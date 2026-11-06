/* Dental X-ray alignment prototype: camera or sample frames -> js-aruco2 -> Align -> indicator + log. */
(function () {
  'use strict';
  var SAMPLES = [ // rendered with OpenCV at known poses (1280x720, 60 deg field of view, 40 mm marker)
    { src: 'frames/f0.jpg', total: 0.0, h: 0.0, v: 0.0, dist: 230.1 },
    { src: 'frames/f1.jpg', total: 2.0, h: -0.68, v: 1.88, dist: 210.3 },
    { src: 'frames/f2.jpg', total: 4.5, h: 2.25, v: -3.9, dist: 240.1 },
    { src: 'frames/f3.jpg', total: 7.0, h: 4.96, v: 4.96, dist: 220.2 },
    { src: 'frames/f4.jpg', total: 10.0, h: 0.0, v: -10.0, dist: 200.1 },
    { src: 'frames/f5.jpg', total: 10.0, h: 10.0, v: 0.0, dist: 250.1 },
    { src: 'frames/f6.jpg', total: 13.0, h: -12.24, v: 4.51, dist: 230.3 },
    { src: 'frames/f7.jpg', total: 15.0, h: -10.73, v: -10.73, dist: 210.3 }];
  var SAMPLE_FOV = 60, SAMPLE_MM = 40, MAX_W = 960;
  var STATUS_TEXT = { green: 'Green: within 3°', amber: 'Amber: 3 to 6°', red: 'Red: over 6°', none: 'No marker in view' };

  function $(id) { return document.getElementById(id); }
  var canvas = $('view'), ctx = canvas.getContext('2d', { willReadFrequently: true });
  var detector = new AR.Detector({ dictionaryName: 'ARUCO_4X4_1000' });
  var video = document.createElement('video');
  video.setAttribute('playsinline', ''); video.muted = true;
  var mode = 'sample', stream = null, current = null, smooth = null, idx = 0, auto = true, timer = null, images = [];
  var log = [];

  function fmt(x, d) { var t = Math.abs(x).toFixed(d == null ? 1 : d); return +t === 0 ? t : (x > 0 ? '+' : '−') + t; }

  function analyse(cam, markerMm, smoothing) {
    var w = canvas.width, h = canvas.height;
    var img = ctx.getImageData(0, 0, w, h);
    var found = detector.detect(img).filter(function (m) { return m.id === 0; });
    if (!found.length) { smooth = null; return null; }
    var corners = Align.refineCorners(detector.grey, found[0].corners);
    var m = Align.measure(corners, cam, markerMm);
    if (smoothing) { // light smoothing of the live reading over the last few frames
      if (smooth) {
        var a = 0.4, n = m.normal, s = smooth;
        m = Align.fromNormal([s.normal[0] + a * (n[0] - s.normal[0]), s.normal[1] + a * (n[1] - s.normal[1]), s.normal[2] + a * (n[2] - s.normal[2])],
                             [s.t[0] + a * (m.t[0] - s.t[0]), s.t[1] + a * (m.t[1] - s.t[1]), s.t[2] + a * (m.t[2] - s.t[2])]);
      }
      smooth = m;
    }
    m.corners = corners;
    return m;
  }

  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

  function overlay(m) {
    var w = canvas.width, h = canvas.height, k = w / 1280, cx = w / 2, cy = h / 2;
    ctx.lineWidth = Math.max(2, 3 * k);
    ctx.strokeStyle = 'rgba(255,255,255,.9)';
    ctx.beginPath(); ctx.moveTo(cx - 18 * k, cy); ctx.lineTo(cx + 18 * k, cy); ctx.moveTo(cx, cy - 18 * k); ctx.lineTo(cx, cy + 18 * k); ctx.stroke();
    if (!m) return;
    var col = { green: '#1f9d55', amber: '#e3a008', red: '#d64545' }[m.status];
    ctx.strokeStyle = col; ctx.lineWidth = Math.max(3, 5 * k);
    ctx.beginPath();
    m.corners.forEach(function (p, i) { if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); });
    ctx.closePath(); ctx.stroke();
    if (m.status !== 'green') { // arrow: which way to aim the tube
      var len = Math.min(m.total * 14, 180) * k, ang = Math.atan2(m.vertical, m.horizontal);
      var ex = cx + len * Math.cos(ang), ey = cy + len * Math.sin(ang);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey);
      ctx.moveTo(ex, ey); ctx.lineTo(ex - 16 * k * Math.cos(ang - 0.45), ey - 16 * k * Math.sin(ang - 0.45));
      ctx.moveTo(ex, ey); ctx.lineTo(ex - 16 * k * Math.cos(ang + 0.45), ey - 16 * k * Math.sin(ang + 0.45));
      ctx.stroke();
    }
  }

  function show(m) {
    current = m;
    var st = m ? m.status : 'none';
    $('panel').className = 'panel st-' + st;
    $('stLabel').textContent = STATUS_TEXT[st];
    $('corr').textContent = m ? m.correction : 'Point the camera at the printed marker, or play the sample frames.';
    $('mH').textContent = m ? fmt(m.horizontal) + '°' : '–';
    $('mV').textContent = m ? fmt(m.vertical) + '°' : '–';
    $('mT').textContent = m ? m.total.toFixed(1) + '°' : '–';
    $('mD').textContent = m ? Math.round(m.distance) + ' mm' : '–';
    $('mR').textContent = m ? m.risk.toFixed(0) + ' %' : '–';
    $('ok').disabled = $('bad').disabled = !m;
  }

  // ---- sample frames ----
  function drawSample() {
    var s = SAMPLES[idx], im = images[idx];
    if (!im || !im.complete || !im.naturalWidth) return;
    canvas.width = im.naturalWidth; canvas.height = im.naturalHeight;
    ctx.drawImage(im, 0, 0);
    var m = analyse(Align.camFromFov(canvas.width, canvas.height, SAMPLE_FOV), SAMPLE_MM, false);
    overlay(m); show(m);
    $('truth').textContent = 'Sample ' + (idx + 1) + ' of ' + SAMPLES.length + ': rendered at a true tilt of ' + s.total.toFixed(1) +
      '° (horizontal ' + fmt(s.h) + '°, vertical ' + fmt(s.v) + '°), ' + Math.round(s.dist) + ' mm away.';
    document.querySelectorAll('#chips button').forEach(function (b, i) { b.setAttribute('aria-pressed', i === idx ? 'true' : 'false'); });
  }

  function startSamples() {
    stopCamera();
    mode = 'sample';
    $('modeLine').textContent = 'Playing sample frames (synthetic images at known angles; exact camera model).';
    $('chipsRow').hidden = false; $('truth').hidden = false;
    var pending = SAMPLES.length;
    if (!images.length) {
      images = SAMPLES.map(function (s) {
        var im = new Image();
        im.onload = function () { if (--pending === 0 || images.indexOf(im) === idx) drawSample(); };
        im.src = s.src; return im;
      });
    } else drawSample();
    setAuto(auto);
  }

  function setAuto(on) {
    auto = on;
    $('auto').setAttribute('aria-pressed', on ? 'true' : 'false');
    $('auto').textContent = on ? 'Pause' : 'Auto-play';
    clearInterval(timer);
    if (on && mode === 'sample') timer = setInterval(function () { idx = (idx + 1) % SAMPLES.length; drawSample(); }, 2500);
  }

  // ---- camera ----
  function stopCamera() {
    if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
    stream = null; smooth = null;
    $('camBtn').textContent = 'Use my camera';
  }

  function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      $('modeLine').textContent = 'This browser gives no camera access here. Use the sample frames.'; return;
    }
    $('modeLine').textContent = 'Asking for the camera…';
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
      .then(function (s) {
        clearInterval(timer);
        stream = s; mode = 'camera'; video.srcObject = s;
        $('chipsRow').hidden = true; $('truth').hidden = true;
        $('camBtn').textContent = 'Stop camera';
        $('modeLine').textContent = 'Live camera. Angles are approximate: your camera is not calibrated (assumed field of view ' + fov() + '°).';
        video.play();
        requestAnimationFrame(loop);
      })
      .catch(function (e) {
        $('modeLine').textContent = 'No camera (' + (e && e.name ? e.name : 'blocked') + '). The sample frames still work.';
        startSamples();
      });
  }

  function fov() { var v = parseFloat($('fov').value); return v >= 20 && v <= 120 ? v : 60; }
  function markerMm() { var v = parseFloat($('mm').value); return v >= 5 && v <= 500 ? v : 40; }

  function loop() {
    if (mode !== 'camera' || !stream) return;
    if (video.readyState >= 2 && video.videoWidth) {
      var sc = Math.min(1, MAX_W / video.videoWidth), w = Math.round(video.videoWidth * sc), h = Math.round(video.videoHeight * sc);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      ctx.drawImage(video, 0, 0, w, h);
      var m = analyse(Align.camFromFov(w, h, fov()), markerMm(), true);
      overlay(m); show(m);
    }
    requestAnimationFrame(loop);
  }

  // ---- log ----
  function rate(label) {
    if (!current) return;
    var m = current, row = {
      time: new Date().toISOString().replace('T', ' ').slice(0, 19), source: mode === 'camera' ? 'camera' : 'sample ' + (idx + 1),
      h: m.horizontal.toFixed(2), v: m.vertical.toFixed(2), total: m.total.toFixed(2), dist: m.distance.toFixed(1),
      status: m.status, risk: m.risk.toFixed(1), rating: label };
    log.push(row);
    var tr = document.createElement('tr');
    [row.time, row.source, row.h, row.v, row.total, row.dist, row.status, row.risk, row.rating].forEach(function (x, i) {
      var td = document.createElement('td'); td.textContent = x; if (i >= 2 && i <= 5 || i === 7) td.className = 'num'; tr.appendChild(td);
    });
    tr.className = 'r-' + row.status;
    $('logBody').appendChild(tr);
    $('logCount').textContent = log.length + (log.length === 1 ? ' row' : ' rows');
    $('csv').disabled = $('clear').disabled = false;
  }

  function csv() {
    var head = 'time_utc,source,horizontal_deg,vertical_deg,total_deg,distance_mm,status,simulated_risk_pct,rating';
    var body = log.map(function (r) { return [r.time, r.source, r.h, r.v, r.total, r.dist, r.status, r.risk, r.rating].join(','); });
    var blob = new Blob([head + '\n' + body.join('\n') + '\n'], { type: 'text/csv' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'alignment-log.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  // ---- wire up ----
  var chips = $('chips');
  SAMPLES.forEach(function (s, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = s.total.toFixed(s.total % 1 ? 1 : 0) + '°'; b.title = 'Sample ' + (i + 1) + ', true tilt ' + s.total + '°';
    b.setAttribute('data-i', i);
    b.addEventListener('click', function () { idx = i; setAuto(false); drawSample(); });
    chips.appendChild(b);
  });
  $('auto').addEventListener('click', function () { setAuto(!auto); });
  $('camBtn').addEventListener('click', function () { if (stream) startSamples(); else startCamera(); });
  $('sampleBtn').addEventListener('click', function () { idx = 0; startSamples(); });
  $('ok').addEventListener('click', function () { rate('Acceptable'); });
  $('bad').addEventListener('click', function () { rate('Unacceptable'); });
  $('csv').addEventListener('click', csv);
  $('clear').addEventListener('click', function () {
    log = []; $('logBody').innerHTML = ''; $('logCount').textContent = '0 rows'; $('csv').disabled = $('clear').disabled = true;
  });
  show(null);
  startSamples();
})();
