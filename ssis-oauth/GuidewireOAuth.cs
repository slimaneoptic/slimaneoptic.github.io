// GuidewireOAuth.cs - OAuth 2.0 client credentials + SOAP call with a Bearer token.
// For an SSIS Script Task: .NET Framework 4.5+ (4.7.2 / 4.8 recommended), C# 7.3, no NuGet packages.
// Only Framework assemblies: System, System.Xml and System.Runtime.Serialization
// (in the Script Task project: References > Add Reference > Framework > System.Runtime.Serialization).
// Nothing in this file depends on SSIS, so it can be tested in a plain console app.
// Nothing in this file writes the client secret or an access token to the log.

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Xml;

namespace GuidewireAuth
{
    /// <summary>Call once before the first request (old Framework tasks may default to TLS 1.0).</summary>
    public static class NetSetup
    {
        public static void Apply()
        {
            // Keep whatever is already enabled and add TLS 1.2.
            ServicePointManager.SecurityProtocol |= SecurityProtocolType.Tls12;
            // Avoid the extra "Expect: 100-continue" round trip on every POST.
            ServicePointManager.Expect100Continue = false;
        }
    }

    public interface IAccessTokenSource
    {
        /// <summary>Returns a valid access token; forceRefresh = true drops the cached one first.</summary>
        string GetAccessToken(bool forceRefresh);
    }

    public sealed class OAuthSettings
    {
        public string TokenUrl;
        public string ClientId;
        public string ClientSecret;      // comes from a sensitive package parameter, never from code
        public string Scope;             // optional, space separated
        public bool UseBasicAuth;        // true: client_id:client_secret in the Authorization header
        public int RefreshMarginSeconds = 60;
        public int TimeoutMs = 30000;
    }

    public class TokenRequestException : Exception
    {
        public int HttpStatus { get; private set; }
        public string OAuthError { get; private set; }
        public TokenRequestException(string message, int httpStatus, string oauthError, Exception inner = null)
            : base(message, inner)
        {
            HttpStatus = httpStatus;
            OAuthError = oauthError;
        }
    }

    /// <summary>Client credentials flow with an in-memory cache. Thread safe.</summary>
    public sealed class TokenProvider : IAccessTokenSource
    {
        private readonly OAuthSettings _s;
        private readonly Action<string> _log;
        private readonly object _gate = new object();
        private string _token;
        private DateTime _expiresUtc = DateTime.MinValue;
        private int _issued;

        public TokenProvider(OAuthSettings settings, Action<string> log)
        {
            if (settings == null) throw new ArgumentNullException("settings");
            if (string.IsNullOrEmpty(settings.TokenUrl)) throw new ArgumentException("TokenUrl is empty");
            if (string.IsNullOrEmpty(settings.ClientId)) throw new ArgumentException("ClientId is empty");
            if (string.IsNullOrEmpty(settings.ClientSecret)) throw new ArgumentException("ClientSecret is empty");
            _s = settings;
            _log = log ?? (m => { });
        }

        /// <summary>How many tokens this provider has fetched (for logs and tests).</summary>
        public int TokensFetched { get { lock (_gate) return _issued; } }

        public string GetAccessToken(bool forceRefresh)
        {
            lock (_gate)
            {
                DateTime now = DateTime.UtcNow;
                if (!forceRefresh && _token != null && now < _expiresUtc.AddSeconds(-_s.RefreshMarginSeconds))
                    return _token;

                if (forceRefresh) _log("Token: refresh forced.");
                else if (_token != null) _log("Token: cached token is within " + _s.RefreshMarginSeconds + " s of expiry, refreshing.");
                else _log("Token: no cached token, requesting one.");

                FetchLocked();
                return _token;
            }
        }

