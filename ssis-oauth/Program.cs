// Test harness: runs the SAME GuidewireOAuth.cs (no SSIS) against mock_guidewire.py.
// Usage: dotnet run -- http://127.0.0.1:18765 run-log.txt results.json
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using GuidewireAuth;

static class Program
{
    const string ClientId = "demo-ssis-client";
    const string Secret = "FAKE-demo-secret-0000";       // fake, matches the mock
    const string WrongSecret = "FAKE-wrong-secret-9999";  // fake
    const string Scope = "tpa.claims.submit";
    const string Action = "urn:mock:tpa:submitClaim";

    static string Base = "";
    static readonly StringBuilder Log = new StringBuilder();
    static readonly List<string> Results = new List<string>();
    static readonly HashSet<string> SeenTokens = new HashSet<string>();
    static Stopwatch Clock = new Stopwatch();

    static string Claim(string claimNumber) =>
        "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
        "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tpa=\"http://example.com/mock/tpa/claims\">\n" +
        "  <soapenv:Header/>\n  <soapenv:Body>\n    <tpa:submitClaim>\n" +
        (claimNumber == null ? "" : "      <tpa:ClaimNumber>" + claimNumber + "</tpa:ClaimNumber>\n") +
        "      <tpa:LossDate>2026-10-28</tpa:LossDate>\n      <tpa:PaidAmount>1250.00</tpa:PaidAmount>\n" +
        "    </tpa:submitClaim>\n  </soapenv:Body>\n</soapenv:Envelope>";

    static void W(string line) { Log.AppendLine(line); Console.WriteLine(line); }
    static void L(string msg) => W(string.Format("  [{0,6} ms] {1}", Clock.ElapsedMilliseconds, msg));

    // Harness-only decorator: remembers every token handed out, so the log can be checked for leaks.
    sealed class Recording : IAccessTokenSource
    {
        readonly TokenProvider _p;
        public Recording(TokenProvider p) { _p = p; }
        public string GetAccessToken(bool force) { var t = _p.GetAccessToken(force); lock (SeenTokens) SeenTokens.Add(t); return t; }
    }

    static string Http(string method, string path, string json = null)
    {
        var req = (HttpWebRequest)WebRequest.Create(Base + path);
        req.Method = method;
        if (json != null)
        {
            var b = Encoding.UTF8.GetBytes(json);
            req.ContentType = "application/json";
            req.ContentLength = b.Length;
            using (var s = req.GetRequestStream()) s.Write(b, 0, b.Length);
        }
        using (var r = req.GetResponse()) using (var sr = new StreamReader(r.GetResponseStream())) return sr.ReadToEnd();
    }
    static void Mock(string json) => Http("POST", "/admin/config", json);
    static Dictionary<string, int> Stats()
    {
        var s = Http("GET", "/admin/stats").Trim('{', '}', ' ');
        return s.Split(',').Select(p => p.Split(':')).ToDictionary(p => p[0].Trim(' ', '"'), p => int.Parse(p[1]));
    }

    static (TokenProvider, SoapClient) Make(string secret, bool basic = false)
    {
        var p = new TokenProvider(new OAuthSettings
        {
            TokenUrl = Base + "/oauth2/token", ClientId = ClientId, ClientSecret = secret, Scope = Scope, UseBasicAuth = basic
        }, L);
        return (p, new SoapClient(Base + "/cc/ws/claim", new Recording(p), L));
    }

    static void Scenario(string id, string title, Func<string> body)
    {
        Mock("{\"expires_in\": 3600, \"reject_next_soap\": 0, \"reject_all_soap\": false}");
        var before = Stats();
        W("");
        W("(" + id + ") " + title);
        Clock = Stopwatch.StartNew();
        string outcome;
        bool pass;
        try { outcome = body(); pass = !outcome.StartsWith("FAIL"); }
        catch (Exception ex) { outcome = "FAIL unexpected " + ex.GetType().Name + ": " + ex.Message; pass = false; }
        long ms = Clock.ElapsedMilliseconds;
        var after = Stats();
        string calls = "token requests " + (after["token_ok"] + after["token_denied"] - before["token_ok"] - before["token_denied"])
            + ", SOAP requests " + (after["soap_ok"] + after["soap_401"] + after["soap_fault"] - before["soap_ok"] - before["soap_401"] - before["soap_fault"])
            + " (mock counters)";
        W("  => " + (pass ? "PASS" : "FAIL") + " in " + ms + " ms. " + outcome + " | " + calls);
        Results.Add("{\"id\":\"" + id + "\",\"title\":\"" + title.Replace("\"", "'") + "\",\"pass\":" + (pass ? "true" : "false")
            + ",\"ms\":" + ms + ",\"outcome\":\"" + outcome.Replace("\\", "/").Replace("\"", "'") + "\",\"calls\":\"" + calls + "\"}");
    }

