// Building-program optimizer: a mixed-integer model solved in the browser by HiGHS (WebAssembly).
//
// Decisions: which floors to build, how many units of each type on each floor, shops or flats on the
// ground floor (and how much shop area), and how many basement parking levels.
// Rules: floor-area ratio (COS), footprint, height, number of levels, parking ratio, unit-mix shares.
// Objective: developer margin = revenue - (land + construction + basements + fees) - marketing.
// "Naive" mode is the usual rule of thumb for comparison: fill the COS with a 50/50 two/three-room mix.

const HIGHS_URL = "https://cdn.jsdelivr.net/npm/highs@1.15.3/build/";
let highsPromise = null;

export function loadSolver() {
  if (!highsPromise) {
    highsPromise = import(HIGHS_URL + "highs.mjs").then(m => m.default({ locateFile: f => HIGHS_URL + f }));
  }
  return highsPromise;
}

const f = v => (Math.abs(v) < 1e-12 ? "0" : Number(v.toPrecision(12)).toString());
const term = (coef, name) => `${coef >= 0 ? "+" : "-"} ${f(Math.abs(coef))} ${name}`;

export function derived(p) {
  const Nmax = Math.max(0, (p.F - p.core) * p.eff);
  const Ncom = Math.max(0, (p.F - p.core) * p.effCom);
  const basementArea = p.A * p.basementUse;
  const cap = Math.floor(basementArea / p.space);
  return { Nmax, Ncom, basementArea, cap };
}

function unitFactor(p, k) {  // price factor of a flat on level k (0 = ground floor)
  return k === 0 ? 1 - p.rdcDiscount / 100 : 1 + (p.premium / 100) * k;
}

