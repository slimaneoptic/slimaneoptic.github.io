/*
 * mic-layer.js: a speaking step for "The Alphabet - Activity 1".
 *
 * It runs on the page next to the H5P blocks and never touches the H5P content or the H5P.Blanks code.
 * 1. Finds each picture by its file name and adds two buttons under it:
 *    Listen (speechSynthesis, the model voice) and Say it (Web Speech API recognition).
 * 2. Compares what the browser heard with the word: matched / close / try again, and keeps the best score per word.
 * 3. Builds an xAPI "answered" statement for every try and hands it to the page
 *    (DOM event "miclayer:statement" on document), next to H5P's own statements.
 * The written H5P task stays as it is: the student says the word first, then types the missing letter.
 */
(function () {
  'use strict';

  var TOPIC = 'https://abcinternationalonline.com/topic/the-alphabet-activity-1/';
  var EXT = 'https://slimanechanchoul.com/xapi/speaking/';
  var WORDS = [
    { n: 1, img: 'oranges.jpg', word: 'orange' },
    { n: 2, img: 'queen.jpg', word: 'queen' },
    { n: 3, img: 'elephant.jpg', word: 'elephant' },
    { n: 4, img: 'grapes.jpg', word: 'grapes' },
    { n: 5, img: 'umbrella.jpg', word: 'umbrella' },
    { n: 6, img: 'violin.jpeg', word: 'violin' },
    { n: 7, img: 'nail.jpg', word: 'nail' },
    { n: 8, img: 'x-ray.jpg', word: 'x-ray', say: 'X-ray' },
    { n: 9, img: 'keys.jpg', word: 'keys' },
    { n: 10, img: 'ice-cream.jpg', word: 'ice cream', letters: 2 }
  ];
  var ACCENTS = { 'en-ZA': 'South African English', 'en-GB': 'British English', 'en-US': 'American English' };
  var POINTS = { matched: 1, close: 0.5, again: 0 };
  var RANK = { matched: 3, close: 2, again: 1, none: 0 };

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  var SS = ('speechSynthesis' in window && window.SpeechSynthesisUtterance) ? window.speechSynthesis : null;
  var state = { lang: 'en-ZA', voice: null, voiceFallback: null, active: null, words: [] };

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

  // Several alternatives from the recognizer: keep the best one.
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

  /* ---------- model voice ---------- */

  function voicesFor(lang) {
    var L = lang.toLowerCase();
    return (SS ? SS.getVoices() : []).filter(function (v) {
      return String(v.lang || '').replace('_', '-').toLowerCase() === L;
    });
  }
  function score(v) { return (/natural|neural|online/i.test(v.name) ? 2 : 0) + (/google|microsoft|apple|siri/i.test(v.name) ? 1 : 0); }

  function pickVoice() {
    var lang = state.lang, list = voicesFor(lang), fellBack = null;
    if (!list.length && lang === 'en-ZA') { list = voicesFor('en-GB'); fellBack = list.length ? 'en-GB' : null; }
    if (!list.length && SS) {
      list = SS.getVoices().filter(function (v) { return /^en[-_]/i.test(v.lang || ''); });
      fellBack = list.length ? 'en' : null;
    }
    list.sort(function (a, b) { return score(b) - score(a); });
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

  function listen(w) {
    if (!SS) { return; }
    SS.cancel();
    var u = new window.SpeechSynthesisUtterance(w.say || w.word);
    u.lang = state.lang;
    if (state.voice) {
      try { u.voice = state.voice; u.lang = String(state.voice.lang).replace('_', '-'); } catch (e) { /* keep the browser's default voice */ }
    }
    u.rate = 0.85;
    SS.speak(u);
  }

  /* ---------- the microphone ---------- */

  function sayIt(w) {
    if (!SR) { return; }
    if (state.active) { try { state.active.abort(); } catch (e) { /* already stopped */ } }
    var rec = new SR(), got = false, failed = false;
    rec.lang = state.lang;
    rec.interimResults = false;
    rec.continuous = false;
    rec.maxAlternatives = 5;
    state.active = rec;
    w.say$.classList.add('ml-on');
    w.say$.setAttribute('aria-pressed', 'true');
    feedback(w, 'info', 'Listening… say the whole word.');

    rec.onresult = function (e) {
      var res = e.results[e.resultIndex || 0] || e.results[0], alts = [], i;
      for (i = 0; res && i < res.length; i++) { alts.push({ text: res[i].transcript, confidence: res[i].confidence }); }
      got = true;
      handle(w, alts);
    };
    rec.onerror = function (e) {
      failed = true;
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        feedback(w, 'again', 'The microphone is blocked. Allow it in the address bar, then try again.');
      } else if (e.error === 'no-speech') {
        feedback(w, 'again', 'I didn’t hear anything. Tap Say it and try again.');
      } else if (e.error === 'network') {
        feedback(w, 'again', 'The browser’s speech service is not reachable. Check the connection and try again.');
      } else if (e.error !== 'aborted') {
        feedback(w, 'again', 'Speech error (' + e.error + '). Try again.');
      }
    };
    rec.onend = function () {
      w.say$.classList.remove('ml-on');
      w.say$.setAttribute('aria-pressed', 'false');
      if (state.active === rec) { state.active = null; }
      if (!got && !failed) { feedback(w, 'again', 'I didn’t hear anything. Tap Say it and try again.'); }
    };
    try { rec.start(); } catch (err) { feedback(w, 'again', 'Could not start the microphone. Try again.'); }
  }

  function handle(w, alts) {
    var g = gradeAll(alts, w.word);
    if (g.kind === 'none') { feedback(w, 'again', 'I didn’t catch a word. Try again.'); return g; }
    var pts = POINTS[g.kind];
    w.tries += 1;
    if (w.best === null || pts > w.best) { w.best = pts; }
    var letters = w.letters ? 'letters' : 'letter';
    if (g.kind === 'matched') {
      feedback(w, 'matched', '✓ Matched: I heard “' + g.heard + '”. Now type the missing ' + letters + ' in ' + w.n + '.');
    } else if (g.kind === 'close') {
      feedback(w, 'close', 'Close: I heard “' + g.heard + '”. ' + (g.why === 'plural' ? 'Listen to the end of the word and try again.' : 'Listen and try once more.'));
    } else {
      feedback(w, 'again', 'Try again: I heard “' + g.heard + '”. Tap Listen first.');
    }
    w.score$.textContent = 'Score ' + fmt(w.best) + ' / 1, ' + w.tries + (w.tries === 1 ? ' try' : ' tries');
    w.score$.hidden = false;
    w.fig.setAttribute('data-result', g.kind);
    total();
    emit(statement(w, g, pts));
    return { kind: g.kind, heard: g.heard, score: pts, best: w.best };
  }

  function fmt(x) { return x === 0.5 ? '0.5' : String(x); }

  function feedback(w, kind, text) {
    w.fb$.textContent = text;
    w.fb$.className = 'ml-fb ml-' + kind;
  }

  function total() {
    var el = document.getElementById('ml-total');
    if (!el) { return; }
    var sum = 0, m = 0, c = 0;
    state.words.forEach(function (w) {
      if (w.best !== null) { sum += w.best; }
      if (w.best === 1) { m++; } else if (w.best === 0.5) { c++; }
    });
    el.innerHTML = 'Speaking score: <b>' + (Math.round(sum * 10) / 10) + ' / ' + state.words.length + '</b> (' + m + ' matched, ' + c + ' close)';
  }

  /* ---------- xAPI ---------- */

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

  /* ---------- building the buttons under the pictures ---------- */

  function build() {
    var root = document.querySelector('[data-mic-layer]') || document.body;
    root.classList.add(SR ? 'ml-has-sr' : 'ml-no-sr');
    WORDS.forEach(function (def) {
      var img = root.querySelector('img[src$="/' + def.img + '"]');
      if (!img) { return; }
      var fig = img.closest('figure') || img.parentNode;
      var w = { n: def.n, word: def.word, say: def.say, letters: def.letters, fig: fig, tries: 0, best: null };
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
      w.listen$.addEventListener('click', function () { listen(w); });
      w.say$.addEventListener('click', function () { sayIt(w); });
      state.words.push(w);
    });

    var note = document.getElementById('ml-sr-note');
    if (note) {
      note.hidden = !!SR;
      if (!SR) {
        note.textContent = 'This browser has no speech recognition (Firefox, for example), so Say it is switched off here. Listen and the written task still work. Open this page in Chrome, Edge or Safari to try the mic.';
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
    if (state.active) { try { state.active.abort(); } catch (e) { /* stopped */ } }
    pickVoice();
  }

  window.MicLayer = {
    words: WORDS,
    grade: grade,
    setLang: setLang,
    info: function () {
      return {
        lang: state.lang, recognition: !!SR, synthesis: !!SS,
        voice: state.voice ? { name: state.voice.name, lang: state.voice.lang } : null,
        voiceFallback: state.voiceFallback,
        words: state.words.map(function (w) { return { n: w.n, word: w.word, tries: w.tries, best: w.best }; })
      };
    }
  };

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', build); } else { build(); }
})();
