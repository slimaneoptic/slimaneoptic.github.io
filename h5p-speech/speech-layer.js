/*
 * speech-layer.js: voice input for an existing H5P "Fill in the Blanks" (H5P.Blanks) activity.
 * Loaded inside the H5P frame next to the content. The H5P content itself is not changed.
 *
 * 1. Waits for the H5P.Blanks instance, reads the accepted answers from its own params (*answer* syntax).
 * 2. Adds a mic button after every blank.
 * 3. Speech (Web Speech API) -> text -> the blank's input -> H5P's own events (keyup, change, blur),
 *    so H5P.Blanks checks the blank itself, marks it and sends its xAPI statements as usual.
 * 4. Shows a one-line feedback under the sentence. In this demo the feedback is rule-based
 *    (edit distance + hints), not an AI model.
 * Browsers without speech recognition get a small "type what you'd say" box that runs the same path.
 */
(function () {
  'use strict';

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  var MIC_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">' +
    '<path fill="currentColor" d="M12 15a3.5 3.5 0 0 0 3.5-3.5v-6a3.5 3.5 0 1 0-7 0v6A3.5 3.5 0 0 0 12 15Zm6-3.5a1 1 0 1 0-2 0 4 4 0 0 1-8 0 1 1 0 1 0-2 0 6 6 0 0 0 5 5.9V20H8.5a1 1 0 1 0 0 2h7a1 1 0 1 0 0-2H13v-2.6a6 6 0 0 0 5-5.9Z"/></svg>';

  var state = { instance: null, blanks: [], listening: null };

  /* ---------- reading the answers from the H5P content ---------- */

  // Same syntax H5P.Blanks uses: *answer/alternative:tip*
  function parseAnswers(questions) {
    var out = [];
    questions.forEach(function (q) {
      var re = /\*([^*]+)\*/g, m;
      while ((m = re.exec(q)) !== null) {
        var body = m[1].replace(/\\:/g, '\u0000');
        var tipAt = body.indexOf(':');
        var sol = tipAt === -1 ? body : body.slice(0, tipAt);
        out.push(sol.replace(/\u0000/g, ':').split('/').map(function (s) {
          return decodeHtml(s).trim();
        }).filter(Boolean));
      }
    });
    return out;
  }

  function decodeHtml(s) {
    var t = document.createElement('textarea');
    t.innerHTML = s;
    return t.value;
  }

  /* ---------- rule-based feedback (an LLM step is planned, not used here) ---------- */

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

  function feedbackFor(said, answers, isCorrect) {
    if (isCorrect) {
      return { kind: 'ok', text: 'You said “' + said + '”. Correct!' };
    }
    var low = said.toLowerCase(), best = answers[0], bestD = Infinity;
    answers.forEach(function (a) {
      var dist = levenshtein(low, a.toLowerCase());
      if (dist < bestD) { bestD = dist; best = a; }
    });
    var hint = 'The answer has ' + best.length + ' letters and starts with “' + best.charAt(0).toUpperCase() + '”.';
    var close = bestD <= Math.max(1, Math.floor(best.length / 3));
    return {
      kind: close ? 'close' : 'wrong',
      text: 'You said “' + said + '”' + (close ? ' - close! ' : ' - not this one. ') + hint
    };
  }

  /* ---------- putting the spoken word into the blank ---------- */

  function cleanSpoken(text) {
    // Speech engines add capitals and end punctuation ("Paris."); H5P.Blanks compares case-insensitively.
    return String(text || '').trim().replace(/[.,!?;:"“”]+$/g, '').replace(/^[“"]+/, '').trim();
  }

  function submit(index, rawText, source) {
    var b = state.blanks[index];
    if (!b) { return { ok: false, error: 'no blank ' + index }; }
    var said = cleanSpoken(rawText);
    if (!said) { setFeedback(b, 'wrong', 'Nothing heard. Try again.'); return { ok: false, error: 'empty' }; }
    if (b.input.disabled) { setFeedback(b, 'ok', 'This blank is already correct.'); return { ok: false, error: 'locked' }; }

    var $ = window.H5P.jQuery, $in = $(b.input);
    b.input.value = said;
    // H5P.Blanks' own handlers: keyup clears an old "wrong" mark, change sends xAPI "interacted",
    // blur runs the blank's check (autoCheck) and, once every blank is filled, xAPI "answered" with the score.
    $in.trigger('keyup').trigger('change').trigger('blur');

    var isCorrect = b.wrapper.classList.contains('h5p-correct');
    var fb = feedbackFor(said, b.answers, isCorrect);
    if (isCorrect) { b.box.hidden = true; }
    setFeedback(b, fb.kind, fb.text);
    try { window.parent.postMessage({ type: 'speech-layer', index: index, said: said, correct: isCorrect, source: source }, '*'); } catch (e) { /* no parent */ }
    return { ok: true, said: said, correct: isCorrect, feedback: fb.text, kind: fb.kind };
  }

  function setFeedback(b, kind, text) {
    b.feedback.textContent = text;
    b.feedback.className = 'sl-feedback sl-' + kind;
    b.feedback.hidden = false;
    resize();
  }

  function resize() {
    if (state.instance && state.instance.trigger) { state.instance.trigger('resize'); }
  }

  /* ---------- microphone ---------- */

  function listen(index) {
    var b = state.blanks[index];
    if (!SR) { showTypeBox(b, 'Speech input needs Chrome or Edge. Type what you’d say:'); return; }
    if (state.listening) { state.listening.abort(); }
    var rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    state.listening = rec;
    b.mic.classList.add('sl-on');
    b.mic.setAttribute('aria-pressed', 'true');
    setFeedback(b, 'info', 'Listening… say one word.');
    rec.onresult = function (e) {
      var t = e.results && e.results[0] && e.results[0][0] ? e.results[0][0].transcript : '';
      submit(index, t, 'speech');
    };
    rec.onerror = function (e) {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        showTypeBox(b, 'Microphone blocked. Allow it in the address bar, or type what you’d say:');
      } else if (e.error === 'no-speech') {
        setFeedback(b, 'wrong', 'I didn’t hear anything. Click the mic and try again.');
      } else if (e.error !== 'aborted') {
        showTypeBox(b, 'Speech service error (' + e.error + '). Type what you’d say:');
      }
    };
    rec.onend = function () {
      b.mic.classList.remove('sl-on');
      b.mic.setAttribute('aria-pressed', 'false');
      if (state.listening === rec) { state.listening = null; }
      if (b.feedback.classList.contains('sl-info')) { b.feedback.hidden = true; resize(); }
    };
    try { rec.start(); } catch (err) { showTypeBox(b, 'Could not start the microphone. Type what you’d say:'); }
  }

  function showTypeBox(b, note) {
    b.box.hidden = false;
    b.boxNote.textContent = note;
    setFeedback(b, 'info', '');
    b.feedback.hidden = true;
    resize();
    b.boxInput.focus();
  }

  /* ---------- building the UI inside the H5P frame ---------- */

  function build(instance) {
    var root = document.querySelector('.h5p-blanks') || document.body;
    var inputs = root.querySelectorAll('.h5p-input-wrapper > input.h5p-text-input');
    var answers = parseAnswers(instance.params.questions || []);
    state.instance = instance;
    state.blanks = [];
    root.classList.add('sl-ready', SR ? 'sl-has-speech' : 'sl-no-speech');

    Array.prototype.forEach.call(inputs, function (input, i) {
      var wrapper = input.parentNode;
      var group = wrapper.closest('[role="group"]') || wrapper.parentNode;

      var mic = document.createElement('button');
      mic.type = 'button';
      mic.className = 'sl-mic';
      mic.innerHTML = MIC_SVG;
      mic.setAttribute('aria-label', 'Speak the answer for blank ' + (i + 1));
      mic.setAttribute('aria-pressed', 'false');
      mic.title = SR ? 'Speak your answer' : 'Speech input needs Chrome or Edge';
      wrapper.parentNode.insertBefore(mic, wrapper.nextSibling);

      var feedback = document.createElement('div');
      feedback.className = 'sl-feedback';
      feedback.setAttribute('role', 'status');
      feedback.hidden = true;

      var box = document.createElement('form');
      box.className = 'sl-box';
      box.hidden = true;
      box.innerHTML = '<span class="sl-note"></span> <input type="text" class="sl-type" autocomplete="off" aria-label="Type what you would say for blank ' + (i + 1) + '"> <button type="submit" class="sl-say">Check</button>';

      group.appendChild(box);
      group.appendChild(feedback);

      var b = {
        index: i, input: input, wrapper: wrapper, answers: answers[i] || [],
        mic: mic, feedback: feedback, box: box,
        boxNote: box.querySelector('.sl-note'), boxInput: box.querySelector('.sl-type')
      };
      mic.addEventListener('click', function () { listen(i); });
      box.addEventListener('submit', function (e) {
        e.preventDefault();
        submit(i, b.boxInput.value, 'typed');
        b.boxInput.value = '';
      });
      state.blanks.push(b);
    });

    // "Try again" in H5P resets the blanks: clear our feedback too.
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.h5p-question-try-again')) {
        state.blanks.forEach(function (b) { b.feedback.hidden = true; b.box.hidden = true; });
        resize();
      }
    }, true);

    resize();
    try { window.parent.postMessage({ type: 'speech-layer-ready', blanks: state.blanks.length, speech: !!SR }, '*'); } catch (e) { /* no parent */ }
  }

  // Test hook: simulate a spoken result without a microphone.
  window.__speechTest = function (text, index) { return submit(index || 0, text, 'test'); };
  window.__speechLayer = {
    answers: function () { return state.blanks.map(function (b) { return b.answers; }); },
    hasSpeech: !!SR
  };

  function findInstance() {
    var list = (window.H5P && window.H5P.instances) || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i].clozes && list[i].params && list[i].params.questions) { return list[i]; }
    }
    return null;
  }

  var tries = 0;
  (function wait() {
    var inst = findInstance();
    if (inst && document.querySelector('.h5p-input-wrapper > input')) { build(inst); return; }
    if (++tries < 200) { setTimeout(wait, 50); }
  })();
})();
