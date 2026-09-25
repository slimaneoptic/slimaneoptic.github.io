import { SAMPLES, ZONES, MARKETS, UNIT_TYPES, TECH } from "./data.js";
import { projector, area, edges, facing, buildable, scaleTo, isConvex } from "./geo.js";
import { study } from "./optimizer.js";
import { LANGS, getLang, setLang, t, applyStatic } from "./i18n.js";

const $ = s => document.querySelector(s);
let lang = getLang();
const tr = (k, v) => t(lang, k, v);
const EMPTY = { type: "FeatureCollection", features: [] };
const COLORS = { shops: "#B7862B", envelope: "#3A7CA5", street: "#B7862B" };

// ---------------------------------------------------------------- state

function fromSample(key) {
  const s = SAMPLES[key], z = ZONES[s.zone], m = MARKETS[z.city];
  return {
    sample: key, name: s.name, place: s.place, ring: s.ring.map(p => [...p]), street: s.street, zone: s.zone,
    rules: { ...z }, land: s.land,
    market: { commerce: m.commerce, parking: m.parking, build: m.build, basement: m.basement },
    units: UNIT_TYPES.map(u => ({ ...u, price: m.price[u.id] })),
    tech: { ...TECH },
  };
}

let state = fromSample("zerktouni");
let result = null;

function geometry() {
  const pr = projector(state.ring);
  const pts = state.ring.map(pr.toXY);
  const A = Math.abs(area(pts));
  const r = state.rules;
  const bld = buildable(pts, state.street, { street: r.street, rear: r.rear, side: r.side });
  const Bp = bld.poly.length >= 3 ? Math.abs(area(bld.poly)) : 0;
  return { pr, pts, A, bld, Bp, F: Math.min(Bp, r.emprise / 100 * A), es: edges(pts), convex: isConvex(pts) };
}

function params(g) {
  const r = state.rules, m = state.market;
  return {
    A: g.A, F: g.F, empriseArea: g.F, emprisePct: r.emprise, cos: r.cos, levels: r.levels, hmax: r.hmax, rdcH: r.rdcH, floorH: r.floorH,
    commerce: r.commerce, parkRes: r.parkRes, parkCom: r.parkCom, units: state.units.map(u => ({ ...u })),
    priceCom: m.commerce, priceParking: m.parking, build: m.build, basement: m.basement, land: state.land * g.A, ...state.tech,
  };
}

// ---------------------------------------------------------------- formatting

const nf = d => new Intl.NumberFormat(LANGS[lang].locale, { maximumFractionDigits: d, minimumFractionDigits: 0 });
const num = (v, d = 0) => nf(d).format(v);
function money(v, sign = false) {
  const a = Math.abs(v);
  const s = a >= 1e6 ? `${nf(2).format(a / 1e6)} ${tr("unit.mdh")}` : a >= 1e3 ? `${nf(0).format(a / 1e3)} ${tr("unit.kdh")}` : `${nf(0).format(a)} ${tr("unit.dh")}`;
  return (v < 0 ? "−" : sign ? "+" : "") + s;
}
const pct = v => `${num(v, 1)} %`;
const levelName = k => (k === 0 ? tr("level.rdc") : `R+${k}`);
const ZONE_LABEL = { "A1-AUC": "A1 · AUC", "B5-AUC": "B5 · AUC", "B5M-AUC": "B5-M · AUC", "SAG-AUM": "SA-G · AUM" };
const zoneLabel = z => ZONE_LABEL[z] || tr("rules.custom");
const parcelName = () => (state.sample ? state.name : tr("parcel.custom"));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---------------------------------------------------------------- forms

const RULES = [
  ["cos", "rules.cos", 0.1, 0.1, 12], ["emprise", "rules.emprise", 1, 10, 100], ["levels", "rules.levels", 1, 0, 20], ["hmax", "rules.hmax", 0.5, 3, 80],
  ["street", "rules.street", 0.5, 0, 20], ["rear", "rules.rear", 0.5, 0, 20], ["side", "rules.side", 0.5, 0, 20],
  ["rdcH", "rules.rdcH", 0.1, 2.5, 7], ["floorH", "rules.floorH", 0.1, 2.5, 5], ["parkRes", "rules.parkRes", 0.1, 0, 5], ["parkCom", "rules.parkCom", 0.1, 0, 10],
];
const PRICES = [["commerce", "market.commerce", 500], ["parking", "market.parking", 5000]];
const COSTS = [
  [() => state.land, v => (state.land = v), "market.land", 500], ["build", "market.build", 100], ["basement", "market.basement", 100],
  ["t:fees", "market.fees", 0.5], ["t:marketing", "market.marketing", 0.5], ["t:premium", "market.premium", 0.1], ["t:rdcDiscount", "market.rdcDiscount", 1],
];

