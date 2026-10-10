// Theme: follows the visitor's system setting until they click the theme button. The choice is remembered,
// and forgotten again when it matches the system, so the page goes back to following it.
// Load in <head> (no defer) so a saved choice applies before the first paint.
(function () {
  var KEY = "theme", root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(v) { try { if (v) localStorage.setItem(KEY, v); else localStorage.removeItem(KEY); } catch (e) {} }
  function system() { return mq && mq.matches ? "dark" : "light"; }
  function current() { return root.getAttribute("data-theme") || system(); }
  var s = saved();
  if (s === "light" || s === "dark") root.setAttribute("data-theme", s);
  window.siteTheme = current;

  var SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var SUN = SVG + '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>';
  var MOON = SVG + '<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/></svg>';

  function paint(btn) {
    var dark = current() === "dark", label = dark ? "Switch to light mode" : "Switch to dark mode";
    btn.innerHTML = dark ? SUN : MOON;
    btn.setAttribute("aria-label", label);
    btn.title = label;
  }
  function notify() {
    var e;
    try { e = new CustomEvent("themechange", { detail: current() }); } catch (x) { return; }
    document.dispatchEvent(e);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-btn";
    var host = document.querySelector("header nav, .bar .links");
    if (host) host.appendChild(btn);
    else { btn.className += " floating"; document.body.appendChild(btn); }
    paint(btn);
    btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      if (next === system()) { root.removeAttribute("data-theme"); store(null); }
      else { root.setAttribute("data-theme", next); store(next); }
      paint(btn);
      notify();
    });
    if (mq) {
      var follow = function () { if (!root.getAttribute("data-theme")) { paint(btn); notify(); } };
      if (mq.addEventListener) mq.addEventListener("change", follow); else if (mq.addListener) mq.addListener(follow);
    }
  });
})();