    static int Main(string[] args)
    {
        Base = args.Length > 0 ? args[0].TrimEnd('/') : "http://127.0.0.1:18765";
        string logPath = args.Length > 1 ? args[1] : "run-log.txt";
        string jsonPath = args.Length > 2 ? args[2] : "results.json";
        NetSetup.Apply();

        W("GuidewireOAuth.cs test run against mock_guidewire.py (mock token + SOAP servers, not Guidewire)");
        W("Run at " + DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss") + " UTC on " + System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription
            + ", " + System.Runtime.InteropServices.RuntimeInformation.OSDescription.Split('#')[0].Trim());
        W("SecurityProtocol after NetSetup.Apply(): " + ServicePointManager.SecurityProtocol);

        Scenario("a", "Normal call: token, then SOAP with Bearer; second claim reuses the cached token", () =>
        {
            var (p, c) = Make(Secret);
            var r1 = c.Post(Claim("DEMO-000101"), Action);
            L("Response: " + Between(r1.Body, "<tpa:Status>", "</tpa:Status>") + ", receipt " + Between(r1.Body, "<tpa:ReceiptId>", "</tpa:ReceiptId>"));
            var r2 = c.Post(Claim("DEMO-000102"), Action);
            L("Response: " + Between(r2.Body, "<tpa:Status>", "</tpa:Status>") + ", receipt " + Between(r2.Body, "<tpa:ReceiptId>", "</tpa:ReceiptId>"));
            return p.TokensFetched == 1 && r1.Attempts == 1 && r2.Attempts == 1
                ? "2 claims ACCEPTED with 1 token" : "FAIL tokens=" + p.TokensFetched;
        });

        Scenario("b", "Token close to expiry: refreshed 60 s before it expires (HTTP Basic client auth)", () =>
        {
            Mock("{\"expires_in\": 62}");
            var (p, c) = Make(Secret, basic: true);
            c.Post(Claim("DEMO-000201"), Action);
            L("Waiting 2.5 s so the 62 s token is inside the 60 s refresh margin...");
            Thread.Sleep(2500);
            var r = c.Post(Claim("DEMO-000202"), Action);
            return p.TokensFetched == 2 && r.Attempts == 1
                ? "token refreshed before use, no 401" : "FAIL tokens=" + p.TokensFetched + " attempts=" + r.Attempts;
        });

        Scenario("c", "Server rejects the cached token once (HTTP 401): refresh + one retry", () =>
        {
            var (p, c) = Make(Secret);
            c.Post(Claim("DEMO-000301"), Action);
            L("Mock told to reject the next SOAP call with 401 (token revoked on the server side).");
            Mock("{\"reject_next_soap\": 1}");
            var r = c.Post(Claim("DEMO-000302"), Action);
            return p.TokensFetched == 2 && r.Attempts == 2 && r.HttpStatus == 200
                ? "retry with new token succeeded (HTTP 200)" : "FAIL";
        });

        Scenario("d", "Wrong client secret: clear error, no retry loop", () =>
        {
            var (p, c) = Make(WrongSecret);
            try { c.Post(Claim("DEMO-000401"), Action); return "FAIL no error"; }
            catch (TokenRequestException ex)
            {
                L("Caught TokenRequestException: " + ex.Message);
                return ex.HttpStatus == 401 && ex.OAuthError == "invalid_client" ? "stopped with HTTP 401 invalid_client" : "FAIL " + ex.Message;
            }
        });

        Scenario("e", "Bad payload: SOAP Fault surfaced with code, text and detail", () =>
        {
            var (p, c) = Make(Secret);
            try { c.Post(Claim(null), Action); return "FAIL no fault"; }
            catch (SoapFaultException ex)
            {
                L("Caught SoapFaultException (HTTP " + ex.HttpStatus + "): " + ex.Message);
                return ex.FaultCode.EndsWith("Client") ? "fault " + ex.FaultCode + " / " + ex.FaultString : "FAIL";
            }
        });

        Scenario("f", "Server keeps answering 401: exactly one retry, then a clear error", () =>
        {
            Mock("{\"reject_all_soap\": true}");
            var (p, c) = Make(Secret);
            try { c.Post(Claim("DEMO-000601"), Action); return "FAIL no error"; }
            catch (SoapCallException ex)
            {
                L("Caught SoapCallException: " + ex.Message);
                return ex.HttpStatus == 401 && p.TokensFetched == 2 ? "stopped after 2 attempts" : "FAIL";
            }
        });
        Mock("{\"expires_in\": 3600, \"reject_next_soap\": 0, \"reject_all_soap\": false}");

        string text = Log.ToString();
        bool leak = text.Contains(Secret) || text.Contains(WrongSecret) || text.Contains("eyJ") || SeenTokens.Any(t => text.Contains(t));
        W("");
        W("Leak check: " + SeenTokens.Count + " tokens issued; secret, wrong secret and tokens found in this log: " + (leak ? "YES (FAIL)" : "none"));
        int passed = Results.Count(r => r.Contains("\"pass\":true"));
        W("Result: " + passed + "/" + Results.Count + " scenarios passed.");

        File.WriteAllText(logPath, text.Replace(Base, "http://mock"));
        File.WriteAllText(jsonPath, "{\"leak\":" + (leak ? "true" : "false") + ",\"scenarios\":[" + string.Join(",", Results) + "]}");
        return passed == Results.Count && !leak ? 0 : 1;
    }

    static string Between(string s, string a, string b)
    {
        int i = s.IndexOf(a); if (i < 0) return "?"; i += a.Length;
        int j = s.IndexOf(b, i); return j < 0 ? "?" : s.Substring(i, j - i);
    }
}
