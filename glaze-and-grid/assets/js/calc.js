/* Glaze & Grid: area calculator. Fictional demo store: sample rules, prices and stock.
 *
 * The JavaScript twin of tools/calc_ref.py: same inputs, same answers on data/calculator-spec.json.
 * The maths is exact. Every decimal becomes a BigInt fraction, so float noise can never add a box
 * or move a cent (in plain floats, 14.4 m2 straight on 1.44 m2 boxes gives 12 boxes instead of 11).
 * Rounding follows data/kit-rules.json: round to 6 decimals before every ceil; money half up to the cent.
 *
 * Plain script:  <script src="js/calc.js"></script>  ->  window.GGCalc
 * Node:          const GGCalc = require('./calc.js')
 *
 *   GGCalc.computeQuote(blob, {length: 4, width: 3, unit: 'm'});   // blob: variation + product, kit_items, rules
 *   GGCalc.setData(productsJson, kitRulesJson);                     // or load data/products.json + kit-rules.json
 *   GGCalc.computeQuote('GG-SLT-6060-MT', {area_m2: 12, pattern: 'brick', buyer: 'trade'});
 *   const calc = GGCalc.renderCalculator(el, blobOrVariation, {plan: true, onChange: fn});
 *
 * In the store it mounts itself on <div id="gg-calc" data-sku data-variation='{blob}' [data-plan]> and
 * follows these events: gg:variation (on the mount: {sku, variation}), gg:view (on document: 'home' | 'trade').
 * It fires gg:calc (bubbles, {quote, state, planCanvas}) after every quote, and gg:basket-add
 * ({lines: [{sku, qty, note}]}) from its Add button when window.GGBasket exists.
 *
 * No dependencies, no network requests. Needs BigInt (Chrome 67+, Safari 14+, Firefox 68+).
 */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module && module.exports) module.exports = api;
  else if (root) root.GGCalc = api;
}(typeof globalThis !== 'undefined' ? globalThis : (typeof self !== 'undefined' ? self : this), function () {
  'use strict';

  var VERSION = '1.0.0';
  var HAS_BIGINT = typeof BigInt === 'function';
  var TIER_10_MIN = 10;        // the "10+ boxes" tier (kit-rules pricing.home)
  var MAX_AREA_M2 = 1000000;   // sanity caps; the Python reference has none
  var MAX_EDGE_M = 10000;

  /* ------------------------------------------------------------------ exact fractions */
  var big = HAS_BIGINT ? BigInt : null;
  var B0 = HAS_BIGINT ? big(0) : 0;
  var B1 = HAS_BIGINT ? big(1) : 1;
  var B2 = HAS_BIGINT ? big(2) : 2;
  var B10 = HAS_BIGINT ? big(10) : 10;
  var P10 = [];

  function pow10(k) {
    if (P10[k] === undefined) {
      var r = B1;
      for (var i = 0; i < k; i++) r *= B10;
      P10[k] = r;
    }
    return P10[k];
  }
  function gcd(a, b) {
    if (a < B0) a = -a;
    while (b !== B0) { var t = a % b; a = b; b = t; }
    return a;
  }
  function fr(n, d) {            // n / d with BigInt parts, d > 0, reduced
    if (d < B0) { n = -n; d = -d; }
    var g = gcd(n, d);
    if (g > B1) { n /= g; d /= g; }
    return { n: n, d: d };
  }
  function I(k) { return fr(big(k), B1); }   // JS integer -> fraction
  function add(a, b) { return fr(a.n * b.d + b.n * a.d, a.d * b.d); }
  function mul(a, b) { return fr(a.n * b.n, a.d * b.d); }
  function div(a, b) { return fr(a.n * b.d, a.d * b.n); }
  function cmp(a, b) { var x = a.n * b.d, y = b.n * a.d; return x < y ? -1 : (x > y ? 1 : 0); }
  function sign(a) { return a.n < B0 ? -1 : (a.n > B0 ? 1 : 0); }

  var ZERO, ONE, TWO, HUNDRED, THOUSAND, TEN;
  if (HAS_BIGINT) { ZERO = I(0); ONE = I(1); TWO = I(2); TEN = I(10); HUNDRED = I(100); THOUSAND = I(1000); }

  // Round half up (ties away from zero) to dp decimals; returns a BigInt count of 10^-dp units.
  function roundUnits(a, dp) {
    var neg = a.n < B0, n = neg ? -a.n : a.n;
    var m = (n * pow10(dp) * B2 + a.d) / (B2 * a.d);
    return neg ? -m : m;
  }
  // Rounded value as a JS number (the nearest double, like float(Decimal) in Python).
  function toNum(a, dp) { return Number(roundUnits(a, dp).toString() + 'e-' + dp); }
  // Whole units after rounding to 6 decimals: the kit-rules "ceil(round(x, 6))".
  function ceil6(a) {
    var m = roundUnits(a, 6), u = pow10(6), q = m / u;
    if (m > B0 && q * u !== m) q += B1;
    return Number(q);
  }
  function pct(a) { return add(ONE, div(a, HUNDRED)); }   // 10 -> 1.10

  // Decimal number or string -> exact fraction (the same value as Decimal(str(x)) in Python). null if invalid.
  var DEC_RE = /^([+-]?)(\d*)(?:\.(\d*))?(?:e([+-]?\d{1,3}))?$/i;
  function dec(x) {
    if (!HAS_BIGINT) return null;
    if (typeof x === 'number') { if (!isFinite(x)) return null; x = String(x); }
    else if (typeof x === 'string') x = x.trim();
    else return null;
    var m = DEC_RE.exec(x);
    if (!m) return null;
    var ip = m[2] || '', fp = m[3] || '';
    if (!ip && !fp) return null;
    if (ip.length + fp.length > 40) return null;
    var n = big((ip + fp) || '0');
    if (m[1] === '-') n = -n;
    var scale = fp.length - (m[4] ? parseInt(m[4], 10) : 0);
    return scale >= 0 ? fr(n, pow10(scale)) : fr(n * pow10(-scale), B1);
  }

  /* ------------------------------------------------------------------ data */
  var DEFAULT_DATA = null;
  var BLOB_DATA = typeof WeakMap === 'function' ? new WeakMap() : null;
  var KIT_MATERIAL = { ADH: 'adhesive', GRT: 'grout', TRM: 'metal trim', CLP: 'plastic clips' };

  function codeOf(sku) { var m = /^GG-([A-Z]+)-/.exec(String(sku || '')); return m ? m[1] : ''; }
  function copy(o) { var out = {}; for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) out[k] = o[k]; return out; }

  // Accept the store's short field names too (per_pallet, unit, stock).
  function normVar(v) {
    if (!v || typeof v !== 'object') return v;
    var o = null;
    function set(k, val) { if (!o) o = copy(v); o[k] = val; }
    if (v.boxes_per_pallet === undefined && v.per_pallet !== undefined) set('boxes_per_pallet', v.per_pallet);
    if (v.sale_unit === undefined && typeof v.unit === 'string') set('sale_unit', v.unit);
    if (v.stock_total === undefined && typeof v.stock === 'number') set('stock_total', v.stock);
    if (v.sell_by === undefined && v.m2_per_box) set('sell_by', 'm2');
    return o || v;
  }

  // products: the whole products.json, or an array of products (a page may embed only its product
  // plus the four fixing products: adhesive, grout, edge trim, levelling clips). rules: kit-rules.json.
  function prepare(products, rules) {
    var list = Array.isArray(products) ? products : ((products && products.products) || []);
    var index = {};
    for (var i = 0; i < list.length; i++) {
      var vs = list[i].variations || [];
      for (var j = 0; j < vs.length; j++) {
        var v = normVar(vs[j]);
        if (v && v.sku) index[v.sku] = { p: list[i], v: v };
      }
    }
    return { index: index, rules: rules, products: list };
  }
  function setData(products, rules) {
    DEFAULT_DATA = (products && products.index && products.rules && rules === undefined) ? products : prepare(products, rules);
    return DEFAULT_DATA;
  }
  function getData() { return DEFAULT_DATA; }

  // A self-contained variation (the store's #gg-calc data-variation): the variation as in products.json plus
  // product (name, handmade, material, kit), kit_items (the fixing variations by SKU, or a list) and rules.
  function dataFromBlob(blob) {
    if (!blob || typeof blob !== 'object' || !blob.rules || !blob.sku) return null;
    if (BLOB_DATA && BLOB_DATA.has(blob)) return BLOB_DATA.get(blob);
    var prod = (blob.product && typeof blob.product === 'object') ? copy(blob.product) : {};
    if (prod.handmade === undefined) prod.handmade = !!blob.handmade;
    if (prod.material === undefined) prod.material = blob.material;
    if (prod.kit === undefined || prod.kit === null) prod.kit = blob.kit;
    var v = copy(blob);
    delete v.product; delete v.kit_items; delete v.rules; delete v.kit;
    prod.variations = [v];
    var list = [prod], byCode = {}, items = blob.kit_items || [];
    if (!Array.isArray(items)) {
      items = Object.keys(items).map(function (k) {
        var x = items[k];
        return (x && typeof x === 'object' && !x.sku && !x.variations) ? (function () { var c = copy(x); c.sku = k; return c; })() : x;
      });
    }
    items.forEach(function (x) {
      if (!x || typeof x !== 'object') return;
      if (Array.isArray(x.variations)) { list.push(x); return; }   // a whole product
      var code = codeOf(x.sku);
      if (!byCode[code]) {
        byCode[code] = { id: 'kit-' + code.toLowerCase(), code: code, material: KIT_MATERIAL[code] || 'fixing', type: 'fixing', variations: [] };
        list.push(byCode[code]);
      }
      byCode[code].variations.push(x);
    });
    var data = prepare(list, blob.rules);
    if (BLOB_DATA) BLOB_DATA.set(blob, data);
    return data;
  }
  function dataFor(variation, data) {
    return data || dataFromBlob(variation) || DEFAULT_DATA;
  }
  // "Bright white" whether the item is named "Bright white" (products.json) or "Tile grout 5 kg, Bright white".
  function colourName(v) {
    return (v.attributes && v.attributes.colour) || (v.colour && v.colour.name) || v.name || v.sku;
  }
  function isGrout(hit) { return !!hit && ((hit.p && hit.p.material === 'grout') || codeOf(hit.v.sku) === 'GRT'); }

  /* ------------------------------------------------------------------ rules */
  function longestSide(v) {
    var s = v.size || {};
    if (s.shape === 'rect') return dec(Math.max(s.w_mm, s.l_mm));
    if (s.shape === 'hex') {          // point to point = across flats x 2 / sqrt(3), to 0.1 mm
      return fr(big(Math.round(s.across_flats_mm * 20 / Math.sqrt(3))), B10);
    }
    if (s.shape === 'set') {
      var mx = 0;
      for (var i = 0; i < s.composition.length; i++) mx = Math.max(mx, s.composition[i].w_mm, s.composition[i].l_mm);
      return dec(mx);
    }
    return null;
  }

  // (L + W) / (L x W) in 1/mm: metres of joint per m2 = factor x 1000.
  function jointFactor(v) {
    var s = v.size || {};
    if (s.shape === 'rect') {
      var w = dec(s.w_mm), l = dec(s.l_mm);
      return div(add(w, l), mul(w, l));
    }
    if (s.shape === 'hex') return div(TWO, dec(s.across_flats_mm));
    if (s.shape === 'set') {
      var num = ZERO, den = ZERO;
      for (var i = 0; i < s.composition.length; i++) {
        var c = s.composition[i], n = dec(c.pieces), cw = dec(c.w_mm), cl = dec(c.l_mm);
        num = add(num, mul(n, add(cw, cl)));
        den = add(den, mul(n, mul(cw, cl)));
      }
      return div(num, den);
    }
    return null;
  }

  function wastePct(p, v, pattern, R) {
    var w = R.waste_pct, base = dec(w.by_pattern[pattern]);
    if (!base) throw new QErr('pattern_not_allowed', { field: 'pattern', pattern: pattern, allowed: v.patterns.slice() });
    if (p.handmade) base = add(base, dec(w.extras.handmade));
    var longest = longestSide(v);
    if (longest && cmp(longest, dec(w.large_format_min_side_mm)) >= 0) base = add(base, dec(w.extras.large_format));
    return base;
  }

  function adhesiveRule(p, v, R) {
    var thk = dec(v.thickness_mm), longest = longestSide(v), rules = R.adhesive.rules;
    for (var i = 0; i < rules.length; i++) {
      var r = rules[i], c = r['if'] || {};
      if (c.min_thickness_mm !== undefined && cmp(thk, dec(c.min_thickness_mm)) < 0) continue;
      if (c.handmade !== undefined && !!p.handmade !== c.handmade) continue;
      if (c.longest_side_mm_over !== undefined && !(cmp(longest, dec(c.longest_side_mm_over)) > 0)) continue;
      return r;
    }
    throw new QErr('rules_missing', { what: 'adhesive' });
  }

  function adhesiveColour(p, v, R) {
    var cr = R.adhesive.colour_rule, fam = v.colour ? v.colour.family : null;
    return (cr.white_if_colour_family.indexOf(fam) >= 0 || cr.white_if_material.indexOf(p.material) >= 0) ? 'white' : 'grey';
  }

  function clipsApply(p, v, R) {
    var c = R.clips;
    return cmp(longestSide(v), dec(c.min_longest_side_mm)) >= 0 &&
      cmp(dec(v.thickness_mm), dec(c.max_thickness_mm)) <= 0 &&
      !(c.exclude_handmade && p.handmade);
  }

  function trimHeight(thickness, R) {
    var t = dec(thickness), best = null, hs = R.trims.heights_mm;
    for (var i = 0; i < hs.length; i++) {
      if (cmp(dec(hs[i]), t) >= 0 && (best === null || hs[i] < best)) best = hs[i];
    }
    return best;
  }

  function fill(pattern, vars) {   // "GG-TRM-{height:02d}-{finish}" -> "GG-TRM-10-BK"
    return String(pattern).replace(/\{(\w+)(?::0(\d)d)?\}/g, function (all, k, width) {
      var s = String(vars[k]);
      if (width) while (s.length < Number(width)) s = '0' + s;
      return s;
    });
  }

  /* ------------------------------------------------------------------ prices and stock */
  function unitPrice(v, buyer) { return dec(v.price[buyer === 'trade' ? 'trade' : 'box']); }

  // Home: full pallets at the pallet price, the rest at the 10+ price when the order has 10 or more, else the box price.
  // Trade: the trade price on every unit.
  function priceLine(v, qty, buyer) {
    var pr = v.price, parts = [];
    if (buyer === 'trade') parts.push({ tier: 'trade', qty: qty, unit: dec(pr.trade) });
    else {
      var bpp = v.boxes_per_pallet || 0;
      var onPallet = bpp ? Math.floor(qty / bpp) * bpp : 0;
      var loose = qty - onPallet;
      var tier = (qty >= TIER_10_MIN && pr.box_10 !== null && pr.box_10 !== undefined) ? 'box_10' : 'box';
      if (onPallet) parts.push({ tier: 'pallet', qty: onPallet, unit: dec(pr.pallet) });
      if (loose) parts.push({ tier: tier, qty: loose, unit: dec(pr[tier]) });
    }
    var total = ZERO;
    for (var i = 0; i < parts.length; i++) total = add(total, mul(parts[i].unit, I(parts[i].qty)));
    return { sku: v.sku, qty: qty, total: total, parts: parts };
  }

  function lineOut(line, extra) {
    var out = { sku: line.sku, qty: line.qty, total: toNum(line.total, 2), parts: [] };
    for (var i = 0; i < line.parts.length; i++) {
      out.parts.push({ tier: line.parts[i].tier, qty: line.parts[i].qty, unit: toNum(line.parts[i].unit, 2) });
    }
    out.tier = line.parts.length ? line.parts[line.parts.length - 1].tier : null;
    if (extra) for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) out[k] = extra[k];
    return out;
  }

  // One room should come from one shade lot: pick the smallest lot that covers the order.
  function lotCheck(v, boxes) {
    var lots = v.lots || [], total = 0, best = null, biggest = null;
    for (var i = 0; i < lots.length; i++) {
      var x = lots[i];
      total += x.stock;
      if (x.stock >= boxes && (best === null || x.stock < best.stock)) best = x;
      if (biggest === null || x.stock > biggest.stock) biggest = x;
    }
    if (best) return { status: 'ok', lot: best.lot, lot_stock: best.stock, total_stock: total, lot_count: lots.length };
    return {
      status: total >= boxes ? 'short_lot' : 'short_stock', lot: null,
      largest_lot: biggest ? biggest.lot : null, largest_stock: biggest ? biggest.stock : 0,
      total_stock: total, lot_count: lots.length
    };
  }

  // Full packs of the big size first; for the rest, small packs unless one more big pack costs less.
  function clipPacks(need, buyer, data, C) {
    var skus = Object.keys(C.packs).sort(function (a, b) { return C.packs[b] - C.packs[a]; });
    var bigSku = skus[0], smallSku = skus[skus.length - 1];
    var bigN = C.packs[bigSku], smallN = C.packs[smallSku];
    var bigHit = data.index[bigSku], smallHit = data.index[smallSku];
    if (!bigHit || !smallHit) throw new QErr('kit_item_missing', { sku: !bigHit ? bigSku : smallSku });
    var nBig = Math.floor(need / bigN), rest = need - nBig * bigN, nSmall = 0;
    if (rest) {
      var k = Math.ceil(rest / smallN);
      if (cmp(unitPrice(bigHit.v, buyer), mul(unitPrice(smallHit.v, buyer), I(k))) < 0) nBig += 1;
      else nSmall = k;
    }
    var packs = {};
    packs[bigSku] = nBig;
    packs[smallSku] = nSmall;
    return packs;
  }

  /* ------------------------------------------------------------------ errors */
  function QErr(code, ctx) { this.code = code; this.ctx = ctx || {}; }

  var FIELD_NAMES = {
    length: 'room length', width: 'room width', area: 'area', edge: 'edge length', joint_mm: 'joint width',
    waste_pct: 'waste', unit: 'units', buyer: 'buyer', pattern: 'pattern'
  };
  var PATTERN_NAMES = { straight: 'straight', brick: 'brick', herringbone: 'herringbone', modular: 'set pattern' };

  function capital(s) { s = String(s); return s.charAt(0).toUpperCase() + s.slice(1); }
  function orList(items) {
    if (items.length < 2) return items.join('');
    return items.slice(0, -1).join(', ') + ' or ' + items[items.length - 1];
  }

  // Plain-English text for an error code (ctx: the extra fields of the error result).
  function messageFor(code, ctx) {
    ctx = ctx || {};
    var f = FIELD_NAMES[ctx.field] || 'value';
    switch (code) {
      case 'no_data': return 'The calculator data did not load. Please reload the page.';
      case 'unsupported_browser': return 'This browser is too old for the calculator. Please update it.';
      case 'unknown_sku': return 'We could not find this tile' + (ctx.sku ? ' (' + ctx.sku + ')' : '') + '.';
      case 'not_sold_by_area': return 'This item is sold by the ' + (ctx.sale_unit || 'unit') + ', not by area.';
      case 'area_missing': return 'Enter the room length and width, or the area.';
      case 'value_missing': return 'Enter the ' + f + '.';
      case 'not_a_number': return 'The ' + f + ' must be a number, like 4.2.';
      case 'area_must_be_positive': return 'The ' + f + ' must be more than 0.';
      case 'area_too_large': return 'The area is over 1,000,000 m\u00b2. Please check it.';
      case 'unit_unknown': return 'Units must be m or ft.';
      case 'pattern_not_allowed':
        return capital(PATTERN_NAMES[ctx.pattern] || String(ctx.pattern)) + ' is not offered for this tile. Choose ' +
          orList((ctx.allowed || []).map(function (x) { return PATTERN_NAMES[x] || x; })) + '.';
      case 'joint_out_of_range': return 'Joints must be 1 to 10 mm wide.';
      case 'waste_out_of_range': return 'Waste must be 0 to 100%.';
      case 'edge_must_not_be_negative': return 'The edge length cannot be below 0.';
      case 'edge_too_large': return 'The edge length is over 10,000 m. Please check it.';
      case 'buyer_unknown': return 'Buyer must be home or trade.';
      case 'unknown_grout': return 'Pick one of our grout colours.';
      case 'unknown_trim_finish': return 'Pick a trim finish: steel, black or brass.';
      case 'kit_item_missing': return 'A kit item is missing from the store data' + (ctx.sku ? ' (' + ctx.sku + ')' : '') + '.';
      case 'rules_missing': return 'The kit rules are incomplete.';
      default: return 'Please check your numbers.';
    }
  }

  function fail(code, ctx) {
    ctx = ctx || {};
    var out = { ok: false, error: code, message: messageFor(code, ctx), field: ctx.field || null };
    for (var k in ctx) if (Object.prototype.hasOwnProperty.call(ctx, k) && out[k] === undefined) out[k] = ctx[k];
    return out;
  }

  function has(o, k) { return o[k] !== undefined && o[k] !== null; }
  function numIn(input, key, field) {
    var x = input[key];
    if (typeof x === 'string' && x.trim() === '') throw new QErr('value_missing', { field: field });
    var f = dec(x);
    if (!f) throw new QErr('not_a_number', { field: field });
    return f;
  }

  /* ------------------------------------------------------------------ the quote */
  /* computeQuote(variation, input, data?)
   *   variation: one of
   *     - a self-contained variation: products.json variation + {product, kit_items, rules} (the store's mount);
   *     - a products.json variation or a SKU string (null: use input.sku), with data from setData() or argument 3.
   *   input: { area_m2 | area_ft2 | length + width + unit ('m' | 'ft'), pattern, joint_mm, buyer ('home' | 'trade'),
   *            edge_m | edge_ft, trim_finish ('ST' | 'BK' | 'BR'), grout_sku, waste_pct (override),
   *            kit: {adhesive, grout, trim, clips} (false leaves an item out) }
   *   Numbers may be JS numbers or decimal strings ("4.2"). Same fields and answers as tools/calc_ref.py.
   * Returns { ok: true, boxes, tiles, lot, kit, lines, total, ... } or { ok: false, error, message, field }. */
  function computeQuote(variation, input, data) {
    try {
      return quote(variation, input || {}, dataFor(variation, data));
    } catch (e) {
      if (e instanceof QErr) return fail(e.code, e.ctx);
      throw e;
    }
  }

  function quote(variation, input, data) {
    if (!HAS_BIGINT) throw new QErr('unsupported_browser');
    if (!data || !data.index || !data.rules) throw new QErr('no_data');
    var R = data.rules, U = R.units;
    var sku = typeof variation === 'string' ? variation : ((variation && variation.sku) || input.sku);
    var hit = sku ? data.index[sku] : null;
    if (!hit) throw new QErr('unknown_sku', { sku: sku || null });
    var p = hit.p, v = hit.v;
    if (v.sell_by !== 'm2') throw new QErr('not_sold_by_area', { sku: sku, sale_unit: v.sale_unit || null });
    if (!p.kit || !v.price || !v.size || !v.patterns || !v.patterns.length || !(Number(v.m2_per_box) > 0)) {
      throw new QErr('rules_missing', { what: 'product kit, price, size, patterns or m2 per box' });
    }
    var M2FT2 = dec(U.m2_per_ft2), MFT = dec(U.m_per_ft);

    // Room size. Same order as the reference: area_m2, then area_ft2, then length x width.
    var area;
    if (has(input, 'area_m2')) area = numIn(input, 'area_m2', 'area');
    else if (has(input, 'area_ft2')) area = mul(numIn(input, 'area_ft2', 'area'), M2FT2);
    else if (has(input, 'length') || has(input, 'width')) {
      var unit = (has(input, 'unit') && input.unit !== '') ? input.unit : 'm';
      if (unit !== 'm' && unit !== 'ft') throw new QErr('unit_unknown', { field: 'unit' });
      if (!has(input, 'length')) throw new QErr('value_missing', { field: 'length' });
      if (!has(input, 'width')) throw new QErr('value_missing', { field: 'width' });
      var L = numIn(input, 'length', 'length'), W = numIn(input, 'width', 'width');
      if (sign(L) <= 0) throw new QErr('area_must_be_positive', { field: 'length' });
      if (sign(W) <= 0) throw new QErr('area_must_be_positive', { field: 'width' });
      area = mul(L, W);
      if (unit === 'ft') area = mul(area, M2FT2);
    } else throw new QErr('area_missing', { field: 'area' });
    if (sign(area) <= 0) throw new QErr('area_must_be_positive', { field: 'area' });

    var pattern = (has(input, 'pattern') && input.pattern !== '') ? String(input.pattern) : v.patterns[0];
    if (v.patterns.indexOf(pattern) < 0) {
      throw new QErr('pattern_not_allowed', { field: 'pattern', pattern: pattern, allowed: v.patterns.slice() });
    }
    var joint = has(input, 'joint_mm') ? numIn(input, 'joint_mm', 'joint_mm') : dec(p.kit.joint_mm_default);
    if (cmp(joint, ONE) < 0 || cmp(joint, TEN) > 0) throw new QErr('joint_out_of_range', { field: 'joint_mm' });

    // Checks the reference does not make (it never gets these inputs from the store).
    var buyer = has(input, 'buyer') ? input.buyer : 'home';
    if (buyer !== 'home' && buyer !== 'trade') throw new QErr('buyer_unknown', { field: 'buyer' });
    if (cmp(area, I(MAX_AREA_M2)) > 0) throw new QErr('area_too_large', { field: 'area' });
    var waste = has(input, 'waste_pct') ? numIn(input, 'waste_pct', 'waste_pct') : wastePct(p, v, pattern, R);
    if (sign(waste) < 0 || cmp(waste, HUNDRED) > 0) throw new QErr('waste_out_of_range', { field: 'waste_pct' });
    var edge = ZERO;
    if (has(input, 'edge_m')) edge = numIn(input, 'edge_m', 'edge');
    else if (has(input, 'edge_ft')) edge = mul(numIn(input, 'edge_ft', 'edge'), MFT);
    if (sign(edge) < 0) throw new QErr('edge_must_not_be_negative', { field: 'edge' });
    if (cmp(edge, I(MAX_EDGE_M)) > 0) throw new QErr('edge_too_large', { field: 'edge' });
    var kitOn = { adhesive: true, grout: true, trim: true, clips: true };
    if (input.kit && typeof input.kit === 'object') {
      for (var k in kitOn) if (input.kit[k] !== undefined) kitOn[k] = !!input.kit[k];
    }

    // Tiles: whole boxes (at least one).
    var withWaste = mul(area, pct(waste));
    var m2box = dec(v.m2_per_box);
    var boxes = Math.max(1, ceil6(div(withWaste, m2box)));
    var m2Ordered = mul(m2box, I(boxes));
    var tl = priceLine(v, boxes, buyer);
    var perM2 = div(tl.total, m2Ordered);
    var bpp = v.boxes_per_pallet || 0;
    var total = tl.total;
    var out = {
      ok: true, sku: v.sku, pattern: pattern, joint_mm: toNum(joint, 1), buyer: buyer,
      area_m2: toNum(area, 4), area_ft2: toNum(div(area, M2FT2), 2),
      waste_pct: toNum(waste, 1), area_with_waste_m2: toNum(withWaste, 4),
      area_with_waste_ft2: toNum(div(withWaste, M2FT2), 2),
      boxes: boxes, m2_ordered: toNum(m2Ordered, 3), m2_ordered_ft2: toNum(div(m2Ordered, M2FT2), 2),
      pieces: boxes * v.pieces_per_box, weight_kg: toNum(mul(dec(v.kg_per_box), I(boxes)), 1),
      full_pallets: bpp ? Math.floor(boxes / bpp) : 0,
      tiles: lineOut(tl, {
        price_per_m2: toNum(perM2, 2), price_per_ft2: toNum(mul(perM2, M2FT2), 2),
        price_per_box: toNum(div(tl.total, I(boxes)), 2)
      }),
      lot: lotCheck(v, boxes),
      kit: {},
      lines: [cartLine('tiles', v, boxes, tl.total)]
    };
    var kit = out.kit;

    if (kitOn.adhesive) {
      var A = R.adhesive, rule = adhesiveRule(p, v, R);
      var kg = mul(mul(area, dec(rule.kg_per_m2)), pct(dec(A.overage_pct)));
      var bags = ceil6(div(kg, dec(A.bag_kg)));
      var aSku = A.skus[adhesiveColour(p, v, R)], aHit = data.index[aSku];
      if (!aHit) throw new QErr('kit_item_missing', { sku: aSku });
      var al = priceLine(aHit.v, bags, buyer);
      total = add(total, al.total);
      kit.adhesive = {
        sku: aSku, rule: rule.id, kg_per_m2: Number(rule.kg_per_m2), notch_mm: rule.notch_mm,
        kg: toNum(kg, 2), bags: bags, total: toNum(al.total, 2), parts: lineOut(al).parts
      };
      if (bags) out.lines.push(cartLine('adhesive', aHit.v, bags, al.total));
    }

    if (kitOn.grout) {
      var G = R.grout;
      var rate = mul(mul(mul(jointFactor(v), dec(v.thickness_mm)), joint), dec(G.density_kg_per_dm3));
      var gkg = mul(mul(area, rate), pct(dec(G.overage_pct)));
      var gbags = ceil6(div(gkg, dec(G.bag_kg)));
      var gSku = (has(input, 'grout_sku') && input.grout_sku !== '') ? String(input.grout_sku) : p.kit.grout_suggest[0];
      var gHit = data.index[gSku];
      if (!isGrout(gHit)) throw new QErr('unknown_grout', { field: 'grout_sku', sku: gSku });
      var gl = priceLine(gHit.v, gbags, buyer);
      total = add(total, gl.total);
      kit.grout = {
        sku: gSku, kg_per_m2: toNum(rate, 3), kg: toNum(gkg, 2), bags: gbags,
        total: toNum(gl.total, 2), parts: lineOut(gl).parts
      };
      if (gbags) out.lines.push(cartLine('grout', gHit.v, gbags, gl.total));
    }

    if (kitOn.trim && sign(edge) > 0) {
      var Tr = R.trims, h = trimHeight(v.thickness_mm, R);
      if (h === null) {
        kit.trim = { sku: null, reason: 'no_trim_for_thickness', lengths: 0, total: 0 };
      } else {
        var fin = (has(input, 'trim_finish') && input.trim_finish !== '') ? String(input.trim_finish)
          : (p.kit.trim_finish_suggest || Tr.default_finish);
        if (!Object.prototype.hasOwnProperty.call(Tr.finishes, fin)) {
          throw new QErr('unknown_trim_finish', { field: 'trim_finish', finish: fin });
        }
        var tSku = fill(Tr.sku_pattern, { height: h, finish: fin }), tHit = data.index[tSku];
        if (!tHit) throw new QErr('kit_item_missing', { sku: tSku });
        var nLen = ceil6(div(mul(edge, pct(dec(Tr.overage_pct))), dec(Tr.length_m)));
        var trl = priceLine(tHit.v, nLen, buyer);
        total = add(total, trl.total);
        kit.trim = {
          sku: tSku, height_mm: h, finish: fin, edge_m: toNum(edge, 2), lengths: nLen,
          total: toNum(trl.total, 2), parts: lineOut(trl).parts
        };
        if (nLen) out.lines.push(cartLine('trim', tHit.v, nLen, trl.total));
      }
    }

    if (kitOn.clips) {
      var C = R.clips, applies = clipsApply(p, v, R);
      if (applies && cmp(joint, dec(C.max_joint_mm)) > 0) {
        kit.clips = { count: 0, reason: 'joint_too_wide', packs: {}, total: 0 };
      } else if (applies) {
        var perM2c = div(mul(jointFactor(v), THOUSAND), dec(C.spacing_m));
        var need = ceil6(mul(mul(area, perM2c), pct(dec(C.overage_pct))));
        var packs = clipPacks(need, buyer, data, C), ctot = ZERO;
        for (var s in packs) {
          if (!Object.prototype.hasOwnProperty.call(packs, s) || !packs[s]) continue;
          var pl = priceLine(data.index[s].v, packs[s], buyer);
          ctot = add(ctot, pl.total);
          out.lines.push(cartLine('clips', data.index[s].v, packs[s], pl.total));
        }
        total = add(total, ctot);
        kit.clips = { per_m2: toNum(perM2c, 2), count: need, packs: packs, total: toNum(ctot, 2) };
      } else {
        kit.clips = { count: 0, reason: 'not_needed', packs: {}, total: 0 };
      }
    }

    out.total = toNum(total, 2);
    return out;
  }

  // One cart line: what an "add to basket" link or request needs.
  function cartLine(kind, v, qty, totalFrac) {
    return {
      kind: kind, sku: v.sku, qty: qty, total: toNum(totalFrac, 2),
      in_stock: v.stock_total === null || v.stock_total === undefined || v.stock_total >= qty
    };
  }

  // Waste % for a variation and pattern (a number like 12), or null if the pattern is not allowed.
  function wasteFor(variation, pattern, data) {
    data = dataFor(variation, data);
    var sku = typeof variation === 'string' ? variation : (variation && variation.sku);
    var hit = data && sku ? data.index[sku] : null;
    if (!hit || !HAS_BIGINT || (hit.v.patterns || []).indexOf(pattern) < 0) return null;
    try { return toNum(wastePct(hit.p, hit.v, pattern, data.rules), 1); } catch (e) { return null; }
  }

  /* ------------------------------------------------------------------ formatting */
  // Exact half-up decimal string ("1514.80"), no grouping.
  function fixed(x, dp) {
    var f = (x && x.n !== undefined) ? x : dec(x);
    if (!f) return typeof x === 'number' && isFinite(x) ? x.toFixed(dp) : '';
    var m = roundUnits(f, dp), neg = m < B0;
    if (neg) m = -m;
    var s = m.toString();
    if (dp > 0) {
      while (s.length <= dp) s = '0' + s;
      s = s.slice(0, s.length - dp) + '.' + s.slice(s.length - dp);
    }
    return (neg && /[1-9]/.test(s) ? '-' : '') + s;
  }
  function group(s) {
    var parts = String(s).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  function fmtNum(x, dp) { return group(fixed(x, dp)); }
  function fmtMoney(x) { return '\u20ac' + group(fixed(x, 2)); }
  function trimZeros(s) { return s.indexOf('.') < 0 ? s : s.replace(/\.?0+$/, ''); }

  /* ------------------------------------------------------------------ the UI */
  // All visible words, for overrides (options.text) and the French/Arabic pages later.
  // Strings use {name} slots; a function gets the same values.
  var TEXT = {
    units: 'Units', metres: 'Metres', feet: 'Feet',
    measure: 'Measure', byRoom: 'Room size', byArea: 'Total area',
    roomSize: 'Room length and width', length: 'Length', width: 'Width', area: 'Area to tile',
    areaIs: '{main}, which is {other}',
    pattern: 'Pattern', waste: '+{pct}% waste', notForTile: 'not for this size',
    patternSwitched: '{wanted} is not offered for this size, so the quote uses {used}.',
    patterns: { straight: 'Straight', brick: 'Brick', herringbone: 'Herringbone', modular: 'Set pattern' },
    joint: 'Joint width', grout: 'Grout colour', groutAria: 'Grout: {name}',
    edge: 'Edges to finish with trim', finish: 'Trim finish',
    finishes: { ST: 'Steel', BK: 'Black', BR: 'Brass' },
    trimFits: '{height} mm trim for this {thk} mm tile, in {len} m lengths.',
    trimNone: 'Our trims go up to {max} mm. This tile is {thk} mm thick.',
    kit: 'Include in the kit',
    kitNames: { adhesive: 'Adhesive', grout: 'Grout', trim: 'Trims', clips: 'Levelling clips' },
    caption: 'Your order', colItem: 'Item', colQty: 'Quantity', colPrice: 'Price',
    tilesHow: '{area} + {waste}% waste ({pattern}) = {need}',
    tierNames: { box: 'single price', box_10: '10+ price', pallet: 'pallet price', trade: 'trade price' },
    boxes: function (o) { return o.n === 1 ? '1 box' : group(String(o.n)) + ' boxes'; },
    bags: function (o) { return o.n === 1 ? '1 bag' : group(String(o.n)) + ' bags'; },
    lengths: function (o) { return o.n === 1 ? '1 length' : group(String(o.n)) + ' lengths'; },
    packs: function (o) { return (o.n === 1 ? '1 pack' : o.n + ' packs') + ' of ' + o.size; },
    adhesiveItem: 'Tile adhesive, {colour}, {kg} kg bags',
    adhesiveHow: '{rate} kg per m\u00b2 + {over}% = {kg} kg. Trowel: {notch} mm notch.',
    groutItem: 'Grout, {colour}, {kg} kg bags',
    groutHow: '{joint} mm joints: {rate} kg per m\u00b2 + {over}% = {kg} kg',
    trimItem: 'Edge trim, {height} mm, {finish}, {len} m',
    trimHow: '{edge} of edge + {over}%',
    trimNoEdge: 'Enter the edge length to add trims.',
    clipsItem: 'Levelling clips',
    clipsHow: '{perM2} clips per m\u00b2 + {over}% = {count} clips',
    clipsJoint: 'Clips fit joints up to {max} mm.',
    clipsHandmade: 'Not used on handmade tiles.',
    clipsSmall: 'Only needed for tiles of {min} cm or more.',
    clipsThick: 'Only for tiles up to {max} mm thick.',
    shortItem: 'Only {stock} in stock.',
    lotOkTitle: 'One shade lot covers your order',
    lotOk: 'All {boxes} come from lot {lot} ({stock} in stock).',
    shortLotTitle: 'No single shade lot has {boxes}',
    shortLot: 'The largest lot, {lot}, has {stock}. We have {total} in {lots} lots, and lots can differ in shade: blend boxes from each lot as you lay.',
    shortStockTitle: 'Only {total} in stock',
    shortStock: 'You need {boxes}.',
    leadTime: 'The workshop\u2019s lead time is about {weeks} weeks.',
    checkTitle: 'Check your numbers',
    totalHome: 'Total at home prices', totalTrade: 'Total at trade prices',
    perArea: 'Tiles: {perM2} per m\u00b2, {perBox} per box.',
    perAreaFt: 'Tiles: {perFt2} per ft\u00b2 ({perM2} per m\u00b2), {perBox} per box.',
    perAreaAvg: 'Tiles: on average {perM2} per m\u00b2, {perBox} per box.',
    perAreaFtAvg: 'Tiles: on average {perFt2} per ft\u00b2 ({perM2} per m\u00b2), {perBox} per box.',
    tradeNote: 'Trade price on every item.',
    addKit: 'Add {boxes} and the kit to basket', addTiles: 'Add {boxes} to basket',
    added: 'Demo store: nothing was added. No real orders.',
    basketNote: 'Calculator: {area}, {pattern}, +{waste}% waste',
    live: '{boxes}, total {total}.',
    fine: 'Demo store: nothing is charged or shipped. Coverage rules are sample data, not installation advice.',
    planCaption: 'Your room at scale',
    planAria: 'Plan of the room with the tiles laid at scale'
  };

  function tpl(x, vars) {
    if (typeof x === 'function') return x(vars || {});
    return String(x).replace(/\{(\w+)\}/g, function (all, k) { return vars && vars[k] !== undefined ? vars[k] : all; });
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function merge(base, over) {
    var out = {}, k;
    for (k in base) if (Object.prototype.hasOwnProperty.call(base, k)) out[k] = base[k];
    if (over) {
      for (k in over) {
        if (!Object.prototype.hasOwnProperty.call(over, k)) continue;
        out[k] = (base[k] && typeof base[k] === 'object' && over[k] && typeof over[k] === 'object') ? merge(base[k], over[k]) : over[k];
      }
    }
    return out;
  }
  function emit(target, name, detail) {
    if (!target || !target.dispatchEvent) return;
    var W = (target.ownerDocument || target).defaultView;
    if (!W || typeof W.CustomEvent !== 'function') return;
    target.dispatchEvent(new W.CustomEvent(name, { detail: detail, bubbles: true }));
  }
  function cleanNum(s) {          // "4,2" -> "4.2"; "1,234.5" -> "1234.5"
    s = String(s === undefined || s === null ? '' : s).replace(/\s+/g, '');
    if (s.indexOf(',') >= 0) s = s.indexOf('.') >= 0 ? s.replace(/,/g, '') : s.replace(',', '.');
    return s;
  }

  // Calculator styles, scoped to .gg-calc. Inserted first in <head>, so the page's own CSS wins on equal rules.
  // Colours read the store's CSS variables (style.css :root), with the approved mock values as fallbacks.
  var CSS = [
    ':where(.gg-calc){color:var(--slate,#262B2E)}',
    ':where(.gg-calc) *{box-sizing:border-box}',
    ':where(.gg-calc) button,:where(.gg-calc) input{font:inherit;color:inherit}',
    ':where(.gg-calc) button{cursor:pointer}',
    ':where(.gg-calc) .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    ':where(.gg-calc) .seg{display:flex;border:1px solid var(--slate,#262B2E);background:var(--label,#FBFBF9)}',
    ':where(.gg-calc) .seg button{flex:1;border:0;border-left:1px solid var(--slate,#262B2E);background:transparent;padding:9px 12px;font-size:14px;font-weight:540;white-space:nowrap}',
    ':where(.gg-calc) .seg button:first-child{border-left:0}',
    ':where(.gg-calc) .seg button[aria-pressed="true"]{background:var(--slate,#262B2E);color:var(--porcelain,#F1F2EF)}',
    ':where(.gg-calc) .seg button:disabled{color:#737977;cursor:not-allowed;background:repeating-linear-gradient(135deg,transparent 0 6px,rgba(38,43,46,.06) 6px 7px)}',
    ':where(.gg-calc) .seg small{font-size:12px;font-weight:450;opacity:.8;margin-left:4px}',
    ':where(.gg-calc) .grout{width:26px;height:26px;padding:0;border:1px solid rgba(38,43,46,.35);position:relative}',
    ':where(.gg-calc) .grout[aria-pressed="true"]::after{content:"";position:absolute;top:-5px;right:-5px;bottom:-5px;left:-5px;border:2px solid var(--slate,#262B2E)}',
    ':where(.gg-calc) .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:46px;padding:0 22px;border:0;background:var(--cobalt,#1E4F8F);color:#fff;text-decoration:none;font-weight:620;font-size:15px;font-stretch:106%}',
    ':where(.gg-calc) .btn:hover{background:var(--cobalt-deep,#163C6E)}',
    ':where(.gg-calc) .btn:disabled{background:#737977;cursor:not-allowed}',
    '.ggc-grid{display:grid;grid-template-columns:minmax(0,340px) minmax(0,1fr);gap:40px;align-items:start}',
    '.ggc-grid.ggc-has-plan{grid-template-columns:330px minmax(0,1fr) 430px}',
    '.ggc-field{margin:0 0 20px;border:0;padding:0;min-width:0}',
    '.ggc-label{display:block;font-size:13px;color:var(--wet,#5C676B);margin:0 0 7px;padding:0;font-stretch:108%}',
    '.ggc-two{display:grid;grid-template-columns:1fr 18px 1fr;gap:6px;align-items:center}',
    '.ggc-times{text-align:center;color:var(--wet,#5C676B)}',
    '.ggc-inp{display:flex;border:1px solid var(--slate,#262B2E);background:#fff;height:48px}',
    '.ggc-inp input{border:0;width:100%;min-width:0;padding:0 12px;font-size:19px;font-weight:620;background:transparent;font-variant-numeric:tabular-nums}',
    '.ggc-inp input:focus{outline:none}',
    '.ggc-inp:focus-within{outline:2px solid var(--cobalt,#1E4F8F);outline-offset:2px}',
    '.ggc-inp.ggc-bad{border-color:var(--ochre,#8A5300);box-shadow:inset 0 0 0 1px var(--ochre,#8A5300)}',
    '.ggc-u{padding:0 12px;display:flex;align-items:center;color:var(--wet,#5C676B);border-left:1px solid var(--grout,#B8BBB5);font-size:14px}',
    '.ggc-hint{font-size:13.5px;color:var(--wet,#5C676B);margin:8px 0 0}',
    '.ggc-hint:empty{display:none}',
    '.ggc-hint.ggc-err{color:var(--ochre,#8A5300);font-weight:560}',
    '.ggc-col{flex-direction:column}',
    '.ggc-col button{border-left:0;border-top:1px solid var(--slate,#262B2E);text-align:left;display:flex;justify-content:space-between;gap:10px}',
    '.ggc-col button:first-child{border-top:0}',
    '.ggc-grouts{display:flex;gap:6px;flex-wrap:wrap}',
    '.ggc-kit{display:grid;grid-template-columns:1fr 1fr;gap:6px 12px}',
    '.ggc-kit legend{grid-column:1/-1;float:left;width:100%}',
    '.ggc-kit label{display:flex;gap:8px;align-items:center;font-size:14.5px}',
    '.ggc-kit input{width:17px;height:17px;accent-color:var(--cobalt,#1E4F8F);margin:0}',
    '.ggc-plan{margin:0;border:1px solid var(--grout,#B8BBB5);background:var(--porcelain,#F1F2EF)}',
    '.ggc-plan canvas{display:block;width:100%;aspect-ratio:4/3.4}',
    '.ggc-plan figcaption{border-top:1px solid var(--grout,#B8BBB5);padding:10px 14px;font-size:13.5px;color:var(--wet,#5C676B)}',
    '.ggc-receipt{border:1px solid var(--slate,#262B2E);background:#fff;min-width:0}',
    '.ggc-receipt table{width:100%;border-collapse:collapse;font-size:14.5px}',
    '.ggc-receipt th,.ggc-receipt td{padding:11px 16px;text-align:left;vertical-align:top;border-bottom:1px solid var(--grout,#B8BBB5);font-variant-numeric:tabular-nums}',
    '.ggc-receipt .ggc-q{text-align:right;white-space:nowrap}',
    '.ggc-receipt .ggc-m{text-align:right;white-space:nowrap;width:92px}',
    '.ggc-receipt thead th{font-size:12.5px;font-weight:500;color:var(--wet,#5C676B);border-bottom:1px solid var(--slate,#262B2E);padding-top:12px;padding-bottom:9px}',
    '.ggc-item{font-weight:600;display:block}',
    '.ggc-how{display:block;font-size:12.5px;color:var(--wet,#5C676B);margin-top:2px;font-weight:400}',
    '.ggc-how.ggc-warn{color:var(--ochre,#8A5300);font-weight:560}',
    '.ggc-muted .ggc-item{font-weight:500;color:var(--wet,#5C676B)}',
    '.ggc-note{margin:14px 16px 0;padding:11px 13px;font-size:14px;line-height:1.45;border-left:4px solid var(--ochre,#8A5300);background:var(--ochre-bg,#F5EBDA);color:#3D2A08}',
    '.ggc-note:empty{display:none}',
    '.ggc-note strong{display:block;color:var(--ochre,#8A5300);margin-bottom:2px}',
    '.ggc-note.ggc-ok{border-color:var(--moss,#2D6A4C);background:var(--moss-bg,#E4EEE7);color:#1E3A2B}',
    '.ggc-note.ggc-ok strong{color:var(--moss,#2D6A4C)}',
    '.ggc-total{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:16px 16px 6px}',
    '.ggc-tl{font-size:14.5px}',
    '.ggc-tv{font-size:30px;font-weight:720;font-stretch:112%;font-variant-numeric:tabular-nums;white-space:nowrap}',
    '.ggc-tsub{padding:0 16px 14px;font-size:13px;color:var(--wet,#5C676B)}',
    '.ggc-tsub:empty{display:none}',
    '.ggc-receipt .ggc-add{width:calc(100% - 32px);margin:0 16px 10px}',
    '.ggc-fine{font-size:12.5px;color:var(--wet,#5C676B);padding:0 16px 14px;margin:0}',
    '@media (min-width:861px) and (min-height:820px){.ggc-grid:not(.ggc-has-plan) .ggc-receipt{position:sticky;top:16px}}',
    '@media (min-width:1241px) and (min-height:820px){.ggc-has-plan .ggc-receipt{position:sticky;top:16px}}',
    '@media (max-width:1240px){.ggc-grid.ggc-has-plan{grid-template-columns:300px minmax(0,1fr)}.ggc-has-plan .ggc-receipt{grid-column:1/-1}}',
    '@media (max-width:860px){.ggc-grid,.ggc-grid.ggc-has-plan{grid-template-columns:minmax(0,1fr);gap:26px}.ggc-receipt th,.ggc-receipt td{padding:10px 12px}.ggc-receipt .ggc-m{width:auto}.ggc-tv{font-size:26px}}'
  ].join('\n');

  function injectCss(doc) {
    if (!doc || doc.getElementById('gg-calc-css')) return;
    var s = doc.createElement('style');
    s.id = 'gg-calc-css';
    s.textContent = CSS;
    var head = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement;
    head.insertBefore(s, head.firstChild);
  }

  var UID = 0;
  var FT = 0.3048, FT2 = 0.09290304;     // display conversions only; the quote uses kit-rules units

  /* renderCalculator(el, variation, options) -> controller
   *   el: the mount element; its contents (a no-JS fallback) are replaced.
   *   variation: a self-contained variation (blob), or a variation object or SKU string with data from setData().
   *   options: {
   *     data,                         prepared data (default: setData)
   *     buyer: 'home' | 'trade' | fn, default: window.GGView.get() if present, else 'home'
   *     viewEvent: 'gg:view',         document event with detail 'home' | 'trade' (false: do not listen)
   *     unit: 'm' | 'ft', mode: 'room' | 'area', length, width, area, edge,   starting values
   *     pattern, joint_mm, grout_sku, trim_finish, kit: {adhesive, grout, trim, clips},
   *     plan: true,                   adds an empty <figure> with a <canvas> for the room drawing (controller.planCanvas)
   *     onChange(quote, state),       after every new quote (state.room_m: room size in metres for a drawing)
   *     onAdd(quote, state),          the Add button (default: gg:basket-add if window.GGBasket exists, else a demo message)
   *     text: {...}, css: false, idPrefix
   *   }
   *   controller: { el, planEl, planCanvas, update(patch), setVariation(v), setBuyer(b), getQuote(), getState(), destroy() } */
  function renderCalculator(el, variation, options) {
    if (!el || !el.ownerDocument) throw new Error('GGCalc.renderCalculator: el must be a DOM element');
    options = options || {};
    var doc = el.ownerDocument, win = doc.defaultView || {};
    var data = dataFor(variation, options.data);
    var T = merge(TEXT, options.text);
    var id = options.idPrefix || ('ggc' + (++UID));
    var viewEvent = options.viewEvent === undefined ? 'gg:view' : options.viewEvent;
    if (options.css !== false) injectCss(doc);

    var ft = options.unit === 'ft';
    var S = {
      unit: ft ? 'ft' : 'm',
      mode: options.mode === 'area' ? 'area' : 'room',
      length: start(options.length, ft ? '13' : '4'), width: start(options.width, ft ? '10' : '3'),
      area: start(options.area, ft ? '130' : '12'), edge: start(options.edge, ft ? '10' : '3'),
      pattern: options.pattern || null,
      joint: (options.joint_mm !== undefined && options.joint_mm !== null) ? String(options.joint_mm) : null,
      grout: options.grout_sku || null, finish: options.trim_finish || null,
      kit: { adhesive: true, grout: true, trim: true, clips: true },
      buyer: 'home'
    };
    if (options.kit) for (var kk in S.kit) if (options.kit[kk] !== undefined) S.kit[kk] = !!options.kit[kk];
    if (options.buyer === 'trade' || options.buyer === 'home') S.buyer = options.buyer;
    else if (win.GGView && typeof win.GGView.get === 'function') S.buyer = win.GGView.get() === 'trade' ? 'trade' : 'home';

    var cur = null, q = null, liveTimer = null, alive = true;

    function start(x, dflt) { return (x === undefined || x === null) ? dflt : String(x); }
    function buyerNow() {
      if (typeof options.buyer === 'function') return options.buyer() === 'trade' ? 'trade' : 'home';
      return S.buyer;
    }
    function $(sel) { return root.querySelector(sel); }
    function $$(sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }

    /* ---------- skeleton (built once) */
    var root = doc.createElement('div');
    root.className = 'gg-calc ggc-grid' + (options.plan ? ' ggc-has-plan' : '');
    root.innerHTML = formHtml() + (options.plan ? planHtml() : '') + receiptHtml();
    el.innerHTML = '';
    el.appendChild(root);
    var form = $('form');

    function seg(act, buttons, extraClass) {
      return '<div class="seg' + (extraClass ? ' ' + extraClass : '') + '" role="group" aria-labelledby="' + id + '-l' + act + '" data-slot="' + act + '">' + buttons + '</div>';
    }
    function btn(act, val, html) {
      return '<button type="button" data-act="' + act + '" data-val="' + esc(val) + '" aria-pressed="false">' + html + '</button>';
    }
    function inp(key, label, unitSlot, hidden) {
      return '<label class="ggc-inp" data-box="' + key + '">' + (hidden ? '<span class="sr">' + esc(label) + '</span>' : '') +
        '<input id="' + id + '-' + key + '" data-in="' + key + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" maxlength="10"' +
        ' aria-describedby="' + id + '-h' + key + '">' + '<span class="ggc-u" data-unit="' + unitSlot + '" aria-hidden="true"></span></label>';
    }
    function formHtml() {
      var kitBoxes = ['adhesive', 'grout', 'trim', 'clips'].map(function (k) {
        return '<label><input type="checkbox" data-kit="' + k + '"> ' + esc(T.kitNames[k]) + '</label>';
      }).join('');
      return '<form class="ggc-in" novalidate aria-label="' + esc(T.roomSize) + '">' +
        '<div class="ggc-field"><span class="ggc-label" id="' + id + '-lunit">' + esc(T.units) + '</span>' +
        seg('unit', btn('unit', 'm', esc(T.metres)) + btn('unit', 'ft', esc(T.feet))) + '</div>' +
        '<div class="ggc-field"><span class="ggc-label" id="' + id + '-lmode">' + esc(T.measure) + '</span>' +
        seg('mode', btn('mode', 'room', esc(T.byRoom)) + btn('mode', 'area', esc(T.byArea))) + '</div>' +
        '<div class="ggc-field" data-part="room"><span class="ggc-label" id="' + id + '-lroom">' + esc(T.roomSize) + '</span>' +
        '<div class="ggc-two" role="group" aria-labelledby="' + id + '-lroom">' + inp('length', T.length, 'len', true) +
        '<span class="ggc-times" aria-hidden="true">\u00d7</span>' + inp('width', T.width, 'len', true) + '</div>' +
        '<p class="ggc-hint" id="' + id + '-hlength"></p><p class="ggc-hint" id="' + id + '-hwidth" hidden></p></div>' +
        '<div class="ggc-field" data-part="area"><label class="ggc-label" for="' + id + '-area">' + esc(T.area) + '</label>' +
        inp('area', T.area, 'area', false) + '<p class="ggc-hint" id="' + id + '-harea"></p></div>' +
        '<div class="ggc-field"><span class="ggc-label" id="' + id + '-lpattern">' + esc(T.pattern) + '</span>' +
        seg('pattern', '', 'ggc-col') + '<p class="ggc-hint" data-hint="pattern"></p></div>' +
        '<div class="ggc-field"><span class="ggc-label" id="' + id + '-ljoint">' + esc(T.joint) + '</span>' +
        seg('joint', '') + '</div>' +
        '<div class="ggc-field"><span class="ggc-label" id="' + id + '-lgrout">' + esc(T.grout) + ': <span data-slot="groutName"></span></span>' +
        '<div class="ggc-grouts" role="group" aria-labelledby="' + id + '-lgrout" data-slot="grout"></div></div>' +
        '<div class="ggc-field"><label class="ggc-label" for="' + id + '-edge">' + esc(T.edge) + '</label>' +
        inp('edge', T.edge, 'len', false) + '<p class="ggc-hint" id="' + id + '-hedge"></p></div>' +
        '<div class="ggc-field" data-part="finish"><span class="ggc-label" id="' + id + '-lfinish">' + esc(T.finish) + '</span>' +
        seg('finish', '') + '</div>' +
        '<fieldset class="ggc-field ggc-kit"><legend class="ggc-label">' + esc(T.kit) + '</legend>' + kitBoxes + '</fieldset>' +
        '</form>';
    }
    function planHtml() {
      return '<figure class="ggc-plan"><canvas role="img" aria-label="' + esc(T.planAria) + '"></canvas>' +
        '<figcaption data-slot="plancap">' + esc(T.planCaption) + '</figcaption></figure>';
    }
    function receiptHtml() {
      return '<div class="ggc-receipt"><table><caption class="sr">' + esc(T.caption) + '</caption><thead><tr>' +
        '<th scope="col">' + esc(T.colItem) + '</th><th scope="col" class="ggc-q">' + esc(T.colQty) + '</th>' +
        '<th scope="col" class="ggc-m">' + esc(T.colPrice) + '</th></tr></thead><tbody data-slot="rows"></tbody></table>' +
        '<div class="ggc-note" data-slot="note"></div>' +
        '<div class="ggc-total"><span class="ggc-tl" data-slot="tl"></span><span class="ggc-tv" data-slot="tv"></span></div>' +
        '<div class="ggc-tsub" data-slot="ts"></div>' +
        '<button type="button" class="btn ggc-add" data-act="add"></button>' +
        '<p class="ggc-fine">' + esc(T.fine) + '</p><p class="sr" aria-live="polite" data-slot="live"></p></div>';
    }

    /* ---------- per-variation parts */
    function effective() {
      var v = cur.v, p = cur.p, R = data.rules, kitP = p.kit || {};
      return {
        pattern: (S.pattern && v.patterns.indexOf(S.pattern) >= 0) ? S.pattern : v.patterns[0],
        joint: S.joint !== null ? S.joint : String(kitP.joint_mm_default),
        grout: (S.grout && data.index[S.grout]) ? S.grout : (kitP.grout_suggest || [])[0],
        finish: (S.finish && R.trims.finishes[S.finish]) ? S.finish : (kitP.trim_finish_suggest || R.trims.default_finish)
      };
    }
    function patternList(v) {
      if (v.patterns.indexOf('modular') >= 0) return v.patterns.slice();
      var all = ['straight', 'brick', 'herringbone'];
      v.patterns.forEach(function (x) { if (all.indexOf(x) < 0) all.push(x); });
      return all;
    }
    function fillSlots() {
      if (!cur || cur.v.sell_by !== 'm2') return;
      var v = cur.v, R = data.rules;
      $('[data-slot="pattern"]').innerHTML = patternList(v).map(function (pat) {
        var w = wasteFor(v, pat, data), name = esc(T.patterns[pat] || pat);
        var b = btn('pattern', pat, name + ' <small>' + esc(w === null ? T.notForTile : tpl(T.waste, { pct: fmtNum(w, 0) })) + '</small>');
        return w === null ? b.replace('<button ', '<button disabled ') : b;
      }).join('');
      var joints = R.grout.joint_mm_options.slice();
      var dj = cur.p.kit ? cur.p.kit.joint_mm_default : null;
      if (dj !== null && joints.indexOf(dj) < 0) joints.push(dj);
      joints.sort(function (a, b) { return a - b; });
      $('[data-slot="joint"]').innerHTML = joints.map(function (j) { return btn('joint', String(j), esc(String(j)) + ' mm'); }).join('');
      $('[data-slot="grout"]').innerHTML = data.products.filter(function (p) { return p.material === 'grout'; })
        .reduce(function (acc, p) { return acc.concat(p.variations); }, [])
        .map(function (g) {
          var hex = g.colour && /^#[0-9a-f]{3,8}$/i.test(g.colour.hex) ? g.colour.hex : '#cccccc';
          return '<button type="button" class="grout" data-act="grout" data-val="' + esc(g.sku) + '" style="background:' + hex +
            '" title="' + esc(colourName(g)) + '" aria-label="' + esc(tpl(T.groutAria, { name: colourName(g) })) + '" aria-pressed="false"></button>';
        }).join('');
      $('[data-slot="finish"]').innerHTML = Object.keys(R.trims.finishes).map(function (f) {
        return btn('finish', f, esc(T.finishes[f] || R.trims.finishes[f]));
      }).join('');
    }

    /* ---------- quote */
    function buildInput(E) {
      var inp = { buyer: buyerNow(), pattern: E.pattern, joint_mm: E.joint, grout_sku: E.grout, trim_finish: E.finish, kit: {} };
      for (var k in S.kit) inp.kit[k] = S.kit[k];
      if (S.mode === 'room') { inp.length = cleanNum(S.length); inp.width = cleanNum(S.width); inp.unit = S.unit; }
      else inp[S.unit === 'ft' ? 'area_ft2' : 'area_m2'] = cleanNum(S.area);
      var e = cleanNum(S.edge);
      inp[S.unit === 'ft' ? 'edge_ft' : 'edge_m'] = e === '' ? 0 : e;
      return inp;
    }
    function recompute() {
      if (!alive) return;
      var E = null;
      if (!cur) q = computeQuote(typeof variation === 'string' ? variation : (variation && variation.sku) || null, {}, data);
      else if (cur.v.sell_by !== 'm2') q = computeQuote(cur.v.sku, {}, data);
      else { E = effective(); q = computeQuote(cur.v.sku, buildInput(E), data); }
      paintForm(E);
      paintReceipt();
      var st = getState();
      if (typeof options.onChange === 'function') options.onChange(q, st);
      emit(root, 'gg:calc', { quote: q, state: st, planCanvas: ctl ? ctl.planCanvas : null });
    }

    /* ---------- paint */
    function areaText(m2, ft2) {
      return S.unit === 'ft' ? fmtNum(ft2, 2) + ' ft\u00b2' : fmtNum(m2, 2) + ' m\u00b2';
    }
    function lenText(s) { return fmtNum(cleanNum(s) || 0, 2) + ' ' + S.unit; }
    function setHint(key, text, isErr) {
      var h = doc.getElementById(id + '-h' + key);
      if (!h) return;
      h.textContent = text || '';
      h.className = 'ggc-hint' + (isErr ? ' ggc-err' : '');
      h.hidden = !text;
    }
    function paintForm(E) {
      var areaSold = !!(cur && cur.v.sell_by === 'm2');
      form.hidden = !areaSold;
      if (!areaSold) return;
      var v = cur.v, R = data.rules;
      var pressed = { unit: S.unit, mode: S.mode, pattern: E.pattern, joint: E.joint, grout: E.grout, finish: E.finish };
      $$('[data-act]').forEach(function (b) {
        var act = b.getAttribute('data-act');
        if (pressed[act] !== undefined) b.setAttribute('aria-pressed', String(String(pressed[act]) === b.getAttribute('data-val')));
      });
      $$('[data-unit="len"]').forEach(function (u) { u.textContent = S.unit; });
      $$('[data-unit="area"]').forEach(function (u) { u.textContent = S.unit + '\u00b2'; });
      $('[data-part="room"]').hidden = S.mode !== 'room';
      $('[data-part="area"]').hidden = S.mode !== 'area';
      $$('[data-kit]').forEach(function (c) { c.checked = !!S.kit[c.getAttribute('data-kit')]; });
      var g = data.index[E.grout];
      $('[data-slot="groutName"]').textContent = g ? colourName(g.v) : '';

      // area line and field errors
      var errField = q.ok ? null : q.field;
      ['length', 'width', 'area', 'edge'].forEach(function (k) {
        var bad = errField === k || (errField === 'area' && S.mode === 'room' && (k === 'length' || k === 'width'));
        var box = $('[data-box="' + k + '"]');
        box.className = 'ggc-inp' + (bad ? ' ggc-bad' : '');
        doc.getElementById(id + '-' + k).setAttribute('aria-invalid', bad ? 'true' : 'false');
      });
      setHint('width', '', false);
      setHint('edge', '', false);
      var areaLine = '';
      if (q.ok) {
        var main = S.unit === 'ft' ? fmtNum(q.area_ft2, 2) + ' ft\u00b2' : fmtNum(q.area_m2, 2) + ' m\u00b2';
        var other = S.unit === 'ft' ? fmtNum(q.area_m2, 2) + ' m\u00b2' : fmtNum(q.area_ft2, 2) + ' ft\u00b2';
        areaLine = tpl(T.areaIs, { main: main, other: other });
      }
      if (S.mode === 'room') {
        if (errField === 'length' || errField === 'width' || errField === 'area') setHint('length', q.message, true);
        else setHint('length', areaLine, false);
        setHint('area', '', false);
      } else {
        setHint('area', errField === 'area' ? q.message : areaLine, errField === 'area');
        setHint('length', '', false);
      }
      // pattern swap note
      var ph = $('[data-hint="pattern"]');
      ph.textContent = (S.pattern && S.pattern !== E.pattern) ? tpl(T.patternSwitched, {
        wanted: T.patterns[S.pattern] || S.pattern, used: (T.patterns[E.pattern] || E.pattern).toLowerCase()
      }) : '';
      // trims
      var h = trimHeight(v.thickness_mm, R), maxH = Math.max.apply(null, R.trims.heights_mm);
      $('[data-part="finish"]').hidden = h === null;
      if (errField === 'edge') setHint('edge', q.message, true);
      else if (h === null) setHint('edge', tpl(T.trimNone, { max: maxH, thk: fmtThk(v.thickness_mm) }), false);
      else setHint('edge', tpl(T.trimFits, { height: h, thk: fmtThk(v.thickness_mm), len: trimZeros(fixed(R.trims.length_m, 2)) }), false);
    }
    function fmtThk(t) { return trimZeros(fixed(t, 1)); }
    function plural(key, n, extra) { var o = { n: n }; if (extra) for (var k in extra) o[k] = extra[k]; return tpl(T[key], o); }

    function row(item, hows, qty, qtyHows, price, cls) {
      return '<tr' + (cls ? ' class="' + cls + '"' : '') + '><td><span class="ggc-item">' + item + '</span>' +
        hows.map(function (x) { return '<span class="ggc-how' + (x.warn ? ' ggc-warn' : '') + '">' + (x.html || x) + '</span>'; }).join('') +
        '</td><td class="ggc-q">' + qty + (qtyHows || []).map(function (x) { return '<span class="ggc-how">' + x + '</span>'; }).join('') +
        '</td><td class="ggc-m">' + price + '</td></tr>';
    }
    function partsText(parts) {
      return parts.map(function (x) {
        return group(String(x.qty)) + ' \u00d7 ' + fmtMoney(x.unit) + ' (' + (T.tierNames[x.tier] || x.tier) + ')';
      }).join(' + ');
    }
    function stockWarn(kind, sku, qty) {
      var line = null;
      q.lines.forEach(function (l) { if (l.kind === kind && l.sku === sku && !l.in_stock) line = l; });
      if (!line) return [];
      var hit = data.index[sku];
      return [{ warn: true, html: esc(tpl(T.shortItem, { stock: hit ? group(String(hit.v.stock_total)) : '0', qty: qty })) }];
    }
    function lower(s) { return String(s).toLowerCase(); }

    function paintReceipt() {
      var rows = $('[data-slot="rows"]'), note = $('[data-slot="note"]'), tl = $('[data-slot="tl"]');
      var tv = $('[data-slot="tv"]'), ts = $('[data-slot="ts"]'), add = $('[data-act="add"]');
      var trade = buyerNow() === 'trade';
      tl.textContent = trade ? T.totalTrade : T.totalHome;
      if (!q.ok) {
        rows.innerHTML = '';
        note.className = 'ggc-note';
        note.innerHTML = (q.error === 'not_sold_by_area' ? '' : '<strong>' + esc(T.checkTitle) + '</strong>') + esc(q.message);
        tv.textContent = '\u2013';
        ts.textContent = '';
        add.textContent = tpl(T.addTiles, { boxes: plural('boxes', 0) });
        add.disabled = true;
        announce(q.message);
        return;
      }
      var v = cur.v, p = cur.p, R = data.rules, html = [];
      var tilesHow = tpl(T.tilesHow, {
        area: areaText(q.area_m2, q.area_ft2), waste: fmtNum(q.waste_pct, q.waste_pct % 1 ? 1 : 0),
        pattern: lower(T.patterns[q.pattern] || q.pattern), need: areaText(q.area_with_waste_m2, q.area_with_waste_ft2)
      });
      html.push(row(esc((p.name + ', ' + v.name).replace(/(\d) x (\d)/g, '$1 \u00d7 $2')), [esc(tilesHow), esc(partsText(q.tiles.parts))].concat(stockWarn('tiles', v.sku, q.boxes)),
        esc(plural('boxes', q.boxes)), [esc(areaText(q.m2_ordered, q.m2_ordered_ft2))], fmtMoney(q.tiles.total)));

      var K = q.kit;
      if (K.adhesive) {
        var a = data.index[K.adhesive.sku];
        html.push(row(esc(tpl(T.adhesiveItem, { colour: lower(colourName(a.v)), kg: trimZeros(fixed(R.adhesive.bag_kg, 1)) })),
          [esc(tpl(T.adhesiveHow, { rate: fmtNum(K.adhesive.kg_per_m2, 1), over: R.adhesive.overage_pct, kg: fmtNum(K.adhesive.kg, 2), notch: K.adhesive.notch_mm })),
            esc(partsText(K.adhesive.parts))].concat(stockWarn('adhesive', a.v.sku, K.adhesive.bags)),
          esc(plural('bags', K.adhesive.bags)), null, fmtMoney(K.adhesive.total)));
      }
      if (K.grout) {
        var g = data.index[K.grout.sku];
        html.push(row(esc(tpl(T.groutItem, { colour: lower(colourName(g.v)), kg: trimZeros(fixed(R.grout.bag_kg, 1)) })),
          [esc(tpl(T.groutHow, { joint: trimZeros(fixed(q.joint_mm, 1)), rate: fmtNum(K.grout.kg_per_m2, 3), over: R.grout.overage_pct, kg: fmtNum(K.grout.kg, 2) })),
            esc(partsText(K.grout.parts))].concat(stockWarn('grout', g.v.sku, K.grout.bags)),
          esc(plural('bags', K.grout.bags)), null, fmtMoney(K.grout.total)));
      }
      if (S.kit.trim) {
        var maxH = Math.max.apply(null, R.trims.heights_mm);
        if (K.trim && K.trim.sku) {
          html.push(row(esc(tpl(T.trimItem, {
            height: K.trim.height_mm, finish: lower(R.trims.finishes[K.trim.finish] || K.trim.finish), len: trimZeros(fixed(R.trims.length_m, 2))
          })), [esc(tpl(T.trimHow, { edge: lenText(S.edge), over: R.trims.overage_pct })), esc(partsText(K.trim.parts))]
            .concat(stockWarn('trim', K.trim.sku, K.trim.lengths)),
          esc(plural('lengths', K.trim.lengths)), null, fmtMoney(K.trim.total)));
        } else if (K.trim) {
          html.push(row(esc(T.kitNames.trim), [esc(tpl(T.trimNone, { max: maxH, thk: fmtThk(v.thickness_mm) }))], '\u2013', null, '\u2013', 'ggc-muted'));
        } else {
          html.push(row(esc(T.kitNames.trim), [esc(T.trimNoEdge)], '\u2013', null, '\u2013', 'ggc-muted'));
        }
      }
      if (K.clips) {
        var C = R.clips;
        if (K.clips.count) {
          var packLines = Object.keys(K.clips.packs).filter(function (s) { return K.clips.packs[s]; }).map(function (s) {
            return esc(plural('packs', K.clips.packs[s], { size: C.packs[s] }));
          });
          html.push(row(esc(T.clipsItem), [esc(tpl(T.clipsHow, { perM2: fmtNum(K.clips.per_m2, 2), over: C.overage_pct, count: group(String(K.clips.count)) }))],
            packLines.shift() || '', packLines, fmtMoney(K.clips.total)));
        } else {
          var why = K.clips.reason === 'joint_too_wide' ? tpl(T.clipsJoint, { max: C.max_joint_mm })
            : p.handmade && C.exclude_handmade ? T.clipsHandmade
              : cmp(dec(v.thickness_mm), dec(C.max_thickness_mm)) > 0 ? tpl(T.clipsThick, { max: C.max_thickness_mm })
                : tpl(T.clipsSmall, { min: trimZeros(fixed(C.min_longest_side_mm / 10, 1)) });
          html.push(row(esc(T.clipsItem), [esc(why)], '\u2013', null, '\u2013', 'ggc-muted'));
        }
      }
      rows.innerHTML = html.join('');

      // shade lots and stock
      var L = q.lot, boxesTxt = plural('boxes', q.boxes), lead = v.lead_time_weeks ? ' ' + tpl(T.leadTime, { weeks: v.lead_time_weeks }) : '';
      if (L.status === 'ok') {
        note.className = 'ggc-note ggc-ok';
        note.innerHTML = '<strong>' + esc(T.lotOkTitle) + '</strong>' + esc(tpl(T.lotOk, { boxes: boxesTxt, lot: L.lot, stock: L.lot_stock }));
      } else if (L.status === 'short_lot') {
        note.className = 'ggc-note';
        note.innerHTML = '<strong>' + esc(tpl(T.shortLotTitle, { boxes: boxesTxt })) + '</strong>' + esc(tpl(T.shortLot, {
          lot: L.largest_lot, stock: L.largest_stock, total: plural('boxes', L.total_stock), lots: L.lot_count
        }) + lead);
      } else {
        note.className = 'ggc-note';
        note.innerHTML = '<strong>' + esc(tpl(T.shortStockTitle, { total: plural('boxes', L.total_stock) })) + '</strong>' +
          esc(tpl(T.shortStock, { boxes: boxesTxt }) + lead);
      }

      tv.textContent = fmtMoney(q.total);
      // One price tier: the list price per m2 from the data, as in the price table (box prices are rounded,
      // so total / m2 can differ by a cent). Mixed tiers (pallets + loose boxes): the average, said so.
      var tp = q.tiles.parts || [], pm = v.price && v.price.per_m2, tier = tp.length === 1 ? tp[0].tier : null;
      var listed = !!(tier && pm && pm[tier] !== null && pm[tier] !== undefined && R.units && dec(pm[tier]));
      var perM2 = listed ? pm[tier] : q.tiles.price_per_m2;
      var perFt2 = listed ? toNum(mul(dec(pm[tier]), dec(R.units.m2_per_ft2)), 2) : q.tiles.price_per_ft2;
      var per = tpl(S.unit === 'ft' ? (listed ? T.perAreaFt : T.perAreaFtAvg) : (listed ? T.perArea : T.perAreaAvg), {
        perM2: fmtMoney(perM2), perFt2: fmtMoney(perFt2), perBox: fmtMoney(q.tiles.price_per_box)
      });
      ts.textContent = per + (trade ? ' ' + T.tradeNote : '');
      var kitLines = q.lines.length > 1;
      add.textContent = tpl(kitLines ? T.addKit : T.addTiles, { boxes: boxesTxt });
      add.disabled = false;
      announce(tpl(T.live, { boxes: boxesTxt, total: fmtMoney(q.total) }));
    }
    function announce(text) {
      var live = $('[data-slot="live"]');
      if (liveTimer && win.clearTimeout) win.clearTimeout(liveTimer);
      if (!win.setTimeout) { live.textContent = text; return; }
      liveTimer = win.setTimeout(function () { live.textContent = text; }, 700);
    }

    /* ---------- state and events */
    function getState() {
      var ok = !!(cur && cur.v.sell_by === 'm2'), E = ok ? effective() : {};
      var room = null;
      if (S.mode === 'room') {
        var L = Number(cleanNum(S.length)), W = Number(cleanNum(S.width)), k = S.unit === 'ft' ? FT : 1;
        if (L > 0 && W > 0 && isFinite(L) && isFinite(W)) room = { length: L * k, width: W * k };
      }
      var g = E.grout ? data.index[E.grout] : null;
      return {
        sku: cur ? cur.v.sku : null, unit: S.unit, mode: S.mode, length: S.length, width: S.width, area: S.area, edge: S.edge,
        pattern: E.pattern || null, joint_mm: E.joint ? Number(E.joint) : null, grout_sku: E.grout || null,
        grout_hex: g && g.v.colour ? g.v.colour.hex : null, trim_finish: E.finish || null,
        kit: { adhesive: S.kit.adhesive, grout: S.kit.grout, trim: S.kit.trim, clips: S.kit.clips },
        buyer: buyerNow(), room_m: room
      };
    }
    function syncInputs() {
      ['length', 'width', 'area', 'edge'].forEach(function (k) { doc.getElementById(id + '-' + k).value = S[k]; });
    }
    function convert(s, factor) {
      var c = cleanNum(s), x = Number(c);
      if (c === '' || !isFinite(x)) return s;
      return trimZeros(fixed(x * factor, 2));
    }
    function switchUnit(u) {
      u = u === 'ft' ? 'ft' : 'm';
      if (u === S.unit) return;
      var k = u === 'ft' ? 1 / FT : FT, k2 = u === 'ft' ? 1 / FT2 : FT2;
      S.length = convert(S.length, k); S.width = convert(S.width, k); S.edge = convert(S.edge, k); S.area = convert(S.area, k2);
      S.unit = u;
      syncInputs();
    }
    function switchMode(m) {
      m = m === 'area' ? 'area' : 'room';
      if (m === S.mode) return;
      if (m === 'area') {               // carry the room's area over
        var L = dec(cleanNum(S.length)), W = dec(cleanNum(S.width));
        if (L && W && sign(L) > 0 && sign(W) > 0) S.area = trimZeros(fixed(mul(L, W), 2));
      }
      S.mode = m;
      syncInputs();
    }
    function onClick(e) {
      var b = e.target && e.target.closest ? e.target.closest('[data-act]') : null;
      if (!b || !root.contains(b) || b.disabled) return;
      var act = b.getAttribute('data-act'), val = b.getAttribute('data-val');
      if (act === 'add') { doAdd(b); return; }
      if (act === 'unit') switchUnit(val);
      else if (act === 'mode') switchMode(val);
      else if (act === 'pattern') S.pattern = val;
      else if (act === 'joint') S.joint = val;
      else if (act === 'grout') S.grout = val;
      else if (act === 'finish') S.finish = val;
      else return;
      recompute();
    }
    function doAdd(b) {
      if (!q || !q.ok) return;
      if (typeof options.onAdd === 'function') { options.onAdd(q, getState()); return; }
      if (win.GGBasket) {               // the store's demo basket (src/js/app.js listens for gg:basket-add)
        var note = tpl(T.basketNote, {
          area: areaText(q.area_m2, q.area_ft2), pattern: String(T.patterns[q.pattern] || q.pattern).toLowerCase(),
          waste: fmtNum(q.waste_pct, q.waste_pct % 1 ? 1 : 0)
        });
        emit(doc, 'gg:basket-add', { lines: q.lines.map(function (l, i) {
          return i === 0 ? { sku: l.sku, qty: l.qty, note: note } : { sku: l.sku, qty: l.qty };
        }), source: 'calculator', quote: q });
        return;
      }
      b.textContent = T.added;
    }
    function onInput(e) {
      var key = e.target && e.target.getAttribute && e.target.getAttribute('data-in');
      if (!key) return;
      S[key] = e.target.value;
      recompute();
    }
    function onToggle(e) {
      var key = e.target && e.target.getAttribute && e.target.getAttribute('data-kit');
      if (!key) return;
      S.kit[key] = !!e.target.checked;
      recompute();
    }
    function onSubmit(e) { e.preventDefault(); }
    function onView(e) {
      var b = e && e.detail;
      if (b !== 'home' && b !== 'trade') return;
      S.buyer = b;
      recompute();
    }
    root.addEventListener('click', onClick);
    root.addEventListener('input', onInput);
    root.addEventListener('change', onToggle);
    form.addEventListener('submit', onSubmit);
    if (viewEvent) doc.addEventListener(viewEvent, onView);

    function setVariation(vr) {
      variation = vr;
      data = dataFor(vr, options.data);
      var sku = typeof vr === 'string' ? vr : (vr && vr.sku);
      cur = (data && data.index && sku) ? (data.index[sku] || null) : null;
      fillSlots();
      recompute();
    }

    var plan = $('.ggc-plan');
    var ctl = {
      el: root,
      planEl: plan,
      planCanvas: plan ? plan.querySelector('canvas') : null,
      update: function (patch) {
        patch = patch || {};
        var sizes = ['length', 'width', 'area', 'edge'].some(function (k) { return patch[k] !== undefined; });
        if (patch.unit !== undefined) { if (sizes) S.unit = patch.unit === 'ft' ? 'ft' : 'm'; else switchUnit(patch.unit); }
        if (patch.mode !== undefined) switchMode(patch.mode);
        ['length', 'width', 'area', 'edge'].forEach(function (k) { if (patch[k] !== undefined) S[k] = String(patch[k]); });
        if (patch.pattern !== undefined) S.pattern = patch.pattern;
        if (patch.joint_mm !== undefined) S.joint = patch.joint_mm === null ? null : String(patch.joint_mm);
        if (patch.grout_sku !== undefined) S.grout = patch.grout_sku;
        if (patch.trim_finish !== undefined) S.finish = patch.trim_finish;
        if (patch.kit) for (var k in S.kit) if (patch.kit[k] !== undefined) S.kit[k] = !!patch.kit[k];
        if (patch.buyer === 'home' || patch.buyer === 'trade') S.buyer = patch.buyer;
        syncInputs();
        recompute();
        return ctl;
      },
      setVariation: function (vr) { setVariation(vr); return ctl; },
      setBuyer: function (b) { S.buyer = b === 'trade' ? 'trade' : 'home'; recompute(); return ctl; },
      getQuote: function () { return q; },
      getState: getState,
      destroy: function () {
        alive = false;
        if (liveTimer && win.clearTimeout) win.clearTimeout(liveTimer);
        root.removeEventListener('click', onClick);
        root.removeEventListener('input', onInput);
        root.removeEventListener('change', onToggle);
        form.removeEventListener('submit', onSubmit);
        if (viewEvent) doc.removeEventListener(viewEvent, onView);
        if (root.parentNode) root.parentNode.removeChild(root);
      }
    };

    syncInputs();
    setVariation(variation);
    return ctl;
  }

  /* ------------------------------------------------------------------ auto mount */
  // The store's product page has <div id="gg-calc" data-sku="..." data-variation='{...}'>: src/js/app.js keeps
  // both attributes up to date and fires gg:variation on it. Any element with data-gg-calc works the same way;
  // data-plan adds the room-drawing slot. Set window.GGCalcAutoMount = false before this script to switch it off.
  var MOUNT_SEL = '#gg-calc, [data-gg-calc]';
  var MOUNTS = typeof WeakMap === 'function' ? new WeakMap() : null;

  function readTarget(el) {
    var raw = el.getAttribute('data-variation');
    if (raw) { try { return JSON.parse(raw); } catch (e) { /* fall back to the SKU */ } }
    return el.getAttribute('data-sku') || null;
  }
  function mountOne(el, vr) {
    if (!MOUNTS || MOUNTS.has(el)) return MOUNTS ? MOUNTS.get(el) : null;
    vr = vr || readTarget(el);
    if (!vr) return null;               // nothing to show yet: the observer waits for the attributes
    var ctl = renderCalculator(el, vr, { plan: el.hasAttribute('data-plan') });
    MOUNTS.set(el, ctl);
    el.ggCalc = ctl;
    return ctl;
  }
  function watch(el) {
    if (el.getAttribute('data-gg-calc-watch') || typeof MutationObserver !== 'function') return;
    el.setAttribute('data-gg-calc-watch', '1');
    new MutationObserver(function () {
      var ctl = MOUNTS.get(el), vr = readTarget(el);
      if (!ctl) { mountOne(el, vr); return; }
      var sku = typeof vr === 'string' ? vr : (vr && vr.sku);
      if (vr && sku !== ctl.getState().sku) ctl.setVariation(vr);
    }).observe(el, { attributes: true, attributeFilter: ['data-variation', 'data-sku'] });
  }
  function autoMount(doc) {
    if (!MOUNTS || !doc || !doc.querySelectorAll) return;
    Array.prototype.forEach.call(doc.querySelectorAll(MOUNT_SEL), function (el) { watch(el); mountOne(el); });
  }
  function onVariation(e) {
    var el = e.target && e.target.closest ? e.target.closest(MOUNT_SEL) : null;
    var d = e.detail || {}, vr = d.variation || d.sku;
    if (!el || !vr || !MOUNTS) return;
    var ctl = MOUNTS.get(el);
    if (ctl) ctl.setVariation(vr); else mountOne(el, vr);
  }
  if (typeof document !== 'undefined' && document && document.addEventListener &&
      !(typeof window !== 'undefined' && window.GGCalcAutoMount === false)) {
    var go = function () { autoMount(document); };
    document.addEventListener('gg:variation', onVariation);
    document.addEventListener('DOMContentLoaded', go);
    if (document.readyState !== 'loading') go();
    setTimeout(go, 0);                  // other deferred scripts may fill the mount first
  }

  return {
    version: VERSION,
    mount: autoMount,
    computeQuote: computeQuote,
    renderCalculator: renderCalculator,
    setData: setData,
    getData: getData,
    prepare: prepare,
    wasteFor: wasteFor,
    messageFor: messageFor,
    format: { money: fmtMoney, num: fmtNum, fixed: fixed },
    TEXT: TEXT
  };
}));
