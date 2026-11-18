/* utm-keeper.js: keeps UTM parameters across pages and return visits. Plain JS, no server code. */
(function () {
  // Config: how each parameter is found in a form. Any one of the selectors is enough.
  // On Gravity Forms: give the hidden field a "Parameter Name" or CSS class (e.g. utm_source), or use the input name.
  var CONFIG = {
    params: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'],
    selectors: {
      utm_source:   'input[name="utm_source"], input[data-utm="utm_source"], .utm_source input',
      utm_medium:   'input[name="utm_medium"], input[data-utm="utm_medium"], .utm_medium input',
      utm_campaign: 'input[name="utm_campaign"], input[data-utm="utm_campaign"], .utm_campaign input',
      utm_term:     'input[name="utm_term"], input[data-utm="utm_term"], .utm_term input',
      utm_content:  'input[name="utm_content"], input[data-utm="utm_content"], .utm_content input',
      gclid:        'input[name="gclid"], input[data-utm="gclid"], .gclid input',
      fbclid:       'input[name="fbclid"], input[data-utm="fbclid"], .fbclid input'
    },
    days: 90,
    key: 'utm_keeper',
    cookiePath: '/utm-keeper/'   // on a real site: '/'
  };

  function readCookie() {
    var m = document.cookie.match(new RegExp('(?:^|; )' + CONFIG.key + '=([^;]*)'));
    if (!m) return null;
    try { return JSON.parse(decodeURIComponent(m[1])); } catch (e) { return null; }
  }
  function readLocal() {
    try { var s = localStorage.getItem(CONFIG.key); return s ? JSON.parse(s) : null; } catch (e) { return null; }
  }
  function valid(r) { return r && r.values && typeof r.expires === 'number' && r.expires > Date.now(); }

  function load() {
    var c = readCookie(), l = readLocal();
    if (valid(c)) return { rec: c, from: 'cookie' };
    if (valid(l)) return { rec: l, from: 'localStorage' };
    return null;
  }
  function save(rec) {
    try { localStorage.setItem(CONFIG.key, JSON.stringify(rec)); } catch (e) {}
    try {
      document.cookie = CONFIG.key + '=' + encodeURIComponent(JSON.stringify(rec)) +
        '; expires=' + new Date(rec.expires).toUTCString() + '; path=' + CONFIG.cookiePath + '; SameSite=Lax' +
        (location.protocol === 'https:' ? '; Secure' : '');
    } catch (e) {}
  }
  function forget() {
    try { localStorage.removeItem(CONFIG.key); } catch (e) {}
    document.cookie = CONFIG.key + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=' + CONFIG.cookiePath + '; SameSite=Lax';
  }

  function fromUrl() {
    var q = new URLSearchParams(location.search), v = {}, any = false;
    CONFIG.params.forEach(function (p) {
      var x = q.get(p);
      if (x) { v[p] = x; any = true; }
    });
    return any ? v : null;
  }

  function fill(root) {
    var s = load(), vals = s ? s.rec.values : {};
    CONFIG.params.forEach(function (p) {
      (root || document).querySelectorAll(CONFIG.selectors[p]).forEach(function (el) {
        el.value = vals[p] || '';
      });
    });
  }

  function init() {
    var fresh = fromUrl();
    if (fresh) {
      var now = Date.now();
      save({ values: fresh, captured: now, expires: now + CONFIG.days * 864e5 });   // last touch: whole set replaced
    } else {
      // direct or internal visit: leave the set alone, but make sure both stores still hold it
      var s = load();
      if (s) save(s.rec);
    }
    fill(document);
    if (window.MutationObserver) {
      new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          if (muts[i].addedNodes.length) { fill(document); break; }
        }
      }).observe(document.documentElement, { childList: true, subtree: true });
    }
    document.dispatchEvent(new CustomEvent('utmkeeper:ready'));
  }

  window.utmKeeper = {
    config: CONFIG,
    get: function () { var s = load(); return s ? { values: s.rec.values, captured: s.rec.captured, expires: s.rec.expires, from: s.from } : null; },
    forget: function () { forget(); fill(document); document.dispatchEvent(new CustomEvent('utmkeeper:ready')); },
    refill: function () { fill(document); }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
