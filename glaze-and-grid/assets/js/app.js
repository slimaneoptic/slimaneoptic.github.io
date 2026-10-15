/* Glaze & Grid demo store: shared code and page controllers. Fictional shop, sample data, no real orders.
   - View switch (home buyer / trade buyer), price formatting, demo basket in localStorage, header and menu.
   - Pages: home wall, shop filters + search, product page, sample box, basket, demo checkout.
   Plain ES2017 for older browsers (Chrome 120 and up). */
(function () {
  'use strict';

  var ROOT = document.documentElement.getAttribute('data-root') || '';
  var CAT = window.GG_CATALOG || { products: [], variations: {} };
  var PRODUCTS = {};
  CAT.products.forEach(function (p) { PRODUCTS[p.id] = p; });
  function $(id) { return document.getElementById(id); }
  function qsa(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function readJSON(id) { var el = $(id); if (!el) return null; try { return JSON.parse(el.textContent); } catch (e) { return null; } }
  function emit(name, detail, target) { (target || document).dispatchEvent(new CustomEvent(name, { detail: detail, bubbles: true })); }
  function store(key, val) { try { if (val === undefined) return JSON.parse(localStorage.getItem(key)); localStorage.setItem(key, JSON.stringify(val)); } catch (e) { return null; } return val; }

  /* ---------- money and numbers ---------- */
  var NF = {};
  function n(v, d) {
    d = d == null ? 2 : d;
    if (!NF[d]) NF[d] = new Intl.NumberFormat('en-IE', { minimumFractionDigits: d, maximumFractionDigits: d });
    return NF[d].format(v);
  }
  function eur(v) { return '€' + n(v, 2); }
  var UNITS = { box: ['box', 'boxes'], bag: ['bag', 'bags'], length: ['length', 'lengths'], pack: ['pack', 'packs'] };
  function unitWord(unit, qty) { var u = UNITS[unit] || [unit, unit + 's']; return qty === 1 ? u[0] : u[1]; }
  function isTrade() { return document.body.classList.contains('trade'); }
  // "Edge trim 2.5 m" + "2.5 m, 8 mm, Matt black" -> "Edge trim 2.5 m, 8 mm, Matt black" (no repeated part)
  function fullName(pn, vn) {
    var parts = String(vn || '').split(', ');
    while (parts.length && parts[0] && (' ' + pn).slice(-(parts[0].length + 1)) === ' ' + parts[0]) parts.shift();
    return (parts.length && parts[0] ? pn + ', ' + parts.join(', ') : pn).replace(/(\d) x (\d)/g, '$1 \u00d7 $2');
  }
  // "Only 5 boxes in stock." when a line asks for more than all shade lots hold (null for made-to-order items)
  function stockNote(stock, qty, unit) {
    if (stock == null || qty <= stock) return '';
    return stock > 0 ? 'Only ' + stock + ' ' + unitWord(unit, stock) + ' in stock.' : 'Out of stock.';
  }
  function fromPrice(v, trade) {
    if (!v) return '';
    if (v.m2) return eur(trade ? v.m2.trade : v.m2.box) + '<span class="u">/m²</span>';
    return eur(trade ? v.price.trade : v.price.box) + ' a ' + unitWord(v.unit, 1);
  }
  window.GGFormat = { eur: eur, n: n, fromPrice: fromPrice, unitWord: unitWord };

  /* Same rule as data/kit-rules.json "pricing": trade price on every unit; home: full pallets at the pallet
     price, the rest at the 10+ price when the line has 10 or more, else the single price. Money in cents. */
  function priceLine(v, qty, trade) {
    var pr = v.price, parts = [];
    if (trade) {
      parts.push({ tier: 'trade', qty: qty, unit: pr.trade });
    } else {
      var bpp = v.per_pallet || 0, full = bpp ? Math.floor(qty / bpp) : 0, onPallet = full * bpp, loose = qty - onPallet;
      var tier = qty >= 10 && pr.box_10 != null ? 'box_10' : 'box';
      if (onPallet && pr.pallet != null) parts.push({ tier: 'pallet', qty: onPallet, unit: pr.pallet });
      else loose = qty;
      if (loose) parts.push({ tier: tier, qty: loose, unit: pr[tier] });
    }
    var c = 0;
    parts.forEach(function (x) { c += Math.round(x.unit * 100) * x.qty; });
    return { total: c / 100, parts: parts };
  }
  var TIER_NAMES = { trade: 'trade price', pallet: 'pallet price', box_10: '10+ price', box: 'single price' };
  function partsText(v, line) {
    return line.parts.map(function (x) { return x.qty + ' ' + unitWord(v.unit, x.qty) + ' at ' + eur(x.unit) + ' (' + TIER_NAMES[x.tier] + ')'; }).join(' + ');
  }

  /* ---------- view switch: home buyer / trade buyer (demo only: no login) ---------- */
  var VKEY = 'gg-view';
  function getView() {
    var m = /[?&]view=(home|trade)\b/.exec(location.search);
    if (m) return m[1];
    return store(VKEY) === 'trade' ? 'trade' : 'home';
  }
  function setView(v, save) {
    document.body.classList.toggle('trade', v === 'trade');
    qsa('.viewas button[data-view]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === v)); });
    if (save) store(VKEY, v);
    emit('gg:view', v);
  }
  window.GGView = { get: function () { return isTrade() ? 'trade' : 'home'; }, set: setView };
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-view]') : null;
    if (b && (b.tagName === 'BUTTON' || b.tagName === 'A')) { e.preventDefault(); setView(b.getAttribute('data-view'), true); }
  });

  /* ---------- demo basket (localStorage only) ---------- */
  var BKEY = 'gg-basket-v1';
  function readBasket() { var b = store(BKEY); return b && Array.isArray(b.lines) ? b : { lines: [] }; }
  function writeBasket(b) { store(BKEY, b); badge(); emit('gg:basket', b.lines); }
  function addLines(lines) {
    var b = readBasket(), added = 0;
    (lines || []).forEach(function (l) {
      if (!l || !l.sku) return;
      var qty = Math.max(1, Math.min(9999, Math.round(+l.qty || 1)));
      // one line per SKU (so the quantity tier covers all of it); sample boxes stay separate
      var same = l.samples ? null : b.lines.filter(function (x) { return x.sku === l.sku && !x.samples; })[0];
      if (same) {
        same.qty = Math.min(9999, same.qty + qty);
        if (l.note) same.note = (same.note ? same.note + '; ' : '') + String(l.note).slice(0, 300);
      } else {
        var line = { sku: String(l.sku), qty: qty };
        if (l.note) line.note = String(l.note).slice(0, 300);
        if (l.samples) line.samples = l.samples.slice(0, 5);
        b.lines.push(line);
      }
      added += qty;
    });
    writeBasket(b);
    return added;
  }
  window.GGBasket = {
    get: function () { return readBasket().lines; },
    add: addLines,
    setQty: function (i, q) { var b = readBasket(); if (b.lines[i]) { b.lines[i].qty = Math.max(1, Math.min(9999, Math.round(q) || 1)); writeBasket(b); } },
    remove: function (i) { var b = readBasket(); b.lines.splice(i, 1); writeBasket(b); },
    clear: function () { writeBasket({ lines: [] }); },
    count: function () { return readBasket().lines.length; },
    priceLine: priceLine
  };
  // other scripts (the calculator) can add lines without knowing this API
  document.addEventListener('gg:basket-add', function (e) {
    var d = e.detail || {};
    var n2 = addLines(d.lines || [d]);
    if (n2) toast('Added to the demo basket. <a href="' + ROOT + 'basket/">View basket</a>');
  });
  window.addEventListener('storage', function (e) { if (e.key === BKEY) { badge(); emit('gg:basket', readBasket().lines); } });
  function badge() {
    var c = readBasket().lines.length;
    qsa('[data-basket-count]').forEach(function (el) { el.textContent = String(c); el.hidden = el.classList.contains('hide-zero') && !c; });
  }

  /* ---------- toast ---------- */
  var toastTimer = null;
  function toast(html) {
    var t = $('gg-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'gg-toast';
      t.className = 'toast';
      t.setAttribute('role', 'status');
      t.setAttribute('aria-live', 'polite');
      document.body.appendChild(t);
    }
    t.innerHTML = html;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 5000);
  }
  window.GGToast = toast;

  /* ---------- header: menu, search ---------- */
  function initHeader() {
    var btn = document.querySelector('.menu-btn'), panel = $('menuPanel');
    if (btn && panel) {
      btn.addEventListener('click', function () {
        var open = !panel.classList.contains('open');
        panel.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', String(open));
        if (open) { var f = panel.querySelector('input, a'); if (f) f.focus(); }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && panel.classList.contains('open')) { panel.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
      });
    }
    if (window.GGSearch) qsa('input[data-search]').forEach(function (i) { window.GGSearch.attach(i); });
    badge();
  }

  /* ---------- samples (sample box picks, max 5) ---------- */
  var SKEY = 'gg-samples-v1';
  function samples() { var s = store(SKEY); return Array.isArray(s) ? s.filter(function (k) { return CAT.variations[k]; }).slice(0, 5) : []; }
  function setSamples(s) { store(SKEY, s.slice(0, 5)); emit('gg:samples', s); }

  /* ================= HOME: the tile wall ================= */
  function initHome() {
    var data = readJSON('gg-wall');
    if (!data || !window.GG) return;
    var GG = window.GG;
    GG.registerTiles((data.cards || []).concat(data.tiles));
    GG.registerGrouts(data.grouts);
    var TILE = {}; data.tiles.forEach(function (t) { TILE[t.id] = t; });
    var state = { tile: data.defaults.tile, pattern: data.defaults.pattern, grout: data.defaults.grout };
    var q = new URLSearchParams(location.search);
    var qt = q.get('tile');
    if (qt) data.tiles.forEach(function (t) { if (t.id === qt || t.key === qt) state.tile = t.id; });
    if (['straight', 'brick', 'herringbone'].indexOf(q.get('pattern')) >= 0) state.pattern = q.get('pattern');
    if (q.get('grout')) data.grouts.forEach(function (g) { if (g.sku === q.get('grout') || g.key === q.get('grout')) state.grout = g.sku; });

    var canvas = $('wall');
    var mobile = function () { return window.matchMedia('(max-width: 860px)').matches; };
    var wall = window.GGHomeWall = new GG.Wall(canvas, { widthM: mobile() ? 1.3 : 3, seed: 11, windowLight: q.get('light') !== 'flat' });

    var chipsEl = $('tileChips'), chipWalls = [];
    data.tiles.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.setAttribute('data-tile', t.id);
      b.setAttribute('aria-label', t.name + ', ' + t.spec);
      b.title = t.name;
      var c = document.createElement('canvas');
      b.appendChild(c);
      chipsEl.appendChild(b);
      // chips are drawn small: faces from the 400 px thumbnails
      var chipSpec = Object.assign({}, t, { id: 'chip:' + t.id });
      if (t.tex && t.thumbTex) chipSpec.tex = { src: t.thumbTex, cm: t.tex.cm };
      GG.registerTiles([chipSpec]);
      chipWalls.push(new GG.Wall(c, { tile: chipSpec.id, pattern: 'straight', grout: t.chipGrout || '#F2F2EE', widthM: t.chipWidthM, light: false, vignette: false, seed: 3, center: t.chipCenter || 'joint' }));
    });
    var groutsEl = $('groutChips');
    data.grouts.forEach(function (g) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'grout';
      b.setAttribute('data-grout', g.sku);
      b.style.background = g.hex;
      b.title = g.name;
      b.setAttribute('aria-label', 'Grout: ' + g.name);
      groutsEl.appendChild(b);
    });
    function grout() { return data.grouts.filter(function (g) { return g.sku === state.grout; })[0] || data.grouts[0]; }

    function sync() {
      var t = TILE[state.tile];
      if (t.patterns.indexOf(state.pattern) < 0) state.pattern = t.patterns[0];
      qsa('.chip', chipsEl).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-tile') === state.tile)); });
      qsa('#patternSeg button').forEach(function (b) {
        var p = b.getAttribute('data-p');
        b.setAttribute('aria-pressed', String(p === state.pattern));
        b.disabled = t.patterns.indexOf(p) < 0;
      });
      var note = $('patternNote');
      note.hidden = t.patterns.length >= 3;
      note.textContent = t.patternNote || '';
      var g = grout();
      qsa('.grout', groutsEl).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-grout') === state.grout)); });
      $('groutName').textContent = g.name;
      $('addGrout').setAttribute('data-add-sku', g.sku);
      $('addGrout').setAttribute('aria-label', 'Add one 5 kg bag of ' + g.name + ' grout to the basket');
      $('tName').textContent = t.name;
      $('tSpec').textContent = t.spec;
      var trade = isTrade();
      $('tPrice').textContent = eur(trade ? t.price.trade : t.price.home);
      $('tVat').textContent = trade ? 'per m², trade price' : 'per m²';
      $('tLink').href = ROOT + t.url;
      canvas.setAttribute('aria-label', 'A wall of ' + t.name + ' (' + t.spec + '), laid ' + state.pattern + ' with ' + g.name.toLowerCase() + ' grout, drawn to scale');
      wall.set({ tile: state.tile, pattern: state.pattern, grout: g.hex, widthM: mobile() ? 1.3 : 3 }).then(updateScale);
    }
    function updateScale() {
      var px = wall.pxPerMetreCss;
      if (!px) return;
      $('scaleBar').style.width = Math.round(px) + 'px';
      $('wallWidth').textContent = (mobile() ? '1.3' : '3') + ' m';
    }
    chipsEl.addEventListener('click', function (e) { var b = e.target.closest('.chip'); if (b) { state.tile = b.getAttribute('data-tile'); sync(); } });
    $('patternSeg').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b && !b.disabled) { state.pattern = b.getAttribute('data-p'); sync(); } });
    groutsEl.addEventListener('click', function (e) { var b = e.target.closest('.grout'); if (b) { state.grout = b.getAttribute('data-grout'); sync(); } });
    document.addEventListener('gg:view', function () { sync(); });

    var cardWalls = qsa('canvas[data-wall-tile]').map(function (c) {
      return new GG.Wall(c, { tile: c.getAttribute('data-wall-tile'), pattern: c.getAttribute('data-pattern') || 'straight',
        grout: c.getAttribute('data-grout') || '#DEDCD3', widthM: parseFloat(c.getAttribute('data-width')) || 1.2, seed: 5, vignette: false });
    });
    function drawAll() {
      sync();
      chipWalls.forEach(function (w) { w.draw(); });
      cardWalls.forEach(function (w) { w.draw(); });
    }
    var tmr = null;
    if (window.ResizeObserver) new ResizeObserver(function () { clearTimeout(tmr); tmr = setTimeout(drawAll, 120); }).observe(canvas);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawAll); else drawAll();
  }

  /* ================= PRODUCT PAGE ================= */
  function initProduct() {
    var P = readJSON('gg-product');
    if (!P) return;
    var vars = P.variations, cur = 0;
    vars.forEach(function (v, i) { if (v.sku === P.default_sku) cur = i; });
    var qs = new URLSearchParams(location.search).get('sku');
    vars.forEach(function (v, i) { if (v.sku === qs) cur = i; });
    var GG = window.GG, laid = null, laidPattern = null, laidGrout = null;
    if (GG && P.wall) {
      GG.registerTiles(Object.keys(P.wall).map(function (k) { return P.wall[k]; }));
      var lc = $('laid');
      if (lc) laid = new GG.Wall(lc, { widthM: 2.4, seed: 21 });
    }
    function calcBlob(v) {
      // The calculator (src/js/calc.js) reads this: the variation as in data/products.json, plus product
      // context, the fixing items it may add (kit_items, by SKU) and the sample rules (data/kit-rules.json).
      return Object.assign({}, v, { product: P.product, handmade: P.product.handmade, material: P.product.material,
        kit: P.product.kit, kit_items: P.kit_items, rules: P.rules });
    }
    var REGIONS = ['price', 'label', 'specs', 'stock', 'draw', 'kit', 'trace', 'used', 'calcfb'];
    function region(name, i) {
      var map = P.regions && P.regions[name];
      if (!map) return;
      var el = document.querySelector('[data-region="' + name + '"]'), tpl = $('tpl-' + name + '-' + map[i]);
      if (el && tpl) el.innerHTML = tpl.innerHTML;
    }
    function drawLaid() {
      if (!laid) return;
      var v = vars[cur], spec = P.wall[v.sku];
      var fig = $('laidFig');
      if (!spec) { if (fig) fig.hidden = true; return; }
      if (fig) fig.hidden = false;
      var pats = (v.patterns || []).filter(function (p) { return p === 'straight' || p === 'brick' || p === 'herringbone'; });
      if (!pats.length) pats = ['straight'];
      if (pats.indexOf(laidPattern) < 0) laidPattern = pats[0];
      var seg = $('laidSeg');
      if (seg) {
        seg.hidden = pats.length < 2 || spec.kind === 'laid';
        qsa('button', seg).forEach(function (b) {
          var p = b.getAttribute('data-p');
          b.hidden = pats.indexOf(p) < 0;
          b.setAttribute('aria-pressed', String(p === laidPattern));
        });
      }
      var widthM = spec.L >= 90 ? 3.6 : 2.4;
      var lg = (P.product.type !== 'fixing' && laidGrout) || P.laid_grout[v.sku] || { hex: '#DEDCD3', name: 'light' };
      laid.set({ tile: v.sku, pattern: laidPattern, grout: lg.hex, widthM: widthM });
      var cap = spec.kind === 'laid' ? 'Laid at scale, ' + widthM + ' m across' : 'Laid at scale, ' + widthM + ' m across, ' + laidPattern + ', ' + lg.name.toLowerCase() + ' grout';
      if (P.laid_caption && P.laid_caption[v.sku]) cap = P.laid_caption[v.sku];
      $('laidCap').textContent = cap;
      $('laid').setAttribute('aria-label', cap + '. ' + fullName(P.product.name, v.name) + '.');
    }
    function show(i, initial) {
      cur = i;
      var v = vars[i];
      if (!initial || i !== P.default_index) REGIONS.forEach(function (r) { region(r, i); });
      qsa('[data-axis]').forEach(function (b) {
        var ax = b.getAttribute('data-axis');
        b.setAttribute('aria-pressed', String(v.attributes[ax] === b.getAttribute('data-value')));
      });
      var picked = $('optPicked');
      if (picked) picked.textContent = v.name.replace(/ x /g, ' × ');
      var img = $('pdImg'), im = P.images[v.sku];
      if (img && im && img.getAttribute('src') !== ROOT + im.full) {
        img.src = ROOT + im.full;
        img.srcset = ROOT + im.thumb + ' 400w, ' + ROOT + im.full + ' 1200w';
        img.alt = im.alt;
        if ($('pdImgCap')) $('pdImgCap').textContent = im.caption;
      }
      drawLaid();
      var mount = $('gg-calc');
      if (mount) {
        var blob = calcBlob(v);
        mount.setAttribute('data-sku', v.sku);
        mount.setAttribute('data-variation', JSON.stringify(blob));
        if (!initial) emit('gg:variation', { sku: v.sku, variation: blob }, mount);
      }
      var add = $('addBtn');
      if (add) add.setAttribute('data-sku', v.sku);
      var sb = $('sampleBtn');
      if (sb) sb.setAttribute('data-sku', v.sku);
      if (!initial) {
        var u = new URL(location.href);
        u.searchParams.set('sku', v.sku);
        history.replaceState(null, '', u.pathname + u.search + u.hash);
      }
    }
    qsa('[data-axis]').forEach(function (b) {
      b.addEventListener('click', function () {
        var ax = b.getAttribute('data-axis'), val = b.getAttribute('data-value'), now = vars[cur].attributes;
        var best = -1;
        vars.forEach(function (v, i) {
          if (best >= 0 || v.attributes[ax] !== val) return;
          var same = Object.keys(now).every(function (k) { return k === ax || v.attributes[k] === now[k]; });
          if (same) best = i;
        });
        if (best < 0) vars.forEach(function (v, i) { if (best < 0 && v.attributes[ax] === val) best = i; });
        if (best >= 0 && best !== cur) show(best, false);
      });
    });
    var seg = $('laidSeg');
    if (seg) seg.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { laidPattern = b.getAttribute('data-p'); drawLaid(); } });

    // quantity and add to basket
    var qty = $('qty');
    function stepQty(d) { var v = Math.max(1, Math.min(9999, (parseInt(qty.value, 10) || 1) + d)); qty.value = String(v); }
    qsa('[data-qty-step]').forEach(function (b) { b.addEventListener('click', function () { stepQty(parseInt(b.getAttribute('data-qty-step'), 10)); }); });
    var addBtn = $('addBtn');
    if (addBtn && qty) addBtn.addEventListener('click', function () {
      var v = vars[cur], q2 = Math.max(1, Math.min(9999, parseInt(qty.value, 10) || 1));
      qty.value = String(q2);
      addLines([{ sku: v.sku, qty: q2 }]);
      var inBasket = readBasket().lines.filter(function (l) { return l.sku === v.sku && !l.samples; }).reduce(function (a, l) { return a + l.qty; }, 0);
      var short = v.stock_policy === 'made_to_order' ? '' : stockNote(v.stock_total || 0, inBasket, v.sale_unit);
      if (short && inBasket > q2) short = short.replace(/\.$/, '') + ' (' + inBasket + ' in your basket).';
      var msg = 'Added ' + q2 + ' ' + unitWord(v.sale_unit, q2) + ' of ' + esc(fullName(P.product.name, v.name)) + '.' +
        (short ? ' <strong>' + esc(short) + '</strong>' : '') + ' <a href="' + ROOT + 'basket/">View basket</a>';
      $('buyStatus').innerHTML = msg;
    });
    var sb = $('sampleBtn');
    if (sb) sb.addEventListener('click', function () {
      var sku = vars[cur].sku, s = samples();
      var link = ' <a href="' + ROOT + 'p/sample-box/">Open the sample box</a>';
      if (s.indexOf(sku) >= 0) { $('buyStatus').innerHTML = 'Already in your sample box (' + s.length + ' of 5).' + link; return; }
      if (s.length >= 5) { $('buyStatus').innerHTML = 'Your sample box is full (5 of 5).' + link; return; }
      s.push(sku);
      setSamples(s);
      $('buyStatus').innerHTML = 'Added to your sample box (' + s.length + ' of 5).' + link;
    });
    // The calculator (src/js/calc.js) reports each new quote: the laid view follows its pattern and grout,
    // and its room-plan canvas (data-plan) is drawn here with the same wall code.
    var plan = null, planTimer = null, lastPlan = null;
    function drawPlan() {
      var st = lastPlan && lastPlan.state, cv = lastPlan && lastPlan.planCanvas;
      if (!st || !cv || !GG || !st.room_m || !P.wall[st.sku]) return;
      var spec = P.wall[st.sku], fig = cv.closest('figure'), cap = fig ? fig.querySelector('[data-slot="plancap"]') : null;
      var L = st.room_m.length, W = st.room_m.width;
      var tiles = L * W * 10000 / (spec.L * spec.W);
      if (tiles > 40000 || L > 60 || W > 60) {
        var g0 = cv.getContext('2d');
        g0.clearRect(0, 0, cv.width, cv.height);
        if (cap) cap.textContent = 'Room too large to draw tile by tile';
        return;
      }
      if (!plan || plan.c !== cv) plan = new GG.Wall(cv, { seed: 21, light: false, vignette: false, background: '#F1F2EF', roomPad: 40 });
      var pat = ['straight', 'brick', 'herringbone'].indexOf(st.pattern) >= 0 ? st.pattern : 'straight';
      plan.set({ tile: st.sku, pattern: pat, grout: st.grout_hex || (P.laid_grout[st.sku] || {}).hex || '#DEDCD3',
        jointMm: st.joint_mm, room: { L: L, W: W }, units: st.unit }).then(function (stats) {
        if (!cap || !stats) return;
        cap.textContent = spec.kind === 'laid' || stats.full == null ? 'Your room at scale'
          : 'Your room at scale: ' + stats.full + ' whole ' + (stats.full === 1 ? 'tile' : 'tiles') + ', ' + stats.cut + ' cut';
      });
    }
    document.addEventListener('gg:calc', function (e) {
      var d = e.detail || {}, st = d.state || {};
      if (!st.sku || st.sku !== vars[cur].sku) return;
      var changed = false;
      if (st.pattern && st.pattern !== laidPattern && ['straight', 'brick', 'herringbone'].indexOf(st.pattern) >= 0) { laidPattern = st.pattern; changed = true; }
      if (st.grout_sku && (!laidGrout || laidGrout.sku !== st.grout_sku) && CAT.variations[st.grout_sku]) {
        laidGrout = { sku: st.grout_sku, hex: st.grout_hex || CAT.variations[st.grout_sku].hex, name: CAT.variations[st.grout_sku].name };
        changed = true;
      }
      if (changed) drawLaid();
      lastPlan = d;
      clearTimeout(planTimer);
      planTimer = setTimeout(drawPlan, 40);
    });
    // on phones the gallery scrolls sideways: make it reachable by keyboard only then
    var gal = document.querySelector('.gallery');
    function galleryFocus() {
      if (!gal) return;
      if (gal.scrollWidth > gal.clientWidth + 2) { gal.setAttribute('tabindex', '0'); gal.setAttribute('role', 'region'); gal.setAttribute('aria-label', 'Product images, scroll sideways'); }
      else { gal.removeAttribute('tabindex'); gal.removeAttribute('role'); gal.removeAttribute('aria-label'); }
    }
    var tmr = null;
    if (window.ResizeObserver && $('laid')) new ResizeObserver(function () { clearTimeout(tmr); tmr = setTimeout(function () { drawLaid(); drawPlan(); galleryFocus(); }, 120); }).observe($('laid'));
    window.addEventListener('resize', galleryFocus);
    galleryFocus();
    show(cur, true);
  }

  // "Add 1 bag" buttons on kit cards, the home grout button, and anything else with data-add-sku
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-add-sku]') : null;
    if (!b) return;
    var sku = b.getAttribute('data-add-sku'), v = CAT.variations[sku];
    if (!v) return;
    var q = parseInt(b.getAttribute('data-add-qty'), 10) || 1;
    addLines([{ sku: sku, qty: q }]);
    var p = PRODUCTS[v.pid];
    toast('Added ' + q + ' ' + unitWord(v.unit, q) + ': ' + esc(fullName(p.name, v.name)) + '. <a href="' + ROOT + 'basket/">View basket</a>');
  });

  /* ================= SAMPLE BOX ================= */
  function initSamples() {
    var grid = $('sampleGrid');
    if (!grid) return;
    var bar = $('sampleBarText'), addBox = $('sampleAdd'), clear = $('sampleClear');
    function render() {
      var s = samples();
      qsa('.sample-pick', grid).forEach(function (b) {
        var on = s.indexOf(b.getAttribute('data-sku')) >= 0;
        b.setAttribute('aria-pressed', String(on));
        b.disabled = !on && s.length >= 5;
      });
      if (!s.length) bar.textContent = 'Pick up to 5 tiles. Trade view: the box is free.';
      else bar.textContent = s.length + ' of 5 picked: ' + s.map(function (k) { var v = CAT.variations[k]; return PRODUCTS[v.pid].short + ' ' + v.name; }).join('; ') + '.';
      addBox.disabled = !s.length;
      clear.disabled = !s.length;
    }
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('.sample-pick');
      if (!b || b.disabled) return;
      var sku = b.getAttribute('data-sku'), s = samples(), i = s.indexOf(sku);
      if (i >= 0) s.splice(i, 1); else if (s.length < 5) s.push(sku);
      setSamples(s);
      render();
    });
    addBox.addEventListener('click', function () {
      var s = samples();
      if (!s.length) return;
      addLines([{ sku: 'GG-SMP-BOX', qty: 1, samples: s }]);
      setSamples([]);
      render();
      toast('Sample box with ' + s.length + ' cut ' + (s.length === 1 ? 'sample' : 'samples') + ' added. <a href="' + ROOT + 'basket/">View basket</a>');
    });
    clear.addEventListener('click', function () { setSamples([]); render(); });
    document.addEventListener('gg:samples', render);
    render();
  }

  /* ================= SHOP: filters and search ================= */
  var PRICE_BUCKETS = { lt30: [0, 30], '30-45': [30, 45], '45-60': [45, 60], '60up': [60, 1e9] };
  function initShop() {
    var form = $('filters'), grid = $('shopGrid');
    if (!form || !grid) return;
    var qIn = $('shopQ'), sortSel = $('shopSort');
    var GROUPS = ['group', 'look', 'finish', 'colour', 'size', 'use', 'price'];
    var cards = {};
    qsa('.card[data-pid]', grid).forEach(function (li) { cards[li.getAttribute('data-pid')] = li; });
    var url = new URLSearchParams(location.search);
    qIn.value = url.get('q') || '';
    if (url.get('sort')) sortSel.value = url.get('sort');
    GROUPS.forEach(function (g) {
      var vals = (url.get(g) || '').split(',').filter(Boolean);
      qsa('input[name="' + g + '"]', form).forEach(function (i) { i.checked = vals.indexOf(i.value) >= 0; });
    });
    function selected() {
      var f = {};
      GROUPS.forEach(function (g) { f[g] = qsa('input[name="' + g + '"]:checked', form).map(function (i) { return i.value; }); });
      return f;
    }
    function m2price(v) { return v.m2 ? (isTrade() ? v.m2.trade : v.m2.box) : null; }
    function vMatch(p, v, f, skip) {
      for (var k = 0; k < GROUPS.length; k++) {
        var g = GROUPS[k], vals = f[g];
        if (g === skip || !vals.length) continue;
        var ok = false;
        if (g === 'group') ok = vals.indexOf(p.group) >= 0;
        else if (g === 'look') ok = vals.indexOf(p.look) >= 0;
        else if (g === 'finish') ok = vals.indexOf(v.finish) >= 0;
        else if (g === 'colour') ok = vals.indexOf(v.family) >= 0;
        else if (g === 'size') ok = vals.indexOf(v.size_key) >= 0;
        else if (g === 'use') ok = vals.some(function (u) { return p.use.indexOf(u) >= 0; });
        else if (g === 'price') {
          var pr = m2price(v);
          ok = pr != null && vals.some(function (b) { var r = PRICE_BUCKETS[b]; return pr >= r[0] && pr < r[1]; });
        }
        if (!ok) return false;
      }
      return true;
    }
    function run(push) {
      var f = selected(), q = qIn.value.trim();
      var res = q && window.GGSearch ? window.GGSearch.query(q) : null;
      var hit = {};
      if (res) res.products.forEach(function (r) { hit[r.pid] = r; });
      var shown = [];
      CAT.products.forEach(function (p) {
        var li = cards[p.id];
        if (!li) return;
        var pool = res ? (hit[p.id] ? hit[p.id].skus : []) : p.skus;
        var m = pool.filter(function (s) { return vMatch(p, CAT.variations[s], f); });
        li.hidden = !m.length;
        if (!m.length) return;
        var best = res && m.indexOf(hit[p.id].sku) >= 0 ? hit[p.id].sku : m[0];
        var v = CAT.variations[best];
        var img = li.querySelector('img');
        if (img && img.getAttribute('src') !== ROOT + v.thumb) { img.src = ROOT + v.thumb; img.alt = ''; }
        li.querySelector('a').href = ROOT + p.url + (best !== p.default ? '?sku=' + encodeURIComponent(best) : '');
        var match = li.querySelector('.card-match');
        var narrowed = m.length < p.skus.length;
        match.hidden = !narrowed;
        if (narrowed) match.textContent = m.length === 1 ? 'Match: ' + v.name : m.length + ' of ' + p.skus.length + ' options match';
        var prices = m.map(function (s) { var x = CAT.variations[s]; return x.m2 ? (isTrade() ? x.m2.trade : x.m2.box) : (isTrade() ? x.price.trade : x.price.box); });
        var lo = Math.min.apply(null, prices);
        var vv = CAT.variations[m[0]];
        li.querySelector('.card-price').innerHTML = (m.length > 1 ? 'from ' : '') + eur(lo) + (vv.m2 ? ' per m²' : ' a ' + unitWord(vv.unit, 1)) + (isTrade() ? ', trade' : '');
        shown.push({ p: p, li: li, score: res ? hit[p.id].score : 0, price: lo, m2: !!vv.m2 });
      });
      var sort = sortSel.value;
      shown.sort(function (a, b) {
        if (q && sort === 'featured') return b.score - a.score || a.p.order - b.p.order;
        if (sort === 'price-asc' || sort === 'price-desc') {
          if (a.m2 !== b.m2) return a.m2 ? -1 : 1;
          return sort === 'price-asc' ? a.price - b.price : b.price - a.price;
        }
        if (sort === 'name') return a.p.name.localeCompare(b.p.name);
        return a.p.order - b.p.order;
      });
      shown.forEach(function (s) { grid.appendChild(s.li); });
      // facet counts: products that would show if this one option were picked in its group
      GROUPS.forEach(function (g) {
        qsa('input[name="' + g + '"]', form).forEach(function (inp) {
          var f2 = Object.assign({}, f);
          f2[g] = [inp.value];
          var c = 0;
          CAT.products.forEach(function (p) {
            var pool = res ? (hit[p.id] ? hit[p.id].skus : []) : p.skus;
            if (pool.some(function (s) { return vMatch(p, CAT.variations[s], f2); })) c++;
          });
          var lab = inp.closest('.f-opt');
          var nEl = lab.querySelector('.n');
          if (nEl) nEl.textContent = String(c);
          lab.classList.toggle('dim', !c && !inp.checked);
        });
      });
      // active filters
      var act = $('activeFilters'), html = '';
      GROUPS.forEach(function (g) {
        f[g].forEach(function (val) {
          var inp = form.querySelector('input[name="' + g + '"][value="' + val + '"]');
          var label = inp ? inp.getAttribute('data-label') : val;
          html += '<button type="button" data-clear="' + g + ':' + esc(val) + '" aria-label="Remove filter ' + esc(label) + '">' + esc(label) + '<span aria-hidden="true">×</span></button>';
        });
      });
      var nAct = GROUPS.reduce(function (a, g) { return a + f[g].length; }, 0);
      if (nAct > 1) html += '<button type="button" data-clear="all">Clear all filters</button>';
      act.innerHTML = html;
      act.hidden = !nAct;
      var ft = $('filtersToggle');
      if (ft) ft.textContent = 'Filters' + (nAct ? ' (' + nAct + ')' : '');
      var count = shown.length;
      $('shopCount').textContent = count + (count === 1 ? ' product' : ' products') + (q ? ' for “' + q + '”' : '') + (nAct ? ' with ' + nAct + (nAct === 1 ? ' filter' : ' filters') : '') + '.';
      var hint = $('searchHint');
      if (res && res.ignored.length && count) { hint.hidden = false; hint.textContent = 'Not used in the search: ' + res.ignored.join(', ') + '.'; }
      else hint.hidden = true;
      $('shopEmpty').hidden = !!count;
      if (push !== false) {
        var u = new URLSearchParams();
        if (q) u.set('q', q);
        GROUPS.forEach(function (g) { if (f[g].length) u.set(g, f[g].join(',')); });
        if (sortSel.value !== 'featured') u.set('sort', sortSel.value);
        var s = u.toString();
        history.replaceState(null, '', location.pathname + (s ? '?' + s : ''));
      }
    }
    form.addEventListener('change', function () { run(); });
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    var t = null;
    qIn.addEventListener('input', function () { clearTimeout(t); t = setTimeout(run, 80); });
    var sf = $('shopSearch');
    if (sf) sf.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    sortSel.addEventListener('change', function () { run(); });
    $('activeFilters').addEventListener('click', function (e) {
      var b = e.target.closest('[data-clear]');
      if (!b) return;
      var k = b.getAttribute('data-clear');
      if (k === 'all') qsa('input[type="checkbox"]', form).forEach(function (i) { i.checked = false; });
      else {
        var parts = k.split(':'), inp = form.querySelector('input[name="' + parts[0] + '"][value="' + parts.slice(1).join(':') + '"]');
        if (inp) inp.checked = false;
      }
      run();
    });
    var clearAll = $('shopClear');
    if (clearAll) clearAll.addEventListener('click', function () { qsa('input[type="checkbox"]', form).forEach(function (i) { i.checked = false; }); qIn.value = ''; run(); qIn.focus(); });
    var ft = $('filtersToggle');
    if (ft) ft.addEventListener('click', function () { var o = !form.classList.contains('open'); form.classList.toggle('open', o); ft.setAttribute('aria-expanded', String(o)); });
    document.addEventListener('gg:view', function () { run(false); });
    run(false);
  }

  /* ================= BASKET ================= */
  function basketTotals(lines) {
    var trade = isTrade(), total = 0, units = 0;
    lines.forEach(function (l) { var v = CAT.variations[l.sku]; if (!v) return; total += Math.round(priceLine(v, l.qty, trade).total * 100); units += l.qty; });
    return { total: total / 100, units: units };
  }
  function initBasket() {
    var list = $('basketLines');
    if (!list) return;
    function render() {
      var lines = readBasket().lines, trade = isTrade(), html = '';
      lines.forEach(function (l, i) {
        var v = CAT.variations[l.sku];
        if (!v) {
          html += '<li class="line"><span></span><span><span class="l-name">Unknown item ' + esc(l.sku) + '</span><span class="l-tools"><button type="button" class="linklike" data-remove="' + i + '">Remove</button></span></span><span></span></li>';
          return;
        }
        var p = PRODUCTS[v.pid], pl = priceLine(v, l.qty, trade);
        var meta = esc(v.label) + ' · ' + esc(l.sku);
        if (v.m2_per_box) meta += ' · ' + n(v.m2_per_box * l.qty, 2) + ' m²';
        var note = '';
        if (l.samples) note = '<span class="l-note">Samples: ' + l.samples.map(function (k) { var x = CAT.variations[k]; return x ? esc(PRODUCTS[x.pid].short + ' ' + x.name) : esc(k); }).join('; ') + '</span>';
        if (l.note) note += '<span class="l-note">' + esc(l.note) + '</span>';
        var short = l.samples ? '' : stockNote(v.stock, l.qty, v.unit);
        if (short) note += '<span class="l-note l-warn">' + esc(short) + '</span>';
        var id = 'q' + i;
        html += '<li class="line"><img src="' + ROOT + v.thumb + '" alt="" width="84" height="84" loading="lazy">' +
          '<span><a class="l-name" href="' + ROOT + p.url + '?sku=' + encodeURIComponent(l.sku) + '">' + esc(p.name) + '</a>' +
          '<span class="l-meta">' + meta + '</span>' + note +
          '<span class="l-tools"><span class="qty"><button type="button" data-step="-1" data-i="' + i + '" aria-label="One less">−</button>' +
          '<label class="sr" for="' + id + '">Quantity, ' + esc(unitWord(v.unit, 2)) + '</label><input id="' + id + '" type="number" inputmode="numeric" min="1" max="9999" value="' + l.qty + '" data-i="' + i + '">' +
          '<button type="button" data-step="1" data-i="' + i + '" aria-label="One more">+</button></span>' +
          '<span class="qty-unit">' + esc(unitWord(v.unit, l.qty)) + '</span>' +
          '<button type="button" class="linklike" data-remove="' + i + '">Remove</button></span></span>' +
          '<span class="l-price">' + eur(pl.total) + '<small>' + esc(partsText(v, pl)) + '</small></span></li>';
      });
      list.innerHTML = html;
      var empty = !lines.length;
      $('basketEmpty').hidden = !empty;
      $('basketFull').hidden = empty;
      var t = basketTotals(lines);
      $('sumLines').textContent = String(lines.length);
      $('sumTotal').textContent = eur(t.total);
      $('sumVat').textContent = trade ? 'Trade prices' : 'Home prices';
    }
    list.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var i = parseInt(b.getAttribute('data-i') || b.getAttribute('data-remove'), 10);
      if (b.hasAttribute('data-remove')) { window.GGBasket.remove(i); return; }
      var l = readBasket().lines[i];
      if (l) window.GGBasket.setQty(i, l.qty + parseInt(b.getAttribute('data-step'), 10));
      var inp = $('q' + i);
      if (inp) inp.focus();
    });
    list.addEventListener('change', function (e) {
      var inp = e.target;
      if (inp.tagName !== 'INPUT') return;
      window.GGBasket.setQty(parseInt(inp.getAttribute('data-i'), 10), parseInt(inp.value, 10) || 1);
    });
    var clear = $('basketClear');
    if (clear) clear.addEventListener('click', function () { window.GGBasket.clear(); });
    document.addEventListener('gg:basket', render);
    document.addEventListener('gg:view', render);
    render();
  }

  /* ================= DEMO CHECKOUT: the end of the line ================= */
  function initCheckout() {
    var box = $('checkoutSummary');
    if (!box) return;
    function render() {
      var lines = readBasket().lines, t = basketTotals(lines);
      box.textContent = lines.length
        ? 'Your demo basket has ' + lines.length + (lines.length === 1 ? ' line' : ' lines') + ', ' + eur(t.total) + (isTrade() ? ' at trade prices.' : ' at home prices.') + ' It stays in this browser only.'
        : 'Your demo basket is empty.';
      $('checkoutClear').hidden = !lines.length;
    }
    $('checkoutClear').addEventListener('click', function () { window.GGBasket.clear(); });
    document.addEventListener('gg:basket', render);
    document.addEventListener('gg:view', render);
    render();
  }

  function init() {
    setView(getView(), false);
    initHeader();
    var b = document.body.classList;
    if (b.contains('page-home')) initHome();
    if (b.contains('page-product')) initProduct();
    if (b.contains('page-samples')) initSamples();
    if (b.contains('page-shop')) initShop();
    if (b.contains('page-basket')) initBasket();
    if (b.contains('page-checkout')) initCheckout();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