function field(id, label, value, step, min = 0, max = 1e9) {
  return `<div class="field"><label for="${id}">${esc(label)}</label><input type="number" id="${id}" value="${value}" step="${step}" min="${min}" max="${max}"></div>`;
}
function checkbox(id, label, checked) {
  return `<div class="field check"><input type="checkbox" id="${id}" ${checked ? "checked" : ""}><label for="${id}">${esc(label)}</label></div>`;
}

function renderForms() {
  $("#zone").innerHTML = Object.keys(ZONES).map(k => `<option value="${k}" ${state.zone === k ? "selected" : ""}>${ZONE_LABEL[k]}</option>`).join("")
    + `<option value="custom" ${state.zone === "custom" ? "selected" : ""}>${esc(tr("rules.custom"))}</option>`;
  $("#rules").innerHTML = RULES.map(([k, l, s, mi, ma]) => field(`r-${k}`, tr(l), state.rules[k], s, mi, ma)).join("") + checkbox("r-commerce", tr("rules.commerce"), state.rules.commerce);
  $("#types").innerHTML = `<thead><tr><th></th><th>${tr("market.area")}</th><th>DH/m²</th><th>${tr("market.min")}</th><th>${tr("market.max")}</th></tr></thead><tbody>`
    + state.units.map((u, i) => `<tr><td>${esc(tr("type." + u.id))}</td><td><input type="number" data-u="${i}" data-k="area" value="${u.area}" step="1" min="15"></td>`
      + `<td><input type="number" data-u="${i}" data-k="price" value="${u.price}" step="250" min="0"></td>`
      + `<td><input type="number" data-u="${i}" data-k="minShare" value="${Math.round(u.minShare * 100)}" step="5" min="0" max="100"></td>`
      + `<td><input type="number" data-u="${i}" data-k="maxShare" value="${Math.round(u.maxShare * 100)}" step="5" min="0" max="100"></td></tr>`).join("") + "</tbody>";
  $("#prices").innerHTML = PRICES.map(([k, l, s]) => field(`m-${k}`, tr(l), state.market[k], s)).join("") + checkbox("m-sell", tr("market.sellParking"), state.tech.sellParking);
  $("#costs").innerHTML = COSTS.map((c, i) => {
    const [key, l, s] = typeof c[0] === "function" ? [null, c[2], c[3]] : c;
    const v = typeof c[0] === "function" ? c[0]() : key.startsWith("t:") ? state.tech[key.slice(2)] : state.market[key];
    return field(`c-${i}`, tr(l), v, s);
  }).join("");
}

function bindForms() {
  $("#zone").addEventListener("change", e => {
    const k = e.target.value;
    if (k !== "custom") {
      state.zone = k;
      state.rules = { ...ZONES[k] };
      const m = MARKETS[ZONES[k].city];
      state.market = { commerce: m.commerce, parking: m.parking, build: m.build, basement: m.basement };
      state.units = state.units.map(u => ({ ...u, price: m.price[u.id] }));
    } else state.zone = "custom";
    renderForms(); schedule();
  });
  document.querySelector(".tabs").addEventListener("input", e => {
    const el = e.target, id = el.id || "", v = el.type === "checkbox" ? el.checked : parseFloat(el.value);
    if (el.type !== "checkbox" && !Number.isFinite(v)) return;
    if (id.startsWith("r-")) {
      state.rules[id.slice(2)] = v;
      if (state.zone !== "custom") { state.zone = "custom"; $("#zone").value = "custom"; }
    } else if (el.dataset.u !== undefined) {
      const u = state.units[+el.dataset.u], k = el.dataset.k;
      u[k] = k.endsWith("Share") ? v / 100 : v;
    } else if (id === "m-sell") state.tech.sellParking = v;
    else if (id.startsWith("m-")) state.market[id.slice(2)] = v;
    else if (id.startsWith("c-")) {
      const c = COSTS[+id.slice(2)];
      if (typeof c[0] === "function") c[1](v);
      else if (c[0].startsWith("t:")) state.tech[c[0].slice(2)] = v;
      else state.market[c[0]] = v;
    } else return;
    schedule();
  });
  $("#street").addEventListener("change", e => { state.street = +e.target.value; schedule(); });
}

