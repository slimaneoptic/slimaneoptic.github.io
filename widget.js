/* AI assistant widget: one script tag puts a chat bubble on any page.
 *
 *   <script src="https://slimanechanchoul.com/widget.js" data-site="your-site.com" data-color="#7A3E9D" defer></script>
 *
 * Attributes: data-site (site the assistant answers from), data-color (brand hex), data-api (API base URL),
 * data-greeting (first line), data-name (shown as "<name> Assistant"; default: the site's own title once read,
 * else the site address), data-font="overpass" (opt-in: loads the Overpass web font from Google Fonts; default:
 * the visitor's system font, so the widget sends nothing to third parties).
 * Classic script. Everything lives in a Shadow DOM, so the host page's styles are not touched and do not leak in.
 * The chat itself is chat/core.js + chat/core.css, loaded relative to this file's own src when the bubble is
 * first opened. No document-level key handlers: Escape is handled inside the widget only. Chats are saved in
 * this browser, one list per site.
 * Pages can also call window.SiteAssistant.create(container, cfg) (the /assistant/ demo does).
 */
(function () {
  "use strict";
  if (window.SiteAssistant && window.SiteAssistant.create) return; // loaded twice

  var me = document.currentScript;
  var BASE = (me && me.src) || (location.origin + "/widget.js");
  var CORE_JS = new URL("chat/core.js", BASE).href;
  var CORE_CSS = new URL("chat/core.css", BASE).href;
  var HOME = "https://slimanechanchoul.com/";
  var FONT = "https://fonts.googleapis.com/css2?family=Overpass:wght@400;600;800&display=swap";
  var corePromise = null;
  function loadCore() { if (!corePromise) corePromise = import(CORE_JS); return corePromise; }

  /* ---------------- small helpers */
  var SVGNS = "http://www.w3.org/2000/svg";
  var IC = {
    chat: "M4 5.5h16v10.5H9.5L5 20v-4H4z", chevdown: "M6 9.5l6 6 6-6", x: "M6 6l12 12M18 6L6 18",
    clock: "M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17zM12 7.5V12l3 2", back: "M15 5l-7 7 7 7",
    newchat: "M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6M15 4.5l4.5 4.5L12 16.5H7.5V12z",
    search: "M11 4.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 1 0 0-13zM16 16l4 4", plus: "M12 5v14M5 12h14",
  };
  function icon(name, size) {
    var s = document.createElementNS(SVGNS, "svg");
    s.setAttribute("width", size || 18); s.setAttribute("height", size || 18); s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("fill", "none"); s.setAttribute("stroke", "currentColor"); s.setAttribute("stroke-width", "1.8");
    s.setAttribute("stroke-linecap", "round"); s.setAttribute("stroke-linejoin", "round"); s.setAttribute("aria-hidden", "true");
    var p = document.createElementNS(SVGNS, "path"); p.setAttribute("d", IC[name] || ""); s.appendChild(p);
    return s;
  }
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      var v = attrs[k]; if (v == null || v === false) continue;
      if (k === "text") e.textContent = v; else if (k === "class") e.className = v; else e.setAttribute(k, v === true ? "" : v);
    }
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }
  function hex6(c) {
    var m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(c || "").trim()); if (!m) return null;
    var x = m[1]; if (x.length === 3) x = x.split("").map(function (d) { return d + d; }).join("");
    return "#" + x.toLowerCase();
  }
  function rgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function mix(h, o, w) { var a = rgb(h), b = rgb(o); return "#" + a.map(function (v, i) { var n = Math.round(v * w + b[i] * (1 - w)); return (n < 16 ? "0" : "") + n.toString(16); }).join(""); }
  function lum(h) { var c = rgb(h).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
  function onColor(h) { var L = lum(h); return 1.05 / (L + 0.05) >= (L + 0.05) / 0.0645 ? "#FFFFFF" : "#14202B"; }
  function brandVars(c, dark) {
    return {brand: c, on: onColor(c), ink: dark ? mix(c, "#ffffff", 0.4) : mix(c, "#000000", 0.82), soft: dark ? mix(c, "#16202a", 0.24) : mix(c, "#ffffff", 0.1)};
  }
  function normSite(s) {
    s = String(s || "").trim(); if (!s) return "";
    if (!/^https?:\/\//i.test(s)) s = "https://" + s;
    try { var u = new URL(s); if ((u.protocol !== "https:" && u.protocol !== "http:") || u.username || u.password || !u.hostname) return ""; return u.href; }
    catch (e) { return ""; }
  }
  function hostOf(u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } }
  function nameFrom(host) {
    var parts = String(host || "").split(".").filter(Boolean);
    while (parts.length > 2 && /^(www|help|docs|support|kb|faq)$/i.test(parts[0])) parts.shift();
    var w = (parts[0] || "Help").replace(/[-_]+/g, " ").trim();
    return w.replace(/\b\w/g, function (m) { return m.toUpperCase(); });
  }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } return null; }
  /** A short brand name from the crawled home page title ("HTTPX", "Acme Help | Acme" -> "Acme"), else "". */
  function siteName(pageList, host) {
    var t = pageList && pageList[0] && String(pageList[0].title || "").trim(); if (!t) return "";
    var parts = t.split(/\s+[|\u2013\u2014\u00b7:\-]\s+/).map(function (x) { return x.trim(); }).filter(Boolean);
    var key = String(host || "").split(".").filter(function (p) { return !/^(www|help|docs|support|kb|faq)$/i.test(p); })[0] || "";
    var flat = function (x) { return x.toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/g, ""); };
    var hit = parts.filter(function (x) { var f = flat(x), k = flat(key); return f && k && (f === k || k.indexOf(f) >= 0 || f.indexOf(k) >= 0); })[0];
    var pick = hit || (parts.length > 1 ? parts[parts.length - 1] : parts[0]) || "";
    if (!hit && parts.length > 1 && parts[0].length <= 24) pick = parts[0].length <= pick.length ? parts[0] : pick;
    return pick.length >= 2 && pick.length <= 30 ? pick : "";
  }
  function ensureFont() {
    try {
      if (document.querySelector('link[href*="family=Overpass"]')) return;
      document.head.appendChild(el("link", {rel: "stylesheet", href: FONT}));
    } catch (e) { /* no head */ }
  }

  /* ---------------- shell styles (inside the shadow root, after core.css) */
  var CSS = [
    ":host{all:initial}",
    ".wg{--ink:#14202B;--paper:#F6F8FA;--surface:#FFFFFF;--slate:#5B6B7A;--body:#3A4855;--rule:#D5DBE1;--hover:#EEF2F5;--ok-text:#0B7A47;--focus:#2A78D6;",
    "--sh:0 1px 2px rgba(20,32,43,.06),0 6px 20px rgba(20,32,43,.07);--sh-lg:0 2px 8px rgba(20,32,43,.08),0 22px 56px rgba(20,32,43,.20);",
    "font:400 15px/1.55 \"Overpass\",system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif;color:var(--body);-webkit-font-smoothing:antialiased;text-align:left;color-scheme:light}",
    ".wg.dark{--ink:#E6EDF3;--paper:#0E151C;--surface:#16202A;--slate:#95A3B1;--body:#C3CDD7;--rule:#2A3743;--hover:#1D2935;--ok-text:#4CC38A;--focus:#5AA2F0;",
    "--sh:0 1px 2px rgba(0,0,0,.4),0 6px 20px rgba(0,0,0,.3);--sh-lg:0 2px 8px rgba(0,0,0,.5),0 22px 56px rgba(0,0,0,.6);color-scheme:dark}",
    ".wg *,.wg *::before,.wg *::after{box-sizing:border-box}",
    ".wg [hidden]{display:none!important}",
    ".sa-launch,.sa-hbtn,.sa-bnew,.sa-hrow{font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}",
    ".sa-launch:focus-visible,.sa-hbtn:focus-visible,.sa-bnew:focus-visible,.sa-hrow:focus-visible,.sa-teaser:focus-visible,.sa-pw a:focus-visible{outline:2px solid var(--focus);outline-offset:2px}.sa-launch:focus,.sa-hbtn:focus,.sa-hrow:focus{outline:none}.sa-launch:focus-visible,.sa-hbtn:focus-visible,.sa-hrow:focus-visible{outline:2px solid var(--focus)}",
    ".sa-sr{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}",
    ".sa-launch,.sa-panel,.sa-teaser{position:absolute;pointer-events:auto}",
    ".wg.fixed .sa-launch,.wg.fixed .sa-panel,.wg.fixed .sa-teaser{position:fixed}",
    ".sa-launch{right:20px;bottom:20px;width:56px;height:56px;border-radius:50%;border:0;background:var(--brand);color:var(--on-brand);box-shadow:var(--sh-lg);display:grid;place-items:center;z-index:2147482001;padding:0;transition:transform .15s}",
    ".sa-launch:hover{transform:scale(1.05)}",
    ".sa-launch .sa-ic-x{display:none}.sa-launch[aria-expanded=\"true\"] .sa-ic-x{display:block}.sa-launch[aria-expanded=\"true\"] .sa-ic-chat{display:none}",
    ".sa-teaser{right:88px;bottom:30px;z-index:2147482000;background:var(--surface);color:var(--ink);border:1px solid var(--rule);border-radius:10px;box-shadow:var(--sh);padding:9px 12px 8px;font-size:14px;font-weight:600;white-space:nowrap;cursor:pointer}",
    ".sa-panel{right:20px;bottom:88px;width:400px;max-width:calc(100% - 40px);height:min(660px,calc(100% - 100px));display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--rule);border-radius:10px;overflow:hidden;box-shadow:var(--sh-lg);z-index:2147482002;animation:sa-pop .18s ease-out;transform-origin:bottom right}",
    "@keyframes sa-pop{from{opacity:0;transform:translateY(10px) scale(.98)}}",
    ".sa-head{flex:none;display:flex;align-items:center;gap:10px;padding:10px 8px 10px 14px;border-bottom:1px solid var(--rule);background:var(--surface);min-height:57px}",
    ".sa-avatar{width:34px;height:34px;border-radius:9px;background:var(--brand);color:var(--on-brand);display:grid;place-items:center;font-weight:800;font-size:16px;flex:none}",
    ".sa-ht{min-width:0}",
    ".sa-title{font-weight:800;color:var(--ink);font-size:15px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".sa-sub{font-size:12.5px;color:var(--slate);display:flex;align-items:center;gap:6px;line-height:1.3}",
    ".sa-sub .sa-dot{width:7px;height:7px;border-radius:50%;background:var(--ok-text);flex:none}",
    ".sa-hbtns{margin-left:auto;display:flex;gap:2px}",
    ".sa-hbtn{width:36px;height:36px;border:0;background:transparent;border-radius:8px;color:var(--slate);display:grid;place-items:center;padding:0}",
    ".sa-hbtn:hover{background:var(--hover);color:var(--ink)}",
    ".sa-body{flex:1;min-height:0;position:relative;display:flex;flex-direction:column}",
    ".sa-core{flex:1;min-height:0}",
    ".sa-loading{padding:22px 16px;color:var(--slate);font-size:14px}",
    ".sa-pw{flex:none;text-align:center;font-size:12px;color:var(--slate);padding:0 12px 8px;background:var(--surface)}",
    ".sa-pw a{color:var(--slate)}",
    ".sa-hd{position:absolute;left:0;right:0;bottom:0;top:57px;background:var(--surface);z-index:60;display:flex;flex-direction:column;animation:sa-slidein .18s ease-out}",
    "@keyframes sa-slidein{from{opacity:0;transform:translateX(16px)}}",
    ".sa-hd-top{padding:12px 14px 8px;border-bottom:1px solid var(--rule)}",
    ".sa-hd-title{display:flex;align-items:center;gap:6px;margin-bottom:10px}",
    ".sa-hd-title strong{color:var(--ink);font-size:15px}",
    ".sa-hd-title span{font-size:12px;color:var(--slate);margin-left:auto}",
    ".sa-hd-row{display:flex;gap:8px}",
    ".sa-search{display:flex;align-items:center;gap:8px;border:1px solid var(--slate);border-radius:8px;padding:0 8px 0 10px;background:var(--surface);min-height:40px;flex:1;color:var(--slate)}",
    ".sa-search:focus-within{outline:2px solid var(--focus);outline-offset:1px}",
    ".sa-search input{border:0;outline:0;background:transparent;flex:1;min-width:0;font:inherit;font-size:14px;padding:8px 0 6px;color:var(--ink)}",
    ".sa-bnew{display:inline-flex;align-items:center;gap:6px;min-height:40px;padding:6px 12px 5px;border-radius:8px;border:1px solid var(--brand);background:var(--brand);color:var(--on-brand);font-weight:600;font-size:14px}",
    ".sa-hd-list{flex:1;overflow:auto;padding:4px 10px 14px;margin:0;list-style:none}",
    ".sa-hd-list li{margin:0}",
    ".sa-hrow{display:block;width:100%;border:0;background:transparent;text-align:left;padding:9px 10px 8px;border-radius:8px;min-height:44px}",
    ".sa-hrow:hover{background:var(--hover)}",
    ".sa-hrow.cur{background:var(--brand-soft)}",
    ".sa-hrow b{display:block;font-weight:600;color:var(--ink);font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.35}",
    ".sa-hrow small{display:block;font-size:12px;color:var(--slate);margin-top:2px}",
    ".sa-hd-empty{padding:28px 10px;text-align:center;color:var(--slate);font-size:14px}",
    /* the shared chat core inside the panel: its layers stay inside the panel */
    ".sc.widget{position:relative;height:100%}",
    ".sc.widget .scrim,.sc.widget .dr,.sc.widget .toast,.sc.widget .menu{position:absolute}",
    ".sc.widget .dr.sheet{max-height:88%}",
    ".sc.widget .toast{bottom:96px}",
    ".sc.widget .meta{flex-wrap:wrap;row-gap:2px;gap:10px}.sc.widget .meta .msrc{display:none}",
    "@media (max-width:640px){",
    " .sa-panel{inset:0;width:auto;max-width:none;height:auto;border:0;border-radius:0;animation:none}",
    " .wg.open .sa-launch,.wg.open .sa-teaser{display:none}",
    " .sa-launch{right:16px;bottom:16px}.sa-teaser{right:84px;bottom:26px}",
    " .sa-head{padding:6px 6px 6px 14px}",
    " .sa-hbtn{width:44px;height:44px}",
    " .sa-search input{font-size:16px}",
    " .sa-pw{padding-bottom:calc(8px + env(safe-area-inset-bottom))}",
    "}",
    "@media (prefers-reduced-motion:reduce){.wg *,.wg *::before,.wg *::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}",
  ].join("\n");

  /* ---------------- one widget */
  function create(container, cfg) {
    cfg = cfg || {};
    var placement = cfg.placement === "frame" ? "frame" : "fixed";
    var site = normSite(cfg.site);
    var host = cfg.label || hostOf(site) || "this site";
    var name = cfg.name || nameFrom(hostOf(site) || cfg.kb || "");
    var color = hex6(cfg.color) || "#2A78D6";
    var api = cfg.api && /^https?:\/\/[^\s]+$/i.test(cfg.api) ? String(cfg.api).replace(/\/+$/, "") : null;
    var key = "sc-w-" + (cfg.storeKey || hostOf(site) || cfg.kb || "default");
    var defGreeting = function () { return "Hi! I answer from the " + name + " pages, with sources. What do you need?"; };
    var coreOpts = {mode: "widget", kb: cfg.kb || undefined, site: site || undefined, color: color, historyKey: key,
      greeting: cfg.greeting || defGreeting(), placeholder: "Ask about " + name + "...",
      starters: Array.isArray(cfg.starters) && cfg.starters.length ? cfg.starters.slice(0, 4) : undefined,
      onEvent: function (t, d) {
        if (t === "kb" && d && !cfg.name) rename(siteName(d.page_list, hostOf(d.url || site)));
        if (t === "answer" || t === "kb") renderHist();
        if (cfg.onEvent) try { cfg.onEvent(t, d); } catch (e) { /* host bug */ }
      }};
    if (api) coreOpts.api = api;
    var ctl = null, mounting = false, dark = false, opener = null, destroyed = false;

    if (cfg.font === "overpass") ensureFont();
    var hostEl = el("div", {"data-site-assistant": ""});
    hostEl.style.cssText = placement === "frame" ? "position:absolute;inset:0;pointer-events:none;z-index:30" : "position:static";
    var shadow = hostEl.attachShadow({mode: "open"});
    var P = "sa" + Math.random().toString(36).slice(2, 7);

    var launch = el("button", {class: "sa-launch", type: "button", "aria-expanded": "false", "aria-controls": P + "-panel", "aria-label": "Open help chat"});
    var icChat = icon("chat", 26); icChat.setAttribute("class", "sa-ic-chat");
    var icX = icon("chevdown", 26); icX.setAttribute("class", "sa-ic-x");
    launch.appendChild(icChat); launch.appendChild(icX);
    var teaser = el("div", {class: "sa-teaser", text: cfg.teaser || "Questions? Ask our docs.", hidden: true});
    var avatar = el("div", {class: "sa-avatar", "aria-hidden": "true", text: (name[0] || "A").toUpperCase()});
    var titleEl = el("div", {class: "sa-title", id: P + "-title", text: name + " Assistant"});
    var histBtn = el("button", {class: "sa-hbtn", type: "button", "aria-label": "Your chats", title: "Your chats", "aria-expanded": "false"}, [icon("clock", 18)]);
    var newBtn = el("button", {class: "sa-hbtn", type: "button", "aria-label": "New chat", title: "New chat"}, [icon("newchat", 18)]);
    var closeBtn = el("button", {class: "sa-hbtn", type: "button", "aria-label": "Close chat", title: "Close (Esc)"}, [icon("x", 18)]);
    var head = el("div", {class: "sa-head"}, [avatar,
      el("div", {class: "sa-ht"}, [titleEl, el("div", {class: "sa-sub"}, [el("span", {class: "sa-dot", "aria-hidden": "true"}), cfg.sub || "Answers from our docs"])]),
      el("div", {class: "sa-hbtns"}, [histBtn, newBtn, closeBtn])]);
    var coreRoot = el("div", {class: "sa-core"}, [el("p", {class: "sa-loading", text: "Loading the assistant..."})]);
    var pwLink = el("a", {href: HOME, target: "_blank", rel: "noopener noreferrer", text: "S'limane Chanchoul"});
    var pw = el("div", {class: "sa-pw"}, ["Powered by ", pwLink]);
    var hdSearch = el("input", {type: "search", placeholder: "Search chats", "aria-label": "Search chats", autocomplete: "off"});
    var hdBack = el("button", {class: "sa-hbtn", type: "button", "aria-label": "Back to chat"}, [icon("back", 18)]);
    var hdNew = el("button", {class: "sa-bnew", type: "button"}, [icon("plus", 16), "New"]);
    var hdList = el("ul", {class: "sa-hd-list", "aria-label": "Your chats"});
    var hd = el("div", {class: "sa-hd", role: "dialog", "aria-label": "Your chats", hidden: true}, [
      el("div", {class: "sa-hd-top"}, [el("div", {class: "sa-hd-title"}, [hdBack, el("strong", {text: "Your chats"}), el("span", {text: "Saved only in this browser"})]),
        el("div", {class: "sa-hd-row"}, [el("label", {class: "sa-search"}, [icon("search", 16), hdSearch]), hdNew])]),
      hdList]);
    var panel = el("section", {class: "sa-panel", id: P + "-panel", role: "dialog", "aria-labelledby": P + "-title", hidden: true},
      [head, el("div", {class: "sa-body"}, [coreRoot, pw, hd])]);
    var wg = el("div", {class: "wg " + placement}, [teaser, panel, launch]);

    var link = el("link", {rel: "stylesheet", href: CORE_CSS});
    var style = el("style", {text: CSS});
    shadow.appendChild(link); shadow.appendChild(style); shadow.appendChild(wg);

    function applyBrand() {
      var b = brandVars(color, dark);
      wg.style.setProperty("--brand", b.brand); wg.style.setProperty("--on-brand", b.on);
      wg.style.setProperty("--brand-ink", b.ink); wg.style.setProperty("--brand-soft", b.soft);
      var r = coreRoot;
      if (r.classList.contains("sc")) {
        r.style.setProperty("--brand", b.brand); r.style.setProperty("--blue", b.brand); r.style.setProperty("--on-blue", b.on);
        r.style.setProperty("--blue-text", b.ink); r.style.setProperty("--blue-soft", b.soft); r.style.setProperty("--btnbg", b.brand); r.style.setProperty("--btnfg", b.on);
        r.classList.toggle("sc-dark", dark);
      }
    }
    function themeNow() {
      if (cfg.theme === "dark") return true; if (cfg.theme === "light") return false;
      try { return typeof window.siteTheme === "function" && window.siteTheme() === "dark"; } catch (e) { return false; }
    }
    function setDark(d) { dark = !!d; wg.classList.toggle("dark", dark); applyBrand(); }
    var onTheme = function () { setDark(themeNow()); };
    if (cfg.theme !== "light" && cfg.theme !== "dark" && typeof window.siteTheme === "function") {
      document.addEventListener("themechange", onTheme);
    }
    setDark(themeNow());

    function rename(n) { // the crawled site title is a better brand name than the domain
      if (!n || n === name) return;
      name = n; titleEl.textContent = name + " Assistant"; avatar.textContent = (name[0] || "A").toUpperCase();
      coreOpts.placeholder = "Ask about " + name + "...";
      if (!cfg.greeting) coreOpts.greeting = defGreeting();
      if (ctl && ctl.state && !ctl.state.active) ctl.newChat();
    }
    var mountP = null;
    function mountCore() {
      if (ctl || destroyed) return Promise.resolve(ctl);
      if (mountP) return mountP;
      mounting = true;
      return (mountP = loadCore().then(function (m) {
        mounting = false; mountP = null;
        if (destroyed) return null; // destroy() ran while the core was loading: never mount an orphan
        coreRoot.replaceChildren();
        ctl = m.mount(coreRoot, coreOpts);
        applyBrand();
        return ctl;
      }, function () {
        mounting = false;
        mountP = null;
        if (!destroyed) coreRoot.replaceChildren(el("p", {class: "sa-loading", text: "The assistant could not load. Please check your connection and reload the page."}));
        return null;
      }));
    }
    function focusInput() { var t = coreRoot.querySelector("textarea"); if (t) t.focus({preventScroll: true}); }
    function isOpen() { return !panel.hidden; }
    function open(focus) {
      if (isOpen()) return;
      opener = focus ? (shadow.activeElement || document.activeElement) : null;
      panel.hidden = false; teaser.hidden = true; ls("sc-w-teased", "1");
      launch.setAttribute("aria-expanded", "true"); launch.setAttribute("aria-label", "Close help chat");
      wg.classList.add("open");
      mountCore().then(function () { if (focus) focusInput(); });
      if (cfg.onToggle) cfg.onToggle(true);
    }
    function close(silent) {
      if (!isOpen()) return;
      closeHist(true);
      panel.hidden = true; wg.classList.remove("open");
      launch.setAttribute("aria-expanded", "false"); launch.setAttribute("aria-label", "Open help chat");
      if (!silent) launch.focus();
      if (cfg.onToggle) cfg.onToggle(false);
    }

    /* history drawer: the chats of this site only */
    function chats() { try { var v = JSON.parse(ls(key) || "[]"); return Array.isArray(v) ? v.filter(function (c) { return c && c.id && Array.isArray(c.messages); }) : []; } catch (e) { return []; } }
    function when(ts) {
      var d = new Date(ts || 0), t0 = new Date(); t0.setHours(0, 0, 0, 0);
      return ts >= t0.getTime() ? d.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}) : d.toLocaleDateString([], {day: "numeric", month: "short"});
    }
    function renderHist() {
      if (hd.hidden) return;
      var term = hdSearch.value.trim().toLowerCase();
      var list = chats().sort(function (a, b) { return (b.updatedAt || 0) - (a.updatedAt || 0); })
        .filter(function (c) { return !term || String(c.title || "").toLowerCase().indexOf(term) >= 0; });
      var cur = ctl && ctl.state ? ctl.state.active : null;
      if (!list.length) { hdList.replaceChildren(el("li", {class: "sa-hd-empty", text: term ? "No chat matches." : "No chats yet. Ask a question and it is saved here."})); return; }
      hdList.replaceChildren.apply(hdList, list.map(function (c) {
        var n = c.messages.filter(function (m) { return m.role === "user"; }).length;
        return el("li", null, [el("button", {class: "sa-hrow" + (c.id === cur ? " cur" : ""), type: "button", "data-open": c.id, "aria-current": c.id === cur ? "true" : null},
          [el("b", {dir: "auto", text: c.title || "Chat"}), el("small", {text: when(c.updatedAt) + " · " + n + (n === 1 ? " question" : " questions")})])]);
      }));
    }
    function openHist() { hd.hidden = false; histBtn.setAttribute("aria-expanded", "true"); renderHist(); hdSearch.focus(); }
    function closeHist(silent) { if (hd.hidden) return false; hd.hidden = true; histBtn.setAttribute("aria-expanded", "false"); if (!silent) histBtn.focus(); return true; }

    launch.addEventListener("click", function () { if (isOpen()) close(); else open(true); });
    teaser.addEventListener("click", function () { open(true); });
    closeBtn.addEventListener("click", function () { close(); });
    histBtn.addEventListener("click", function () { if (hd.hidden) mountCore().then(openHist); else closeHist(); });
    newBtn.addEventListener("click", function () { mountCore().then(function (c) { if (!c) return; closeHist(true); c.newChat(); focusInput(); }); });
    hdBack.addEventListener("click", function () { closeHist(); });
    hdNew.addEventListener("click", function () { if (ctl) { ctl.newChat(); } closeHist(true); focusInput(); });
    hdSearch.addEventListener("input", renderHist);
    hdList.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-open]"); if (!b || !ctl) return;
      if (ctl.open(b.getAttribute("data-open"))) { closeHist(true); var hq = coreRoot.querySelector(".q"); if (hq) hq.focus({preventScroll: true}); else focusInput(); }
    });
    /* Escape: the chat core closes its own layers first (and stops the event); then the drawer; then the panel.
       Keys typed in the widget never reach the host page: its shortcuts ("/" for search, arrows, its own Escape
       handlers) would otherwise see them, because outside the shadow root their target is the host <div>. */
    wg.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !e.defaultPrevented) {
        if (closeHist()) e.preventDefault();
        else if (isOpen()) { e.preventDefault(); close(); }
      }
      e.stopPropagation();
    });
    wg.addEventListener("keyup", function (e) { e.stopPropagation(); });
    wg.addEventListener("keypress", function (e) { e.stopPropagation(); });

    if (placement === "fixed") (container || document.body).appendChild(hostEl); else container.appendChild(hostEl);
    if (cfg.open) open(false);
    else if (cfg.teaser !== false && !ls("sc-w-teased")) teaser.hidden = false;

    return {
      open: open, close: close, isOpen: isOpen,
      setColor: function (c) { var x = hex6(c); if (x) { color = x; coreOpts.color = x; applyBrand(); } },
      update: function (o) {
        if (o.greeting != null) coreOpts.greeting = String(o.greeting) || ("Hi! I answer from the " + name + " pages, with sources. What do you need?");
        if (o.starters) { var s = o.starters.map(String).map(function (x) { return x.trim(); }).filter(Boolean); coreOpts.starters = s.length ? s.slice(0, 4) : undefined; }
        if (ctl && ctl.state && !ctl.state.active) ctl.newChat();
      },
      get core() { return ctl; },
      historyKey: key,
      destroy: function () {
        destroyed = true;
        document.removeEventListener("themechange", onTheme);
        if (ctl) { ctl.destroy(); ctl = null; }
        hostEl.remove();
      },
    };
  }

  window.SiteAssistant = {create: create, normSite: normSite, hex: hex6, nameFrom: nameFrom, siteName: siteName};

  /* auto start from the script tag */
  if (me && me.dataset && (me.dataset.site || me.dataset.kb)) {
    var d = me.dataset;
    var go = function () {
      create(document.body, {site: d.site, kb: d.kb, color: d.color, api: d.api, greeting: d.greeting, name: d.name, placement: "fixed", theme: d.theme, font: d.font});
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
  }
})();