export function buildLP(p, mode = "best", fixLevels = null) {
  const { Nmax, Ncom, basementArea, cap } = derived(p);
  const n = p.levels, T = p.units, K = n + 1;
  const mk = 1 - p.marketing / 100, fe = 1 + p.fees / 100;
  const x = (k, t) => `x_${k}_${T[t].id}`;
  const obj = [], rows = [], bounds = [], ints = [], bins = [];

  // objective in thousands of dirhams
  for (let k = 0; k < K; k++) for (let t = 0; t < T.length; t++) {
    const a = T[t].area;
    const value = mode === "naive" ? a / p.eff : (a * T[t].price * unitFactor(p, k) * mk - fe * p.build * a / p.eff) / 1000;
    obj.push(term(value, x(k, t)));
    bounds.push(`0 <= ${x(k, t)} <= ${Math.floor(Nmax / a)}`);
    ints.push(x(k, t));
  }
  for (let k = 1; k < K; k++) {
    obj.push(term(mode === "naive" ? p.core : -fe * p.build * p.core / 1000, `y_${k}`));
    bins.push(`y_${k}`);
  }
  obj.push(term(mode === "naive" ? 1 / p.effCom : (p.priceCom * mk - fe * p.build / p.effCom) / 1000, "c"));
  obj.push(term(mode === "naive" ? -1e-3 : -fe * p.basement * basementArea / 1000, "b"));
  obj.push(term(mode === "naive" || !p.sellParking ? 0 : p.priceParking * mk / 1000, "sp"));
  ints.push("sp");
  obj.push(term(0, "g"));
  bins.push("g");
  bounds.push(`0 <= c <= ${f(Ncom)}`, `0 <= b <= ${p.basementMax}`);
  ints.push("b");
  if (!p.commerce || Ncom <= 0) bounds.push("g = 0");

  // capacity of each level
  rows.push(`cap0: ${T.map((_, t) => term(T[t].area, x(0, t))).join(" ")} ${term(Nmax, "g")} <= ${f(Nmax)}`);
  rows.push(`com: c ${term(-Ncom, "g")} <= 0`);
  for (let k = 1; k < K; k++) {
    rows.push(`cap${k}: ${T.map((_, t) => term(T[t].area, x(k, t))).join(" ")} ${term(-Nmax, `y_${k}`)} <= 0`);
    if (k > 1) rows.push(`ord${k}: y_${k} - y_${k - 1} <= 0`);
  }
  // floor-area ratio (gross area, ground-floor core included)
  const gross = [];
  for (let k = 0; k < K; k++) for (let t = 0; t < T.length; t++) gross.push(term(T[t].area / p.eff, x(k, t)));
  for (let k = 1; k < K; k++) gross.push(term(p.core, `y_${k}`));
  rows.push(`cos: ${gross.join(" ")} ${term(1 / p.effCom, "c")} <= ${f(p.cos * p.A - p.core)}`);
  // height and number of levels
  const ys = Array.from({ length: n }, (_, i) => `y_${i + 1}`);
  if (n > 0) {
    rows.push(`height: ${ys.map(y => term(p.floorH, y)).join(" ")} ${term(p.rdcH - p.floorH, "g")} <= ${f(p.hmax - p.floorH)}`);
    rows.push(`levels: ${ys.map(y => term(1, y)).join(" ")} <= ${n}`);
    if (fixLevels !== null) rows.push(`fixlev: ${ys.map(y => term(1, y)).join(" ")} = ${fixLevels}`);
  } else if (fixLevels) {
    return null;
  }
  // parking: spaces provided >= spaces required
  const req = [];
  for (let k = 0; k < K; k++) for (let t = 0; t < T.length; t++) req.push(term(-p.parkRes / 100 * T[t].area / p.eff, x(k, t)));
  for (let k = 1; k < K; k++) req.push(term(-p.parkRes / 100 * p.core, `y_${k}`));
  rows.push(`park: ${term(cap, "b")} ${req.join(" ")} ${term(-p.parkCom / 100 / p.effCom, "c")} >= ${f(p.parkRes / 100 * p.core)}`);
  // parking spaces sold: no more than built, and no more than the market takes (per flat, plus the shops' spaces)
  rows.push(`sold: sp ${term(-cap, "b")} <= 0`);
  const demand = [];
  for (let k = 0; k < K; k++) for (let t = 0; t < T.length; t++) demand.push(term(-p.parkingPerUnit, x(k, t)));
  rows.push(`market: sp ${demand.join(" ")} ${term(-p.parkCom / 100 / p.effCom, "c")} <= 0`);
  // unit mix, as shares of the number of units
  const all = [];
  for (let k = 0; k < K; k++) for (let t = 0; t < T.length; t++) all.push([k, t]);
  T.forEach((u, t) => {
    const maxS = mode === "naive" ? (u.id === "t2" || u.id === "t3" ? 1 : 0) : u.maxShare;
    const minS = mode === "naive" ? 0 : u.minShare;
    if (maxS < 1) rows.push(`mixmax_${u.id}: ${all.map(([k, tt]) => term((tt === t ? 1 : 0) - maxS, x(k, tt))).join(" ")} <= 0`);
    if (minS > 0) rows.push(`mixmin_${u.id}: ${all.map(([k, tt]) => term((tt === t ? 1 : 0) - minS, x(k, tt))).join(" ")} >= 0`);
  });
  if (mode === "naive") {  // the usual standard: two- and three-room flats in equal numbers on every level, shops if allowed
    const t2 = T.findIndex(u => u.id === "t2"), t3 = T.findIndex(u => u.id === "t3");
    for (let k = 0; k < K; k++) {
      rows.push(`half${k}a: ${x(k, t2)} - ${x(k, t3)} <= 1`);
      rows.push(`half${k}b: ${x(k, t2)} - ${x(k, t3)} >= -1`);
    }
    if (p.commerce && Ncom > 0) bounds.push("g = 1");
  }
  return `Maximize\n obj: ${obj.join(" ")}\nSubject To\n ${rows.join("\n ")}\nBounds\n ${bounds.join("\n ")}\nGenerals\n ${ints.join(" ")}\nBinaries\n ${bins.join(" ")}\nEnd\n`;
}

export async function solve(p, mode = "best", fixLevels = null) {
  const lp = buildLP(p, mode, fixLevels);
  if (!lp) return null;
  const highs = await loadSolver();
  let r;
  try {
    r = highs.solve(lp, { output_flag: false, time_limit: 10, mip_rel_gap: 1e-6 });
  } catch (e) {
    return null;
  }
  if (r.Status !== "Optimal") return null;
  const v = name => Math.round(r.Columns[name] ? r.Columns[name].Primal : 0);
  const K = p.levels + 1;
  const sol = {
    x: Array.from({ length: K }, (_, k) => p.units.map(u => v(`x_${k}_${u.id}`))),
    y: [1, ...Array.from({ length: p.levels }, (_, i) => v(`y_${i + 1}`))],
    g: v("g"), b: v("b"), c: r.Columns.c ? Math.max(0, r.Columns.c.Primal) : 0,
    status: r.Status, mode,
  };
  if (!sol.g) sol.c = 0;
  return evaluate(p, sol);
}