function renderSamples() {
  $("#samples").innerHTML = Object.entries(SAMPLES).map(([k, s]) => {
    const z = k === state.sample;
    return `<button class="sample" data-sample="${k}" aria-pressed="${z}" type="button"><b>${esc(s.name)}</b><small>${esc(s.place)} · ${ZONE_LABEL[s.zone]}</small></button>`;
  }).join("");
}

function renderFacts(g) {
  $("#facts").innerHTML = [
    [tr("parcel.area"), `${num(g.A)} m²`],
    [tr("parcel.buildable"), `${num(g.Bp)} m²`],
    [tr("parcel.footprint"), `${num(g.F)} m²`],
  ].map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join("");
  $("#street").innerHTML = g.es.map(e => `<option value="${e.i}" ${e.i === state.street ? "selected" : ""}>${esc(tr("parcel.side"))} ${e.i + 1} · ${num(e.len, 1)} m · ${esc(tr("parcel.facing"))} ${esc(tr("dir." + facing(e)))}</option>`).join("");
  $("#convex").hidden = g.convex;
}

// ---------------------------------------------------------------- map

const map = new maplibregl.Map({
  container: "map", style: "https://tiles.openfreemap.org/styles/liberty",
  center: [-7.63444, 33.58833], zoom: 18.2, pitch: 60, bearing: -28, maxPitch: 75,
  antialias: true, canvasContextAttributes: { preserveDrawingBuffer: true }, preserveDrawingBuffer: true,
});
map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");
let mapReady = false;
const src = (id, data) => map.getSource(id) && map.getSource(id).setData(data);
const poly = (ring, props = {}) => ({ type: "Feature", properties: props, geometry: { type: "Polygon", coordinates: [[...ring, ring[0]]] } });

map.on("load", () => {
  if (map.getLayer("building-3d")) {  // neighbours: flat footprints by default, so they never hide the project
    map.setPaintProperty("building-3d", "fill-extrusion-color", "#E2E6E4");
    map.setPaintProperty("building-3d", "fill-extrusion-opacity", 0.6);
    map.setLayoutProperty("building-3d", "visibility", "none");
  }
  for (const id of ["parcel", "street", "buildable", "envelope", "building", "draw"]) map.addSource(`p-${id}`, { type: "geojson", data: EMPTY });
  map.addLayer({ id: "p-parcel-fill", type: "fill", source: "p-parcel", paint: { "fill-color": "#0E6B5C", "fill-opacity": 0.08 } });
  map.addLayer({ id: "p-parcel-line", type: "line", source: "p-parcel", paint: { "line-color": "#0F1B24", "line-width": 2.2 } });
  map.addLayer({ id: "p-street-line", type: "line", source: "p-street", paint: { "line-color": COLORS.street, "line-width": 5 } });
  map.addLayer({ id: "p-buildable-line", type: "line", source: "p-buildable", paint: { "line-color": COLORS.envelope, "line-width": 1.6, "line-dasharray": [2, 2] } });
  map.addLayer({ id: "p-building", type: "fill-extrusion", source: "p-building", paint: { "fill-extrusion-color": ["get", "color"], "fill-extrusion-base": ["get", "base"], "fill-extrusion-height": ["get", "top"], "fill-extrusion-opacity": 0.96 } });
  map.addLayer({ id: "p-envelope", type: "fill-extrusion", source: "p-envelope", paint: { "fill-extrusion-color": COLORS.envelope, "fill-extrusion-base": 0, "fill-extrusion-height": ["get", "h"], "fill-extrusion-opacity": 0.14 } });
  map.addLayer({ id: "p-draw-line", type: "line", source: "p-draw", paint: { "line-color": "#B3261E", "line-width": 2, "line-dasharray": [1.5, 1] } });
  map.addLayer({ id: "p-draw-pts", type: "circle", source: "p-draw", filter: ["==", "$type", "Point"], paint: { "circle-radius": 5, "circle-color": "#fff", "circle-stroke-color": "#B3261E", "circle-stroke-width": 2 } });
  mapReady = true;
  run();
});

function drawGeometry(g) {
  if (!mapReady) return;
  src("p-parcel", { type: "FeatureCollection", features: [poly(state.ring)] });
  const e = g.es[state.street];
  src("p-street", e ? { type: "FeatureCollection", features: [{ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [g.pr.toLonLat(e.a), g.pr.toLonLat(e.b)] } }] } : EMPTY);
  const b = g.bld.poly.map(g.pr.toLonLat);
  src("p-buildable", b.length >= 3 ? { type: "FeatureCollection", features: [poly(b)] } : EMPTY);
  src("p-envelope", b.length >= 3 ? { type: "FeatureCollection", features: [poly(b, { h: state.rules.hmax })] } : EMPTY);
}

