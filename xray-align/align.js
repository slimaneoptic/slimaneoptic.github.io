/* Tube-to-ring alignment maths for the browser demo (same steps as the Python core).
   Prototype, not for clinical use. Corners come from js-aruco2 (TL, TR, BR, BL). */
(function (root) {
  'use strict';
  var GREEN = 3, AMBER = 6;

  // gradient-based sub-pixel corner refinement (the idea behind OpenCV cornerSubPix)
  function refineCorner(g, w, h, x0, y0, win) {
    var x = x0, y = y0, s2 = 2 * (win * 0.6) * (win * 0.6);
    for (var it = 0; it < 12; it++) {
      var a = 0, b = 0, c = 0, bx = 0, by = 0, xi = Math.round(x), yi = Math.round(y);
      for (var dy = -win; dy <= win; dy++) {
        for (var dx = -win; dx <= win; dx++) {
          var px = xi + dx, py = yi + dy;
          if (px < 1 || py < 1 || px >= w - 1 || py >= h - 1) continue;
          var i = py * w + px;
          var gx = (g[i + 1] - g[i - 1]) * 0.5, gy = (g[i + w] - g[i - w]) * 0.5;
          var k = Math.exp(-(dx * dx + dy * dy) / s2);
          var gxx = gx * gx * k, gxy = gx * gy * k, gyy = gy * gy * k;
          a += gxx; b += gxy; c += gyy; bx += gxx * px + gxy * py; by += gxy * px + gyy * py;
        }
      }
      var det = a * c - b * b;
      if (Math.abs(det) < 1e-6) break;
      var nx = (c * bx - b * by) / det, ny = (a * by - b * bx) / det;
      if (Math.hypot(nx - x0, ny - y0) > win) return { x: x0, y: y0 };
      var moved = Math.hypot(nx - x, ny - y);
      x = nx; y = ny;
      if (moved < 0.01) break;
    }
    return { x: x, y: y };
  }

  function refineCorners(grey, corners) {
    var side = 0;
    for (var j = 0; j < 4; j++) {
      var p = corners[j], q = corners[(j + 1) % 4];
      side += Math.hypot(q.x - p.x, q.y - p.y) / 4;
    }
    var win = Math.max(3, Math.min(7, Math.round(side / 25)));
    return corners.map(function (p) { return refineCorner(grey.data, grey.width, grey.height, p.x, p.y, win); });
  }

  function solve(A, b) { // Gaussian elimination with partial pivoting
    var n = b.length, M = A.map(function (r, i) { return r.concat([b[i]]); });
    for (var col = 0; col < n; col++) {
      var piv = col;
      for (var r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
      var tmp = M[col]; M[col] = M[piv]; M[piv] = tmp;
      for (var r2 = col + 1; r2 < n; r2++) {
        var f = M[r2][col] / M[col][col];
        for (var cc = col; cc <= n; cc++) M[r2][cc] -= f * M[col][cc];
      }
    }
    var x = new Array(n);
    for (var i = n - 1; i >= 0; i--) {
      var s = M[i][n];
      for (var j = i + 1; j < n; j++) s -= M[i][j] * x[j];
      x[i] = s / M[i][i];
    }
    return x;
  }

  function norm(v) { return Math.hypot(v[0], v[1], v[2]); }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function scale(v, s) { return [v[0] * s, v[1] * s, v[2] * s]; }
  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }

  // planar pose from the 4 corners: homography in normalised camera coordinates, then
  // H = lambda [r1 r2 t]. Plane frame: x right, y down, z into the ring.
  function pose(corners, cam, markerMm) {
    var hs = markerMm / 2, P = [[-hs, -hs], [hs, -hs], [hs, hs], [-hs, hs]], A = [], b = [];
    for (var i = 0; i < 4; i++) {
      var X = P[i][0], Y = P[i][1];
      var x = (corners[i].x - cam.cx) / cam.fx, y = (corners[i].y - cam.cy) / cam.fy;
      A.push([X, Y, 1, 0, 0, 0, -x * X, -x * Y]); b.push(x);
      A.push([0, 0, 0, X, Y, 1, -y * X, -y * Y]); b.push(y);
    }
    var h = solve(A, b);
    var h1 = [h[0], h[3], h[6]], h2 = [h[1], h[4], h[7]], h3 = [h[2], h[5], 1];
    var lam = (norm(h1) + norm(h2)) / 2;
    if (h3[2] / lam < 0) lam = -lam;
    var r1 = scale(h1, 1 / norm(h1)), r2 = scale(h2, 1 / norm(h2)), t = scale(h3, 1 / lam);
    if (lam < 0) { r1 = scale(r1, -1); r2 = scale(r2, -1); }
    var cs = add(r1, r2), df = sub(r1, r2);
    cs = scale(cs, 1 / norm(cs)); df = scale(df, 1 / norm(df));
    r1 = scale(add(cs, df), Math.SQRT1_2); r2 = scale(sub(cs, df), Math.SQRT1_2);
    return { r1: r1, r2: r2, n: cross(r1, r2), t: t };
  }

  function risk(totalDeg) { return 100 / (1 + Math.exp(-(totalDeg - 6) / 1.2)); } // SIMULATED

  function correction(hd, vd, status) {
    if (status === 'green') return 'Hold: aligned within 3°';
    var parts = [];
    if (Math.abs(hd) >= 0.5) parts.push(Math.abs(hd).toFixed(1) + '° ' + (hd > 0 ? 'right' : 'left'));
    if (Math.abs(vd) >= 0.5) parts.push(Math.abs(vd).toFixed(1) + '° ' + (vd > 0 ? 'down' : 'up'));
    return 'Aim the tube ' + parts.join(' and ') + ' (camera view)';
  }

  // n: ring normal in the camera (= tube) frame, pointing away from the tube; t: ring centre in mm
  function fromNormal(n, t) {
    var D = 180 / Math.PI, k = 1 / norm(n);
    n = [n[0] * k, n[1] * k, n[2] * k];
    var hd = Math.atan2(n[0], n[2]) * D, vd = Math.atan2(n[1], n[2]) * D;
    var total = Math.acos(Math.min(1, n[2])) * D;
    var status = total <= GREEN ? 'green' : total <= AMBER ? 'amber' : 'red';
    return { horizontal: hd, vertical: vd, total: total, distance: norm(t), offsetX: t[0], offsetY: t[1],
             status: status, correction: correction(hd, vd, status), risk: risk(total), normal: n, t: t };
  }

  function measure(corners, cam, markerMm) {
    var p = pose(corners, cam, markerMm);
    return fromNormal(p.n, p.t);
  }

  function camFromFov(w, h, hfovDeg) {
    var f = (w / 2) / Math.tan(hfovDeg * Math.PI / 360);
    return { fx: f, fy: f, cx: (w - 1) / 2, cy: (h - 1) / 2 };
  }

  var api = { refineCorners: refineCorners, pose: pose, measure: measure, fromNormal: fromNormal, risk: risk, camFromFov: camFromFov };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Align = api;
})(this);