// Everything reported comes from here, for the optimal and the naive program alike.
export function evaluate(p, sol) {
  const { basementArea, cap } = derived(p);
  const T = p.units;
  const levels = [];
  let revenue = { flats: 0, shops: 0, parking: 0 }, gfa = 0, comGross = 0, units = 0;
  const byType = Object.fromEntries(T.map(u => [u.id, 0]));
  sol.x.forEach((counts, k) => {
    const built = k === 0 || sol.y[k];
    if (!built) return;
    const net = counts.reduce((s, n, t) => s + n * T[t].area, 0);
    const shop = k === 0 && sol.g ? sol.c : 0;
    const gross = p.core + net / p.eff + shop / p.effCom;
    counts.forEach((n, t) => { byType[T[t].id] += n; units += n; revenue.flats += n * T[t].area * T[t].price * unitFactor(p, k); });
    if (shop) { revenue.shops += shop * p.priceCom; comGross += shop / p.effCom; }
    gfa += gross;
    levels.push({ k, use: k === 0 && sol.g ? "shops" : "flats", counts, net: net + shop, gross, height: k === 0 ? (sol.g ? p.rdcH : p.floorH) : p.floorH });
  });
  const spaces = cap * sol.b;
  const sold = p.sellParking ? Math.min(spaces, Math.floor(p.parkingPerUnit * units + p.parkCom / 100 * comGross + 1e-9)) : 0;
  revenue.parking = sold * p.priceParking;
  const totalRevenue = revenue.flats + revenue.shops + revenue.parking;
  const cost = {
    land: p.land,
    construction: gfa * p.build,
    basements: sol.b * basementArea * p.basement,
  };
  cost.fees = (cost.construction + cost.basements) * p.fees / 100;
  cost.marketing = totalRevenue * p.marketing / 100;
  const totalCost = Object.values(cost).reduce((s, v) => s + v, 0);
  const margin = totalRevenue - totalCost;
  const height = levels.reduce((s, l) => s + l.height, 0);
  const required = Math.ceil(p.parkRes / 100 * (gfa - comGross) + p.parkCom / 100 * comGross - 1e-9);
  const rdc = levels.find(l => l.k === 0);
  const checks = [
    { id: "cos", ok: gfa <= p.cos * p.A + 0.5, value: gfa / p.A, limit: p.cos },
    { id: "emprise", ok: rdc.gross <= p.empriseArea + 0.5, value: 100 * rdc.gross / p.A, limit: p.emprisePct },
    { id: "height", ok: height <= p.hmax + 1e-6, value: height, limit: p.hmax },
    { id: "levels", ok: levels.length - 1 <= p.levels, value: levels.length - 1, limit: p.levels },
    { id: "parking", ok: spaces >= required, value: spaces, limit: required },
  ];
  T.forEach(u => {
    const share = units ? byType[u.id] / units : 0;
    if (u.maxShare < 1 || u.minShare > 0) checks.push({ id: "mix", type: u.id, ok: sol.mode === "naive" || (share <= u.maxShare + 1e-9 && share >= u.minShare - 1e-9), value: 100 * share, min: 100 * u.minShare, max: 100 * u.maxShare });
  });
  return {
    sol, levels, gfa, comGross, units, byType, spaces, sold, required, height, basements: sol.b,
    revenue, totalRevenue, cost, totalCost, margin,
    marginPct: totalRevenue ? 100 * margin / totalRevenue : 0,
    marginOnCost: totalCost ? 100 * margin / totalCost : 0,
    checks,
  };
}

// Best program, rule-of-thumb program, margin by number of floors, and sensitivity to prices and costs.
export async function study(p) {
  const best = await solve(p, "best");
  const naive = await solve(p, "naive");
  const byLevels = [];
  for (let m = 0; m <= p.levels; m++) {
    const r = await solve(p, "best", m);
    byLevels.push({ levels: m, margin: r ? r.margin : null });
  }
  const variants = [
    ["price-10", { ...p, units: p.units.map(u => ({ ...u, price: u.price * 0.9 })), priceCom: p.priceCom * 0.9, priceParking: p.priceParking * 0.9 }],
    ["price+10", { ...p, units: p.units.map(u => ({ ...u, price: u.price * 1.1 })), priceCom: p.priceCom * 1.1, priceParking: p.priceParking * 1.1 }],
    ["cost-10", { ...p, build: p.build * 0.9, basement: p.basement * 0.9 }],
    ["cost+10", { ...p, build: p.build * 1.1, basement: p.basement * 1.1 }],
    ["land+20", { ...p, land: p.land * 1.2 }],
  ];
  const sensitivity = [];
  for (const [id, q] of variants) {
    const r = await solve(q, "best");
    sensitivity.push({ id, margin: r ? r.margin : null, marginPct: r ? r.marginPct : null, levels: r ? r.levels.length - 1 : null, units: r ? r.units : null, same: r && best ? sameProgram(r, best) : false });
  }
  return { best, naive, byLevels, sensitivity };
}

function sameProgram(a, b) {
  return a.levels.length === b.levels.length && a.units === b.units && a.basements === b.basements && a.sol.g === b.sol.g;
}
