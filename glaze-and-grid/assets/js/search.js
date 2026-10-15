/* Glaze & Grid: instant search over the sample catalogue (window.GG_CATALOG).
   Knows synonyms (zellige / zellij / زليج, metro / subway, hex / hexagon), sizes written many ways
   (60x60, 60 x 60 cm, 600 x 600 mm, 120x60) and small typos. English, French and Arabic words.
   Plain ES2017 for older browsers. Exposes window.GGSearch. */
(function (global) {
  'use strict';

  /* ---------- text folding ---------- */
  function fold(s) {
    s = String(s == null ? '' : s).toLowerCase();
    // Arabic: one alef, one yeh, ta marbuta as heh (before NFD so hamza forms fold cleanly)
    s = s.replace(/[آأإٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
    if (s.normalize) s = s.normalize('NFD');
    s = s.replace(/[̀-ًͯ-ٰٟـ]/g, '');
    s = s.replace(/[×✕✖*]/g, 'x').replace(/[   ]/g, ' ');
    return s;
  }

  /* ---------- synonyms: every word in a group stands for the first one ---------- */
  var GROUPS = [
    ['zellige', 'zellij', 'zelij', 'zillij', 'zellig', 'zelige', 'zelliges', 'zellidj', 'zelig', 'zellij', 'zlij', 'zliij', 'زليج', 'الزليج', 'moroccan', 'marocain', 'maroc', 'مغربي'],
    ['metro', 'subway', 'metros', 'metrotile', 'subways', 'ميترو'],
    ['hexagon', 'hex', 'hexa', 'hexagonal', 'hexagons', 'hexagone', 'hexagonale', 'honeycomb', 'سداسي'],
    ['travertine', 'travertin', 'travertino', 'trav', 'ترافرتين', 'ترافرتين'],
    ['terrazzo', 'terazzo', 'terrazo', 'terrazzos', 'granito', 'تيرازو'],
    ['marble', 'marbre', 'marmo', 'marbles', 'رخام', 'الرخام'],
    ['concrete', 'cement', 'beton', 'microcement', 'microciment', 'ciment', 'اسمنت', 'خرسانه'],
    ['slate', 'ardoise', 'اردواز'],
    ['limestone', 'calcaire', 'pierre calcaire'],
    ['wood', 'wooden', 'oak', 'timber', 'parquet', 'plank', 'planks', 'bois', 'chene', 'خشب', 'خشبي'],
    ['stone', 'pierre', 'حجر'],
    ['outdoor', 'outside', 'exterior', 'external', 'garden', 'patio', 'terrace', 'terrasse', 'exterieur', 'خارجي'],
    ['paver', 'pavers', 'paving', 'slab', 'slabs', 'dalle', 'dalles'],
    ['floor', 'floors', 'flooring', 'sol', 'sols', 'ارضيه', 'ارضية'],
    ['wall', 'walls', 'mur', 'murs', 'mural', 'murale', 'حائط', 'جدار'],
    ['wet', 'wetroom', 'bathroom', 'bath', 'shower', 'bain', 'douche', 'حمام'],
    ['splashback', 'backsplash', 'kitchen', 'cuisine', 'credence'],
    ['grout', 'grouts', 'grouting', 'joint', 'joints', 'jointing', 'روبه', 'ترويب'],
    ['adhesive', 'glue', 'thinset', 'mortar', 'colle', 'mortier', 'لاصق', 'غراء'],
    ['trim', 'trims', 'profile', 'profiles', 'edging', 'profil', 'profiles', 'baguette', 'زاويه'],
    ['clips', 'clip', 'levelling', 'leveling', 'leveller', 'spacers', 'spacer', 'croisillons', 'nivellement', 'مشابك'],
    ['sample', 'samples', 'swatch', 'swatches', 'echantillon', 'echantillons', 'عينه', 'عينات'],
    ['pattern', 'patterned', 'encaustic', 'motif', 'motifs', 'decor', 'decorative', 'ciment', 'cementtile'],
    ['tile', 'tiles', 'tiling', 'carrelage', 'carreau', 'carreaux', 'faience', 'بلاط'],
    ['white', 'blanc', 'blanche', 'ابيض', 'بيضاء'],
    ['black', 'noir', 'noire', 'اسود', 'سوداء'],
    ['grey', 'gray', 'gris', 'grise', 'رمادي'],
    ['blue', 'bleu', 'bleue', 'navy', 'ازرق', 'زرقاء'],
    ['green', 'vert', 'verte', 'اخضر', 'خضراء'],
    ['beige', 'cream', 'creme', 'ecru', 'بيج'],
    ['brown', 'marron', 'brun', 'بني'],
    ['pink', 'rose', 'blush', 'وردي'],
    ['yellow', 'jaune', 'mustard', 'اصفر'],
    ['red', 'rouge', 'احمر'],
    ['matt', 'matte', 'mat', 'mate'],
    ['gloss', 'glossy', 'shiny', 'brillant', 'brillante', 'لامع'],
    ['polished', 'poli', 'polie'],
    ['honed', 'adouci'],
    ['handmade', 'handcrafted', 'artisanal', 'artisan', 'يدوي']
  ];
  var CANON = {};
  GROUPS.forEach(function (g) { g.forEach(function (w) { CANON[fold(w)] = fold(g[0]); }); });
  var STOP = { the: 1, a: 1, an: 1, and: 1, or: 1, for: 1, of: 1, in: 1, on: 1, with: 1, to: 1, my: 1, me: 1, i: 1,
    de: 1, la: 1, le: 1, les: 1, des: 1, du: 1, et: 1, en: 1, un: 1, une: 1, pour: 1, avec: 1,
    cm: 1, mm: 1, m: 1, x: 1, by: 1, size: 1, 'في': 1, 'من': 1, 'مع': 1 };

  /* ---------- sizes ---------- */
  function num(s) { return parseFloat(String(s).replace(',', '.')); }
  function fmtN(n) { return String(Math.round(n * 100) / 100); }
  function sizeToken(a, b) { var lo = Math.min(a, b), hi = Math.max(a, b); return 's' + fmtN(lo) + 'x' + fmtN(hi); }
  var SIZE_RE = /(\d+(?:[.,]\d+)?)\s*(mm|cm)?\s*(?:x|by)\s*(\d+(?:[.,]\d+)?)\s*(mm|cm)?/g;
  // "600 x 600" can mean mm or cm: both readings are kept and the one in the catalogue wins
  function extractSizes(q) {
    var sizes = [];
    var rest = q.replace(SIZE_RE, function (m, a, ua, b, ub) {
      var x = num(a), y = num(b), unit = ub || ua, alts = [];
      if (unit === 'mm') alts.push(sizeToken(x / 10, y / 10));
      else if (unit === 'cm') alts.push(sizeToken(x, y));
      else { alts.push(sizeToken(x, y)); alts.push(sizeToken(x / 10, y / 10)); }
      sizes.push(alts);
      return ' ';
    });
    return { sizes: sizes, rest: rest };
  }

  function tokens(s) {
    var out = [];
    String(s).split(/[^0-9a-z؀-ۿß-ɏ.]+/).forEach(function (w) {
      w = w.replace(/^\.+|\.+$/g, '');
      if (!w) return;
      // split letters from digits: "20mm" -> 20, mm; "1010" stays
      var parts = w.match(/\d+(?:\.\d+)?|[^\d.]+/g) || [];
      parts.forEach(function (p) { if (p && p !== '.') out.push(p); });
    });
    return out;
  }
  function canon(w) { return CANON[w] || w; }

  /* ---------- edit distance (optimal string alignment) ---------- */
  function dist(a, b, max) {
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) > max) return max + 1;
    var prev2 = null, prev = [], cur, i, j;
    for (j = 0; j <= lb; j++) prev[j] = j;
    for (i = 1; i <= la; i++) {
      cur = [i];
      var best = i;
      for (j = 1; j <= lb; j++) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        var v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        if (i > 1 && j > 1 && a.charAt(i - 1) === b.charAt(j - 2) && a.charAt(i - 2) === b.charAt(j - 1)) v = Math.min(v, prev2[j - 2] + 1);
        cur[j] = v;
        if (v < best) best = v;
      }
      if (best > max) return max + 1;
      prev2 = prev; prev = cur;
    }
    return prev[lb];
  }
  function maxTypos(w) { return /^\d/.test(w) ? 0 : w.length <= 3 ? 0 : w.length <= 5 ? 1 : 2; }

  /* ---------- index ---------- */
  var IDX = null;
  function addTokens(map, text, weight) {
    var s = fold(text);
    var ex = extractSizes(s);
    ex.sizes.forEach(function (alts) { var t = alts[0]; if (!map[t] || map[t] < weight) map[t] = weight; });
    tokens(s).forEach(function (w) {
      if (STOP[w]) return;
      var c = canon(w);
      if (!map[c] || map[c] < weight) map[c] = weight;
      if (c !== w && (!map[w] || map[w] < weight)) map[w] = weight;
    });
  }
  function build() {
    var cat = global.GG_CATALOG;
    if (!cat) return null;
    var docs = [], vocab = {};
    cat.products.forEach(function (p, pi) {
      p.skus.forEach(function (sku, vi) {
        var v = cat.variations[sku], map = {};
        addTokens(map, p.name, 3);
        addTokens(map, v.name, 3);
        Object.keys(v.attrs || {}).forEach(function (k) { addTokens(map, v.attrs[k], 3); });
        addTokens(map, sku, 3);
        if (v.supplier_sku) addTokens(map, v.supplier_sku, 2);
        if (v.colour) addTokens(map, v.colour, 3);
        if (v.family) addTokens(map, v.family, 2);
        if (v.finish) addTokens(map, v.finish, 2);
        if (v.size) addTokens(map, v.size, 2);
        if (p.look) addTokens(map, p.look, 2);
        if (p.material) addTokens(map, p.material, 2);
        (p.keywords || []).forEach(function (k) { addTokens(map, k, 2); });
        addTokens(map, p.group_label, 1);
        (p.use || []).forEach(function (u) { addTokens(map, u, 1); });
        // the patterns this variation can be laid in (straight, brick, herringbone): "herringbone" finds them all
        (v.patterns || []).forEach(function (pt) { addTokens(map, pt, 1); });
        if (p.type === 'tile' || p.type === 'stone') map.tile = map.tile || 1;
        if (p.handmade) map.handmade = 2;
        if (v.dims) {
          var t = sizeToken(v.dims[0], v.dims[1]);
          map[t] = 3;
          map[fmtN(v.dims[0])] = map[fmtN(v.dims[0])] || 2;
          map[fmtN(v.dims[1])] = map[fmtN(v.dims[1])] || 2;
        }
        Object.keys(map).forEach(function (t) { vocab[t] = 1; });
        docs.push({ pid: p.id, sku: sku, pi: pi, vi: vi, map: map, dflt: sku === p.default });
      });
    });
    IDX = { docs: docs, vocab: Object.keys(vocab) };
    return IDX;
  }

  // For one query word: the index words it can stand for, with a match quality (1 = exact).
  function expand(w, vocabSet, vocab) {
    if (/^\u0627\u0644./.test(w) && w.length > 4 && !CANON[w] && !vocabSet[w]) w = w.slice(2); // Arabic "al-"
    var c = canon(w), out = {};
    if (vocabSet[c]) out[c] = 1;
    if (vocabSet[w]) out[w] = 1;
    if (w.length >= 2 && !/^\d+$/.test(w)) {
      for (var i = 0; i < vocab.length; i++) {
        var t = vocab[i];
        if (t.charAt(0) === 's' && /^s\d/.test(t)) continue;
        if (t.length > w.length && t.indexOf(w) === 0 && !out[t]) out[t] = 0.8;
      }
    }
    var mt = maxTypos(w);
    if (mt) {
      for (var k = 0; k < vocab.length; k++) {
        var u = vocab[k];
        if (out[u] || /^s\d/.test(u) || /^\d/.test(u)) continue;
        var d = dist(w, u.length > w.length + 2 ? u.slice(0, w.length + 2) : u, mt);
        // a typo inside the first letters of a longer word counts too ("zelig" in "zellige")
        if (d <= mt) out[u] = d === 1 ? 0.6 : 0.45;
      }
      // a typo of a synonym: "zellidge" -> zellige via CANON keys
      Object.keys(CANON).forEach(function (syn) {
        if (syn.length < 4 || out[CANON[syn]]) return;
        if (Math.abs(syn.length - w.length) > mt) return;
        if (dist(w, syn, mt) <= mt && vocabSet[CANON[syn]]) out[CANON[syn]] = 0.55;
      });
    }
    return out;
  }

  function query(q) {
    var idx = IDX || build();
    if (!idx) return { products: [], ignored: [], terms: 0 };
    var s = fold(q).trim();
    if (!s) return { products: [], ignored: [], terms: 0 };
    var vocabSet = {};
    idx.vocab.forEach(function (t) { vocabSet[t] = 1; });
    var ex = extractSizes(s);
    var terms = [], ignored = [];
    ex.sizes.forEach(function (alts) {
      var m = {};
      alts.forEach(function (t, i) { if (vocabSet[t]) m[t] = i === 0 ? 1 : 0.95; });
      if (Object.keys(m).length) terms.push(m); else ignored.push(alts[0].slice(1));
    });
    var words = tokens(ex.rest).filter(function (w) { return !STOP[w]; });
    words.forEach(function (w) {
      var m = expand(w, vocabSet, idx.vocab), keys = Object.keys(m);
      if (!keys.length) { ignored.push(w); return; }
      // keep only the near-best readings of a word: "zelige" means zellige, not also beige
      var best = Math.max.apply(null, keys.map(function (k) { return m[k]; }));
      keys.forEach(function (k) { if (m[k] < best - 0.15) delete m[k]; });
      terms.push(m);
    });
    if (!terms.length) return { products: [], ignored: ignored, terms: 0 };
    var byProduct = {};
    idx.docs.forEach(function (d) {
      var total = 0;
      for (var i = 0; i < terms.length; i++) {
        var best = 0, m = terms[i];
        for (var t in m) { if (d.map[t]) { var sc = m[t] * d.map[t]; if (sc > best) best = sc; } }
        if (!best) return;
        total += best;
      }
      var cur = byProduct[d.pid];
      if (!cur) byProduct[d.pid] = cur = { pid: d.pid, score: total, sku: d.sku, pi: d.pi, skus: [] };
      cur.skus.push(d.sku);
      if (total > cur.score || (total === cur.score && d.dflt)) { cur.score = total; cur.sku = d.sku; }
    });
    var list = Object.keys(byProduct).map(function (k) { return byProduct[k]; });
    list.sort(function (a, b) { return b.score - a.score || a.pi - b.pi; });
    return { products: list, ignored: ignored, terms: terms.length };
  }

  /* ---------- combobox for the header search ---------- */
  function root() { return document.documentElement.getAttribute('data-root') || ''; }
  var uid = 0;
  function attach(input) {
    if (!input || input.getAttribute('data-gg-search')) return;
    input.setAttribute('data-gg-search', '1');
    var form = input.form;
    var list = document.createElement('ul');
    list.className = 'search-pop';
    list.id = 'gg-sp-' + (++uid);
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', 'Search results');
    list.hidden = true;
    (input.parentNode).appendChild(list);
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', list.id);
    var items = [], active = -1;

    function shopUrl(q) { return root() + 'shop/?q=' + encodeURIComponent(q); }
    function close() { list.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); active = -1; }
    function setActive(i) {
      items.forEach(function (el, k) { el.setAttribute('aria-selected', String(k === i)); });
      active = i;
      if (i >= 0 && items[i]) { input.setAttribute('aria-activedescendant', items[i].id); }
      else input.removeAttribute('aria-activedescendant');
    }
    function render() {
      var q = input.value.trim();
      if (!q) { close(); return; }
      var res = query(q), cat = global.GG_CATALOG, fmt = global.GGFormat, trade = document.body.classList.contains('trade');
      var html = '';
      items = [];
      res.products.slice(0, 6).forEach(function (r, i) {
        var p = cat.products.filter(function (x) { return x.id === r.pid; })[0], v = cat.variations[r.sku];
        var price = fmt ? fmt.fromPrice(v, trade) : '';
        html += '<li role="none"><a role="option" id="' + list.id + '-o' + i + '" class="sp-opt" href="' + root() + p.url + '?sku=' + encodeURIComponent(r.sku) + '" tabindex="-1">' +
          '<img src="' + root() + v.thumb + '" alt="" width="44" height="44" loading="lazy">' +
          '<span><span class="sp-name">' + esc(p.name) + '</span><span class="sp-meta">' + esc(v.label) + '</span></span>' +
          '<span class="sp-price">' + price + '</span></a></li>';
      });
      if (!res.products.length) html += '<li role="none" class="sp-none">No match for “' + esc(q) + '”. Try zellige, metro, hexagon or 60x60.</li>';
      html += '<li role="none"><a role="option" id="' + list.id + '-all" class="sp-all" href="' + shopUrl(q) + '" tabindex="-1">See all results in the shop</a></li>';
      list.innerHTML = html;
      items = Array.prototype.slice.call(list.querySelectorAll('[role="option"]'));
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      setActive(-1);
    }
    input.addEventListener('input', render);
    input.addEventListener('focus', function () { if (input.value.trim()) render(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { if (list.hidden) render(); e.preventDefault(); setActive(Math.min(items.length - 1, active + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(-1, active - 1)); }
      else if (e.key === 'Escape') { if (!list.hidden) { e.preventDefault(); close(); } else { input.value = ''; } }
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (active >= 0 && items[active]) location.href = items[active].href;
        else if (input.value.trim()) location.href = shopUrl(input.value.trim());
      }
    });
    if (form) form.addEventListener('submit', function (e) { e.preventDefault(); if (input.value.trim()) location.href = shopUrl(input.value.trim()); });
    document.addEventListener('click', function (e) { if (!list.hidden && !input.parentNode.contains(e.target)) close(); });
    input.addEventListener('blur', function () { setTimeout(function () { if (!input.parentNode.contains(document.activeElement)) close(); }, 150); });
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  global.GGSearch = { query: query, fold: fold, canon: canon, attach: attach, rebuild: build, extractSizes: extractSizes };
})(window);
