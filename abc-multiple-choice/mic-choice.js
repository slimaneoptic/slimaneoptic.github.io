/*
 * mic-choice.js: a speaking step for "Activity 96 Multiple choice".
 *
 * It runs on the page next to the H5P blocks and does not change the H5P content or code.
 * The student sees the picture and says the word. The spoken word picks the option in H5P's own list and
 * presses H5P's own Check, so H5P scores it as usual. Clicking still works.
 *
 * Matching reads what the browser heard in rank order and takes the first result that is one of the options,
 * so a sound-alike lower in the list (say "beast" under a clear "feast") cannot turn a wrong answer into a right one.
 * Two chances, then the answer, then the next picture.
 */
(function () {
  'use strict';

  var TOPIC = 'https://abcinternationalonline.com/topic/activity-96-multiple-choice/';
  var EXT = 'https://slimanechanchoul.com/xapi/speaking/';
  var ITEMS = window.MIC_CHOICE_ITEMS || [];
  // The browser spells some spoken words another way. These count as the same word.
  var SAME = {
    tea: ['t', 'tee'], tee: ['t', 'tea'], bee: ['b', 'be'], bean: ['been'], key: ['quay'], sea: ['see', 'c'],
    flea: ['flee'], tease: ['teas', 'tees'], team: ['teem']
  };
  var ACCENTS = { 'en-GB': 'British English', 'en-ZA': 'South African English', 'en-US': 'American English' };
  var POINTS = { matched: 1, close: 0.5, wrong: 0, again: 0 };
  var PRAISE = ['Well done!', 'Great job!', 'Excellent!'];
  var TIMING = {
    rate: 0.85, afterPrompt: 400, afterPraise: 500, afterPick: 700, holdResult: 1800, beforeNext: 350, scrollMax: 1500
  };

  function SRC() { return window.SpeechRecognition || window.webkitSpeechRecognition || null; }
  var SS = ('speechSynthesis' in window && window.SpeechSynthesisUtterance) ? window.speechSynthesis : null;
  var state = {
    lang: 'en-GB', voice: null, voiceFallback: null, active: null, items: [], root: null,
    run: 0, practice: 0, flow: 'idle', flowAt: 0, praise: 0, tapResolve: null, utter: null, log: []
  };

  // Event log for testing on this computer only. On the published page nothing is stored.
  var LOCAL = location.hostname === '127.0.0.1', SHOWLOG = /[?&]log=1/.test(location.search);
  function dbg(ev, data) {
    if (!LOCAL && !SHOWLOG) { return; }
    var row = { t: new Date().toISOString().slice(11, 23), ev: ev, d: data || null, vis: document.visibilityState, focus: document.hasFocus() };
    state.log.push(row);
    if (LOCAL) { try { localStorage.setItem('mic-log', JSON.stringify(state.log.slice(-300))); } catch (e) { /* no storage */ } }
    if (SHOWLOG) {
      var el = document.getElementById('ml-log');
      if (!el) {
        el = document.createElement('pre'); el.id = 'ml-log';
        el.style.cssText = 'font-size:11px;line-height:1.35;white-space:pre-wrap;overflow-wrap:anywhere;margin:1rem 0;padding:.6rem;border:1px solid #888;border-radius:6px;max-height:60vh;overflow:auto';
        (document.querySelector('main') || document.body).appendChild(el);
      }
      el.textContent = row.t.slice(0, 8) + ' ' + ev + (data ? ' ' + JSON.stringify(data) : '') + (row.vis === 'visible' ? '' : ' [hidden]') + '\n' + el.textContent;
    }
  }
  if (LOCAL || SHOWLOG) {
    window.addEventListener('error', function (e) { dbg('page-error', { msg: String(e.message) }); });
    window.addEventListener('unhandledrejection', function (e) { dbg('promise-error', { msg: String(e.reason) }); });
    document.addEventListener('visibilitychange', function () { dbg('visibility', null); });
  }

  /* ---------- deciding what the student said ---------- */

  function norm(s) {
    return String(s || '').toLowerCase().replace(/[‘’']/g, '').replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
  }

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

  function formsOf(word) { return [word].concat(SAME[word] || []); }

  // "a beast", "it's a beast" and "beast" all say "beast". Long sentences do not count.
  function says(text, word) {
    var parts = norm(text).split(' ').filter(Boolean), forms = formsOf(word);
    if (!parts.length || parts.length > 4) { return false; }
    return parts.some(function (p) { return forms.indexOf(p) !== -1; });
  }

  function classify(alts, item) {
    var i, a, hits, text;
    for (i = 0; i < alts.length; i++) {
      text = alts[i].text;
      a = String(text || '').trim().replace(/[.,!?;:]+$/, '');
      hits = item.options.filter(function (o) { return says(text, o); });
      if (hits.length > 1) { return { kind: 'again', why: 'many', heard: a, confidence: alts[i].confidence }; }
      if (hits.length === 1) {
        return hits[0] === item.answer
          ? { kind: 'matched', option: hits[0], heard: a, confidence: alts[i].confidence }
          : { kind: 'wrong', option: hits[0], heard: a, confidence: alts[i].confidence };
      }
    }
    if (!alts.length || !norm(alts[0].text)) { return { kind: 'none', heard: '' }; }
    var top = String(alts[0].text).trim().replace(/[.,!?;:]+$/, '');
    for (i = 0; i < alts.length; i++) {
      var h = norm(alts[i].text).replace(/^(a|an|the|some)\s+/, '').replace(/ /g, ''), t = item.answer;
      if (t.length >= 3 && h && levenshtein(h, t) <= Math.max(1, Math.round(t.length / 4))) {
        return { kind: 'close', heard: String(alts[i].text).trim().replace(/[.,!?;:]+$/, ''), confidence: alts[i].confidence };
      }
    }
    return { kind: 'again', heard: top, confidence: alts[0].confidence };
  }

  /* ---------- voice and sound ---------- */

  function voicesFor(lang) {
    var L = lang.toLowerCase();
    return (SS ? SS.getVoices() : []).filter(function (v) { return String(v.lang || '').replace('_', '-').toLowerCase() === L; });
  }
  function vscore(v) { return (/natural|neural|online/i.test(v.name) ? 2 : 0) + (/google|microsoft|apple|siri/i.test(v.name) ? 1 : 0); }

  function pickVoice() {
    var list = voicesFor(state.lang), fell = null;
    if (!list.length && state.lang === 'en-ZA') { list = voicesFor('en-GB'); fell = list.length ? 'en-GB' : null; }
    if (!list.length && SS) { list = SS.getVoices().filter(function (v) { return /^en[-_]/i.test(v.lang || ''); }); fell = list.length ? 'en' : null; }
    list.sort(function (a, b) { return vscore(b) - vscore(a); });
    state.voice = list[0] || null;
    state.voiceFallback = fell;
    var el = document.getElementById('ml-voice');
    if (!el) { return; }
    var v = state.voice, wanted = ACCENTS[state.lang];
    if (!SS) { el.textContent = 'This browser has no speech output.'; }
    else if (!v) { el.textContent = 'Voice in use: the browser’s default voice (no ' + wanted + ' voice on this device).'; }
    else if (fell) { el.textContent = 'No ' + wanted + ' voice on this device, using ' + v.name + ' (' + v.lang + '). The mic still listens in ' + state.lang + '.'; }
    else { el.textContent = 'Voice in use: ' + v.name + ' (' + v.lang + ').'; }
  }

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function speak(text, rate) {
    return new Promise(function (resolve) {
      if (!SS) { resolve(); return; }
      var u = new window.SpeechSynthesisUtterance(text), done = false, timer;
      u.lang = state.lang;
      if (state.voice) { try { u.voice = state.voice; u.lang = String(state.voice.lang).replace('_', '-'); } catch (e) { /* default */ } }
      u.rate = rate || TIMING.rate;
      function fin() { if (!done) { done = true; clearTimeout(timer); resolve(); } }
      u.onend = fin; u.onerror = fin;
      timer = setTimeout(fin, 1500 + text.length * 130);
      state.utter = u;
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
  function tone(name) {
    var notes = name === 'ping' ? [[880, 0, 0.16], [1318.5, 0.11, 0.3]] : name === 'tick' ? [[660, 0, 0.1]] : [[392, 0, 0.28]];
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
    return wait(name === 'ping' ? 450 : 330);
  }

  /* ---------- working H5P's own controls ---------- */

  function winOf(w) {
    var f = document.querySelector('#h5p-' + w.n + ' iframe');
    return f && f.contentWindow && f.contentWindow.document ? f.contentWindow : null;
  }
  function visible(el) { return !!(el && el.offsetParent !== null); }
  function button(win, cls) { return win ? win.document.querySelector('.h5p-question-' + cls) : null; }

  function reopen(w) {
    var win = winOf(w), retry = button(win, 'try-again');
    if (visible(retry)) { retry.click(); }
  }

  function pick(w, option) {
    var win = winOf(w);
    if (!win) { return false; }
    reopen(w);
    var list = win.document.querySelectorAll('.h5p-answer'), i;
    for (i = 0; i < list.length; i++) {
      if (norm(list[i].textContent) === option) {
        if (list[i].getAttribute('aria-checked') !== 'true') { list[i].click(); }
        return true;
      }
    }
    return false;
  }

  function check(w) { var b = button(winOf(w), 'check-answer'); if (visible(b)) { b.click(); return true; } return false; }
  function showSolution(w) { var b = button(winOf(w), 'show-solution'); if (visible(b)) { b.click(); return true; } return false; }

  /* ---------- results ---------- */

  function feedback(w, kind, text) { w.fb$.textContent = text; w.fb$.className = 'ml-fb ml-' + kind; }

  function totals() {
    var sum = 0, m = 0, c = 0;
    state.items.forEach(function (w) {
      if (w.best !== null) { sum += w.best; }
      if (w.best === 1) { m++; } else if (w.best === 0.5) { c++; }
    });
    return { sum: Math.round(sum * 10) / 10, m: m, c: c };
  }
  function total() {
    var el = document.getElementById('ml-total'), t = totals();
    if (el) { el.innerHTML = 'Speaking score: <b>' + t.sum + ' / ' + state.items.length + '</b> (' + t.m + ' matched, ' + t.c + ' close)'; }
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
        objectType: 'Activity', id: TOPIC + '#say-' + w.n,
        definition: {
          name: { 'en-US': 'Say it: ' + w.n + '. ' + w.answer },
          type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
          interactionType: 'choice', correctResponsesPattern: [w.answer]
        }
      },
      result: { score: { min: 0, max: 1, raw: pts, scaled: pts }, success: g.kind === 'matched', response: g.heard, extensions: ext },
      context: { language: state.lang, contextActivities: { parent: [{ objectType: 'Activity', id: TOPIC }] } },
      timestamp: new Date().toISOString()
    };
  }

  function record(w, alts) {
    var g = classify(alts, w);
    if (g.kind === 'none') { feedback(w, 'again', 'I didn’t catch a word.'); return g; }
    var pts = POINTS[g.kind];
    w.tries += 1;
    if (w.best === null || pts > w.best) { w.best = pts; }
    if (g.kind === 'matched') { feedback(w, 'matched', '✓ I heard “' + g.heard + '”. That’s right.'); }
    else if (g.kind === 'wrong') { feedback(w, 'again', 'I heard “' + g.heard + '”. Look at the picture again.'); }
    else if (g.kind === 'close') { feedback(w, 'close', 'Close: I heard “' + g.heard + '”. Try once more.'); }
    else if (g.why === 'many') { feedback(w, 'again', 'I heard “' + g.heard + '”. Say just one word.'); }
    else { feedback(w, 'again', 'I heard “' + g.heard + '”. Say one of the words in the list.'); }
    w.score$.textContent = 'Score ' + (w.best === 0.5 ? '0.5' : String(w.best)) + ' / 1, ' + w.tries + (w.tries === 1 ? ' try' : ' tries');
    w.score$.hidden = false;
    w.fig.setAttribute('data-result', g.kind);
    total();
    emit(statement(w, g, pts));
    return g;
  }

  function emit(st) { document.dispatchEvent(new CustomEvent('miclayer:statement', { detail: st })); }

  /* ---------- the microphone ---------- */

  function recognize(w) {
    return new Promise(function (resolve) {
      if (state.active) { try { state.active.abort(); } catch (e) { /* stopped */ } }
      var Rec = SRC(), rec = new Rec(), settled = false, timer, readyTimer, isReady = false, gotSound = false, latest = null;
      rec.lang = state.lang; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 5;
      state.active = rec;
      feedback(w, 'info', 'Getting the mic ready…');
      dbg('recognize', { picture: w.n, lang: rec.lang, flow: state.flow });

      // Only tell the student to speak once the microphone is really on.
      function ready() {
        if (isReady || settled) { return; }
        isReady = true;
        w.say$.classList.add('ml-on');
        w.say$.setAttribute('aria-pressed', 'true');
        feedback(w, 'info', 'Speak now…');
        if (state.flow === 'running') { status('Picture ' + w.n + ' of ' + state.items.length + ': speak now.'); }
        tone('tick');
      }
      readyTimer = setTimeout(ready, 1500);
      ['start', 'audiostart', 'soundstart', 'speechstart', 'speechend', 'soundend', 'audioend'].forEach(function (ev) {
        try {
          rec.addEventListener(ev, function () {
            dbg(ev, { picture: w.n });
            if (ev === 'audiostart') { ready(); }
            if (ev === 'speechstart' || ev === 'soundstart') { gotSound = true; }
          });
        } catch (e) { /* simulated mic */ }
      });

      function fin(r) {
        if (settled) { return; }
        settled = true; clearTimeout(timer); clearTimeout(readyTimer);
        dbg('finished', { picture: w.n, error: r.error || null, partial: !!r.partial, sound: gotSound, heard: r.alts ? r.alts.map(function (a) { return a.text; }) : null });
        w.say$.classList.remove('ml-on');
        w.say$.setAttribute('aria-pressed', 'false');
        if (state.active === rec) { state.active = null; }
        resolve(r);
      }
      // Without a final result, use the last partial one: short single words often never get a final result.
      function endWithoutFinal(err) {
        if (latest && latest.length) { fin({ alts: latest, partial: true }); return; }
        fin({ error: err === 'no-speech' && gotSound ? 'no-result' : err });
      }
      rec.onresult = function (e) {
        var res = e.results[e.results.length - 1], alts = [], i;
        for (i = 0; res && i < res.length; i++) {
          if (String(res[i].transcript || '').trim()) { alts.push({ text: res[i].transcript, confidence: res[i].confidence }); }
        }
        if (alts.length) { latest = alts; }
        dbg('result', { final: !!(res && res.isFinal), text: alts.map(function (a) { return a.text; }) });
        if (res && res.isFinal) { if (latest) { fin({ alts: latest }); } else { fin({ error: 'no-result' }); } }
      };
      rec.onnomatch = function () { dbg('nomatch', { picture: w.n }); endWithoutFinal('no-result'); };
      rec.onerror = function (e) { dbg('error', { picture: w.n, error: e.error || 'error' }); endWithoutFinal(e.error || 'error'); };
      rec.onend = function () { dbg('end', { picture: w.n }); endWithoutFinal('no-speech'); };
      timer = setTimeout(function () { try { rec.abort(); } catch (e) { /* ignore */ } endWithoutFinal('no-speech'); }, 12000);
      try { rec.start(); } catch (err) { dbg('start-failed', { msg: String(err) }); fin({ error: 'start-failed' }); }
    });
  }

  function errorText(err) {
    if (err === 'not-allowed' || err === 'service-not-allowed' || err === 'start-failed') { return 'The microphone is blocked. Allow it in the address bar, then try again.'; }
    if (err === 'network') { return 'The browser’s speech service is not reachable. Check the connection and try again.'; }
    if (err === 'audio-capture') { return 'No microphone was found on this device.'; }
    if (err === 'no-result') { return 'I heard you, but couldn’t make out an English word. Say it again, in English.'; }
    return 'I didn’t hear anything. Say it after the beep.';
  }

  function react(g, stale) {
    if (g.kind === 'close') { return tone('soft').then(function () { if (!stale()) { return speak('Almost, try again'); } }); }
    if (g.kind === 'wrong') { return speak('Look at the picture and try again'); }
    return speak('Let’s try again');
  }

  function afterMatch(w, stale) {
    return tone('ping').then(function () {
      if (stale()) { return; }
      return speak(PRAISE[state.praise++ % PRAISE.length]);
    }).then(function () { return stale() ? null : wait(TIMING.afterPraise); }).then(function () {
      if (stale()) { return; }
      pick(w, w.answer);
      return wait(TIMING.afterPick);
    }).then(function () {
      if (stale()) { return; }
      check(w);
      finishItem(w);
      return speak(w.answer);
    });
  }

  function finishItem(w) { w.done = true; w.hear$.hidden = !SS; }

  function sayIt(w) {
    if (!SRC()) { return; }
    pauseFlow();
    ensureAudio();
    if (SS) { SS.cancel(); }
    var token = ++state.practice;
    function stale() { return token !== state.practice; }
    recognize(w).then(function (r) {
      if (stale()) { return; }
      if (r.error) { if (r.error !== 'aborted') { feedback(w, 'again', errorText(r.error)); } return; }
      var g = record(w, r.alts);
      if (g.kind === 'matched') { return afterMatch(w, stale); }
      if (g.kind !== 'none') { return react(g, stale); }
    });
  }

  /* ---------- guided flow ---------- */

  function status(text) { var el = document.getElementById('ml-flow-status'); if (el) { el.textContent = text; } }
  function flowUI() {
    var start = document.getElementById('ml-start'), pause = document.getElementById('ml-pause');
    if (!start) { return; }
    var running = state.flow === 'running';
    start.hidden = running; pause.hidden = !running;
    start.innerHTML = state.flow === 'paused' ? '<span aria-hidden="true">▶</span> Resume (picture ' + state.items[state.flowAt].n + ')'
      : state.flow === 'done' ? '<span aria-hidden="true">▶</span> Start again' : '<span aria-hidden="true">▶</span> Start';
  }

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
  function focusItem(w) {
    state.items.forEach(function (x) { x.fig.classList.toggle('ml-current', x === w); });
    var r = w.fig.getBoundingClientRect();
    return scrollToY(window.scrollY + r.top + r.height / 2 - window.innerHeight / 2);
  }

  function waitForTap(run) {
    var tap = document.getElementById('ml-tap');
    return new Promise(function (resolve) {
      tap.hidden = false;
      state.tapResolve = function (ok) { tap.hidden = true; state.tapResolve = null; resolve(ok && run === state.run); };
    });
  }

  function isBlocked(r) { return r.error === 'not-allowed' || r.error === 'service-not-allowed' || r.error === 'start-failed'; }

  function listenInFlow(w, run) {
    return recognize(w).then(function (r) {
      if (run !== state.run) { return { cancelled: true }; }
      if (!isBlocked(r)) { return r; }
      status('Picture ' + w.n + ': tap the big mic button, then say the word.');
      return waitForTap(run).then(function (ok) {
        if (!ok) { return { cancelled: true }; }
        return recognize(w).then(function (r2) {
          if (run !== state.run) { return { cancelled: true }; }
          return isBlocked(r2) ? { blocked: true } : r2;
        });
      });
    });
  }

  function runFlow(from) {
    var run = ++state.run, count = state.items.length;
    state.practice++;
    state.flow = 'running';
    flowUI();
    ensureAudio();
    if (SS) { SS.cancel(); }
    if (from === 0) {
      state.items.forEach(function (x) {
        reopen(x);
        x.done = false; x.tries = 0; x.best = null;
        x.hear$.hidden = true; x.score$.hidden = true;
        x.fig.removeAttribute('data-result');
        feedback(x, 'info', '');
      });
      total();
    }
    function stale() { return run !== state.run; }

    function doItem(i) {
      if (stale()) { return Promise.resolve(); }
      if (i >= count) { return finish(); }
      var w = state.items[i], tries = 0, unheard = 0, lastWrong = null;
      state.flowAt = i;

      function next() {
        if (stale()) { return; }
        return wait(TIMING.holdResult).then(function () { return stale() ? null : wait(TIMING.beforeNext); })
          .then(function () { return doItem(i + 1); });
      }

      function giveAnswer() {
        feedback(w, 'info', 'The word is “' + w.answer + '”. Moving on.');
        status('Picture ' + w.n + ' of ' + count + ': the word is “' + w.answer + '”.');
        return speak('The word is ' + w.answer).then(function () {
          if (stale()) { return; }
          if (lastWrong && pick(w, lastWrong)) {
            return wait(TIMING.afterPick).then(function () {
              if (stale()) { return; }
              check(w);
              return wait(TIMING.afterPick);
            }).then(function () { if (!stale()) { showSolution(w); } });
          }
        }).then(function () { if (!stale()) { finishItem(w); } }).then(next);
      }

      function attempt() {
        if (stale()) { return Promise.resolve(); }
        status('Picture ' + w.n + ' of ' + count + ': getting the mic ready…');
        return listenInFlow(w, run).then(function (r) {
          if (stale() || r.cancelled) { return; }
          if (r.blocked) {
            pauseFlow();
            status('The microphone is blocked. Allow it in the address bar, then press Resume.');
            feedback(w, 'again', errorText('not-allowed'));
            return;
          }
          var g = r.alts ? record(w, r.alts) : { kind: 'none' };
          // Not being heard does not use up one of the two chances.
          if (g.kind === 'none') {
            if (!r.alts) { feedback(w, 'again', errorText(r.error)); }
            unheard++;
            if (unheard >= 3) { return giveAnswer(); }
            return speak(r.error === 'no-result' ? 'Say it again, in English' : 'I didn’t hear you. Say it again').then(function () {
              return stale() ? null : wait(TIMING.afterPrompt);
            }).then(attempt);
          }
          tries++;
          if (g.kind === 'matched') {
            status('Picture ' + w.n + ' of ' + count + ': that’s right!');
            return afterMatch(w, stale).then(next);
          }
          if (g.kind === 'wrong') { lastWrong = g.option; }
          if (tries >= 2) { return giveAnswer(); }
          return react(g, stale).then(function () { return stale() ? null : wait(TIMING.afterPrompt); }).then(attempt);
        });
      }

      status('Picture ' + w.n + ' of ' + count + ': look at the picture.');
      feedback(w, 'info', '');
      return focusItem(w).then(function () { return stale() ? null : speak('What is this?'); })
        .then(function () { return stale() ? null : wait(TIMING.afterPrompt); }).then(attempt);
    }

    function finish() {
      if (stale()) { return; }
      state.items.forEach(function (x) { x.fig.classList.remove('ml-current'); });
      state.flow = 'done'; state.flowAt = 0;
      flowUI();
      var t = totals();
      status('All done! Speaking score ' + t.sum + ' / ' + count + '.');
      return speak('All done!');
    }

    return doItem(from).then(null, function (e) { status('Something went wrong: ' + e); state.flow = 'paused'; flowUI(); });
  }

  function pauseFlow() {
    if (state.flow !== 'running') { return; }
    state.run++;
    state.flow = 'paused';
    if (state.tapResolve) { state.tapResolve(false); }
    if (state.active) { try { state.active.abort(); } catch (e) { /* stopped */ } }
    if (SS) { SS.cancel(); }
    flowUI();
    status('Paused at picture ' + state.items[state.flowAt].n + '.');
  }

  /* ---------- building the buttons ---------- */

  function build() {
    var root = document.querySelector('[data-mic-layer]');
    var hasSR = !!SRC();
    state.root = root;
    ITEMS.forEach(function (def) {
      var fig = document.getElementById('fig-' + def.n);
      if (!fig) { return; }
      var w = { n: def.n, answer: def.answer, options: def.options, fig: fig, tries: 0, best: null, done: false };
      var box = document.createElement('div');
      box.className = 'ml-box';
      box.innerHTML = '<div class="ml-btns"><button type="button" class="ml-say" aria-pressed="false"><span aria-hidden="true">🎤</span> Say it</button>' +
        '<button type="button" class="ml-listen" hidden><span aria-hidden="true">🔊</span> Hear it</button></div>' +
        '<p class="ml-fb" role="status" aria-live="polite"></p><p class="ml-score" hidden></p>';
      fig.appendChild(box);
      w.say$ = box.querySelector('.ml-say');
      w.hear$ = box.querySelector('.ml-listen');
      w.fb$ = box.querySelector('.ml-fb');
      w.score$ = box.querySelector('.ml-score');
      w.say$.setAttribute('aria-label', 'Say the word for picture ' + def.n);
      w.hear$.setAttribute('aria-label', 'Hear the word for picture ' + def.n);
      if (!hasSR) { w.say$.disabled = true; w.say$.title = 'Speech recognition needs Chrome, Edge or Safari'; }
      w.say$.addEventListener('click', function () { sayIt(w); });
      w.hear$.addEventListener('click', function () { pauseFlow(); state.practice++; if (SS) { SS.cancel(); speak(w.answer); } });
      state.items.push(w);
    });

    var start = document.getElementById('ml-start');
    if (!hasSR) { start.disabled = true; start.title = 'Needs speech recognition (Chrome, Edge or Safari)'; }
    start.addEventListener('click', function () { if (SRC()) { runFlow(state.flow === 'paused' ? state.flowAt : 0); } });
    document.getElementById('ml-pause').addEventListener('click', pauseFlow);
    document.getElementById('ml-tap').addEventListener('click', function () { if (state.tapResolve) { state.tapResolve(true); } });
    status(hasSR ? 'Press Start, then say the word for each picture.' : '');

    var note = document.getElementById('ml-sr-note');
    if (note && !hasSR) {
      note.hidden = false;
      note.textContent = 'This browser has no speech recognition (Firefox, for example), so Start and Say it are switched off. You can still click the answers. Open this page in Chrome, Edge or Safari to try the mic.';
    }
    Array.prototype.forEach.call(document.querySelectorAll('input[name="ml-accent"]'), function (r) {
      r.checked = r.value === state.lang;
      r.addEventListener('change', function () { if (r.checked) { setLang(r.value); } });
    });
    if (SS) {
      pickVoice();
      if (typeof SS.addEventListener === 'function') { SS.addEventListener('voiceschanged', pickVoice); }
    } else { pickVoice(); }
    total();
  }

  function setLang(lang) {
    if (!ACCENTS[lang]) { return; }
    state.lang = lang;
    if (state.flow !== 'running' && state.active) { try { state.active.abort(); } catch (e) { /* stopped */ } }
    pickVoice();
  }

  window.MicChoice = {
    classify: classify,
    timing: TIMING,
    info: function () {
      return {
        lang: state.lang, flow: state.flow, flowAt: state.flowAt, totals: totals(),
        items: state.items.map(function (w) { return { n: w.n, tries: w.tries, best: w.best, done: w.done }; })
      };
    }
  };

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', build); } else { build(); }
})();
