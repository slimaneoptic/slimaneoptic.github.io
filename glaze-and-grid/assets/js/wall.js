/* Glaze & Grid: tile wall renderer (canvas). Fictional shop, sample data.
   Tiles are drawn at true scale with real joint widths. Faces come from the store's swatches
   (CC0 materials from ambientCG and Poly Haven) and from wall sprite sheets drawn by code.
   Sprite faces are picked so that no two neighbouring tiles share a face.
   Plain ES2017 for older browsers (Chrome 120 and up): no newer language features. */
(function (global) {
  'use strict';

  /* ---------- seeded random ---------- */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(i, j, s) {
    var h = Math.imul(i | 0, 374761393) ^ Math.imul(j | 0, 668265263) ^ Math.imul(s | 0, 1274126177);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return (h ^ (h >>> 16)) >>> 0;
  }

  /* ---------- registries: tiles (by SKU or id) and grouts ---------- */
  var TILES = {};
  var GROUTS = [];
  function registerTiles(list) { (list || []).forEach(function (t) { TILES[t.id] = t; }); }
  function registerGrouts(list) { GROUTS = (list || []).slice(); }
  function resolveTile(t) { return typeof t === 'string' ? TILES[t] : t; }
  function groutHex(g) {
    if (!g) return '#DEDCD3';
    if (g.charAt(0) === '#') return g;
    for (var i = 0; i < GROUTS.length; i++) {
      var x = GROUTS[i];
      if (x.id === g || x.sku === g || (x.name && x.name.toLowerCase() === String(g).toLowerCase())) return x.hex;
    }
    return '#DEDCD3';
  }

  /* ---------- images, with step-down copies for sharp small tiles ---------- */
  var imgCache = {};
  function loadImage(src) {
    if (!imgCache[src]) {
      imgCache[src] = new Promise(function (resolve, reject) {
        var im = new Image();
        im.decoding = 'async';
        im.onload = function () { resolve(im); };
        im.onerror = reject;
        im.src = src;
      });
    }
    return imgCache[src];
  }
  var stepCache = {};
  function makeCanvas(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  // A copy of img halved `level` times (better than one big downscale). Returns {img, k}: k = copy px per source px.
  function stepDown(img, src, scale) {
    var level = 0, s = scale;
    while (s < 0.5 && level < 5) { s *= 2; level++; }
    var w0 = img.naturalWidth || img.width, h0 = img.naturalHeight || img.height;
    if (!level) return { img: img, k: 1 };
    var key = src + '@' + level;
    if (!stepCache[key]) {
      var cur = img, w = w0, h = h0;
      for (var l = 0; l < level; l++) {
        w = Math.max(1, Math.round(w / 2)); h = Math.max(1, Math.round(h / 2));
        var c = makeCanvas(w, h), g = c.getContext('2d');
        g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
        g.drawImage(cur, 0, 0, w, h);
        cur = c;
      }
      stepCache[key] = { img: cur, k: cur.width / w0 };
    }
    return stepCache[key];
  }
  var silCache = typeof WeakMap === 'function' ? new WeakMap() : null;
  function silhouette(src) { // black copy of a sprite sheet, for the shadow each tile casts on the grout
    if (silCache && silCache.has(src)) return silCache.get(src);
    var c = makeCanvas(src.width || src.naturalWidth, src.height || src.naturalHeight), g = c.getContext('2d');
    g.drawImage(src, 0, 0);
    g.globalCompositeOperation = 'source-in';
    g.fillStyle = '#000';
    g.fillRect(0, 0, c.width, c.height);
    if (silCache) silCache.set(src, c);
    return c;
  }

  var groutCache = {};
  function groutTexture(hex) { // sanded grout: fine light and dark grains
    if (groutCache[hex]) return groutCache[hex];
    var n = 96, c = makeCanvas(n, n), g = c.getContext('2d'), r = rng(5);
    g.fillStyle = hex;
    g.fillRect(0, 0, n, n);
    for (var k = 0; k < 1400; k++) {
      g.fillStyle = r() < 0.5 ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.12)';
      g.fillRect(Math.floor(r() * n), Math.floor(r() * n), 1, 1);
    }
    groutCache[hex] = c;
    return c;
  }

  /* ---------- pattern placements ---------- */
  // Tile centres in pattern space (cm, origin at the view centre), local angle (0 or 90) and grid ids.
  function placements(pattern, t, jointCm, halfW, halfH) {
    var out = [], L = t.L, W = t.W;
    if (t.shape === 'hex') {
      var d = W, step = d + jointCm, dx = step * Math.sqrt(3) / 2;
      var cols = Math.ceil(halfW / dx) + 2, rows = Math.ceil(halfH / step) + 2;
      for (var ci = -cols; ci <= cols; ci++) {
        var off = (ci & 1) ? step / 2 : 0;
        for (var rj = -rows; rj <= rows; rj++) out.push({ x: ci * dx, y: rj * step + off, ang: 0, i: ci, j: rj });
      }
      return { list: out, rot: 0 };
    }
    if (pattern === 'herringbone' && L < 2 * W) pattern = 'straight';
    var a = L + jointCm, b = W + jointCm;
    if (pattern === 'herringbone') {
      var R = Math.sqrt(halfW * halfW + halfH * halfH) + 2 * a;
      var nMax = Math.ceil(R / b) + 2, mMax = Math.ceil(R / a) + 2;
      for (var n = -nMax; n <= nMax; n++) {
        for (var m = -mMax; m <= mMax; m++) {
          var px = n * b + m * a, py = n * b - m * a;
          var hx = px + L / 2, hy = py + W / 2;
          if (Math.abs(hx) < R && Math.abs(hy) < R) out.push({ x: hx, y: hy, ang: 0, i: n, j: m * 2 });
          var vx = px + a + W / 2, vy = py + b - a + L / 2;
          if (Math.abs(vx) < R && Math.abs(vy) < R) out.push({ x: vx, y: vy, ang: 90, i: n, j: m * 2 + 1 });
        }
      }
      return { list: out, rot: Math.PI / 4 };
    }
    var rws = Math.ceil(halfH / b) + 2, cls = Math.ceil(halfW / a) + 2;
    for (var j = -rws; j <= rws; j++) {
      var sh = pattern === 'brick' && (j & 1) ? a / 2 : 0;
      for (var i = -cls; i <= cls; i++) out.push({ x: i * a + a / 2 - sh, y: j * b + b / 2, ang: 0, i: i, j: j });
    }
    return { list: out, rot: 0 };
  }

  // Remembers which face each tile got, so a new tile can avoid the faces of the tiles around it.
  function FacePicker(cell) { this.cell = cell; this.map = {}; }
  FacePicker.prototype.near = function (x, y, thr) {
    var cx = Math.floor(x / this.cell), cy = Math.floor(y / this.cell), out = [];
    for (var a = -1; a <= 1; a++) {
      for (var b = -1; b <= 1; b++) {
        var list = this.map[(cx + a) + ',' + (cy + b)];
        if (!list) continue;
        for (var k = 0; k < list.length; k++) {
          var q = list[k], ddx = q.x - x, ddy = q.y - y;
          if (ddx * ddx + ddy * ddy < thr * thr) out.push(q.f);
        }
      }
    }
    return out;
  };
  FacePicker.prototype.add = function (x, y, f) {
    var key = Math.floor(x / this.cell) + ',' + Math.floor(y / this.cell);
    (this.map[key] || (this.map[key] = [])).push({ x: x, y: y, f: f });
  };

  var LIGHT = (function () { var x = -0.55, y = -0.83, n = Math.sqrt(x * x + y * y); return [x / n, y / n]; })();

  /* ---------- renderer ---------- */
  function Wall(canvas, opts) {
    this.c = canvas;
    this.g = canvas.getContext('2d');
    this.o = Object.assign({ tile: null, pattern: 'straight', grout: '#F2F2EE', widthM: 3, seed: 11,
      jointMm: null, room: null, light: true, vignette: true, windowLight: false, center: 'joint' }, opts || {});
    this.token = 0;
    this.stats = null;
    this.pxPerMetreCss = 0;
  }

  Wall.prototype.set = function (o) { Object.assign(this.o, o || {}); return this.draw(); };

  Wall.prototype.draw = function () {
    var self = this, o = this.o, t = resolveTile(o.tile);
    if (!t) return Promise.resolve(null);
    var token = ++this.token;
    var src = t.kind === 'atlas' ? t.atlas.src : t.tex.src;
    return loadImage(src).then(function (img) {
      if (token !== self.token) return null;
      return self.paint(t, img, src);
    }, function () { return null; });
  };

  Wall.prototype.paint = function (t, img, src) {
    var o = this.o, cv = this.c, dpr = Math.min(2, global.devicePixelRatio || 1);
    var cssW = cv.clientWidth, cssH = cv.clientHeight;
    if (!cssW || !cssH) return null;
    var W = Math.round(cssW * dpr), H = Math.round(cssH * dpr);
    if (cv.width !== W) cv.width = W;
    if (cv.height !== H) cv.height = H;
    var g = this.g;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalAlpha = 1;
    g.globalCompositeOperation = 'source-over';
    g.imageSmoothingEnabled = true;
    g.imageSmoothingQuality = 'high';

    var ppc, cx, cy, roomRect = null; // device px per cm
    if (o.room) {
      var pad = (o.roomPad || 34) * dpr;
      ppc = Math.min((W - 2 * pad) / (o.room.L * 100), (H - 2 * pad) / (o.room.W * 100));
      var rw = o.room.L * 100 * ppc, rh = o.room.W * 100 * ppc;
      roomRect = { x: (W - rw) / 2, y: (H - rh) / 2, w: rw, h: rh };
    } else {
      ppc = W / (o.widthM * 100);
    }
    cx = W / 2; cy = H / 2;
    this.pxPerMetreCss = ppc * 100 / dpr;

    var grout = groutHex(o.grout);
    var jointMm = o.jointMm != null ? o.jointMm : t.joint;
    var jointCm = Math.max(jointMm / 10, 1 / ppc); // never thinner than one device pixel
    var rx0 = roomRect ? roomRect.x : 0, ry0 = roomRect ? roomRect.y : 0;
    var rx1 = roomRect ? roomRect.x + roomRect.w : W, ry1 = roomRect ? roomRect.y + roomRect.h : H;

    if (roomRect) {
      g.fillStyle = o.background || '#F1F2EF';
      g.fillRect(0, 0, W, H);
      g.save();
      g.beginPath();
      g.rect(roomRect.x, roomRect.y, roomRect.w, roomRect.h);
      g.clip();
    }

    var full = 0, cut = 0;
    if (t.kind === 'laid') {
      // a laid sample (boards or a mixed set with its own joints), repeated at true size
      var sc = ppc * t.tex.cm / (img.naturalWidth || img.width);
      var st = stepDown(img, src, sc);
      var pat = g.createPattern(st.img, 'repeat');
      var k = sc / st.k;
      if (pat.setTransform && global.DOMMatrix) pat.setTransform(new DOMMatrix().translateSelf(cx, cy).scaleSelf(k, k));
      g.fillStyle = pat;
      g.fillRect(0, 0, W, H);
    } else {
      g.fillStyle = g.createPattern(groutTexture(grout), 'repeat');
      g.fillRect(0, 0, W, H);
      var halfW = (roomRect ? roomRect.w : W) / 2 / ppc, halfH = (roomRect ? roomRect.h : H) / 2 / ppc;
      var pl = placements(o.pattern, t, jointCm, halfW, halfH);
      var cosR = Math.cos(pl.rot), sinR = Math.sin(pl.rot);
      var Lpx = t.L * ppc, Wpx = t.W * ppc;
      var reach = Math.sqrt(Lpx * Lpx + Wpx * Wpx) / 2 + 2;
      var gl = parseInt(grout.slice(1, 3), 16) * 0.3 + parseInt(grout.slice(3, 5), 16) * 0.59 + parseInt(grout.slice(5, 7), 16) * 0.11;
      var shadowA = gl > 120 ? 0.26 : 0.16;
      var bandX = W * 0.66, bandW = W * 0.075;
      var atlas = null, sheet = null, sil = null, aScale = 0;
      if (t.kind === 'atlas') {
        atlas = t.atlas;
        aScale = ppc / atlas.ppcm;
        sheet = stepDown(img, src, aScale);
        sil = silhouette(sheet.img);
      }
      var picker = new FacePicker(Math.max(t.L, t.W) + jointCm);
      var faces = this.faces = []; // which sprite face each tile got (pattern space, cm): used by the tests
      // tiles closer than this count as neighbours; with 4 faces or fewer only edge neighbours can all differ
      var thr = this.neighbourCm = t.shape === 'hex' ? 1.2 * (t.W + jointCm)
        : (atlas && atlas.count <= 4 ? 0.6 : 0.8) * (t.L + t.W);
      var offX = 0, offY = 0;
      if (o.center === 'tile' && !pl.rot && t.shape !== 'hex') { offX = (t.L + jointCm) / 2; offY = (t.W + jointCm) / 2; }

      for (var q = 0; q < pl.list.length; q++) {
        var p = pl.list[q];
        var px = p.x - offX, py = p.y - offY;
        var gx = cx + (px * cosR - py * sinR) * ppc;
        var gy = cy + (px * sinR + py * cosR) * ppc;
        if (gx < rx0 - reach || gx > rx1 + reach || gy < ry0 - reach || gy > ry1 + reach) continue;
        var ang = pl.rot + (p.ang * Math.PI) / 180;
        var r = rng(hash(p.i, p.j, o.seed));
        var ca = Math.cos(ang), sa = Math.sin(ang);
        var hx = Lpx / 2, hy = Wpx / 2;
        var corners = [[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]].map(function (uv) {
          return [gx + uv[0] * ca - uv[1] * sa, gy + uv[0] * sa + uv[1] * ca];
        });
        if (roomRect) {
          var inside = 0, minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
          for (var cc = 0; cc < 4; cc++) {
            var qq = corners[cc];
            if (qq[0] >= rx0 - 0.5 && qq[0] <= rx1 + 0.5 && qq[1] >= ry0 - 0.5 && qq[1] <= ry1 + 0.5) inside++;
            minX = Math.min(minX, qq[0]); maxX = Math.max(maxX, qq[0]); minY = Math.min(minY, qq[1]); maxY = Math.max(maxY, qq[1]);
          }
          if (maxX <= rx0 || minX >= rx1 || maxY <= ry0 || minY >= ry1) continue;
          if (inside === 4) full++; else cut++;
        }

        if (atlas) {
          // pick a face no neighbour has
          var K = atlas.count, start = Math.floor(r() * K), f = start;
          var avoid = picker.near(px, py, thr);
          for (var s2 = 0; s2 < K; s2++) { var cand = (start + s2) % K; if (avoid.indexOf(cand) < 0) { f = cand; break; } }
          picker.add(px, py, f);
          faces.push([Math.round(px * 10) / 10, Math.round(py * 10) / 10, f]);
          var col = f % atlas.cols, row = Math.floor(f / atlas.cols);
          var kk = sheet.k;
          var sx = col * atlas.cw * kk, sy = row * atlas.ch * kk, sw = atlas.cw * kk, shh = atlas.ch * kk;
          var dw = atlas.cw * aScale, dh = atlas.ch * aScale;
          g.setTransform(ca, sa, -sa, ca, gx, gy);
          g.globalAlpha = shadowA;
          var sdx = 0.7 * dpr, sdy = 1.1 * dpr; // shadow offset in screen space, turned into the tile's frame
          g.drawImage(sil, sx, sy, sw, shh, -dw / 2 + (sdx * ca + sdy * sa), -dh / 2 + (-sdx * sa + sdy * ca), dw, dh);
          g.globalAlpha = 1;
          g.drawImage(sheet.img, sx, sy, sw, shh, -dw / 2, -dh / 2, dw, dh);
          g.setTransform(1, 0, 0, 1, 0, 0);
          if (t.reflect && !roomRect) { // a soft window reflection across glossy faces (not on a room plan)
            g.save();
            g.beginPath();
            g.moveTo(corners[0][0], corners[0][1]);
            for (var c2 = 1; c2 < 4; c2++) g.lineTo(corners[c2][0], corners[c2][1]);
            g.closePath();
            g.clip();
            var jx = bandX + (r() - 0.5) * bandW * 0.5;
            var gr0 = g.createLinearGradient(jx - bandW, gy - bandW * 0.6, jx + bandW, gy + bandW * 0.6);
            gr0.addColorStop(0, 'rgba(255,255,255,0)');
            gr0.addColorStop(0.45, 'rgba(255,255,255,' + t.reflect + ')');
            gr0.addColorStop(0.55, 'rgba(255,255,255,' + t.reflect + ')');
            gr0.addColorStop(1, 'rgba(255,255,255,0)');
            g.fillStyle = gr0;
            g.fillRect(0, 0, W, H);
            g.restore();
          }
          continue;
        }

        // image faces: a window of the swatch for each tile, so no two tiles repeat
        g.setTransform(ca, sa, -sa, ca, gx, gy);
        g.fillStyle = 'rgba(0,0,0,' + shadowA + ')';
        var sdx2 = 0.6 * dpr, sdy2 = 1.0 * dpr;
        g.fillRect(-hx + (sdx2 * ca + sdy2 * sa), -hy + (-sdx2 * sa + sdy2 * ca), Lpx, Wpx);
        var iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
        var tpc = iw / t.tex.cm;
        var win = Math.min(1, Math.min(iw / (t.L * tpc), ih / (t.W * tpc)));
        var sww = t.L * tpc * win, shw = t.W * tpc * win; // tiles bigger than the swatch use the whole swatch, scaled
        var stx = stepDown(img, src, Lpx / sww);
        var k2 = stx.k;
        var ox = r() * (iw - sww), oy = r() * (ih - shw);
        var rots = t.rot || [0, 180];
        var rot = rots[Math.floor(r() * rots.length)];
        if (rot) g.rotate((rot * Math.PI) / 180);
        if (rot === 90 || rot === 270) g.drawImage(stx.img, ox * k2, oy * k2, sww * k2, shw * k2, -hy, -hx, Wpx, Lpx);
        else g.drawImage(stx.img, ox * k2, oy * k2, sww * k2, shw * k2, -hx, -hy, Lpx, Wpx);
        if (rot) g.rotate((-rot * Math.PI) / 180);
        var tone = (r() - 0.5) * 2 * (t.tone || 0);
        if (tone) {
          g.fillStyle = tone > 0 ? 'rgba(255,250,240,' + tone.toFixed(3) + ')' : 'rgba(20,18,15,' + (-tone).toFixed(3) + ')';
          g.fillRect(-hx, -hy, Lpx, Wpx);
        }
        if (t.gloss) {
          var gr1 = g.createLinearGradient(-hx, -hy, hx, hy);
          gr1.addColorStop(0, 'rgba(255,255,255,' + t.gloss + ')');
          gr1.addColorStop(0.5, 'rgba(255,255,255,0)');
          gr1.addColorStop(1, 'rgba(255,255,255,0.02)');
          g.fillStyle = gr1;
          g.fillRect(-hx, -hy, Lpx, Wpx);
        }
        g.setTransform(1, 0, 0, 1, 0, 0);
        // edge light: edges turned to the light get a thin bright rim, the others a thin dark one
        g.lineWidth = Math.max(1, 0.8 * dpr);
        for (var e = 0; e < 4; e++) {
          var A = corners[e], B = corners[(e + 1) % 4];
          var nx = B[1] - A[1], ny = -(B[0] - A[0]);
          var nl = Math.sqrt(nx * nx + ny * ny);
          nx /= nl; ny /= nl;
          var lit = nx * LIGHT[0] + ny * LIGHT[1];
          if (Math.abs(lit) < 0.15) continue;
          var ix = -nx * 0.5 * g.lineWidth, iy = -ny * 0.5 * g.lineWidth;
          g.strokeStyle = lit > 0 ? 'rgba(255,255,255,' + (0.32 * lit).toFixed(3) + ')' : 'rgba(0,0,0,' + (0.22 * -lit).toFixed(3) + ')';
          g.beginPath();
          g.moveTo(A[0] + ix, A[1] + iy);
          g.lineTo(B[0] + ix, B[1] + iy);
          g.stroke();
        }
      }
    }
    g.setTransform(1, 0, 0, 1, 0, 0);

    if (o.light) { // soft light across the whole surface, from the upper left
      var gr2 = g.createLinearGradient(0, 0, W * 0.9, H * 1.1);
      gr2.addColorStop(0, 'rgba(255,255,255,0.10)');
      gr2.addColorStop(0.55, 'rgba(255,255,255,0)');
      gr2.addColorStop(1, 'rgba(0,0,0,0.16)');
      g.fillStyle = gr2;
      g.fillRect(0, 0, W, H);
    }
    if (o.windowLight && !roomRect) { // two soft slanted window panes falling across the wall
      g.save();
      g.filter = 'blur(' + Math.round(Math.min(W, H) * 0.045) + 'px)';
      g.globalCompositeOperation = 'soft-light';
      g.fillStyle = 'rgba(255,246,228,0.5)';
      var sk = H * 0.55;
      [[0.47, 0.13], [0.635, 0.13]].forEach(function (pw) {
        g.beginPath();
        g.moveTo(W * pw[0], -40); g.lineTo(W * (pw[0] + pw[1]), -40);
        g.lineTo(W * (pw[0] + pw[1]) - sk, H + 40); g.lineTo(W * pw[0] - sk, H + 40);
        g.closePath();
        g.fill();
      });
      g.restore();
    }
    if (o.vignette && !roomRect) {
      var gr3 = g.createRadialGradient(W * 0.45, H * 0.4, Math.min(W, H) * 0.3, W * 0.5, H * 0.5, Math.sqrt(W * W + H * H) * 0.62);
      gr3.addColorStop(0, 'rgba(0,0,0,0)');
      gr3.addColorStop(1, 'rgba(0,0,0,0.16)');
      g.fillStyle = gr3;
      g.fillRect(0, 0, W, H);
    }
    if (roomRect) {
      g.restore();
      this.drawRoomFrame(roomRect, ppc, dpr);
    }
    this.stats = roomRect ? { full: full, cut: cut } : null;
    return this.stats || {};
  };

  // walls, a door and the room size around a room plan
  Wall.prototype.drawRoomFrame = function (rr, ppc, dpr) {
    var g = this.g, o = this.o, wall = Math.max(6 * dpr, 10 * ppc);
    g.save();
    g.fillStyle = '#262B2E';
    g.fillRect(rr.x - wall, rr.y - wall, rr.w + 2 * wall, wall);
    g.fillRect(rr.x - wall, rr.y + rr.h, rr.w + 2 * wall, wall);
    g.fillRect(rr.x - wall, rr.y, wall, rr.h);
    g.fillRect(rr.x + rr.w, rr.y, wall, rr.h);
    var dw = 83 * ppc, dx = rr.x + rr.w - dw - 30 * ppc; // 83 cm door leaf
    g.fillStyle = o.background || '#F1F2EF';
    g.fillRect(dx, rr.y + rr.h - 1, dw, wall + 2);
    g.strokeStyle = '#262B2E';
    g.lineWidth = 1.2 * dpr;
    g.beginPath();
    g.moveTo(dx, rr.y + rr.h);
    g.lineTo(dx, rr.y + rr.h - dw);
    g.stroke();
    g.setLineDash([3 * dpr, 3 * dpr]);
    g.beginPath();
    g.arc(dx, rr.y + rr.h, dw, -Math.PI / 2, 0);
    g.stroke();
    g.setLineDash([]);
    var fs = 12 * dpr;
    g.font = '500 ' + fs + 'px Archivo, system-ui, sans-serif';
    g.fillStyle = '#5C676B';
    g.textAlign = 'center';
    g.textBaseline = 'bottom';
    var lab = function (m) { return o.units === 'ft' ? (m * 3.28084).toFixed(1) + ' ft' : m.toFixed(2) + ' m'; };
    g.fillText(lab(o.room.L), rr.x + rr.w / 2, rr.y - wall - 6 * dpr);
    g.save();
    g.translate(rr.x - wall - 8 * dpr, rr.y + rr.h / 2);
    g.rotate(-Math.PI / 2);
    g.fillText(lab(o.room.W), 0, 0);
    g.restore();
    g.restore();
  };

  global.GG = global.GG || {};
  global.GG.Wall = Wall;
  global.GG.TILES = TILES;
  global.GG.registerTiles = registerTiles;
  global.GG.registerGrouts = registerGrouts;
  global.GG.groutHex = groutHex;
  global.GG.loadImage = loadImage;
  Object.defineProperty(global.GG, 'GROUTS', { get: function () { return GROUTS; }, configurable: true });
})(window);
