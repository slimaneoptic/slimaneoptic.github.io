/*
 * mic-layer.js: a speaking step for "The Alphabet - Activity 1".
 *
 * It runs on the page next to the H5P blocks. It does not change the H5P content or the H5P.Blanks code.
 * 1. Finds each picture by its file name and adds Listen (speechSynthesis) and Say it (Web Speech API) under it.
 * 2. Speaking is the answer: when the word matches, it types the missing letter(s) into that word's blank
 *    through H5P's own input field (value + H5P's keyup/change events), so H5P's Check scores it as usual.
 *    Typing still works.
 * 3. Sound feedback: a short WebAudio "ping" + spoken praise on a match, a soft tone + "Almost, try again" when close,
 *    "Let's try again" + the model word on a miss.
 * 4. Guided flow from one Start click: model word, "Your turn", listen, feedback, fill, next picture; 2 tries per word,
 *    then it shows the word, fills it and moves on. Pause/Resume. After the last word it says "All done!"
 *    and presses Check on each H5P block.
 * 5. Builds an xAPI "answered" statement for every try (DOM event "miclayer:statement" on document).
 */
(function () {
  'use strict';

  var TOPIC = 'https://abcinternationalonline.com/topic/the-alphabet-activity-1/';
  var EXT = 'https://slimanechanchoul.com/xapi/speaking/';
  // blanks: [H5P block (1-4), blank index in that block, letter]
  var WORDS = [
    { n: 1, img: 'oranges.jpg', word: 'orange', blanks: [[1, 0, 'O']] },
    { n: 2, img: 'queen.jpg', word: 'queen', blanks: [[1, 1, 'Q']] },
    { n: 3, img: 'elephant.jpg', word: 'elephant', blanks: [[1, 2, 'h']] },
    { n: 4, img: 'grapes.jpg', word: 'grapes', blanks: [[2, 0, 'p']] },
    { n: 5, img: 'umbrella.jpg', word: 'umbrella', blanks: [[2, 1, 'm']] },
    { n: 6, img: 'violin.jpeg', word: 'violin', blanks: [[2, 2, 'l']] },
    { n: 7, img: 'nail.jpg', word: 'nail', blanks: [[3, 0, 'N']] },
    { n: 8, img: 'x-ray.jpg', word: 'x-ray', say: 'X-ray', blanks: [[3, 1, 'y']] },
    { n: 9, img: 'keys.jpg', word: 'keys', blanks: [[3, 2, 'K']] },
    { n: 10, img: 'ice-cream.jpg', word: 'ice cream', blanks: [[4, 0, 'c'], [4, 1, 'r']] }
  ];
  var ACCENTS = { 'en-ZA': 'South African English', 'en-GB': 'British English', 'en-US': 'American English' };
  var POINTS = { matched: 1, close: 0.5, again: 0 };
  var RANK = { matched: 3, close: 2, again: 1, none: 0 };
  var PRAISE = ['Well done!', 'Great job!', 'Excellent!'];

  // Guided-flow timings (ms) and speech rate: tune here.
  var TIMING = {
    rate: 0.85,          // speech rate for the model word, prompts and praise
    afterWord: 800,      // model word -> "Your turn"
    afterPrompt: 500,    // "Your turn" -> start listening
    afterPraise: 1000,   // hold after ping + praise, before typing
    perChar: 250,        // typing speed, per letter
    holdFilled: 2000,    // filled blank stays on screen
    holdBlock: 2000,     // after the last word of a block, the whole filled block stays on screen
    beforeNext: 350,     // small gap before the next picture
    scrollMax: 1500      // longest wait for a smooth scroll to settle
  };
  try { if (window.MicLayerTiming) { for (var tk in window.MicLayerTiming) { TIMING[tk] = window.MicLayerTiming[tk]; } } } catch (e) { /* defaults */ }

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  var SS = ('speechSynthesis' in window && window.SpeechSynthesisUtterance) ? window.speechSynthesis : null;
  var state = {
    log: [], lang: 'en-ZA', voice: null, voiceFallback: null, active: null, words: [], root: null,
    run: 0, practice: 0, flow: 'idle', flowAt: 0, praise: 0, sounds: [], tapResolve: null, utter: null
  };

  /* ---------- matching what was heard ---------- */

  function norm(s) {
    return String(s || '').toLowerCase()
      .replace(/[‘’']/g, '')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }
  function squash(s) { return s.replace(/ /g, ''); }

  function levenshtein(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) { d[i] = [i]; }
    for (j = 0; j <= n; j++) { d[0][j] = j; }
    for (i = 1; i <= m; i++) {
      for (j = 1; j <= n; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    }
    return d[m][n];
  }

  // "x ray", "xray", "X-ray." all match "x-ray"; "an orange" matches "orange";
  // "oranges" (plural/singular) and near sounds are "close"; anything else is "again".
  function grade(heard, target) {
    var h = norm(heard).replace(/^(a|an|the|some)\s+/, ''), t = squash(norm(target));
    var hs = squash(h);
    if (!hs) { return { kind: 'none' }; }
    if (hs === t) { return { kind: 'matched' }; }
    var parts = h.split(' '), i, j, best = 'again';
    if (parts.length <= 4) {
      for (i = 0; i < parts.length; i++) {
        for (j = i + 1; j <= parts.length; j++) {
          if (parts.slice(i, j).join('') === t) { return { kind: 'matched' }; }
        }
      }
    }
    if (hs === t + 's' || hs === t + 'es' || hs + 's' === t || hs + 'es' === t) { return { kind: 'close', why: 'plural' }; }
    if (levenshtein(hs, t) <= Math.max(1, Math.round(t.length / 4))) { best = 'close'; }
    return { kind: best };
  }

  function gradeAll(alts, target) {
    var best = null;
    alts.forEach(function (a) {
      var g = grade(a.text, target);
      g.heard = String(a.text || '').trim().replace(/[.,!?;:]+$/, '');
      g.confidence = a.confidence;
      if (!best || RANK[g.kind] > RANK[best.kind]) { best = g; }
    });
    return best || { kind: 'none', heard: '' };
  }

  /* ---------- voice, sounds ---------- */

  function voicesFor(lang) {
    var L = lang.toLowerCase();
    return (SS ? SS.getVoices() : []).filter(function (v) {
      return String(v.lang || '').replace('_', '-').toLowerCase() === L;
    });
  }
  function vscore(v) { return (/natural|neural|online/i.test(v.name) ? 2 : 0) + (/google|microsoft|apple|siri/i.test(v.name) ? 1 : 0); }

  function pickVoice() {
    var lang = state.lang, list = voicesFor(lang), fellBack = null;
    if (!list.length && lang === 'en-ZA') { list = voicesFor('en-GB'); fellBack = list.length ? 'en-GB' : null; }
    if (!list.length && SS) {
      list = SS.getVoices().filter(function (v) { return /^en[-_]/i.test(v.lang || ''); });
      fellBack = list.length ? 'en' : null;
    }
    list.sort(function (a, b) { return vscore(b) - vscore(a); });
    state.voice = list[0] || null;
    state.voiceFallback = fellBack;
    showVoice();
  }

  function showVoice() {
    var el = document.getElementById('ml-voice');
    if (!el) { return; }
    if (!SS) { el.textContent = 'This browser has no speech output, so Listen is hidden.'; return; }
    var v = state.voice, wanted = ACCENTS[state.lang];
    if (!v) {
      el.textContent = 'Voice in use: the browser’s default voice (no ' + wanted + ' voice listed on this device).';
    } else if (state.voiceFallback === 'en-GB') {
      el.textContent = 'No South African English voice on this device, so the model voice falls back to British: ' + v.name + ' (' + v.lang + '). The mic still listens in en-ZA.';
    } else if (state.voiceFallback) {
      el.textContent = 'No ' + wanted + ' voice on this device, using ' + v.name + ' (' + v.lang + '). The mic still listens in ' + state.lang + '.';
    } else {
      el.textContent = 'Voice in use: ' + v.name + ' (' + v.lang + ').';
    }
    el.setAttribute('data-voice', v ? v.name + '|' + v.lang : '');
  }

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  // Speak and resolve when done (with a time limit, as some browsers skip the "end" event).
  function speak(text, rate) {
    return new Promise(function (resolve) {
      if (!SS) { resolve(); return; }
      var u = new window.SpeechSynthesisUtterance(text), done = false, timer;
      u.lang = state.lang;
      if (state.voice) {
        try { u.voice = state.voice; u.lang = String(state.voice.lang).replace('_', '-'); } catch (e) { /* default voice */ }
      }
      u.rate = rate || TIMING.rate;
      function fin() { if (!done) { done = true; clearTimeout(timer); resolve(); } }
      u.onend = fin;
      u.onerror = fin;
      timer = setTimeout(fin, 1500 + text.length * 130);
      state.utter = u; // keep a reference until it ends
      SS.speak(u);
    });
  }

  var actx = null;
  function ensureAudio() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!actx && AC) { actx = new AC(); }
      if (actx && actx.state === 'suspended') { actx.resume(); }
    } catch (e) { actx = null; }
  }

  // name: 'ping' (two bright notes) or 'soft' (one low, quiet note). Generated, no audio file.
  function tone(name) {
    state.sounds.push(name);
    var notes = name === 'ping' ? [[880, 0, 0.16], [1318.5, 0.11, 0.3]] : [[392, 0, 0.28]];
    var total = name === 'ping' ? 450 : 330;
    try {
      ensureAudio();
      if (actx) {
        var t0 = actx.currentTime + 0.02;
        notes.forEach(function (nt) {
          var o = actx.createOscillator(), g = actx.createGain(), t = t0 + nt[1];
          o.type = name === 'ping' ? 'sine' : 'triangle';
          o.frequency.setValueAtTime(nt[0], t);
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(name === 'ping' ? 0.22 : 0.12, t + 0.015);
          g.gain.exponentialRampToValueAtTime(0.0001, t + nt[2]);
          o.connect(g); g.connect(actx.destination);
          o.start(t); o.stop(t + nt[2] + 0.05);
        });
      }
    } catch (e) { /* no sound, keep going */ }
    return wait(total);
  }

  /* ---------- filling the H5P blanks ---------- */

  function blockWin(b) {
    var frames = state.root.querySelectorAll('iframe');
    var f = frames[b - 1];
    return f && f.contentWindow && f.contentWindow.document ? f.contentWindow : null;
  }
  function inputsOf(win) { return win.document.querySelectorAll('.h5p-input-wrapper > input.h5p-text-input'); }
  function visible(el) { return !!(el && el.offsetParent !== null); }

  function setInput(win, input, letter) {
    input.value = letter;
    var $ = win.H5P && win.H5P.jQuery;
    if ($) { $(input).trigger('keyup').trigger('change'); } else { input.dispatchEvent(new win.Event('change', { bubbles: true })); }
  }

  // A block that was already checked: press its own "Retry", then put back the letters already earned.
  function reopen(b) {
    var win = blockWin(b);
    if (!win) { return; }
    var retry = win.document.querySelector('.h5p-question-try-again');
    if (visible(retry)) {
      retry.click();
      state.words.forEach(function (w) {
        if (!w.filled) { return; }
        w.blanks.forEach(function (bl) {
          if (bl[0] === b) { var inp = inputsOf(win)[bl[1]]; if (inp) { setInput(win, inp, bl[2]); } }
        });
      });
    }
  }

  function fill(w) {
    w.blanks.forEach(function (bl) {
      var win = blockWin(bl[0]);
      if (!win) { return; }
      var inp = inputsOf(win)[bl[1]];
      if (!inp) { return; }
      if (inp.disabled || visible(win.document.querySelector('.h5p-question-try-again'))) {
        if (inp.value === bl[2] && inp.disabled) { return; }
        reopen(bl[0]);
        inp = inputsOf(win)[bl[1]];
      }
      if (inp) { setInput(win, inp, bl[2]); }
    });
    w.filled = true;
  }

  function pressCheckAll() {
    var pressed = 0;
    for (var b = 1; b <= 4; b++) {
      var win = blockWin(b), btn = win && win.document.querySelector('.h5p-question-check-answer');
      if (visible(btn)) { btn.click(); pressed++; }
    }
    return pressed;
  }

  /* ---------- results, feedback, xAPI ---------- */

  function record(w, alts, noFill) {
    var g = gradeAll(alts, w.word);
    if (g.kind === 'none') { feedback(w, 'again', 'I didn’t catch a word.'); return g; }
    var pts = POINTS[g.kind];
    w.tries += 1;
    if (w.best === null || pts > w.best) { w.best = pts; }
    if (g.kind === 'matched') {
      if (!noFill) { fill(w); }
      feedback(w, 'matched', '✓ Matched: I heard “' + g.heard + '”. ' + (w.blanks.length > 1 ? 'Letters' : 'Letter') + ' filled in.');
    } else if (g.kind === 'close') {
      feedback(w, 'close', 'Close: I heard “' + g.heard + '”. ' + (g.why === 'plural' ? 'Listen to the end of the word and try again.' : 'Listen and try once more.'));
    } else {
      feedback(w, 'again', 'Try again: I heard “' + g.heard + '”.');
    }
    w.score$.textContent = 'Score ' + (w.best === 0.5 ? '0.5' : String(w.best)) + ' / 1, ' + w.tries + (w.tries === 1 ? ' try' : ' tries');
    w.score$.hidden = false;
    w.fig.setAttribute('data-result', g.kind);
    total();
    emit(statement(w, g, pts));
    return g;
  }

  // The sound + voice after a try. last=true: no "try again" (the flow moves on).
  function react(kind, w, isStale) {
    if (kind === 'matched') {
      return tone('ping').then(function () {
        if (isStale()) { return; }
        var p = PRAISE[state.praise++ % PRAISE.length];
        return speak(p);
      });
    }
    if (kind === 'close') {
      return tone('soft').then(function () { if (!isStale()) { return speak('Almost, try again'); } });
    }
    return speak('Let’s try again').then(function () { if (!isStale()) { return wait(200).then(function () { if (!isStale()) { return speak(w.say || w.word); } }); } });
  }

  function feedback(w, kind, text) {
    w.fb$.textContent = text;
    w.fb$.className = 'ml-fb ml-' + kind;
  }

  function total() {
    var el = document.getElementById('ml-total');
    var t = totals();
    if (el) { el.innerHTML = 'Speaking score: <b>' + t.sum + ' / ' + state.words.length + '</b> (' + t.m + ' matched, ' + t.c + ' close)'; }
    return t;
  }
  function totals() {
    var sum = 0, m = 0, c = 0;
    state.words.forEach(function (w) {
      if (w.best !== null) { sum += w.best; }
      if (w.best === 1) { m++; } else if (w.best === 0.5) { c++; }
    });
    return { sum: Math.round(sum * 10) / 10, m: m, c: c };
  }

  function statement(w, g, pts) {
    var ext = {};
    ext[EXT + 'match'] = g.kind;
    ext[EXT + 'recognition-lang'] = state.lang;
    if (typeof g.confidence === 'number') { ext[EXT + 'confidence'] = Math.round(g.confidence * 100) / 100; }
    return {
      actor: { objectType: 'Agent', name: 'Student (preview)', account: { homePage: 'https://abcinternationalonline.com', name: 'logged-in-student' } },
      verb: { id: 'http://adlnet.gov/expapi/verbs/answered', display: { 'en-US': 'answered' } },
      object: {
        objectType: 'Activity',
        id: TOPIC + '#say-' + w.word.replace(/\s+/g, '-'),
        definition: {
          name: { 'en-US': 'Say it: ' + w.n + '. ' + w.word },
          type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
          interactionType: 'fill-in',
          correctResponsesPattern: [w.word]
        }
      },
      result: { score: { min: 0, max: 1, raw: pts, scaled: pts }, success: g.kind === 'matched', response: g.heard, extensions: ext },
      context: { language: state.lang, contextActivities: { parent: [{ objectType: 'Activity', id: TOPIC }] } },
      timestamp: new Date().toISOString()
    };
  }

  function emit(st) {
    var ev;
    try { ev = new CustomEvent('miclayer:statement', { detail: st }); } catch (e) { ev = document.createEvent('CustomEvent'); ev.initCustomEvent('miclayer:statement', false, false, st); }
    document.dispatchEvent(ev);
  }

  /* ---------- the microphone ---------- */

  // One recognition run. Resolves with {alts:[...]} or {error:'...'}.
  function recognize(w) {
    return new Promise(function (resolve) {
      if (state.active) { try { state.active.abort(); } catch (e) { /* stopped */ } }
      var rec = new SR(), settled = false, timer;
      rec.lang = state.lang;
      rec.interimResults = false;
      rec.continuous = false;
      rec.maxAlternatives = 5;
      state.active = rec;
      w.say$.classList.add('ml-on');
      w.say$.setAttribute('aria-pressed', 'true');
      feedback(w, 'info', 'Listening… say the whole word.');
      function fin(r) {
        if (settled) { return; }
        settled = true;
        clearTimeout(timer);
        w.say$.classList.remove('ml-on');
        w.say$.setAttribute('aria-pressed', 'false');
        if (state.active === rec) { state.active = null; }
        resolve(r);
      }
      rec.onresult = function (e) {
        var res = e.results[e.resultIndex || 0] || e.results[0], alts = [], i;
        for (i = 0; res && i < res.length; i++) { alts.push({ text: res[i].transcript, confidence: res[i].confidence }); }
        fin({ alts: alts });
      };
      rec.onerror = function (e) { fin({ error: e.error || 'error' }); };
      rec.onend = function () { fin({ error: 'no-speech' }); };
      timer = setTimeout(function () { try { rec.abort(); } catch (e) { /* ignore */ } fin({ error: 'no-speech' }); }, 12000);
      try { rec.start(); } catch (err) { fin({ error: 'start-failed' }); }
    });
  }

  function errorText(err) {
    if (err === 'not-allowed' || err === 'service-not-allowed' || err === 'start-failed') { return 'The microphone is blocked. Allow it in the address bar, then try again.'; }
    if (err === 'network') { return 'The browser’s speech service is not reachable. Check the connection and try again.'; }
    return 'I didn’t hear anything. Try again.';
  }

  /* practice: one word, from its own Say it button */
  function sayIt(w) {
    if (!SR) { return; }
    pauseFlow();
    ensureAudio();
    if (SS) { SS.cancel(); }
    var token = ++state.practice;
    function stale() { return token !== state.practice; }
    recognize(w).then(function (r) {
      if (stale()) { return; }
      if (r.error) { if (r.error !== 'aborted') { feedback(w, 'again', errorText(r.error)); } return; }
      var g = record(w, r.alts);
      if (g.kind !== 'none') { return react(g.kind, w, stale); }
    });
  }

  function listen(w) {
    if (!SS) { return; }
    state.practice++;
    SS.cancel();
    speak(w.say || w.word, 0.85);
  }

  /* ---------- guided flow ---------- */

  function flowUI() {
    var start = document.getElementById('ml-start'), pause = document.getElementById('ml-pause');
    if (!start) { return; }
    var running = state.flow === 'running';
    start.hidden = running;
    pause.hidden = !running;
    start.innerHTML = state.flow === 'paused' ? '<span aria-hidden="true">▶</span> Resume (word ' + state.words[state.flowAt].n + ')'
      : state.flow === 'done' ? '<span aria-hidden="true">▶</span> Start again' : '<span aria-hidden="true">▶</span> Start';
  }
  function status(text) { var el = document.getElementById('ml-flow-status'); if (el) { el.textContent = text; } }

  function logEv(e, n, extra) {
    var o = { t: Date.now(), e: e, n: n };
    if (extra) { for (var k in extra) { o[k] = extra[k]; } }
    state.log.push(o);
  }

  // Smooth scroll, resolved when the page stops moving.
  function scrollToY(y) {
    var max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    var target = Math.max(0, Math.min(Math.round(y), max));
    try { window.scrollTo({ top: target, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, target); }
    return new Promise(function (res) {
      var last = -1, same = 0, t0 = Date.now();
      (function poll() {
        var cur = window.scrollY;
        same = cur === last ? same + 1 : 0;
        last = cur;
        if (same >= 2 || Date.now() - t0 > TIMING.scrollMax) { res(); } else { setTimeout(poll, 60); }
      })();
    });
  }
  // Centre an element (in this page or inside an H5P frame) in the window.
  function centerOn(el, win) {
    var r = el.getBoundingClientRect(), off = win && win.frameElement ? win.frameElement.getBoundingClientRect().top : 0;
    return scrollToY(window.scrollY + off + r.top + r.height / 2 - window.innerHeight / 2);
  }
  function inView(el, win) {
    var r = el.getBoundingClientRect(), off = win && win.frameElement ? win.frameElement.getBoundingClientRect().top : 0;
    var top = off + r.top;
    return top >= 0 && top + r.height <= window.innerHeight;
  }

  function focusWord(w) {
    state.words.forEach(function (x) { x.fig.classList.toggle('ml-current', x === w); });
    logEv('current', w.n);
    return centerOn(w.fig);
  }

  // Type the letter(s) into the H5P blank(s) one at a time, with a green glow, then hold.
  function typeIn(w, stale) {
    var slots = [];
    w.blanks.forEach(function (bl) {
      var win = blockWin(bl[0]), inp = win && inputsOf(win)[bl[1]];
      if (win && inp && (inp.disabled || visible(win.document.querySelector('.h5p-question-try-again')))) { reopen(bl[0]); inp = inputsOf(win)[bl[1]]; }
      if (inp) { slots.push({ win: win, inp: inp, ch: bl[2] }); }
    });
    if (!slots.length) { w.filled = true; return Promise.resolve(); }
    return centerOn(slots[0].inp, slots[0].win).then(function () {
      var chain = Promise.resolve();
      slots.forEach(function (sl) {
        chain = chain.then(function () {
          if (stale()) { return; }
          sl.inp.style.transition = 'box-shadow .25s ease, background-color .25s ease';
          sl.inp.style.boxShadow = '0 0 0 4px rgba(31, 122, 58, .55)';
          sl.inp.style.backgroundColor = '#E8F5EC';
          setInput(sl.win, sl.inp, '');
          return wait(TIMING.perChar).then(function () {
            if (stale()) { return; }
            setInput(sl.win, sl.inp, sl.ch);
            logEv('typed', w.n, { ch: sl.ch, visible: inView(sl.inp, sl.win) });
          });
        });
      });
      return chain.then(function () {
        w.filled = true;
        return wait(TIMING.holdFilled);
      }).then(function () {
        slots.forEach(function (sl) { sl.inp.style.boxShadow = ''; sl.inp.style.backgroundColor = ''; });
      });
    });
  }

  // Shown only if the browser refuses to listen without a fresh tap.
  function waitForTap(run) {
    var tap = document.getElementById('ml-tap');
    return new Promise(function (resolve) {
      tap.hidden = false;
      try { tap.focus(); } catch (e) { /* ignore */ }
      state.tapResolve = function (ok) { tap.hidden = true; state.tapResolve = null; resolve(ok && run === state.run); };
    });
  }

  function listenInFlow(w, run) {
    return recognize(w).then(function (r) {
      if (run !== state.run) { return { cancelled: true }; }
      if (r.error === 'not-allowed' || r.error === 'service-not-allowed' || r.error === 'start-failed') {
        status('Word ' + w.n + ' of 10: tap the big mic button, then say the word.');
        return waitForTap(run).then(function (ok) {
          if (!ok) { return { cancelled: true }; }
          return recognize(w).then(function (r2) {
            if (run !== state.run) { return { cancelled: true }; }
            if (r2.error === 'not-allowed' || r2.error === 'service-not-allowed' || r2.error === 'start-failed') { return { blocked: true }; }
            return r2;
          });
        });
      }
      return r;
    });
  }

  function runFlow(from) {
    var run = ++state.run;
    state.practice++;
    state.flow = 'running';
    flowUI();
    ensureAudio();
    if (SS) { SS.cancel(); }
    if (from === 0) {
      state.words.forEach(function (x) { x.filled = false; });
      for (var b = 1; b <= 4; b++) { reopen(b); }
    }
    function stale() { return run !== state.run; }

    function doWord(i) {
      if (stale()) { return Promise.resolve(); }
      if (i >= state.words.length) { return finish(); }
      var w = state.words[i], tries = 0, nextW = state.words[i + 1];
      var blockEnd = !nextW || nextW.blanks[0][0] !== w.blanks[0][0];
      state.flowAt = i;
      status('Word ' + w.n + ' of 10: listen.');
      feedback(w, 'info', '');

      function attempt() {
        if (stale()) { return Promise.resolve(); }
        status('Word ' + w.n + ' of 10: your turn, say it now.');
        return listenInFlow(w, run).then(function (r) {
          if (stale() || r.cancelled) { return; }
          if (r.blocked) {
            pauseFlow();
            status('The microphone is blocked. Allow it in the address bar, then press Resume.');
            feedback(w, 'again', errorText('not-allowed'));
            return;
          }
          tries++;
          var g = r.alts ? record(w, r.alts, true) : { kind: 'none' };
          if (!r.alts) { feedback(w, 'again', errorText(r.error)); }
          if (g.kind === 'matched') {
            status('Word ' + w.n + ' of 10: matched!');
            return react('matched', w, stale)
              .then(function () { return stale() ? null : wait(TIMING.afterPraise); })
              .then(function () { if (!stale()) { status('Word ' + w.n + ' of 10: watch the letter go in.'); return typeIn(w, stale); } })
              .then(next);
          }
          if (tries >= 2) {
            feedback(w, 'info', 'The word is “' + w.word + '”. ' + (w.blanks.length > 1 ? 'Letters' : 'Letter') + ' filled in, moving on.');
            status('Word ' + w.n + ' of 10: the word is “' + w.word + '”.');
            return speak('The word is ' + (w.say || w.word))
              .then(function () { if (!stale()) { return typeIn(w, stale); } })
              .then(next);
          }
          return react(g.kind === 'close' ? 'close' : 'again', w, stale).then(function () {
            return stale() ? null : wait(TIMING.afterPrompt);
          }).then(attempt);
        });
      }
      function next() {
        if (stale()) { return; }
        var p = Promise.resolve();
        if (blockEnd) {
          var win = blockWin(w.blanks[0][0]);
          if (win && win.frameElement) {
            p = centerOn(win.frameElement).then(function () { logEv('block', w.n); return wait(TIMING.holdBlock); });
          }
        }
        return p.then(function () { return stale() ? null : wait(TIMING.beforeNext); }).then(function () { return doWord(i + 1); });
      }

      return focusWord(w)
        .then(function () { return stale() ? null : speak(w.say || w.word); })
        .then(function () { return stale() ? null : wait(TIMING.afterWord); })
        .then(function () { return stale() ? null : speak('Your turn'); })
        .then(function () { return stale() ? null : wait(TIMING.afterPrompt); })
        .then(attempt);
    }

    function finish() {
      if (stale()) { return; }
      state.words.forEach(function (x) { x.fig.classList.remove('ml-current'); });
      state.flow = 'done';
      state.flowAt = 0;
      flowUI();
      var t = totals();
      status('All done! Speaking score ' + t.sum + ' / 10. Check was pressed on each block for you.');
      return speak('All done!').then(function () {
        state.checked = pressCheckAll();
        logEv('done', 0);
        return wait(300);
      }).then(function () {
        var win = blockWin(1);
        if (win && win.frameElement) { return scrollToY(window.scrollY + win.frameElement.getBoundingClientRect().top - 90); }
      });
    }

    return doWord(from).then(null, function (e) { status('Something went wrong: ' + e); state.flow = 'paused'; flowUI(); });
  }

  function pauseFlow() {
    if (state.flow !== 'running') { return; }
    state.run++;
    state.flow = 'paused';
    if (state.tapResolve) { state.tapResolve(false); }
    if (state.active) { try { state.active.abort(); } catch (e) { /* stopped */ } }
    if (SS) { SS.cancel(); }
    flowUI();
    status('Paused at word ' + state.words[state.flowAt].n + '.');
  }

  /* ---------- building the buttons ---------- */

  function buildFlowBar(root) {
    var bar = document.createElement('div');
    bar.className = 'ml-flow';
    bar.innerHTML =
      '<div class="ml-flow-btns">' +
      '<button type="button" id="ml-start" class="ml-start"><span aria-hidden="true">▶</span> Start</button>' +
      '<button type="button" id="ml-pause" class="ml-pause" hidden><span aria-hidden="true">⏸</span> Pause</button>' +
      '</div>' +
      '<p id="ml-flow-status" class="ml-flow-status" aria-live="polite"></p>' +
      '<button type="button" id="ml-tap" class="ml-tap" hidden><span aria-hidden="true">🎤</span> Tap to answer</button>';
    var first = root.querySelector('.block');
    root.insertBefore(bar, first || null);
    var start = bar.querySelector('#ml-start');
    if (!SR) { start.disabled = true; start.title = 'Needs speech recognition (Chrome, Edge or Safari)'; }
    start.addEventListener('click', function () { if (SR) { runFlow(state.flow === 'paused' ? state.flowAt : 0); } });
    bar.querySelector('#ml-pause').addEventListener('click', pauseFlow);
    bar.querySelector('#ml-tap').addEventListener('click', function () { if (state.tapResolve) { state.tapResolve(true); } });
    status(SR ? 'Press Start: you hear each word, then say it.' : '');
  }

  function build() {
    var root = document.querySelector('[data-mic-layer]') || document.body;
    state.root = root;
    root.classList.add(SR ? 'ml-has-sr' : 'ml-no-sr');
    WORDS.forEach(function (def) {
      var img = root.querySelector('img[src$="/' + def.img + '"]');
      if (!img) { return; }
      var fig = img.closest('figure') || img.parentNode;
      var w = { n: def.n, word: def.word, say: def.say, blanks: def.blanks, fig: fig, tries: 0, best: null, filled: false };
      var box = document.createElement('div');
      box.className = 'ml-box';
      box.innerHTML =
        '<div class="ml-btns">' +
        '<button type="button" class="ml-listen"><span aria-hidden="true">🔊</span> Listen</button>' +
        '<button type="button" class="ml-say" aria-pressed="false"><span aria-hidden="true">🎤</span> Say it</button>' +
        '</div><p class="ml-fb" role="status" aria-live="polite"></p><p class="ml-score" hidden></p>';
      fig.appendChild(box);
      w.listen$ = box.querySelector('.ml-listen');
      w.say$ = box.querySelector('.ml-say');
      w.fb$ = box.querySelector('.ml-fb');
      w.score$ = box.querySelector('.ml-score');
      w.listen$.setAttribute('aria-label', 'Listen to word ' + def.n);
      w.say$.setAttribute('aria-label', 'Say word ' + def.n);
      if (!SS) { w.listen$.hidden = true; }
      if (!SR) { w.say$.disabled = true; w.say$.title = 'Speech recognition needs Chrome, Edge or Safari'; }
      w.listen$.addEventListener('click', function () { pauseFlow(); listen(w); });
      w.say$.addEventListener('click', function () { sayIt(w); });
      state.words.push(w);
    });
    buildFlowBar(root);

    var note = document.getElementById('ml-sr-note');
    if (note) {
      note.hidden = !!SR;
      if (!SR) {
        note.textContent = 'This browser has no speech recognition (Firefox, for example), so Start and Say it are switched off here. Listen and the written task still work. Open this page in Chrome, Edge or Safari to try the mic.';
      }
    }

    Array.prototype.forEach.call(document.querySelectorAll('input[name="ml-accent"]'), function (r) {
      r.checked = r.value === state.lang;
      r.addEventListener('change', function () { if (r.checked) { setLang(r.value); } });
    });

    if (SS) {
      pickVoice();
      if (typeof SS.addEventListener === 'function') { SS.addEventListener('voiceschanged', pickVoice); } else { SS.onvoiceschanged = pickVoice; }
    } else {
      showVoice();
    }
    total();
  }

  function setLang(lang) {
    if (!ACCENTS[lang]) { return; }
    state.lang = lang;
    if (state.flow !== 'running' && state.active) { try { state.active.abort(); } catch (e) { /* stopped */ } }
    pickVoice();
  }

  window.MicLayer = {
    words: WORDS,
    grade: grade,
    setLang: setLang,
    sounds: state.sounds,
    log: state.log,
    timing: TIMING,
    info: function () {
      return {
        lang: state.lang, recognition: !!SR, synthesis: !!SS,
        voice: state.voice ? { name: state.voice.name, lang: state.voice.lang } : null,
        voiceFallback: state.voiceFallback,
        flow: state.flow, flowAt: state.flowAt, checked: state.checked || 0,
        words: state.words.map(function (w) { return { n: w.n, word: w.word, tries: w.tries, best: w.best, filled: w.filled }; })
      };
    }
  };

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', build); } else { build(); }
})();