        private void FetchLocked()
        {
            var form = new StringBuilder("grant_type=client_credentials");
            if (!_s.UseBasicAuth)
            {
                form.Append("&client_id=").Append(Uri.EscapeDataString(_s.ClientId));
                form.Append("&client_secret=").Append(Uri.EscapeDataString(_s.ClientSecret));
            }
            if (!string.IsNullOrEmpty(_s.Scope))
                form.Append("&scope=").Append(Uri.EscapeDataString(_s.Scope));
            byte[] body = Encoding.ASCII.GetBytes(form.ToString());

            var req = (HttpWebRequest)WebRequest.Create(_s.TokenUrl);
            req.Method = "POST";
            req.ContentType = "application/x-www-form-urlencoded";
            req.Accept = "application/json";
            req.Timeout = _s.TimeoutMs;
            req.ReadWriteTimeout = _s.TimeoutMs;
            if (_s.UseBasicAuth)
            {
                // RFC 6749 2.3.1: id and secret are form-encoded, then joined with ':' and Base64 encoded.
                string pair = Uri.EscapeDataString(_s.ClientId) + ":" + Uri.EscapeDataString(_s.ClientSecret);
                req.Headers[HttpRequestHeader.Authorization] = "Basic " + Convert.ToBase64String(Encoding.UTF8.GetBytes(pair));
            }
            req.ContentLength = body.Length;

            var sw = Stopwatch.StartNew();
            int status;
            string json;
            try
            {
                using (Stream rs = req.GetRequestStream()) rs.Write(body, 0, body.Length);
                using (var resp = (HttpWebResponse)req.GetResponse())
                {
                    status = (int)resp.StatusCode;
                    json = ReadAll(resp);
                }
            }
            catch (WebException ex)
            {
                var er = ex.Response as HttpWebResponse;
                if (er == null)
                    throw new TokenRequestException("Token endpoint not reachable (" + ex.Status + "): " + ex.Message, 0, null, ex);
                using (er)
                {
                    int code = (int)er.StatusCode;
                    Dictionary<string, object> err = TryParseJson(ReadAll(er));
                    string oauthError = Str(err, "error");
                    string desc = Str(err, "error_description");
                    string msg = "Token request failed: HTTP " + code
                        + (oauthError != null ? " " + oauthError : "")
                        + (desc != null ? " - " + desc : "")
                        + (code == 400 || code == 401 ? ". Check client id, client secret and scope." : ".");
                    // No retry here: a wrong secret will not fix itself, and retries can lock the client.
                    throw new TokenRequestException(msg, code, oauthError, ex);
                }
            }

            Dictionary<string, object> t = TryParseJson(json);
            string token = Str(t, "access_token");
            if (string.IsNullOrEmpty(token))
                throw new TokenRequestException("Token response has no access_token (HTTP " + status + ").", status, null);
            string type = Str(t, "token_type");
            if (type != null && !type.Equals("Bearer", StringComparison.OrdinalIgnoreCase))
                throw new TokenRequestException("Unexpected token_type '" + type + "' (expected Bearer).", status, null);

            long expiresIn;
            if (!long.TryParse(Str(t, "expires_in") ?? "", out expiresIn) || expiresIn <= 0)
                expiresIn = 300; // no expires_in: assume 5 minutes; a 401 still triggers one refresh.

            _token = token;
            _expiresUtc = DateTime.UtcNow.AddSeconds(expiresIn);
            _issued++;
            _log("Token: #" + _issued + " received in " + sw.ElapsedMilliseconds + " ms, expires_in " + expiresIn
                 + " s, reused until " + Math.Max(0, expiresIn - _s.RefreshMarginSeconds) + " s from now.");
        }

        private static Dictionary<string, object> TryParseJson(string json)
        {
            if (string.IsNullOrEmpty(json)) return null;
            try
            {
                var ser = new DataContractJsonSerializer(typeof(Dictionary<string, object>),
                    new DataContractJsonSerializerSettings { UseSimpleDictionaryFormat = true });
                using (var ms = new MemoryStream(Encoding.UTF8.GetBytes(json)))
                    return (Dictionary<string, object>)ser.ReadObject(ms);
            }
            catch (Exception) { return null; } // not JSON (an HTML error page, for example)
        }

        private static string Str(Dictionary<string, object> d, string key)
        {
            object v;
            if (d == null || !d.TryGetValue(key, out v) || v == null) return null;
            return Convert.ToString(v, System.Globalization.CultureInfo.InvariantCulture);
        }

        internal static string ReadAll(WebResponse r)
        {
            using (Stream s = r.GetResponseStream())
            using (var sr = new StreamReader(s, Encoding.UTF8))
                return sr.ReadToEnd();
        }
    }

    public sealed class SoapResult
    {
        public int HttpStatus;
        public string Body;
        public long ElapsedMs;
        public int Attempts;
    }

    public class SoapCallException : Exception
    {
        public int HttpStatus { get; private set; }
        public string ResponseBody { get; private set; }
        public SoapCallException(string message, int httpStatus, string body, Exception inner = null)
            : base(message, inner)
        {
            HttpStatus = httpStatus;
            ResponseBody = body;
        }
    }

    public sealed class SoapFaultException : SoapCallException
    {
        public string FaultCode { get; private set; }
        public string FaultString { get; private set; }
        public string Detail { get; private set; }
        public SoapFaultException(int httpStatus, string code, string text, string detail, string body)
            : base("SOAP Fault " + code + ": " + text + (string.IsNullOrEmpty(detail) ? "" : " | detail: " + detail), httpStatus, body)
        {
            FaultCode = code;
            FaultString = text;
            Detail = detail;
        }
    }

    /// <summary>Posts an existing SOAP envelope with a Bearer token. One retry on 401 with a fresh token.</summary>
    public sealed class SoapClient
    {
        private readonly string _endpoint;
        private readonly IAccessTokenSource _tokens;
        private readonly Action<string> _log;
        public int TimeoutMs = 100000;
        public string ContentType = "text/xml; charset=utf-8"; // SOAP 1.1

