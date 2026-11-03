// ScriptMain.cs - the SSIS-only part of the XMLCCXmlLoad Script Task (C# 7.3, .NET Framework 4.x).
// Add GuidewireOAuth.cs to the same Script Task project (Project > Add Existing Item) and a reference to
// System.Runtime.Serialization. Keep your project's own ST_... namespace; only Main() changes.
//
// Script Task Editor:
//   ReadOnlyVariables : $Package::OAuthTokenUrl, $Package::OAuthClientId, $Package::OAuthScope,
//                       $Package::OAuthClientSecret (Sensitive = True), $Package::GuidewireSoapUrl,
//                       $Package::SoapAction, User::ClaimXml
//   ReadWriteVariables: User::SoapResponse
// The secret is never in this file: it comes from the sensitive package parameter, which the SSIS catalog
// fills from an environment variable marked Sensitive (stored encrypted in SSISDB).

using System;
using GuidewireAuth;

namespace ST_XMLCCXmlLoad
{
    [Microsoft.SqlServer.Dts.Tasks.ScriptTask.SSISScriptTaskEntryPointAttribute]
    public partial class ScriptMain : Microsoft.SqlServer.Dts.Tasks.ScriptTask.VSTARTScriptObjectModelBase
    {
        private const string Source = "XMLCCXmlLoad";

        // Static: if the task runs many times in one package execution (Foreach Loop), the token is reused
        // until 60 s before it expires instead of being requested for every claim.
        private static TokenProvider _tokens;
        private static string _tokensKey;
        private static Action<string> _currentLog;
        private static readonly object _gate = new object();

        public void Main()
        {
            try
            {
                _currentLog = Info; // token messages go to this run's log
                NetSetup.Apply();   // TLS 1.2 on .NET Framework

                var settings = new OAuthSettings
                {
                    TokenUrl = Param("$Package::OAuthTokenUrl"),
                    ClientId = Param("$Package::OAuthClientId"),
                    Scope = Param("$Package::OAuthScope"),
                    ClientSecret = Convert.ToString(Dts.Variables["$Package::OAuthClientSecret"].GetSensitiveValue()),
                    UseBasicAuth = false // set true if the token endpoint wants client_secret_basic
                };
                string soapUrl = Param("$Package::GuidewireSoapUrl");
                string soapAction = Param("$Package::SoapAction");

                // Your existing code that builds the claim XML stays as it is; here it is read from a variable.
                string soapXml = Param("User::ClaimXml");

                Info("Calling " + soapUrl + " (client id " + settings.ClientId + ", " + soapXml.Length + " chars).");

                var client = new SoapClient(soapUrl, GetProvider(settings), Info);
                SoapResult result = client.Post(soapXml, soapAction);

                Dts.Variables["User::SoapResponse"].Value = result.Body;
                Info("Claim submitted: HTTP " + result.HttpStatus + ", " + result.ElapsedMs + " ms.");
                Dts.TaskResult = (int)ScriptResults.Success;
            }
            catch (SoapFaultException ex)
            {
                Error("Guidewire returned a SOAP Fault. " + ex.Message);
                Dts.TaskResult = (int)ScriptResults.Failure;
            }
            catch (TokenRequestException ex)
            {
                Error(ex.Message); // never contains the secret or a token
                Dts.TaskResult = (int)ScriptResults.Failure;
            }
            catch (Exception ex)
            {
                Error(ex.GetType().Name + ": " + ex.Message);
                Dts.TaskResult = (int)ScriptResults.Failure;
            }
        }

        private static TokenProvider GetProvider(OAuthSettings s)
        {
            // Kept in memory only, never logged: a new provider if any setting (or the secret) changed.
            string key = s.TokenUrl + "|" + s.ClientId + "|" + s.Scope + "|" + s.UseBasicAuth + "|" + s.ClientSecret;
            lock (_gate)
            {
                if (_tokens == null || _tokensKey != key)
                {
                    _tokens = new TokenProvider(s, m => { Action<string> log = _currentLog; if (log != null) log(m); });
                    _tokensKey = key;
                }
                return _tokens;
            }
        }

        private string Param(string name)
        {
            object v = Dts.Variables[name].Value;
            return v == null ? "" : v.ToString();
        }

        private void Info(string message)
        {
            bool fireAgain = true;
            Dts.Events.FireInformation(0, Source, message, string.Empty, 0, ref fireAgain);
        }

        private void Error(string message)
        {
            Dts.Events.FireError(0, Source, message, string.Empty, 0);
        }

        #region ScriptResults declaration
        enum ScriptResults
        {
            Success = Microsoft.SqlServer.Dts.Runtime.DTSExecResult.Success,
            Failure = Microsoft.SqlServer.Dts.Runtime.DTSExecResult.Failure
        };
        #endregion
    }
}
