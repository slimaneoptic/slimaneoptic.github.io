// Plane geometry on a local metric projection (accurate to centimetres at parcel scale).

export function projector(ring) {
  const lon0 = ring.reduce((s, p) => s + p[0], 0) / ring.length;
  const lat0 = ring.reduce((s, p) => s + p[1], 0) / ring.length;
  const kx = 111320 * Math.cos(lat0 * Math.PI / 180), ky = 110540;
  return {
    toXY: ([lon, lat]) => [(lon - lon0) * kx, (lat - lat0) * ky],
    toLonLat: ([x, y]) => [lon0 + x / kx, lat0 + y / ky],
  };
}

export function area(pts) {  // signed shoelace, positive when counter-clockwise
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length];
    s += x1 * y2 - x2 * y1;
  }
  return s / 2;
}

export function ccw(pts) { return area(pts) < 0 ? [...pts].reverse() : pts; }

export function centroid(pts) {
  let cx = 0, cy = 0, a = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length];
    const f = x1 * y2 - x2 * y1;
    cx += (x1 + x2) * f; cy += (y1 + y2) * f; a += f;
  }
  return a ? [cx / (3 * a), cy / (3 * a)] : pts[0];
}

export function edges(pts) {
  return pts.map((p, i) => {
    const q = pts[(i + 1) % pts.length];
    const dx = q[0] - p[0], dy = q[1] - p[1];
    const len = Math.hypot(dx, dy);
    const bearing = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;
    return { i, a: p, b: q, len, dir: [dx / len, dy / len], mid: [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], bearing };
  });
}

// facing direction (outward normal) of an edge as a compass word key: n, ne, e, …
export function facing(edge) {
  const nx = edge.dir[1], ny = -edge.dir[0];  // outward normal for a counter-clockwise ring
  const deg = (Math.atan2(nx, ny) * 180 / Math.PI + 360) % 360;
  return ["n", "ne", "e", "se", "s", "sw", "w", "nw"][Math.round(deg / 45) % 8];
}

// the edge facing away from the street: most anti-parallel to it, and farthest from it
export function rearEdge(es, street) {
  const s = es[street];
  let best = null, score = -Infinity;
  for (const e of es) {
    if (e.i === street) continue;
    const anti = -(e.dir[0] * s.dir[0] + e.dir[1] * s.dir[1]);
    const dist = Math.hypot(e.mid[0] - s.mid[0], e.mid[1] - s.mid[1]);
    if (anti > 0.5 && anti * 1000 + dist > score) { score = anti * 1000 + dist; best = e.i; }
  }
  return best;
}

// Clip a polygon by the half-plane on the left of the line through p with direction d, shifted inward by `off`.
function clip(poly, p, d, off) {
  const n = [-d[1], d[0]];  // inward normal for a counter-clockwise ring
  const side = q => (q[0] - p[0]) * n[0] + (q[1] - p[1]) * n[1] - off;
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const sa = side(a), sb = side(b);
    if (sa >= 0) out.push(a);
    if ((sa >= 0) !== (sb >= 0)) {
      const t = sa / (sa - sb);
      out.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
    }
  }
  return out;
}

// Buildable polygon: each side moved inward by its setback (exact for convex parcels).
export function buildable(pts, street, setbacks) {
  const es = edges(pts);
  const rear = rearEdge(es, street);
  let poly = pts;
  for (const e of es) {
    const off = e.i === street ? setbacks.street : e.i === rear ? setbacks.rear : setbacks.side;
    if (off > 0) poly = clip(poly, e.a, e.dir, off);
    if (poly.length < 3) return { poly: [], rear };
  }
  return { poly, rear };
}

// Same shape scaled around its centroid to a target area (stays inside a convex shape when shrinking).
export function scaleTo(pts, target) {
  const a = Math.abs(area(pts));
  if (!a || target >= a) return pts;
  const k = Math.sqrt(target / a), [cx, cy] = centroid(pts);
  return pts.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]);
}

export function isConvex(pts) {
  let sign = 0;
  for (let i = 0; i < pts.length; i++) {
    const [a, b, c] = [pts[i], pts[(i + 1) % pts.length], pts[(i + 2) % pts.length]];
    const z = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
    if (Math.abs(z) < 1e-9) continue;
    if (sign && Math.sign(z) !== sign) return false;
    sign = Math.sign(z);
  }
  return true;
}
