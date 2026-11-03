#!/usr/bin/env python3
"""Mock OAuth token server + mock SOAP endpoint for testing the SSIS Script Task code.

NOT Guidewire. Python stdlib only. All credentials below are fake demo values.

  POST /oauth2/token      client_credentials (form body or HTTP Basic), returns a JWT-shaped token
  POST /cc/ws/claim       SOAP 1.1, needs "Authorization: Bearer <valid token>"
  POST /admin/config      JSON: {"expires_in": 62} | {"reject_next_soap": 1} | {"reject_all_soap": true}
  GET  /admin/stats       request counters

Usage: python3 mock_guidewire.py [port]
"""
import base64, hashlib, hmac, json, secrets, sys, threading, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, unquote
from xml.etree import ElementTree as ET

CLIENT_ID = "demo-ssis-client"
CLIENT_SECRET = "FAKE-demo-secret-0000"          # fake, for the mock only
SCOPE = "tpa.claims.submit"
SIGN_KEY = b"mock-signing-key-not-a-secret"

SOAP_NS = "http://schemas.xmlsoap.org/soap/envelope/"
TPA_NS = "http://example.com/mock/tpa/claims"

lock = threading.Lock()
state = {"expires_in": 3600, "reject_next_soap": 0, "reject_all_soap": False}
tokens = {}  # token -> expiry (epoch seconds)
stats = {"token_ok": 0, "token_denied": 0, "soap_ok": 0, "soap_401": 0, "soap_fault": 0}


def b64u(b):
    return base64.urlsafe_b64encode(b).rstrip(b"=").decode()


def make_token(lifetime):
    now = int(time.time())
    head = b64u(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    body = b64u(json.dumps({"iss": "mock-token-server", "sub": CLIENT_ID, "scp": SCOPE.split(),
                            "iat": now, "exp": now + lifetime, "jti": secrets.token_hex(8)}).encode())
    sig = b64u(hmac.new(SIGN_KEY, f"{head}.{body}".encode(), hashlib.sha256).digest())
    return f"{head}.{body}.{sig}"


def fault(code, text, detail):
    return (f'<?xml version="1.0" encoding="utf-8"?><soapenv:Envelope xmlns:soapenv="{SOAP_NS}"><soapenv:Body>'
            f'<soapenv:Fault><faultcode>soapenv:{code}</faultcode><faultstring>{text}</faultstring>'
            f'<detail><tpa:ValidationError xmlns:tpa="{TPA_NS}">{detail}</tpa:ValidationError></detail>'
            f'</soapenv:Fault></soapenv:Body></soapenv:Envelope>')


class H(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt, *args):
        pass

    def send(self, code, body, ctype, extra=None):
        data = body.encode()
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        for k, v in (extra or {}).items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(data)

    def body(self):
        n = int(self.headers.get("Content-Length") or 0)
        return self.rfile.read(n).decode("utf-8", "replace") if n else ""

    def do_GET(self):
        if self.path == "/admin/stats":
            with lock:
                return self.send(200, json.dumps(stats), "application/json")
        self.send(404, "not found", "text/plain")

    def do_POST(self):
        raw = self.body()
        if self.path == "/oauth2/token":
            return self.token(raw)
        if self.path == "/cc/ws/claim":
            return self.soap(raw)
        if self.path == "/admin/config":
            with lock:
                state.update(json.loads(raw or "{}"))
                return self.send(200, json.dumps(state), "application/json")
        self.send(404, "not found", "text/plain")

    def token(self, raw):
        form = {k: v[0] for k, v in parse_qs(raw, keep_blank_values=True).items()}
        cid, csec = form.get("client_id"), form.get("client_secret")
        auth = self.headers.get("Authorization", "")
        if auth.startswith("Basic "):
            try:
                pair = base64.b64decode(auth[6:]).decode()
                cid, csec = (unquote(x) for x in pair.split(":", 1))
            except Exception:
                cid = csec = None
        deny = None
        if form.get("grant_type") != "client_credentials":
            deny = (400, "unsupported_grant_type", "grant_type must be client_credentials")
        elif cid != CLIENT_ID or csec != CLIENT_SECRET:
            deny = (401, "invalid_client", "Client authentication failed")
        elif form.get("scope") and form["scope"] != SCOPE:
            deny = (400, "invalid_scope", "The requested scope is invalid")
        with lock:
            if deny:
                stats["token_denied"] += 1
            else:
                stats["token_ok"] += 1
                life = int(state["expires_in"])
                tok = make_token(life)
                tokens[tok] = time.time() + life
        if deny:
            return self.send(deny[0], json.dumps({"error": deny[1], "error_description": deny[2]}),
                             "application/json", {"Cache-Control": "no-store"})
        self.send(200, json.dumps({"access_token": tok, "token_type": "Bearer", "expires_in": life, "scope": SCOPE}),
                  "application/json", {"Cache-Control": "no-store"})

    def soap(self, raw):
        auth = self.headers.get("Authorization", "")
        tok = auth[7:] if auth.startswith("Bearer ") else None
        with lock:
            exp = tokens.get(tok)
            reason = None
            if state["reject_all_soap"]:
                reason = "token rejected (mock: reject_all_soap)"
            elif state["reject_next_soap"] > 0:
                state["reject_next_soap"] -= 1
                reason = "token revoked (mock: reject_next_soap)"
            elif exp is None:
                reason = "missing or unknown token"
            elif time.time() >= exp:
                reason = "token expired"
            if reason:
                stats["soap_401"] += 1
        if reason:
            return self.send(401, "", "text/plain",
                             {"WWW-Authenticate": f'Bearer error="invalid_token", error_description="{reason}"'})
        if not self.headers.get("SOAPAction") or not self.headers.get("Content-Type", "").startswith("text/xml"):
            with lock:
                stats["soap_fault"] += 1
            return self.send(500, fault("Client", "Missing SOAPAction or wrong Content-Type", "headers"),
                             "text/xml; charset=utf-8")
        try:
            root = ET.fromstring(raw)
            claim = root.find(f".//{{{TPA_NS}}}ClaimNumber")
            amount = root.find(f".//{{{TPA_NS}}}PaidAmount")
            if claim is None or not (claim.text or "").strip():
                raise ValueError("ClaimNumber is required")
            float(amount.text) if amount is not None else 0.0
        except Exception as e:
            with lock:
                stats["soap_fault"] += 1
            msg = "Invalid claim payload"
            return self.send(500, fault("Client", msg, str(e).replace("<", "&lt;")[:200]), "text/xml; charset=utf-8")
        with lock:
            stats["soap_ok"] += 1
        resp = (f'<?xml version="1.0" encoding="utf-8"?><soapenv:Envelope xmlns:soapenv="{SOAP_NS}"><soapenv:Body>'
                f'<tpa:submitClaimResponse xmlns:tpa="{TPA_NS}"><tpa:ClaimNumber>{claim.text.strip()}</tpa:ClaimNumber>'
                f'<tpa:Status>ACCEPTED</tpa:Status><tpa:ReceiptId>MOCK-{secrets.token_hex(4).upper()}</tpa:ReceiptId>'
                f'</tpa:submitClaimResponse></soapenv:Body></soapenv:Envelope>')
        self.send(200, resp, "text/xml; charset=utf-8")


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 18765
    srv = ThreadingHTTPServer(("127.0.0.1", port), H)
    print(f"mock listening on http://127.0.0.1:{port}", flush=True)
    srv.serve_forever()