function flatColor(k, n) {  // green, lighter as the floors rise
  const a = [14, 107, 92], b = [102, 184, 164], f = n > 1 ? (k - 1) / (n - 1) : 0;
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * f)).join(",")})`;
}

function drawBuilding(g, best) {
  if (!mapReady) return;
  if (!best || g.bld.poly.length < 3) { src("p-building", EMPTY); return; }
  const top = best.levels.length - 1;
  let base = 0;
  const feats = best.levels.map(l => {
    const plate = scaleTo(g.bld.poly, Math.min(l.gross, g.Bp)).map(g.pr.toLonLat);
    const color = l.use === "shops" ? COLORS.shops : flatColor(Math.max(1, l.k), Math.max(1, top));
    const f = poly(plate, { base, top: base + l.height - 0.2, color });
    base += l.height;
    return f;
  });
  src("p-building", { type: "FeatureCollection", features: feats });
}

function fit(g) {
  if (!mapReady) return;
  const c = g.pr.toLonLat([0, 0]);
  map.easeTo({ center: c, zoom: 18.2, duration: 900 });
}

$(".view").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.view === "nb") {
    const on = b.getAttribute("aria-pressed") !== "true";
    b.setAttribute("aria-pressed", String(on));
    if (map.getLayer("building-3d")) map.setLayoutProperty("building-3d", "visibility", on ? "visible" : "none");
    return;
  }
  document.querySelectorAll(".view button[data-view='3d'], .view button[data-view='2d']").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  map.easeTo(b.dataset.view === "3d" ? { pitch: 60, bearing: -28 } : { pitch: 0, bearing: 0 });
});

// drawing a parcel
let drawing = null;
function updateDraw() {
  if (!drawing) { src("p-draw", EMPTY); return; }
  const feats = drawing.map(p => ({ type: "Feature", properties: {}, geometry: { type: "Point", coordinates: p } }));
  if (drawing.length > 1) feats.push({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: drawing.length > 2 ? [...drawing, drawing[0]] : drawing } });
  src("p-draw", { type: "FeatureCollection", features: feats });
}
function startDraw() {
  drawing = []; map.doubleClickZoom.disable(); map.getCanvas().style.cursor = "crosshair";
  $("#drawbar").classList.add("on"); map.easeTo({ pitch: 0, bearing: 0 }); updateDraw();
}
function stopDraw() {
  const pts = drawing; drawing = null; map.getCanvas().style.cursor = ""; $("#drawbar").classList.remove("on");
  setTimeout(() => map.doubleClickZoom.enable(), 300); updateDraw(); return pts;
}
function finishDraw() {
  const raw = stopDraw();
  if (!raw) return;
  const ring = raw.filter((p, i) => i === 0 || Math.hypot(p[0] - raw[i - 1][0], p[1] - raw[i - 1][1]) > 2e-7);
  if (ring.length < 3) return;
  const pr = projector(ring);
  if (area(ring.map(pr.toXY)) < 0) ring.reverse();
  const es = edges(ring.map(pr.toXY));
  state = { ...state, sample: null, name: tr("parcel.custom"), place: "", ring, street: es.reduce((a, e) => (e.len > es[a].len ? e.i : a), 0) };
  renderSamples(); map.easeTo({ pitch: 60, bearing: -28 }); schedule();
}
map.on("click", e => { if (drawing) { drawing.push([e.lngLat.lng, e.lngLat.lat]); updateDraw(); } });
map.on("dblclick", e => { if (drawing) { e.preventDefault(); finishDraw(); } });
$("#draw").addEventListener("click", startDraw);
$("#finish").addEventListener("click", finishDraw);
$("#cancel").addEventListener("click", () => stopDraw());

// ---------------------------------------------------------------- run

let timer = null, runId = 0;
function schedule() { clearTimeout(timer); timer = setTimeout(run, 350); }

async function run() {
  if (!mapReady) return;
  const id = ++runId;
  const g = geometry();
  renderFacts(g); drawGeometry(g);
  $("#busy").classList.add("on");
  $("#status").textContent = tr("result.computing");
  await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
  const t0 = performance.now();
  let res = null;
  try { res = await study(params(g)); } catch (err) { console.error(err); }
  if (id !== runId) return;
  result = res ? { ...res, g, ms: Math.round(performance.now() - t0) } : { best: null, g, ms: 0 };
  $("#busy").classList.remove("on");
  renderResults(); drawBuilding(g, result.best); writeHash();
}

// ---------------------------------------------------------------- results

function kpi(v, l, d = "", cls = "") {
  return `<div class="kpi ${cls}"><div class="v">${v}</div><div class="l">${esc(l)}</div>${d ? `<div class="d">${d}</div>` : ""}</div>`;
}

function whyChart(byLevels, bestLevels) {
  const vals = byLevels.map(b => b.margin);
  const valid = vals.filter(v => v !== null);
  if (!valid.length) return "";
  const W = 400, H = 170, pad = 22, bw = (W - 2 * pad) / vals.length;
  const max = Math.max(0, ...valid), min = Math.min(0, ...valid), span = max - min || 1;
  const y = v => pad + (max - v) / span * (H - 2 * pad - 14);
  let out = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(tr("why.title"))}">`;
  out += `<line x1="${pad}" x2="${W - pad}" y1="${y(0)}" y2="${y(0)}" stroke="#9AA6A2" stroke-width="1"/>`;
  vals.forEach((v, i) => {
    const x = pad + i * bw + bw * 0.18, w = bw * 0.64;
    if (v !== null) {
      const top = Math.min(y(v), y(0)), h = Math.max(1, Math.abs(y(v) - y(0)));
      out += `<rect x="${x}" y="${top}" width="${w}" height="${h}" rx="2" fill="${i === bestLevels ? "#0E6B5C" : "#C6D1CD"}"/>`;
      out += `<text x="${x + w / 2}" y="${v >= 0 ? top - 4 : top + h + 11}" text-anchor="middle">${nf(1).format(v / 1e6)}</text>`;
    }
    out += `<text x="${x + w / 2}" y="${H - 4}" text-anchor="middle">${i === 0 ? tr("level.rdc") : "R+" + i}</text>`;
  });
  return out + "</svg>";
}

