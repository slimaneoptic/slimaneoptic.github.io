// Visit counter: one beacon per page load to the site's API (POST /api/hit) with the page, the referrer, language,
// time zone, screen size and a random per-tab session id. The API adds the country and city from its edge headers
// and never stores the IP or the full user agent. Only the query parameters in KEEP are sent (the API filters them
// again). Skipped on a local copy of the site (unless ?hittest=1), in automated browsers, and for the owner: open
// any page once with ?me=1 to stop counting this browser (?me=0 undoes it); the flag is then removed from the address
// bar, so a copied link never carries it. What is logged is listed on /privacy/.
// Time on page and clicks: at most one more beacon per page load (a summary), sent the first time the page is hidden
// (tab closed or switched, another page opened, phone app put away). Time after a return to the tab is not counted:
// one summary per page view keeps the API inside its free quota. No summary when the page was in front for less than
// half a second with no click (redirects, tabs never looked at). See track() below for what a summary holds.
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
  var path = location.pathname, t0 = Date.now(); // t0: the page-load time, sent again in the summary to pair the two
  var body = JSON.stringify({
    path: path, qs: qs ? ("?" + qs).slice(0, 200) : "", title: (document.title || "").slice(0, 120),
    ref: (document.referrer || "").split(/[?#]/)[0].slice(0, 300), lang: navigator.language || "", tz: tz,
    sw: screen.width || 0, sh: screen.height || 0, sid: sid, t: t0
  });
  post(body);

  // Wait for the page's own markup (hit.js is loaded with defer, so this is at once) but not for the page's scripts.
  try {
    if (document.readyState === "loading") {
      document.addEventListener("readystatechange", function ready() {
        if (document.readyState === "loading") return;
        document.removeEventListener("readystatechange", ready);
        try { track(); } catch (e) { /* never break the page */ }
      });
    } else track();
  } catch (e) { /* never break the page */ }

  function post(text) {
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(api + "/api/hit", text)) return; // text/plain: no preflight
    } catch (e) { /* fall back to fetch */ }
    try { fetch(api + "/api/hit", { method: "POST", body: text, keepalive: true, mode: "no-cors" }).catch(function () {}); } catch (e) { /* no fetch */ }
  }

  // The summary: {type: "leave", page, sid, pv (= t0), active_ms, max_scroll_pct, clicks: [{l, ms, n}]}.
  // - active_ms: time while the tab is visible and the window focused, 2 hours at most.
  // - max_scroll_pct: how far down the page the visitor scrolled (100 = the end, or a page that does not scroll).
  // - clicks: links, buttons, check boxes, radio buttons, selects and <summary> toggles, 25 at most, in order, each
  //   with its time since the page loaded; the same label clicked again right away adds to n instead.
  //   The label is data-track when the element has one; for a link to another site, "out:" + its host only; else
  //   the element's aria-label or its own text (a check box or select: its <label>) as it was when the page loaded.
  //   Text that scripts add or change later can hold what the visitor typed (a chat history, a site address), so it
  //   is never read: such elements get their tag and id or first class ("button.chip"), unless they have data-track.
  //   Labels are one line, 40 characters at most, without e-mail addresses or query strings.
  // Never recorded: what is typed, form values, which option was chosen, link addresses, clicks in text fields or
  // in a widget's shadow DOM, clicks made by scripts.
  function track() {
    if (typeof WeakMap !== "function" || !document.querySelectorAll || !window.addEventListener) return;
    var MAX_MS = 7200000, MAX_CLICKS = 25, MAX_BYTES = 3800;
    var SEL = "a,button,[role=button],input[type=checkbox],input[type=radio],select,summary,[data-track]";
    var perf = window.performance;
    var now = perf && perf.now ? function () { return perf.now(); } : function () { return Date.now(); };
    var start = now(), active = 0, since = -1, scroll = 0, clicks = [], sent = false, timer = 0;
    var known = new WeakMap(); // element -> its label when the page loaded

    function clean(s) {
      s = String(s).replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069\ufeff]/g, " ")
        .replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, "(email)")
        .replace(/((?:https?:\/\/|www\.)[^\s?#]*)[?#]\S*/gi, "$1")
        .replace(/\s+/g, " ").replace(/^ | $/g, "");
      if (s.length > 40) s = s.slice(0, /[\ud800-\udbff]/.test(s.charAt(39)) ? 39 : 40).replace(/ $/, "");
      return s;
    }
    function text(node, out) { // the element's own text: never what is inside fields, selects or editable areas
      for (var c = node.firstChild; c && out.length < 200; c = c.nextSibling) {
        if (c.nodeType === 3) out += c.nodeValue;
        else if (c.nodeType === 1 && !/^(INPUT|SELECT|TEXTAREA|OPTION|SCRIPT|STYLE|TEMPLATE)$/.test(c.tagName) &&
                 !c.isContentEditable) out = text(c, out + " ");
      }
      return out;
    }
    function ownLabel(el) {
      var s = el.getAttribute("aria-label") || "";
      if (!s) {
        if (el.tagName === "INPUT" || el.tagName === "SELECT") {
          var lab = (el.labels && el.labels[0]) || (el.closest && el.closest("label"));
          s = lab ? text(lab, "") : "";
        } else s = text(el, "");
      }
      return clean(s) || (el.id ? clean("#" + el.id) : "");
    }
    function labelOf(el) {
      var s = clean(el.getAttribute("data-track") || "");
      if (s) return s;
      if (el.tagName === "A" && typeof el.hostname === "string" && el.hostname &&
          el.hostname.toLowerCase() !== location.hostname.toLowerCase() && /^https?:$/.test(el.protocol)) {
        return clean("out:" + el.hostname.toLowerCase());
      }
      s = known.get(el);
      if (s) return s;
      var cls = typeof el.className === "string" ? el.className.replace(/^\s+/, "").split(/\s+/)[0] : "";
      return clean(el.tagName.toLowerCase() + (el.id ? "#" + el.id : cls ? "." + cls : ""));
    }
    function isActive() {
      if (document.visibilityState && document.visibilityState !== "visible") return false;
      try { return !document.hasFocus || document.hasFocus(); } catch (e) { return true; }
    }
    function tick() {
      var t = now();
      if (since >= 0) active += Math.max(0, t - since);
      since = isActive() ? t : -1;
    }
    function measure() {
      timer = 0;
      try {
        var de = document.documentElement, b = document.body;
        var h = Math.max(de.scrollHeight || 0, b ? b.scrollHeight || 0 : 0), vh = window.innerHeight || de.clientHeight || 0;
        var y = window.pageYOffset || de.scrollTop || 0;
        if (h > 0 && vh > 0) scroll = Math.max(scroll, Math.min(100, Math.round((y + vh) / h * 100)));
      } catch (e) { /* no layout */ }
    }
    function bytes(s) { try { return new Blob([s]).size; } catch (e) { return s.length * 3; } }
    function leave() {
      if (sent) return;
      sent = true;
      try {
        tick();
        measure();
        var ms = Math.min(MAX_MS, Math.round(active));
        if (ms < 500 && !clicks.length) return;
        var sum = { type: "leave", page: path.slice(0, 200), sid: sid, pv: t0, active_ms: ms, max_scroll_pct: scroll,
                    clicks: clicks.slice(0, MAX_CLICKS) };
        var json = JSON.stringify(sum);
        while (bytes(json) > MAX_BYTES && sum.clicks.length) { sum.clicks.pop(); json = JSON.stringify(sum); }
        post(json);
      } catch (e) { /* never break the page */ }
    }

    try {
      var els = document.querySelectorAll(SEL);
      for (var i = 0; i < els.length && i < 3000; i++) known.set(els[i], ownLabel(els[i]));
    } catch (e) { /* labels fall back to tag and class */ }
    since = isActive() ? start : -1; // scroll depth is read on scroll and on leave, once images have their height

    document.addEventListener("click", function (e) {
      try {
        var el = e.target;
        if (sent || e.isTrusted === false || !el || el.nodeType !== 1 || !el.closest) return;
        if (el.isContentEditable || el.tagName === "TEXTAREA" ||
            (el.tagName === "INPUT" && !/^(checkbox|radio)$/i.test(el.type))) return;
        el = el.closest(SEL);
        if (!el) return;
        var l = labelOf(el), last = clicks[clicks.length - 1];
        if (!l) return;
        if (last && last.l === l) { last.n = Math.min(1000, (last.n || 1) + 1); return; }
        if (clicks.length < MAX_CLICKS) clicks.push({ l: l, ms: Math.max(0, Math.round(now() - start)) });
      } catch (err) { /* never break the page */ }
    }, true);
    window.addEventListener("scroll", function () { if (!timer) timer = setTimeout(measure, 250); }, { passive: true });
    window.addEventListener("focus", tick);
    window.addEventListener("blur", function () { tick(); setTimeout(tick, 100); }); // focus may move into an iframe
    document.addEventListener("visibilitychange", function () {
      tick();
      if (document.visibilityState === "hidden") leave();
    });
    window.addEventListener("pagehide", leave);
  }
})();