        public SoapClient(string endpointUrl, IAccessTokenSource tokens, Action<string> log)
        {
            if (string.IsNullOrEmpty(endpointUrl)) throw new ArgumentException("endpointUrl is empty");
            if (tokens == null) throw new ArgumentNullException("tokens");
            _endpoint = endpointUrl;
            _tokens = tokens;
            _log = log ?? (m => { });
        }

        public SoapResult Post(string soapXml, string soapAction)
        {
            var sw = Stopwatch.StartNew();
            byte[] body = Encoding.UTF8.GetBytes(soapXml);

            int status; string text;
            Send(body, soapAction, _tokens.GetAccessToken(false), out status, out text);
            int attempts = 1;
            if (status == 401)
            {
                _log("SOAP: HTTP 401 with the cached token, getting a new token and retrying once.");
                Send(body, soapAction, _tokens.GetAccessToken(true), out status, out text);
                attempts = 2;
                if (status == 401)
                    throw new SoapCallException("SOAP call rejected with HTTP 401 twice (fresh token too). "
                        + "Check that the client has the scope/role for this API.", 401, text);
            }

            // A Fault can come back as HTTP 500 (SOAP 1.1 rule) or, on some servers, as HTTP 200.
            SoapFaultException fault = TryReadFault(status, text);
            if (fault != null) throw fault;
            if (status < 200 || status > 299)
                throw new SoapCallException("SOAP call failed: HTTP " + status + ": " + Trim(text, 300), status, text);

            _log("SOAP: HTTP " + status + " in " + sw.ElapsedMilliseconds + " ms (" + attempts + " attempt" + (attempts > 1 ? "s" : "") + ").");
            return new SoapResult { HttpStatus = status, Body = text, ElapsedMs = sw.ElapsedMilliseconds, Attempts = attempts };
        }

        private void Send(byte[] body, string soapAction, string token, out int status, out string text)
        {
            var req = (HttpWebRequest)WebRequest.Create(_endpoint);
            req.Method = "POST";
            req.ContentType = ContentType;
            req.Headers["SOAPAction"] = "\"" + (soapAction ?? "") + "\"";
            req.Headers[HttpRequestHeader.Authorization] = "Bearer " + token;
            req.Timeout = TimeoutMs;
            req.ReadWriteTimeout = TimeoutMs;
            req.ContentLength = body.Length;
            try
            {
                using (Stream rs = req.GetRequestStream()) rs.Write(body, 0, body.Length);
                using (var resp = (HttpWebResponse)req.GetResponse())
                {
                    status = (int)resp.StatusCode;
                    text = TokenProvider.ReadAll(resp);
                }
            }
            catch (WebException ex)
            {
                var er = ex.Response as HttpWebResponse;
                if (er == null)
                    throw new SoapCallException("SOAP endpoint not reachable (" + ex.Status + "): " + ex.Message, 0, null, ex);
                using (er)
                {
                    status = (int)er.StatusCode;
                    text = TokenProvider.ReadAll(er);
                }
            }
        }

        /// <summary>Reads a SOAP 1.1 (faultcode/faultstring) or SOAP 1.2 (Code/Reason) Fault, or returns null.</summary>
        public static SoapFaultException TryReadFault(int status, string xml)
        {
            if (string.IsNullOrEmpty(xml) || xml.IndexOf("Fault", StringComparison.Ordinal) < 0) return null;
            var doc = new XmlDocument { XmlResolver = null }; // no external entities
            try
            {
                using (var sr = new StringReader(xml))
                using (var xr = XmlReader.Create(sr, new XmlReaderSettings { DtdProcessing = DtdProcessing.Prohibit, XmlResolver = null }))
                    doc.Load(xr);
            }
            catch (XmlException) { return null; }

            XmlNode fault = null;
            foreach (XmlNode n in doc.GetElementsByTagName("*"))
                if (n.LocalName == "Fault") { fault = n; break; }
            if (fault == null) return null;

            string code = Child(fault, "faultcode") ?? Child(fault, "Code");
            string text = Child(fault, "faultstring") ?? Child(fault, "Reason");
            string detail = Child(fault, "detail") ?? Child(fault, "Detail");
            return new SoapFaultException(status, code ?? "(none)", text ?? "(none)", Trim(detail, 500), xml);
        }

        private static string Child(XmlNode parent, string localName)
        {
            foreach (XmlNode c in parent.ChildNodes)
                if (c.LocalName == localName) return c.InnerText.Trim();
            return null;
        }

        private static string Trim(string s, int max)
        {
            if (s == null) return null;
            s = s.Replace("\r", " ").Replace("\n", " ").Trim();
            return s.Length <= max ? s : s.Substring(0, max) + "...";
        }
    }
}