function renderResults() {
  const box = $("#results");
  const { best, naive, byLevels, sensitivity, ms } = result || {};
  if (!best) {
    $("#status").textContent = "";
    box.innerHTML = `<p class="note warn">${esc(tr("result.infeasible"))}</p>`;
    $("#summary").hidden = true;
    return;
  }
  const n = 2 + byLevels.length + sensitivity.length;
  $("#status").textContent = tr("result.solver", { ms: num(ms), n });
  const bestLv = best.levels.length - 1, gain = naive ? best.margin - naive.margin : 0;
  const sellable = best.levels.reduce((s, l) => s + l.net, 0);
  let h = `<div class="kpis">`
    + kpi(money(best.margin), tr("kpi.margin"), naive ? `<span>${esc(tr("kpi.vsNaive", { d: money(gain, true) }))}</span>` : "", "main")
    + kpi(pct(best.marginPct), tr("kpi.marginPct"))
    + kpi(money(best.totalRevenue), tr("kpi.revenue"))
    + kpi(num(best.units), tr("kpi.units"), esc(tr("kpi.sellable", { a: num(sellable) })))
    + kpi(`R+${bestLv}`, tr("kpi.levels"), esc(tr("kpi.height", { h: num(best.height, 1) })))
    + `</div>`;

  // comparison with the usual program
  if (naive) {
    const row = (label, a, b, better = null) => `<tr><td>${esc(label)}</td><td class="${better === "a" ? "best" : ""}">${a}</td><td class="${better === "b" ? "best" : ""}">${b}</td></tr>`;
    h += `<h3>${esc(tr("compare.title"))}</h3><div class="tw"><table class="data"><thead><tr><th></th><th>${esc(tr("compare.best"))}</th><th>${esc(tr("compare.naive"))}</th></tr></thead><tbody>`
      + row(tr("kpi.levels"), `R+${bestLv}`, `R+${naive.levels.length - 1}`)
      + row(tr("kpi.units"), num(best.units), num(naive.units))
      + state.units.map(u => row(tr("type." + u.id), num(best.byType[u.id]), num(naive.byType[u.id]))).join("")
      + row(tr("use.shops"), `${num(best.sol.c)} m²`, `${num(naive.sol.c)} m²`)
      + row(tr("use.parking"), num(best.spaces), num(naive.spaces))
      + row(tr("kpi.revenue"), money(best.totalRevenue), money(naive.totalRevenue))
      + row(tr("bilan.total") + " " + tr("bilan.costs").toLowerCase(), money(best.totalCost), money(naive.totalCost))
      + row(tr("kpi.margin"), money(best.margin), money(naive.margin), best.margin >= naive.margin ? "a" : "b")
      + row(tr("kpi.marginPct"), pct(best.marginPct), pct(naive.marginPct))
      + `</tbody></table></div><p class="hint">${esc(tr("compare.naiveHelp"))}</p>`;
  }

  // level by level
  h += `<h3>${esc(tr("program.title"))}</h3><div class="tw">${programTable(best)}</div>`;

  // why this height
  h += `<h3>${esc(tr("why.title"))}</h3><p class="hint">${esc(tr("why.help"))}</p>${whyChart(byLevels, bestLv)}`
    + `<p class="hint">${esc(bestLv < state.rules.levels ? tr("why.stop", { n: bestLv }) : tr("why.max"))}</p>`;

  // sensitivity
  h += `<h3>${esc(tr("sens.title"))}</h3><table class="data"><thead><tr><th>${esc(tr("sens.case"))}</th><th>${esc(tr("sens.margin"))}</th><th>${esc(tr("sens.program"))}</th></tr></thead><tbody>`
    + sensitivity.map(s => `<tr><td>${esc(tr("sens." + s.id))}</td><td>${s.margin === null ? "–" : money(s.margin)}</td><td>${s.margin === null ? "–" : esc(s.same ? tr("sens.same") : tr("sens.changed", { l: s.levels, u: s.units }))}</td></tr>`).join("")
    + `</tbody></table>`;

  // rule checks
  h += `<h3>${esc(tr("checks.title"))}</h3>${checksList(best)}`;

  // feasibility statement
  h += `<h3>${esc(tr("bilan.title"))}</h3><div class="tw">${bilanTable(best, naive)}</div>`;

  h += `<div class="actions"><button class="btn green" id="print" type="button">${esc(tr("actions.print"))}</button>`
    + `<button class="btn ghost" id="csv" type="button">${esc(tr("actions.csv"))}</button>`
    + `<button class="btn ghost" id="share" type="button">${esc(tr("actions.share"))}</button></div>`;
  box.innerHTML = h;
  $("#print").addEventListener("click", printNote);
  $("#csv").addEventListener("click", exportCsv);
  $("#share").addEventListener("click", share);

  const s = $("#summary");
  s.hidden = false;
  s.innerHTML = `<div class="l">${esc(parcelName())}${state.place ? " · " + esc(state.place) : ""} · ${esc(zoneLabel(state.zone))}</div>`
    + `<div class="v">${money(best.margin)} · R+${bestLv} · ${num(best.units)} ${esc(tr("kpi.units").toLowerCase())}</div>`
    + `<div class="l">${esc(tr("kpi.vsNaive", { d: money(gain, true) }))}</div>`;
}

