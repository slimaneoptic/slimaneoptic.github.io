// Portrait-style photo test. Everything runs in this page: the photo is never uploaded.
// Pipeline: decode (EXIF orientation) -> AI cutout (MediaPipe, CPU) -> edge refine (guided filter) ->
// auto light (levels + exposure) + light unsharp mask on the subject -> background blur in linear light,
// normalised so the subject's colours do not bleed into it, stronger farther from the subject -> composite.
// No ctx.filter anywhere (older Safari ignores it): all blurs are plain JS box blurs.

const MP_VER = "0.10.35";
const MP_BASE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VER}`;
const MODELS = {
  person: { url: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/1/selfie_multiclass_256x256.tflite", mb: 16.4, name: "selfie_multiclass_256x256" },
  personFast: { url: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/1/selfie_segmenter.tflite", mb: 0.25, name: "selfie_segmenter" },
  object: { url: "https://storage.googleapis.com/mediapipe-models/interactive_segmenter/magic_touch/float32/1/magic_touch.tflite", mb: 6.2, name: "magic_touch" },
};
const WASM_MB = 11;
const OUT_LONG = 3024;   // long side of the result (3024 x 2268 = 6.9 MP, well under the iOS 16.7 MP canvas cap)
const SEG_LONG = 1280;   // long side used to refine the cutout edges
const qs = new URLSearchParams(location.search);
const PERSON_KEY = qs.get("pm") === "fast" ? "personFast" : "person";

// MediaPipe's wasm prints its "INFO: ..." lines through console.error; pass those to console.info
// so that real errors still stand out. Nothing else is changed.
const consoleError = console.error.bind(console);
console.error = (...args) => {
  if (typeof args[0] === "string" && args[0].startsWith("INFO: ")) return console.info(...args);
  return consoleError(...args);
};

const $ = (id) => document.getElementById(id);
const T = () => performance.now();
const fmt = (n) => Math.round(n).toLocaleString("en-US");
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));

const S = {
  mode: "person", point: { x: 0.5, y: 0.45 }, blur: 60, light: true, split: 50,
  W: 0, H: 0, src: null, sharp: null, out: null, seg: null, segW: 0, segH: 0, segRGBA: null, gray: null,
  mask: null, maskCv: null, lut: null, blob: null, blobGen: 0, gen: 0, busy: false, queued: null,
};
const TEST = (window.__portrait = { state: "idle", times: {}, info: {}, errors: [], renders: 0 });

function status(msg, isErr) {
  const el = $("status");
  el.textContent = msg;
  el.classList.toggle("err", !!isErr);
  if (isErr) { TEST.state = "error"; TEST.errors.push(msg); }
}
function progress(frac) {
  const bar = $("bar");
  if (frac == null) { bar.hidden = true; return; }
  bar.hidden = false;
  bar.firstElementChild.style.width = `${Math.round(clamp(frac, 0, 1) * 100)}%`;
}
function canvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  return c;
}
function ctx2d(c, opts) { return c.getContext("2d", opts); }
function freeCanvas(c) { if (c) { c.width = 0; c.height = 0; } } // Safari releases canvas memory on resize to 0

// ---------- decode with EXIF orientation ----------
// 2x1 JPEG with EXIF orientation 6: a browser that applies EXIF itself decodes it as 1x2.
const ORIENT_TEST = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAABAAIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDFoooryz7w/9k=";
let autoOrientP = null;
function browserAppliesExif() {
  if (!autoOrientP) {
    autoOrientP = new Promise((res) => {
      const im = new Image();
      im.onload = () => res(im.naturalWidth === 1 && im.naturalHeight === 2);
      im.onerror = () => res(true);
      im.src = ORIENT_TEST;
    });
  }
  return autoOrientP;
}

// EXIF orientation tag (0x0112) from the first 128 KB of a JPEG; 1 when absent or not a JPEG.
async function readOrientation(file) {
  try {
    const buf = await file.slice(0, 131072).arrayBuffer();
    const v = new DataView(buf);
    if (v.byteLength < 4 || v.getUint16(0) !== 0xffd8) return 1;
    let off = 2;
    while (off + 4 <= v.byteLength) {
      const marker = v.getUint16(off), size = v.getUint16(off + 2);
      if (marker === 0xffe1 && off + 10 <= v.byteLength && v.getUint32(off + 4) === 0x45786966) {
        const t = off + 10, le = v.getUint16(t) === 0x4949;
        const ifd = t + v.getUint32(t + 4, le), n = v.getUint16(ifd, le);
        for (let i = 0; i < n; i++) {
          const e = ifd + 2 + i * 12;
          if (e + 10 > v.byteLength) break;
          if (v.getUint16(e, le) === 0x0112) return v.getUint16(e + 8, le) || 1;
        }
        return 1;
      }
      if ((marker & 0xff00) !== 0xff00 || marker === 0xffda) break;
      off += 2 + size;
    }
  } catch (e) { /* unreadable header: treat as upright */ }
  return 1;
}

function loadImg(url) {
  return new Promise((res, rej) => {
    const im = new Image();
    im.decoding = "async";
    im.onload = () => res(im);
    im.onerror = () => rej(new Error("This photo could not be opened. Try a JPEG or HEIC photo from the camera."));
    im.src = url;
  });
}

// Draws the photo upright into a canvas whose long side is at most OUT_LONG.
async function decodeToCanvas(file) {
  const [orient, auto] = await Promise.all([readOrientation(file), browserAppliesExif()]);
  const url = URL.createObjectURL(file);
  try {
    const im = await loadImg(url);
    if (im.decode) { try { await im.decode(); } catch (e) { /* onload already fired */ } }
    const nw = im.naturalWidth, nh = im.naturalHeight;
    const manual = !auto && orient > 1;            // only old browsers need the manual turn
    const swap = manual && orient >= 5;
    const uw = swap ? nh : nw, uh = swap ? nw : nh; // upright size
    const k = Math.min(1, OUT_LONG / Math.max(uw, uh));
    const W = Math.max(1, Math.round(uw * k)), H = Math.max(1, Math.round(uh * k));
    const c = canvas(W, H), g = ctx2d(c);
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
    if (manual) {
      const dw = swap ? H : W, dh = swap ? W : H;  // draw size before the turn
      const tf = { 2: [-1, 0, 0, 1, W, 0], 3: [-1, 0, 0, -1, W, H], 4: [1, 0, 0, -1, 0, H], 5: [0, 1, 1, 0, 0, 0],
        6: [0, 1, -1, 0, W, 0], 7: [0, -1, -1, 0, W, H], 8: [0, -1, 1, 0, 0, H] }[orient];
      if (tf) g.setTransform(...tf);
      g.drawImage(im, 0, 0, dw, dh);
      g.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      g.drawImage(im, 0, 0, W, H);
    }
    return { c, W, H, inW: uw, inH: uh, orient, auto, manual };
  } finally {
    URL.revokeObjectURL(url);
  }
}

// ---------- MediaPipe ----------
let vision = null, filesetP = null;
const segP = {};
function loadFileset() {
  if (!filesetP) {
    filesetP = import(`${MP_BASE}/vision_bundle.mjs`).then(async (mod) => {
      vision = mod;
      return mod.FilesetResolver.forVisionTasks(`${MP_BASE}/wasm`);
    });
  }
  return filesetP;
}
function loadSegmenter(key) {
  if (!segP[key]) {
    segP[key] = (async () => {
      const t0 = T(), M = MODELS[key], what = key === "object" ? "object" : "person";
      const filesetReady = loadFileset();
      const buf = await fetchModel(M.url, (f, got) => {
        progress(f);
        status(`Downloading the ${what} model: ${(got / 1048576).toFixed(1)} of ${M.mb} MB…`);
      });
      status("Starting the AI engine…");
      const fileset = await filesetReady;
      const Cls = key === "object" ? vision.InteractiveSegmenter : vision.ImageSegmenter;
      // A local blob URL instead of modelAssetBuffer: in 0.10.35 InteractiveSegmenter rejects the buffer form.
      const blobUrl = URL.createObjectURL(new Blob([buf], { type: "application/octet-stream" }));
      const opts = { baseOptions: { modelAssetPath: blobUrl, delegate: "CPU" }, outputCategoryMask: false, outputConfidenceMasks: true };
      if (key !== "object") opts.runningMode = "IMAGE";
      try {
        const seg = await Cls.createFromOptions(fileset, opts);
        TEST.times[`load_${key}`] = Math.round(T() - t0);
        return seg;
      } finally {
        URL.revokeObjectURL(blobUrl);
      }
    })();
    segP[key].catch(() => { delete segP[key]; });
  }
  return segP[key];
}

// Downloads a model with a progress callback (MediaPipe's own loader has none).
async function fetchModel(url, onp) {
  const r = await fetch(url, { mode: "cors" });
  if (!r.ok) throw new Error(`The AI model did not download (HTTP ${r.status}).`);
  const total = +r.headers.get("content-length") || 0;
  if (!r.body || !r.body.getReader) return new Uint8Array(await r.arrayBuffer());
  const reader = r.body.getReader(), parts = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    parts.push(value); got += value.length;
    if (total) onp(got / total, got);
  }
  const buf = new Uint8Array(got);
  let o = 0;
  for (const p of parts) { buf.set(p, o); o += p.length; }
  return buf;
}

// ---------- image maths (plain JS, float planes) ----------
function blurH(s, d, w, h, r) {
  const inv = 1 / (2 * r + 1), wm = w - 1;
  for (let y = 0, o = 0; y < h; y++, o += w) {
    let acc = (r + 1) * s[o];
    for (let k = 1; k <= r; k++) acc += s[o + (k < wm ? k : wm)];
    for (let x = 0; x < w; x++) {
      d[o + x] = acc * inv;
      const a = x + r + 1, b = x - r;
      acc += s[o + (a < wm ? a : wm)] - s[o + (b > 0 ? b : 0)];
    }
  }
}
function blurV(s, d, w, h, r) {
  const inv = 1 / (2 * r + 1), hm = h - 1;
  for (let x = 0; x < w; x++) {
    let acc = (r + 1) * s[x];
    for (let k = 1; k <= r; k++) acc += s[(k < hm ? k : hm) * w + x];
    for (let y = 0; y < h; y++) {
      d[y * w + x] = acc * inv;
      const a = y + r + 1, b = y - r;
      acc += s[(a < hm ? a : hm) * w + x] - s[(b > 0 ? b : 0) * w + x];
    }
  }
}
// In-place box blur; 3 passes of radius r is close to a Gaussian with sigma ~ r.
function boxBlur(a, w, h, r, passes, tmp) {
  if (r < 1) return a;
  tmp = tmp || new Float32Array(a.length);
  for (let p = 0; p < passes; p++) { blurH(a, tmp, w, h, r); blurV(tmp, a, w, h, r); }
  return a;
}

// Guided filter (He et al.): the cutout follows the edges of the photo itself.
function guidedFilter(I, p, w, h, r, eps) {
  const N = w * h, tmp = new Float32Array(N);
  const mI = Float32Array.from(I), mP = Float32Array.from(p), mIP = new Float32Array(N), mII = new Float32Array(N);
  for (let i = 0; i < N; i++) { mIP[i] = I[i] * p[i]; mII[i] = I[i] * I[i]; }
  boxBlur(mI, w, h, r, 1, tmp); boxBlur(mP, w, h, r, 1, tmp); boxBlur(mIP, w, h, r, 1, tmp); boxBlur(mII, w, h, r, 1, tmp);
  const A = mIP, B = mII; // reuse buffers
  for (let i = 0; i < N; i++) {
    const a = (mIP[i] - mI[i] * mP[i]) / (mII[i] - mI[i] * mI[i] + eps);
    A[i] = a; B[i] = mP[i] - a * mI[i];
  }
  boxBlur(A, w, h, r, 1, tmp); boxBlur(B, w, h, r, 1, tmp);
  const q = mP;
  for (let i = 0; i < N; i++) q[i] = A[i] * I[i] + B[i];
  return q;
}

// Bilinear resample of a float plane (mask sizes can differ from the input size).
function resample(src, sw, sh, dw, dh) {
  if (sw === dw && sh === dh) return src;
  const out = new Float32Array(dw * dh), kx = sw / dw, ky = sh / dh;
  for (let y = 0; y < dh; y++) {
    const fy = clamp((y + 0.5) * ky - 0.5, 0, sh - 1), y0 = fy | 0, y1 = Math.min(y0 + 1, sh - 1), ty = fy - y0;
    for (let x = 0; x < dw; x++) {
      const fx = clamp((x + 0.5) * kx - 0.5, 0, sw - 1), x0 = fx | 0, x1 = Math.min(x0 + 1, sw - 1), tx = fx - x0;
      const a = src[y0 * sw + x0], b = src[y0 * sw + x1], c = src[y1 * sw + x0], d = src[y1 * sw + x1];
      out[y * dw + x] = (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
    }
  }
  return out;
}

// Seg-size copy of the photo + grey guide in [0, 1].
function prepareSeg() {
  const k = Math.min(1, SEG_LONG / Math.max(S.W, S.H));
  const w = Math.max(1, Math.round(S.W * k)), h = Math.max(1, Math.round(S.H * k));
  freeCanvas(S.seg);
  const c = canvas(w, h), g = ctx2d(c, { willReadFrequently: true });
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
  g.drawImage(S.src, 0, 0, w, h);
  const d = g.getImageData(0, 0, w, h).data, N = w * h, gray = new Float32Array(N);
  for (let i = 0, p = 0; i < N; i++, p += 4) gray[i] = (d[p] * 0.2126 + d[p + 1] * 0.7152 + d[p + 2] * 0.0722) / 255;
  Object.assign(S, { seg: c, segW: w, segH: h, segRGBA: d, gray });
}

// AI cutout -> subject probability at seg size.
async function cutout() {
  const key = S.mode === "object" ? "object" : PERSON_KEY;
  const seg = await loadSegmenter(key);
  const t0 = T();
  const res = S.mode === "object" ? seg.segment(S.seg, { keypoint: { x: S.point.x, y: S.point.y } }) : seg.segment(S.seg);
  const masks = res.confidenceMasks || [];
  if (!masks.length) { res.close && res.close(); throw new Error("The AI model returned no mask."); }
  // Multi-class person model (6 masks): mask 0 = background. Single-mask models (selfie, magic_touch): mask 0 = subject.
  const pick = masks[0];
  const mw = pick.width, mh = pick.height, raw = Float32Array.from(pick.getAsFloat32Array());
  if (masks.length > 1) for (let i = 0; i < raw.length; i++) raw[i] = 1 - raw[i];
  TEST.info.masks = masks.length; TEST.info.maskSize = `${mw}x${mh}`;
  res.close && res.close();
  const t1 = T();
  return { prob: resample(raw, mw, mh, S.segW, S.segH), ms: t1 - t0 };
}

// Snap the cutout to the photo's edges, firm it up, feather it slightly.
function refineMask(prob) {
  const w = S.segW, h = S.segH, N = w * h;
  const r = Math.max(2, Math.round(Math.max(w, h) * 0.008));
  const q = guidedFilter(S.gray, prob, w, h, r, 1e-3);
  let cover = 0;
  for (let i = 0; i < N; i++) {
    let x = (q[i] - 0.25) * 2;
    x = x < 0 ? 0 : x > 1 ? 1 : x;
    q[i] = x * x * (3 - 2 * x);
    cover += q[i];
  }
  boxBlur(q, w, h, 1, 2);
  S.mask = q; S.cover = cover / N;
  if (!S.maskCv || S.maskCv.width !== w || S.maskCv.height !== h) { freeCanvas(S.maskCv); S.maskCv = canvas(w, h); }
  const img = new ImageData(w, h), a = img.data;
  for (let i = 0; i < N; i++) a[i * 4 + 3] = Math.round(q[i] * 255);
  ctx2d(S.maskCv).putImageData(img, 0, 0);
}

// ---------- light: gentle levels + exposure, weighted to the subject ----------
function buildLut() {
  const lut = new Uint8ClampedArray(256);
  if (!S.light) { for (let i = 0; i < 256; i++) lut[i] = i; S.lightInfo = "off"; return lut; }
  const d = S.segRGBA, m = S.mask, N = S.segW * S.segH;
  const hAll = new Float64Array(256), hSub = new Float64Array(256);
  let sub = 0;
  for (let i = 0, p = 0; i < N; i++, p += 4) {
    const y = (d[p] * 54 + d[p + 1] * 183 + d[p + 2] * 19) >> 8;
    hAll[y] += 1;
    if (m) { hSub[y] += m[i]; sub += m[i]; }
  }
  const pct = (hist, q) => {
    let tot = 0; for (let i = 0; i < 256; i++) tot += hist[i];
    let c = 0; for (let i = 0; i < 256; i++) { c += hist[i]; if (c >= q * tot) return i; }
    return 255;
  };
  const lo = Math.min(pct(hAll, 0.004), 40), hi = Math.max(pct(hAll, 0.996), 200);
  const S_LEVELS = 0.7; // only 70% of the full stretch
  const lev = (i) => S_LEVELS * clamp((i - lo) / (hi - lo), 0, 1) + (1 - S_LEVELS) * (i / 255);
  const med = lev(pct(sub > N * 0.02 ? hSub : hAll, 0.5));
  let gamma = clamp(Math.log(0.46) / Math.log(clamp(med, 0.02, 0.98)), 0.72, 1.2);
  gamma = 1 + (gamma - 1) * 0.75;
  for (let i = 0; i < 256; i++) lut[i] = Math.round(Math.pow(lev(i), gamma) * 255);
  S.lightInfo = `levels ${lo}-${hi}, gamma ${gamma.toFixed(2)}`;
  return lut;
}

// Full-size subject layer: light LUT + light unsharp mask (radius 1, with a noise threshold).
function makeSharp() {
  const W = S.W, H = S.H, lut = S.lut;
  const a = ctx2d(S.src, { willReadFrequently: true }).getImageData(0, 0, W, H).data;
  for (let p = 0; p < a.length; p += 4) { a[p] = lut[a[p]]; a[p + 1] = lut[a[p + 1]]; a[p + 2] = lut[a[p + 2]]; }
  const out = new ImageData(W, H), o = out.data, row = W * 4, K = 0.15, THR = 6;
  o.set(a);
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1, p = y * row + 4; x < W - 1; x++, p += 4) {
      for (let c = p; c < p + 3; c++) {
        const v = a[c], lap = 4 * v - a[c - 4] - a[c + 4] - a[c - row] - a[c + row];
        if (lap > THR || lap < -THR) o[c] = v + K * lap;
      }
    }
  }
  if (!S.sharp) S.sharp = canvas(W, H);
  ctx2d(S.sharp).putImageData(out, 0, 0);
}

// Background layer at reduced size: blur in (approximate) linear light so highlights bloom like a lens,
// normalised by a "how much background" weight so the subject's colours do not bleed into it,
// and progressive: lighter blur next to the subject, full blur farther away.
function makeBackground() {
  const strength = S.blur / 100;
  freeCanvas(S.bgCv); S.bgCv = null;
  if (strength <= 0 || S.cover < 0.004) return;
  const longF = Math.max(S.W, S.H), sigmaF = strength * 0.03 * longF;
  const bl = clamp(Math.round((longF * 7) / Math.max(sigmaF, 1)), 384, Math.min(1280, longF));
  const k = bl / longF, w = Math.max(1, Math.round(S.W * k)), h = Math.max(1, Math.round(S.H * k)), N = w * h;
  const c = canvas(w, h), g = ctx2d(c, { willReadFrequently: true });
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
  g.drawImage(S.src, 0, 0, w, h);
  const img = g.getImageData(0, 0, w, h), d = img.data;
  g.clearRect(0, 0, w, h);
  g.drawImage(S.maskCv, 0, 0, w, h);
  const md = g.getImageData(0, 0, w, h).data;
  const lin = new Float32Array(256);
  for (let i = 0; i < 256; i++) { const v = S.lut[i] / 255; lin[i] = v * v; }
  const R = new Float32Array(N), G = new Float32Array(N), B = new Float32Array(N), Wt = new Float32Array(N), near = new Float32Array(N);
  for (let i = 0, p = 0; i < N; i++, p += 4) {
    const m = md[p + 3] / 255, wt = 0.02 + 0.98 * clamp(1 - 2 * m, 0, 1);
    R[i] = lin[d[p]] * wt; G[i] = lin[d[p + 1]] * wt; B[i] = lin[d[p + 2]] * wt; Wt[i] = wt; near[i] = m;
  }
  const rs = [R.slice(), G.slice(), B.slice(), Wt.slice()], rl = [R, G, B, Wt], tmp = new Float32Array(N);
  const sigma = sigmaF * k, rL = Math.max(1, Math.round(sigma)), rS = Math.max(1, Math.round(sigma * 0.35));
  for (const pl of rl) boxBlur(pl, w, h, rL, 3, tmp);
  for (const pl of rs) boxBlur(pl, w, h, rS, 3, tmp);
  boxBlur(near, w, h, Math.max(2, Math.round(0.06 * Math.max(w, h))), 2, tmp);
  for (let i = 0, p = 0; i < N; i++, p += 4) {
    let t = clamp(near[i] * 2.2, 0, 1);
    t = t * t * (3 - 2 * t) * 0.65;
    const wl = rl[3][i], ws = rs[3][i];
    for (let ch = 0; ch < 3; ch++) {
      const v = (rl[ch][i] / wl) * (1 - t) + (rs[ch][i] / ws) * t;
      d[p + ch] = Math.sqrt(v > 0 ? v : 0) * 255 + 0.5;
    }
    d[p + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  S.bgCv = c;
  S.bgInfo = `${w}x${h}, sigma ${sigma.toFixed(1)} px`;
}

function composite() {
  const g = ctx2d(S.out);
  g.globalCompositeOperation = "copy";
  g.drawImage(S.sharp, 0, 0);
  if (S.bgCv) {
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
    g.globalCompositeOperation = "destination-in";
    g.drawImage(S.maskCv, 0, 0, S.W, S.H);
    g.globalCompositeOperation = "destination-over";
    g.drawImage(S.bgCv, 0, 0, S.W, S.H);
  }
  g.globalCompositeOperation = "source-over";
}

// ---------- orchestration ----------
const LEVEL = { blur: 1, light: 2, mask: 3, photo: 4 };
let pendingFile = null;
function request(kind, file) {
  if (file) pendingFile = file;
  if (!S.queued || LEVEL[kind] > LEVEL[S.queued]) S.queued = kind;
  if (!S.busy) pump();
}
async function pump() {
  S.busy = true;
  while (S.queued) {
    const kind = S.queued;
    S.queued = null;
    try { await run(kind); } catch (e) { console.error(e); status(e && e.message ? e.message : String(e), true); progress(null); }
  }
  S.busy = false;
  $("cmp-busy").hidden = true;
}

function mount() {
  $("slot-after").replaceChildren(S.out);
  $("slot-before").replaceChildren(S.src);
  S.out.setAttribute("aria-label", "Result photo"); S.src.setAttribute("aria-label", "Original photo");
}

async function run(kind) {
  if (kind !== "photo" && !S.src) return;
  TEST.state = "working";
  const t = {};
  $("cmp-busy").hidden = $("result").hidden;
  if (kind === "photo") {
    const file = pendingFile;
    pendingFile = null;
    status("Opening the photo…");
    await nextFrame();
    let a = T();
    const dec = await decodeToCanvas(file);
    freeCanvas(S.src); freeCanvas(S.sharp); freeCanvas(S.out); freeCanvas(S.bgCv);
    Object.assign(S, { src: dec.c, W: dec.W, H: dec.H, sharp: null, bgCv: null, out: canvas(dec.W, dec.H), dec, point: { x: 0.5, y: 0.45 } });
    prepareSeg();
    t.decode = T() - a;
    mount();
    $("result").hidden = false;
    $("cmp-busy").hidden = false;
    placeDot();
    TEST.info = { inW: dec.inW, inH: dec.inH, W: dec.W, H: dec.H, orient: dec.orient, browserAppliesExif: dec.auto, manualTurn: dec.manual, fileType: file.type, fileBytes: file.size };
  }
  if (LEVEL[kind] >= LEVEL.mask) {
    status(S.mode === "object" ? "Finding the object at the dot…" : "Finding the person…");
    await nextFrame();
    const c = await cutout();
    t.cutout = c.ms;
    const a = T();
    refineMask(c.prob);
    t.edges = T() - a;
  }
  if (LEVEL[kind] >= LEVEL.light) {
    status("Fixing the light and sharpening…");
    await nextFrame();
    const a = T();
    S.lut = buildLut();
    makeSharp();
    t.light = T() - a;
  }
  let a = T();
  makeBackground();
  t.blur = T() - a;
  a = T();
  composite();
  t.mix = T() - a;
  const total = Object.values(t).reduce((s, v) => s + v, 0);
  TEST.times.last = Object.fromEntries(Object.entries(t).map(([k, v]) => [k, Math.round(v)]));
  TEST.times.last.total = Math.round(total);
  TEST.times.lastKind = kind;
  if (kind === "photo") TEST.times.photo = TEST.times.last;
  TEST.renders++;
  showStats(kind, t, total);
  scheduleBlob();
  TEST.state = "done";
}

const STEP_NAMES = { decode: "open", cutout: "AI cutout", edges: "edges", light: "light + sharpen", blur: "blur", mix: "mix" };
function showStats(kind, t, total) {
  $("k-time").textContent = `${fmt(total)} ms`;
  $("k-out").textContent = `${S.W} × ${S.H}`;
  $("k-in").textContent = `${S.dec.inW} × ${S.dec.inH}`;
  const lm = TEST.times[`load_${S.mode === "object" ? "object" : PERSON_KEY}`];
  $("k-model").textContent = lm ? `${fmt(lm)} ms` : "–";
  const steps = Object.entries(t).map(([k, v]) => `${STEP_NAMES[k]} ${fmt(v)}`).join(" · ");
  const o = S.dec.orient;
  const ex = o > 1 ? ` EXIF orientation ${o}, ${S.dec.manual ? "turned by the page" : "applied by the browser"}.` : "";
  $("k-steps").textContent = `${kind === "photo" ? "Full run" : "Re-run"}: ${steps} ms.${ex}`;
  if (S.cover < 0.004) {
    status(S.mode === "object" ? "No object found at the dot. Tap the subject in the photo." : "No person found. Switch to Object and tap the subject.");
  } else {
    status(`Done in ${fmt(total)} ms. Drag across the photo to compare.`);
  }
}

// ---------- download / share ----------
let blobTimer = 0;
function scheduleBlob() {
  S.blob = null;
  clearTimeout(blobTimer);
  const gen = ++S.blobGen;
  blobTimer = setTimeout(() => makeBlob(gen), 500);
}
function makeBlob(gen) {
  return new Promise((res) => S.out.toBlob((b) => { if (gen === S.blobGen) S.blob = b; res(b); }, "image/jpeg", 0.92));
}
function fileName() {
  const d = new Date(), p = (n) => String(n).padStart(2, "0");
  return `portrait-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}.jpg`;
}
function saveBlob(b) {
  const url = URL.createObjectURL(b), a = document.createElement("a"), name = fileName();
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
  $("save-note").textContent = `${name}, ${(b.size / 1048576).toFixed(1)} MB JPEG, ${S.W} × ${S.H} px. On iPhone it goes to Files › Downloads.`;
}
$("btn-dl").addEventListener("click", async () => {
  if (!S.out) return;
  if (S.blob) return saveBlob(S.blob); // ready: stays inside the tap
  const b = await makeBlob(S.blobGen);
  if (b) saveBlob(b); else status("The JPEG could not be made.", true);
});
const canShareFiles = (() => {
  try {
    const f = new File([new Blob(["x"], { type: "image/jpeg" })], "t.jpg", { type: "image/jpeg" });
    return !!(navigator.share && navigator.canShare && navigator.canShare({ files: [f] }));
  } catch (e) { return false; }
})();
$("btn-share").hidden = !canShareFiles;
$("btn-share").addEventListener("click", async () => {
  if (!S.blob) { status("Preparing the photo, tap again in a second."); await makeBlob(S.blobGen); return; }
  try { await navigator.share({ files: [new File([S.blob], fileName(), { type: "image/jpeg" })] }); }
  catch (e) { if (e.name !== "AbortError") status(`Sharing did not work: ${e.message}`, true); }
});

// ---------- controls ----------
function setSplit(v) {
  S.split = clamp(v, 0, 100);
  $("split").value = String(Math.round(S.split));
  const ins = `inset(0 ${(100 - S.split).toFixed(2)}% 0 0)`, b = $("slot-before");
  b.style.webkitClipPath = ins; b.style.clipPath = ins;
  $("cmp-line").style.left = `${S.split}%`;
}
$("split").addEventListener("input", (e) => setSplit(+e.target.value));

function placeDot() {
  const dot = $("cmp-dot");
  dot.hidden = S.mode !== "object";
  dot.style.left = `${S.point.x * 100}%`; dot.style.top = `${S.point.y * 100}%`;
}
const cmp = $("cmp");
let drag = null;
const relX = (e) => { const r = cmp.getBoundingClientRect(); return ((e.clientX - r.left) / r.width) * 100; };
cmp.addEventListener("pointerdown", (e) => { drag = { id: e.pointerId, x: e.clientX, y: e.clientY, on: false }; });
cmp.addEventListener("pointermove", (e) => {
  if (!drag || e.pointerId !== drag.id) return;
  const dx = Math.abs(e.clientX - drag.x), dy = Math.abs(e.clientY - drag.y);
  if (!drag.on && dx > 8 && dx > dy) { drag.on = true; try { cmp.setPointerCapture(e.pointerId); } catch (err) { /* old Safari */ } }
  if (drag.on) setSplit(relX(e));
});
cmp.addEventListener("pointerup", (e) => {
  if (!drag || e.pointerId !== drag.id) return;
  const was = drag.on;
  drag = null;
  if (was) return;
  if (S.mode === "object" && S.src) {
    const r = cmp.getBoundingClientRect();
    S.point = { x: clamp((e.clientX - r.left) / r.width, 0, 1), y: clamp((e.clientY - r.top) / r.height, 0, 1) };
    placeDot();
    request("mask");
  } else {
    setSplit(relX(e));
  }
});
cmp.addEventListener("pointercancel", () => { drag = null; });

document.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => {
  const m = b.dataset.mode;
  if (m === S.mode) return;
  S.mode = m;
  document.querySelectorAll("[data-mode]").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.mode === m)));
  $("mode-help").textContent = m === "object" ? "Object mode: tap the subject in the photo (the dot marks it)." : "Person mode finds people on its own.";
  placeDot();
  if (m === "object") preload("object");
  request("mask");
}));
$("blur").addEventListener("input", (e) => { S.blur = +e.target.value; $("blur-v").textContent = e.target.value; request("blur"); });
$("light").addEventListener("change", (e) => { S.light = e.target.checked; request("light"); });
for (const id of ["in-camera", "in-library"]) {
  $(id).addEventListener("change", (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (f) request("photo", f);
  });
}

// ---------- start ----------
function preload(key) {
  return loadSegmenter(key).then(() => {
    if (!S.busy) { status(S.src ? "Model ready." : "Ready. Take a photo or choose one from the library."); }
    progress(null);
    TEST.ready = true;
  }, (e) => { console.error(e); status(`The AI model could not load: ${e.message || e}`, true); progress(null); });
}
$("dl-size").textContent = `${Math.round(WASM_MB + MODELS[PERSON_KEY].mb)} MB`;
$("tech").textContent = `MediaPipe Tasks Vision ${MP_VER} (CPU) · person model ${MODELS[PERSON_KEY].name} · object model ${MODELS.object.name} · result up to ${OUT_LONG} px on the long side.`;
setSplit(50);
if (typeof WebAssembly !== "object") status("This browser cannot run the AI model (no WebAssembly).", true);
else preload(PERSON_KEY);
