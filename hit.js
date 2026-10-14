// Visit counter: one beacon per page load to the site's API (POST /api/hit) with the page, the referrer, language,
// time zone, screen size and a random per-tab session id. The API adds the country and city from its edge headers
// and never stores the IP or the full user agent. Only the query parameters in KEEP are sent (the API filters them
// again). Skipped on a local copy of the site (unless ?hittest=1), in automated browsers, and for the owner: open
// any page once with ?me=1 to stop counting this browser (?me=0 undoes it); the flag is then removed from the address
// bar, so a copied link never carries it. What is logged is listed on /privacy/.
// Cloudflare Web Analytics: paste the site token from the Cloudflare dashboard into CF_TOKEN (one-line change).
(function () {
  var CF_TOKEN = "140371deb465473999cccc80af35559b";
  var DEFAULT_API = "https://site-chatbot-omega.vercel.app";
  // The parameters the site's pages read, plus campaign tags. Same list as QS_KEEP in the API's visits.py.
  var KEEP = ["site", "color", "q", "sel", "theme", "utm_source", "utm_medium", "utm_campaign"];
  if (window.__scHit) return; // once per page load, even if the tag is on the page twice
  window.__scHit = 1;

  var params, host = location.hostname, local = host === "localhost" || host === "127.0.0.1";
  try { params = new URLSearchParams(location.search); } catch (e) { return; }

  var me = params.get("me");
  try {
    if (me === "1") { localStorage.setItem("sc_owner", "1"); console.info("hit.js: this browser is not counted now (?me=0 to undo)."); }
    else if (me === "0") { localStorage.removeItem("sc_owner"); console.info("hit.js: this browser is counted again."); }
  } catch (e) { /* storage blocked */ }
  if (me !== null) {
    // Drop "me" from the address bar; the rest of the query (as written) and the hash stay.
    try {
      var rest = location.search.slice(1).split("&").filter(function (p) {
        var k = p.split("=")[0];
        try { k = decodeURIComponent(k.replace(/\+/g, " ")); } catch (e) { /* malformed: compare as is */ }
        return p !== "" && k !== "me";
      }).join("&");
      history.replaceState(history.state, "", location.pathname + (rest ? "?" + rest : "") + location.hash);
    } catch (e) { /* old browser or sandboxed frame: the flag stays in the address bar */ }
  }
  var owner = false;
  try { owner = localStorage.getItem("sc_owner") === "1"; } catch (e) { /* storage blocked */ }
  if (owner || navigator.webdriver || (local && params.get("hittest") !== "1")) return;

  if (CF_TOKEN) {
    var cf = document.createElement("script");
    cf.defer = true;
    cf.src = "https://static.cloudflareinsights.com/beacon.min.js";
    cf.setAttribute("data-cf-beacon", JSON.stringify({ token: CF_TOKEN }));
    (document.head || document.documentElement).appendChild(cf);
  }

  // Same API as chat/config.js: `?api=<url>` overrides it only on a local copy of the site.
  var api = DEFAULT_API, q = params.get("api");
  if (local && q && /^https?:\/\/[^\s]+$/i.test(q)) api = q.replace(/\/+$/, "");

  var sid = "";
  try { sid = sessionStorage.getItem("sc_sid") || ""; } catch (e) { /* storage blocked */ }
  if (!/^[A-Za-z0-9_-]{8,40}$/.test(sid)) {
    var a = new Uint8Array(9);
    try { crypto.getRandomValues(a); } catch (e) { for (var i = 0; i < a.length; i++) a[i] = Math.random() * 256 | 0; }
    sid = Array.prototype.map.call(a, function (b) { return (b < 16 ? "0" : "") + b.toString(16); }).join("");
    try { sessionStorage.setItem("sc_sid", sid); } catch (e) { /* storage blocked */ }
  }

  var kept = new URLSearchParams();
  try { params.forEach(function (v, k) { if (KEEP.indexOf(k) >= 0) kept.append(k, v); }); } catch (e) { /* old browser: no qs */ }
  var qs = kept.toString(), tz = "";
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) { /* old browser */ }
  var body = JSON.stringify({
    path: location.pathname, qs: qs ? ("?" + qs).slice(0, 200) : "", title: (document.title || "").slice(0, 120),
    ref: (document.referrer || "").split(/[?#]/)[0].slice(0, 300), lang: navigator.language || "", tz: tz,
    sw: screen.width || 0, sh: screen.height || 0, sid: sid, t: Date.now()
  });
  try {
    if (navigator.sendBeacon && navigator.sendBeacon(api + "/api/hit", body)) return; // text/plain: no preflight
  } catch (e) { /* fall back to fetch */ }
  try { fetch(api + "/api/hit", { method: "POST", body: body, keepalive: true, mode: "no-cors" }).catch(function () {}); } catch (e) { /* no fetch */ }
})();