function programTable(best) {
  const T = state.units;
  let rows = [...best.levels].reverse().map(l => `<tr><td>${levelName(l.k)}</td><td><span class="swatch" style="background:${l.use === "shops" ? COLORS.shops : "#0E6B5C"}"></span>${esc(tr("use." + l.use))}</td>`
    + T.map((u, t) => `<td>${l.use === "shops" && l.k === 0 && !l.counts.some(c => c) ? "" : l.counts[t] || ""}</td>`).join("")
    + `<td>${num(l.net)}</td><td>${num(l.gross)}</td></tr>`).join("");
  const cap = best.basements ? Math.round(best.spaces / best.basements) : 0;
  for (let b = 1; b <= best.basements; b++) {
    rows += `<tr class="sub"><td>${esc(tr("level.basement", { n: -b }))}</td><td>${esc(tr("use.parking"))}</td><td colspan="${T.length}">${esc(tr("program.spaces", { n: cap }))}</td><td></td><td></td></tr>`;
  }
  const net = best.levels.reduce((s, l) => s + l.net, 0);
  rows += `<tr class="sum"><td>${esc(tr("program.total"))}</td><td></td>${T.map(u => `<td>${best.byType[u.id] || ""}</td>`).join("")}<td>${num(net)}</td><td>${num(best.gfa)}</td></tr>`;
  return `<table class="data"><thead><tr><th>${esc(tr("program.level"))}</th><th>${esc(tr("program.use"))}</th>${T.map(u => `<th>${esc(tr("type." + u.id))}</th>`).join("")}<th>${esc(tr("program.net"))}</th><th>${esc(tr("program.gross"))}</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function checksList(best) {
  const items = best.checks.map(c => {
    let label, value;
    if (c.id === "cos") { label = tr("check.cos"); value = `${num(c.value, 2)} / ${num(c.limit, 2)}`; }
    else if (c.id === "emprise") { label = tr("check.emprise"); value = `${num(c.value)} % / ${num(c.limit)} %`; }
    else if (c.id === "height") { label = tr("check.height"); value = `${num(c.value, 1)} m / ${num(c.limit, 1)} m`; }
    else if (c.id === "levels") { label = tr("check.levels"); value = `R+${c.value} / R+${c.limit}`; }
    else if (c.id === "parking") { label = tr("check.parking"); value = tr("check.places", { v: num(c.value), l: num(c.limit) }); }
    else { label = tr("check.mix", { t: tr("type." + c.type).toLowerCase() }); value = `${num(c.value)} % (${num(c.min)}–${num(c.max)} %)`; }
    return `<li class="${c.ok ? "" : "ko"}"><b>${esc(label)}</b><span>${esc(value)}</span></li>`;
  });
  return `<ul class="checks">${items.join("")}</ul>`;
}

function bilanTable(best, naive) {
  const cols = naive ? [best, naive] : [best];
  const line = (label, f, cls = "") => `<tr class="${cls}"><td>${esc(label)}</td>${cols.map(r => `<td>${f(r)}</td>`).join("")}</tr>`;
  return `<table class="data"><thead><tr><th></th><th>${esc(tr("compare.best"))}</th>${naive ? `<th>${esc(tr("compare.naive"))}</th>` : ""}</tr></thead><tbody>`
    + line(tr("bilan.revenue"), () => "", "sub")
    + line(tr("bilan.flats"), r => money(r.revenue.flats))
    + line(tr("bilan.shops"), r => money(r.revenue.shops))
    + line(tr("bilan.parking"), r => money(r.revenue.parking))
    + line(tr("bilan.total"), r => money(r.totalRevenue), "sum")
    + line(tr("bilan.costs"), () => "", "sub")
    + line(tr("bilan.land"), r => money(r.cost.land))
    + line(tr("bilan.construction"), r => money(r.cost.construction))
    + line(tr("bilan.basements"), r => money(r.cost.basements))
    + line(tr("bilan.fees"), r => money(r.cost.fees))
    + line(tr("bilan.marketing"), r => money(r.cost.marketing))
    + line(tr("bilan.total"), r => money(r.totalCost), "sum")
    + line(tr("bilan.margin"), r => money(r.margin), "sum")
    + line(tr("bilan.marginRev"), r => pct(r.marginPct))
    + line(tr("bilan.marginCost"), r => pct(r.marginOnCost))
    + `</tbody></table>`;
}

// ---------------------------------------------------------------- exports

function printNote() {
  const { best, naive } = result;
  let img = "";
  try { img = map.getCanvas().toDataURL("image/png"); } catch (e) { /* tainted canvas: skip the picture */ }
  $("#report").innerHTML = `<p class="meta">Parcelle+ · ${new Date().toLocaleDateString(LANGS[lang].locale)}</p>`
    + `<h1>${esc(tr("report.title"))}</h1>`
    + `<p class="meta">${esc(tr("report.parcel"))} : ${esc(parcelName())}${state.place ? ", " + esc(state.place) : ""} · ${num(result.g.A)} m² · ${esc(tr("report.zone"))} ${esc(zoneLabel(state.zone))}</p>`
    + `<div class="kpis">${kpi(money(best.margin), tr("kpi.margin"), naive ? esc(tr("kpi.vsNaive", { d: money(best.margin - naive.margin, true) })) : "", "main")}${kpi(pct(best.marginPct), tr("kpi.marginPct"))}${kpi(money(best.totalRevenue), tr("kpi.revenue"))}${kpi(`R+${best.levels.length - 1}`, tr("kpi.levels"), esc(tr("kpi.units")) + " : " + num(best.units))}</div>`
    + (img ? `<img src="${img}" alt="">` : "")
    + `<h2>${esc(tr("program.title"))}</h2>${programTable(best)}`
    + `<h2>${esc(tr("bilan.title"))}</h2>${bilanTable(best, naive)}`
    + `<h2>${esc(tr("checks.title"))}</h2>${checksList(best)}`
    + `<p class="meta" style="margin-top:6mm">${esc(tr("report.disclaimer"))}</p>`;
  setTimeout(() => window.print(), 150);
}

function exportCsv() {
  const { best, naive } = result;
  const sep = lang === "en" ? "," : ";";
  const q = v => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [[tr("program.level"), tr("program.use"), ...state.units.map(u => tr("type." + u.id)), tr("program.net"), tr("program.gross")].map(q).join(sep)];
  [...best.levels].reverse().forEach(l => lines.push([levelName(l.k), tr("use." + l.use), ...l.counts, Math.round(l.net), Math.round(l.gross)].map(q).join(sep)));
  lines.push("", [q(tr("bilan.title")), q(tr("compare.best")), q(tr("compare.naive"))].join(sep));
  const rows = [["bilan.flats", r => r.revenue.flats], ["bilan.shops", r => r.revenue.shops], ["bilan.parking", r => r.revenue.parking], ["bilan.land", r => r.cost.land],
    ["bilan.construction", r => r.cost.construction], ["bilan.basements", r => r.cost.basements], ["bilan.fees", r => r.cost.fees], ["bilan.marketing", r => r.cost.marketing],
    ["bilan.margin", r => r.margin]];
  rows.forEach(([k, f]) => lines.push([tr(k), Math.round(f(best)), naive ? Math.round(f(naive)) : ""].map(q).join(sep)));
  const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `parcelle-${(state.sample || "parcelle")}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function encodeState() {
  const s = { v: 1, s: state.sample, st: state.street, z: state.zone, ru: state.rules, l: state.land, mk: state.market, u: state.units.map(u => [u.area, u.price, u.minShare, u.maxShare]), te: state.tech };
  if (!state.sample) { s.r = state.ring.map(p => [+p[0].toFixed(7), +p[1].toFixed(7)]); s.n = state.name; }
  return btoa(unescape(encodeURIComponent(JSON.stringify(s)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function decodeState(h) {
  try {
    const s = JSON.parse(decodeURIComponent(escape(atob(h.replace(/-/g, "+").replace(/_/g, "/")))));
    const base = s.s && SAMPLES[s.s] ? fromSample(s.s) : fromSample("zerktouni");
    if (s.r) { base.ring = s.r; base.sample = null; base.name = s.n || "Parcelle"; base.place = ""; }
    return { ...base, street: s.st ?? base.street, zone: s.z || base.zone, rules: { ...base.rules, ...s.ru }, land: s.l ?? base.land, market: { ...base.market, ...s.mk },
      units: base.units.map((u, i) => (s.u && s.u[i] ? { ...u, area: s.u[i][0], price: s.u[i][1], minShare: s.u[i][2], maxShare: s.u[i][3] } : u)), tech: { ...base.tech, ...s.te } };
  } catch (e) { return null; }
}
function writeHash() { history.replaceState(null, "", `${location.pathname}${location.search}#p=${encodeState()}`); }
async function share() {
  writeHash();
  try { await navigator.clipboard.writeText(location.href); } catch (e) { /* clipboard blocked: the address bar has the link */ }
  const b = $("#share"); b.textContent = tr("actions.copied"); setTimeout(() => (b.textContent = tr("actions.share")), 1800);
}

// ---------------------------------------------------------------- tabs, language, start

function showTab(name) {
  document.querySelectorAll(".steps button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.tab === name)));
  document.querySelectorAll(".tab").forEach(s => (s.hidden = s.id !== `tab-${name}`));
}
document.querySelector(".steps").addEventListener("click", e => { const b = e.target.closest("button"); if (b) showTab(b.dataset.tab); });

$("#samples").addEventListener("click", e => {
  const b = e.target.closest("[data-sample]"); if (!b) return;
  state = fromSample(b.dataset.sample);
  renderSamples(); renderForms(); fit(geometry()); schedule();
});

document.querySelectorAll("[data-lang]").forEach(b => b.addEventListener("click", () => {
  lang = b.dataset.lang; setLang(lang); applyStatic(lang);
  renderSamples(); renderForms();
  if (result) { renderFacts(result.g); renderResults(); }
}));

(function start() {
  const hash = new URLSearchParams(location.hash.slice(1)).get("p");
  const sample = new URLSearchParams(location.search).get("sample");
  const fromHash = hash ? decodeState(hash) : null;
  if (fromHash) state = fromHash;
  else if (sample && SAMPLES[sample]) state = fromSample(sample);
  applyStatic(lang);
  renderSamples(); renderForms(); bindForms();
  const g = geometry();
  map.jumpTo({ center: g.pr.toLonLat([0, 0]) });
  showTab("result");
})();
