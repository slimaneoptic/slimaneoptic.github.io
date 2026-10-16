/* Document archive demo. Everything shown comes from window.ARCHIVE (data.js, written by the pipeline run).
   The page only displays stored results: search is a plain keyword match on the stored OCR text, in the browser,
   and the answers are the stored ones. No AI calls, no network requests. */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var BEHAVIOR = reduceMotion ? "auto" : "smooth";

  /* ---------- tiny DOM helper ---------- */
  function h(tag, props) {
    var el = document.createElement(tag);
    if (props) {
      for (var k in props) {
        if (!Object.prototype.hasOwnProperty.call(props, k)) continue;
        var v = props[k];
        if (v === null || v === undefined || v === false) continue;
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else if (k.slice(0, 2) === "on" && typeof v === "function") el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? "" : String(v));
      }
    }
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, c) {
    if (c === null || c === undefined || c === false) return;
    if (Array.isArray(c)) { for (var i = 0; i < c.length; i++) add(el, c[i]); return; }
    el.appendChild(typeof c === "object" ? c : document.createTextNode(String(c)));
  }
  function icon(id, cls) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "ico" + (cls ? " " + cls : ""));
    svg.setAttribute("aria-hidden", "true");
    var use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#" + id);
    svg.appendChild(use);
    return svg;
  }
  function srOnly(text) { return h("span", { class: "sr-only" }, text); }

  function fail(msg) {
    var box = $("load-error");
    if (!box) return;
    box.textContent = msg;
    box.hidden = false;
  }

  /* ---------- data ---------- */
  var A = window.ARCHIVE;
  if (!A || typeof A !== "object" || !A.meta || !Array.isArray(A.documents)) {
    fail("The archive data (data.js) did not load, so there is nothing to show.");
    return;
  }
  var meta = A.meta;
  var docs = A.documents.filter(function (d) { return d && d.id && Array.isArray(d.pages) && d.pages.length; });
  var folders = Array.isArray(A.folders) ? A.folders.filter(function (f) { return f && f.id; }) : [];
  var dups = Array.isArray(A.duplicates) ? A.duplicates : [];
  var qa = Array.isArray(A.qa) ? A.qa.filter(function (q) { return q && q.question; }) : [];
  var stats = Array.isArray(A.stats) ? A.stats : [];
  // Optional extension written by the pipeline and evaluate.py: what the OCR router saw on each page, measured
  // accuracy per page, how the input pages were made, and the closest pair that was not flagged as a duplicate.
  var CK = A.checks && typeof A.checks === "object" ? A.checks : {};
  var ckPages = CK.pages && typeof CK.pages === "object" ? CK.pages : {};
  function pageCheck(d, n) { return ckPages[d.id + " p" + n] || null; }

  var byId = {}, fById = {}, fDocs = {}, pairsOf = {}, folderOfDoc = {};
  docs.forEach(function (d) { byId[d.id] = d; });
  folders.forEach(function (f) {
    fById[f.id] = f;
    fDocs[f.id] = (Array.isArray(f.documents) ? f.documents : []).filter(function (id) { return byId[id]; });
    fDocs[f.id].forEach(function (id) { if (!folderOfDoc[id]) folderOfDoc[id] = f; });
  });
  dups.forEach(function (p) {
    if (!p || !byId[p.a] || !byId[p.b]) return;
    (pairsOf[p.a] = pairsOf[p.a] || []).push(p);
    (pairsOf[p.b] = pairsOf[p.b] || []).push(p);
  });
  function folderOf(d) { return fById[d.folder] || folderOfDoc[d.id] || null; }

  /* ---------- formatting ---------- */
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function isNum(n) { return typeof n === "number" && isFinite(n); }
  function fmtInt(n) { return isNum(n) ? Math.round(n).toLocaleString("en-US") : "n/a"; }
  function plural(n, one, many) { return fmtInt(n) + " " + (n === 1 ? one : (many || one + "s")); }
  function fmtSec(s) {
    if (!isNum(s)) return "n/a";
    if (s < 60) return String(Math.round(s * 10) / 10) + " s";
    var m = Math.floor(s / 60), r = Math.round(s - m * 60);
    if (r === 60) { m += 1; r = 0; }
    if (m < 60) return m + " min" + (r ? " " + r + " s" : "");
    var hh = Math.floor(m / 60), mm = m % 60;
    return hh + " h" + (mm ? " " + mm + " min" : "");
  }
  function fmtUSD(x) {
    if (!isNum(x)) return "n/a";
    if (x > 0 && x < 0.0001) return "under $0.0001";
    return "$" + x.toFixed(x < 0.1 ? 4 : 2);
  }
  // Numbers are shown as stored (no extra rounding), so every figure on the page matches the data file.
  function fmtConf(c) {
    if (!isNum(c)) return null;
    return String(Math.round((c <= 1 ? c * 100 : c) * 10) / 10) + "%";
  }
  function fmtPct(x) { return isNum(x) ? String(Math.round(x * 10000) / 100) + "%" : "n/a"; }
  function fmtScore(s) { return isNum(s) ? s.toFixed(3) : "n/a"; }
  function fmtDate(s) {
    if (!s) return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (m && +m[2] >= 1 && +m[2] <= 12) return +m[3] + " " + MON[+m[2] - 1] + " " + m[1];
    m = /^(\d{4})-(\d{2})$/.exec(s);
    if (m && +m[2] >= 1 && +m[2] <= 12) return MON[+m[2] - 1] + " " + m[1];
    return String(s);
  }
  function cap(t) { t = String(t || ""); return t.charAt(0).toUpperCase() + t.slice(1); }
  function kindLabel(k) { return k === "exact" ? "Exact duplicate" : k === "near" ? "Near duplicate" : "Duplicate"; }
  function pageIndex(d, n) {
    for (var i = 0; i < d.pages.length; i++) if (d.pages[i].page === n) return i;
    return -1;
  }
  function pageNo(d, i) { return isNum(d.pages[i].page) ? d.pages[i].page : i + 1; }
  function pageOf(d, n) { var i = pageIndex(d, n); return i >= 0 ? d.pages[i] : null; }
  function handPages(d) {
    var out = [];
    d.pages.forEach(function (p, i) { if (p.handwritten) out.push(pageNo(d, i)); });
    return out;
  }

  /* ---------- keyword search on the stored OCR text ---------- */
  // fold() lower-cases and drops accents one character at a time and keeps a map back to the original
  // positions, so a match found in the folded text can be highlighted in the original text.
  function fold(text) {
    var out = "", map = [];
    text = String(text || "");
    for (var i = 0; i < text.length; i++) {
      var f = text[i].normalize("NFD").toLowerCase().replace(/[\u0300-\u036f]/g, "");
      for (var j = 0; j < f.length; j++) { out += f[j]; map.push(i); }
    }
    map.push(text.length);
    return { s: out, map: map };
  }
  var pageFold = {}, hayFold = {};
  function foldPage(d, i) {
    var key = d.id + "\u0000" + i;
    return pageFold[key] || (pageFold[key] = fold(d.pages[i].text));
  }
  function hay(d) {
    if (!hayFold[d.id]) {
      var parts = [d.title, d.type, d.date, (d.people || []).join(" ")];
      d.pages.forEach(function (p) { parts.push(p.text); });
      hayFold[d.id] = fold(parts.join("\n")).s;
    }
    return hayFold[d.id];
  }
  var SPLIT;
  try { SPLIT = new RegExp("[^\\p{L}\\p{N}]+", "u"); } catch (e) { SPLIT = /[^0-9a-z\u00c0-\uffff]+/; }
  function termsOf(q) {
    var seen = {}, out = [];
    fold(q).s.split(SPLIT).forEach(function (t) {
      if (t.length >= 2 && !seen[t]) { seen[t] = 1; out.push(t); }
    });
    return out;
  }
  function matches(d) {
    if (!S.terms.length) return true;
    var s = hay(d);
    for (var i = 0; i < S.terms.length; i++) if (s.indexOf(S.terms[i]) < 0) return false;
    return true;
  }
  function termRanges(F) {
    var out = [];
    S.terms.forEach(function (t) {
      var k = 0;
      while ((k = F.s.indexOf(t, k)) >= 0) { out.push({ s: F.map[k], e: F.map[k + t.length], cls: "kw" }); k += t.length; }
    });
    return out;
  }
  function firstHit(d) { // index of the first page with a match, and the match
    for (var i = 0; i < d.pages.length; i++) {
      var r = termRanges(foldPage(d, i));
      if (r.length) { r.sort(function (a, b) { return a.s - b.s; }); return { i: i, r: r }; }
    }
    return null;
  }
  // Accept ranges in priority order, skipping any that overlaps one already accepted; return them sorted.
  function pickRanges(cands) {
    var kept = [];
    cands.forEach(function (c) {
      if (!(c.e > c.s)) return;
      for (var i = 0; i < kept.length; i++) if (c.s < kept[i].e && kept[i].s < c.e) return;
      kept.push(c);
    });
    return kept.sort(function (a, b) { return a.s - b.s; });
  }
  function markedText(text, ranges, collapse) {
    var frag = document.createDocumentFragment(), pos = 0;
    function txt(s) { frag.appendChild(document.createTextNode(collapse ? s.replace(/\s+/g, " ") : s)); }
    ranges.forEach(function (r) {
      if (r.s > pos) txt(text.slice(pos, r.s));
      var m = h("mark", { class: r.cls + (r.on ? " on" : ""), "data-n": r.n || null, title: r.title || null });
      if (r.cls === "cite") { m.tabIndex = -1; m.id = "cite-mark-" + r.n; }
      m.textContent = collapse ? text.slice(r.s, r.e).replace(/\s+/g, " ") : text.slice(r.s, r.e);
      frag.appendChild(m);
      pos = r.e;
    });
    if (pos < text.length) txt(text.slice(pos));
    return frag;
  }
  function snippet(d) {
    var hit = firstHit(d);
    if (!hit) return null; // the match is in the title, type, people or summary
    var text = String(d.pages[hit.i].text), first = hit.r[0];
    var from = Math.max(0, first.s - 48), to = Math.min(text.length, first.e + 72);
    if (from > 0) { var sp = text.indexOf(" ", from); if (sp >= 0 && sp < first.s) from = sp + 1; }
    if (to < text.length) { var sp2 = text.lastIndexOf(" ", to); if (sp2 > first.e) to = sp2; }
    var inside = hit.r.filter(function (r) { return r.s >= from && r.e <= to; }).map(function (r) {
      return { s: r.s - from, e: r.e - from, cls: r.cls };
    });
    var span = h("span", { class: "d-snip" }, from > 0 ? "\u2026" : "", markedText(text.slice(from, to), pickRanges(inside), true),
      to < text.length ? "\u2026" : "", " (p. " + pageNo(d, hit.i) + ")");
    return span;
  }

  /* ---------- state ---------- */
  var S = { folder: "all", query: "", terms: [], doc: null, page: 1, view: "both", qa: -1, cite: null };

  function visibleDocs() {
    var base = S.folder === "all" || !fById[S.folder] ? docs : fDocs[S.folder].map(function (id) { return byId[id]; });
    return { base: base, shown: base.filter(matches) };
  }
  function announce(msg) {
    var live = $("live");
    live.textContent = "";
    setTimeout(function () { live.textContent = msg; }, 30);
  }

  /* ---------- header: tiles and facts ---------- */
  function renderHeader() {
    var tiles = $("tiles"), pages = meta.pages, hw = meta.handwritten_pages;
    var all = [], read = 0, failed = 0;
    docs.forEach(function (d) { d.pages.forEach(function (p) { all.push(pageCheck(d, p.page)); if (!String(p.text || "").trim()) failed++; }); });
    var known = all.filter(Boolean);
    known.forEach(function (c) { if (c.engine === "tesseract" || c.engine === "vision") read++; });
    var ppm = isNum(pages) && isNum(meta.pipeline_seconds) && meta.pipeline_seconds > 0 ? Math.round(pages / meta.pipeline_seconds * 60) : null;
    [
      ["Pages", fmtInt(pages), known.length === all.length && all.length ? fmtInt(read) + " read by OCR · " + fmtInt(failed) + " failed" : null],
      ["Documents", fmtInt(meta.documents), folders.length ? plural(folders.length, "AI folder") : null],
      ["Handwriting-font pages", fmtInt(hw), "fonts, not real handwriting"],
      ["Pipeline time", fmtSec(meta.pipeline_seconds), ppm !== null ? fmtInt(ppm) + " pages/min, one batch" : null],
      ["AI cost", fmtUSD(meta.ai_cost_usd), "whole run"]
    ].forEach(function (t) {
      tiles.appendChild(h("div", { class: "tile" },
        h("span", { class: "t-label" }, t[0]),
        h("span", { class: "t-val" }, t[1]),
        t[2] ? h("span", { class: "t-sub" }, t[2]) : null));
    });
    var facts = $("facts");
    [["Input pages", CK.input && CK.input.made ? CK.input.made : null], ["OCR", meta.ocr_engine], ["Language model", meta.model ? meta.model + " through OpenRouter (vision OCR, fields, folders, answers)" : null],
      ["Storage", "JSON files: the pipeline writes one archive file, which this page loads, and caches each AI answer on disk. No database."],
      ["On this page", "Stored results only. Search runs in your browser on the OCR text; the page makes no AI calls."],
      ["AWS", "Not used here. Amazon Textract and Bedrock appear only in the plan in section 4."],
      ["Collection", meta.collection], ["Run date", meta.generated]]
      .forEach(function (f) {
        if (f[1] === null || f[1] === undefined || f[1] === "") return;
        facts.appendChild(h("dt", null, f[0]));
        facts.appendChild(h("dd", null, String(f[1])));
      });
  }

  /* ---------- folders ---------- */
  var folderBtns = [];
  function renderFolders() {
    var list = $("folder-list");
    function item(id, name, count, why, idx) {
      var whyId = why ? "why-" + idx : null;
      var btn = h("button", { type: "button", class: "folder", "aria-pressed": "false", "aria-describedby": whyId, "data-track": "folder",
        onclick: function () { pickFolder(id); } },
        h("span", { class: "f-name" }, name),
        h("span", { class: "f-n" }, fmtInt(count), srOnly(count === 1 ? " document" : " documents")));
      btn.dataset.folder = id;
      folderBtns.push(btn);
      return h("li", null, btn, why ? h("p", { class: "why", id: whyId }, h("b", null, "Why"), why) : null);
    }
    list.appendChild(item("all", "All documents", docs.length, null, -1));
    folders.forEach(function (f, i) { list.appendChild(item(f.id, f.name || f.id, fDocs[f.id].length, f.why || null, i)); });
    markFolder();
  }
  function markFolder() {
    folderBtns.forEach(function (b) {
      var on = b.dataset.folder === S.folder;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.parentNode.classList.toggle("on", on);
    });
    var box = $("why-box"), f = fById[S.folder];
    box.textContent = "";
    if (f && f.why) { box.appendChild(h("b", null, "Why this folder")); box.appendChild(document.createTextNode(f.why)); box.hidden = false; }
    else box.hidden = true;
  }
  function pickFolder(id) {
    closeAnswer(false);
    S.folder = id;
    markFolder();
    renderDocs();
    renderStatus();
    var v = visibleDocs();
    announce((id === "all" ? "All documents" : (fById[id].name || id)) + ": " + plural(v.shown.length, "document") + " shown.");
  }

  /* ---------- document list ---------- */
  var docBtns = {};
  function renderDocs() {
    var list = $("doc-list"), v = visibleDocs();
    list.textContent = "";
    docBtns = {};
    $("doc-count").textContent = S.terms.length ? v.shown.length + " of " + v.base.length : String(v.base.length);
    if (!v.shown.length) {
      var li = h("li", { class: "empty" },
        h("p", null, S.terms.length ? "No document here contains all of: " + S.terms.join(", ") + "." : "No documents in this folder."));
      if (S.terms.length) li.appendChild(h("button", { type: "button", class: "btn-ghost", onclick: clearSearch }, "Clear the search"));
      list.appendChild(li);
      return;
    }
    v.shown.forEach(function (d) {
      var badges = h("span", { class: "d-badges" });
      var kinds = {};
      (pairsOf[d.id] || []).forEach(function (p) {
        if (kinds[p.kind]) return;
        kinds[p.kind] = 1;
        badges.appendChild(h("span", { class: "pill " + (p.kind === "exact" ? "exact" : "near") }, kindLabel(p.kind)));
      });
      if (!(pairsOf[d.id] || []).length && d.duplicate_of) badges.appendChild(h("span", { class: "pill near" }, "Duplicate"));
      var hp = handPages(d);
      if (hp.length) {
        badges.appendChild(h("span", { class: "tag hand" },
          hp.length === d.pages.length ? "Handwriting font" : "Handwriting font p. " + (hp.length > 3 ? hp.slice(0, 3).join(", ") + "\u2026" : hp.join(", "))));
      }
      var metaBits = [d.id, cap(d.type), fmtDate(d.date) || "No date", plural(d.pages.length, "page")].filter(Boolean);
      var btn = h("button", { type: "button", class: "doc", "aria-current": d.id === S.doc ? "true" : "false", "data-track": "document",
        onclick: function () { openDoc(d.id, { fromList: true }); } },
        h("span", { class: "d-title" }, d.title || d.id),
        h("span", { class: "d-meta" }, metaBits.join(" \u00b7 ")),
        badges,
        S.terms.length ? snippet(d) : null);
      docBtns[d.id] = btn;
      list.appendChild(h("li", null, btn));
    });
  }
  function markDoc() {
    for (var id in docBtns) docBtns[id].setAttribute("aria-current", id === S.doc ? "true" : "false");
  }

  /* ---------- search ---------- */
  var qIn = $("q"), qTimer = null;
  function questionLike(q) {
    return /\?\s*$/.test(q) || /^(who|what|when|where|which|why|how|is|are|was|were|does|do|did|can|could|list|show|find|tell)\b/i.test(q);
  }
  function renderStatus() {
    var st = $("q-status");
    st.textContent = "";
    if (!S.query) return;
    if (!S.terms.length) { st.textContent = "Type at least two letters or digits."; return; }
    var v = visibleDocs(), inAll = docs.filter(matches).length, here = S.folder !== "all" && fById[S.folder];
    if (v.shown.length) {
      st.appendChild(document.createTextNode(plural(v.shown.length, "document") + (v.shown.length === 1 ? " contains" : " contain") +
        " every word" + (here ? " in \u201c" + (here.name || here.id) + "\u201d" : "") + ". "));
    } else {
      st.appendChild(document.createTextNode("No document" + (here ? " in \u201c" + (here.name || here.id) + "\u201d" : "") +
        " contains all of: " + S.terms.join(", ") + ". "));
    }
    if (here && inAll > v.shown.length) {
      st.appendChild(h("button", { type: "button", class: "link-btn", onclick: function () { pickFolder("all"); } },
        "Show all " + plural(inAll, "match", "matches")));
      st.appendChild(document.createTextNode(". "));
    }
    if (questionLike(S.query)) {
      st.appendChild(document.createTextNode("This box matches words, it does not answer questions: pick one of the prepared questions" +
        (window.innerWidth > 900 ? " on the right." : " below.")));
    }
  }
  function applySearch() {
    clearTimeout(qTimer);
    var q = qIn.value.trim();
    if (q === S.query) return;
    if (q) closeAnswer(false);
    S.query = q;
    S.terms = termsOf(q);
    $("q-clear").hidden = !q;
    renderDocs();
    renderStatus();
    if (S.doc) {
      var d = byId[S.doc], hit = S.terms.length ? firstHit(d) : null;
      if (hit && !S.cite) {
        var cur = pageIndex(d, S.page);
        if (cur < 0 || !termRanges(foldPage(d, cur)).length) S.page = pageNo(d, hit.i);
      }
      renderViewer();
    }
  }
  function clearSearch() {
    qIn.value = "";
    applySearch();
    qIn.focus();
  }
  qIn.addEventListener("input", function () { clearTimeout(qTimer); qTimer = setTimeout(applySearch, 140); });
  qIn.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); applySearch(); }
    else if (e.key === "Escape" && qIn.value) { e.preventDefault(); clearSearch(); }
  });
  $("q-clear").addEventListener("click", clearSearch);

  /* ---------- questions and answers ---------- */
  var qBtns = [];
  function citeList(q) {
    return (Array.isArray(q.citations) ? q.citations : []).filter(function (c) { return c && byId[c.doc]; });
  }
  function citeByN(q, n) {
    var cs = citeList(q);
    for (var i = 0; i < cs.length; i++) if (cs[i].n === n) return cs[i];
    return null;
  }
  function renderQuestions() {
    var box = $("qlist");
    if (!qa.length) { box.closest(".ask").hidden = true; return; }
    qa.forEach(function (q, i) {
      var b = h("button", { type: "button", class: "qbtn", "aria-pressed": "false", "aria-controls": "answer", "data-track": "question " + (i + 1),
        onclick: function () { pickQuestion(i); } }, q.question);
      qBtns.push(b);
      box.appendChild(b);
    });
  }
  function pickQuestion(i) {
    S.qa = i;
    S.cite = null;
    qBtns.forEach(function (b, k) { b.setAttribute("aria-pressed", k === i ? "true" : "false"); });
    var first = citeList(qa[i])[0];
    if (first) { showCite(first, {}); centerInPane(document.querySelector("#v-wrap mark.cite.on")); }
    else { markCites(); renderViewer(); } // drop the previous answer's highlights: this answer cites no page
    renderAnswer();
    // Bring the answer and its source page into view together (phones: the answer, the viewer follows below).
    var phone = window.matchMedia ? window.matchMedia("(max-width: 700px)").matches : window.innerWidth <= 700;
    var target = phone ? $("docs-pane") : document.querySelector("#archive .panes"), r = target.getBoundingClientRect();
    if (phone || r.top > window.innerHeight * 0.4 || r.top < -10) target.scrollIntoView({ block: "start", behavior: BEHAVIOR });
    var aq = $("a-q");
    if (aq) { try { aq.focus({ preventScroll: true }); } catch (e) { aq.focus(); } }
    var q = qa[i];
    announce(q.not_found ? "Answer: not found in these records." : "Answer shown with " + plural(citeList(q).length, "source") + ".");
  }
  function closeAnswer(moveFocus) {
    if (S.qa < 0) return;
    S.qa = -1;
    S.cite = null;
    qBtns.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
    renderAnswer();
    renderViewer();
    if (moveFocus) {
      var b = docBtns[S.doc] || document.querySelector("#doc-list button");
      if (b) b.focus();
    }
  }
  function inlineAnswer(text, q) {
    var frag = document.createDocumentFragment(), re = /\[(\d+(?:\s*[,;]\s*\d+)*)\]|\*\*([^*]+)\*\*/g, last = 0, m;
    text = String(text || "");
    while ((m = re.exec(text))) {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      if (m[1]) {
        var ns = m[1].split(/[,;]/).map(function (s) { return parseInt(s, 10); }).filter(function (n) { return citeByN(q, n); });
        if (!ns.length) frag.appendChild(document.createTextNode(m[0]));
        ns.forEach(function (n) { frag.appendChild(citeButton(q, citeByN(q, n), true)); });
      } else {
        frag.appendChild(h("strong", null, m[2]));
      }
      last = re.lastIndex;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    return frag;
  }
  function citeButton(q, c, inline) {
    var d = byId[c.doc], label = "Source " + c.n + ": " + d.id + ", " + (d.title || d.id) + ", page " + c.page;
    var on = S.cite === c;
    if (inline) {
      return h("button", { type: "button", class: "cite-inline", "aria-label": label, "aria-pressed": on ? "true" : "false", "data-n": c.n, "data-track": "citation inline",
        onclick: function () { showCite(c, { scroll: true, focus: true }); } }, String(c.n));
    }
    return h("button", { type: "button", class: "cite-btn", "aria-pressed": on ? "true" : "false", "data-n": c.n, "data-track": "citation",
      onclick: function () { showCite(c, { scroll: true, focus: true }); } },
      h("span", { class: "c-n", "aria-hidden": "true" }, "[" + c.n + "]"),
      h("span", { class: "c-src" }, srOnly("Source " + c.n + ": "), h("span", { class: "did" }, d.id + " p" + c.page), " ",
        h("b", null, d.title || d.id), ", page " + c.page + (pageOf(d, c.page) && pageOf(d, c.page).handwritten ? " (handwriting font)" : "")),
      h("q", null, c.quote));
  }
  function renderAnswer() {
    var box = $("answer"), on = S.qa >= 0;
    box.textContent = "";
    box.hidden = !on;
    $("doc-list").hidden = on;
    $("doc-count").hidden = on;
    $("h-docs").textContent = on ? "Answer" : "Documents";
    $("docs-pane").classList.toggle("answering", on);
    $("docs-pane").scrollTop = 0;
    if (!on) return;
    var q = qa[S.qa], cs = citeList(q);
    var pages = {};
    cs.forEach(function (c) { pages[c.doc + "#" + c.page] = 1; });
    var nPages = Object.keys(pages).length;
    box.appendChild(h("div", { class: "a-top" },
      h("button", { type: "button", class: "btn-ghost", onclick: function () { closeAnswer(true); }, "data-track": "answer back" }, icon("i-prev"), "Back to documents")));
    box.appendChild(h("h4", { class: "a-q", id: "a-q", tabindex: "-1" }, q.question));
    if (q.not_found) {
      box.appendChild(h("p", null, h("span", { class: "pill notfound" }, "Not found in these records")));
      box.appendChild(h("p", { class: "nf-box" }, icon("i-info"), h("span", null, inlineAnswer(q.answer, q))));
    } else {
      if (nPages) box.appendChild(h("p", null, h("span", { class: "pill found" }, "Cited from " + plural(nPages, "page"))));
      box.appendChild(h("p", { class: "a-text" }, inlineAnswer(q.answer, q)));
    }
    if (cs.length) {
      box.appendChild(h("p", { class: "lab", id: "a-src" }, "Sources"));
      var ol = h("ol", { class: "a-cites", "aria-labelledby": "a-src" });
      cs.forEach(function (c) { ol.appendChild(h("li", null, citeButton(q, c, false))); });
      box.appendChild(ol);
    }
    box.appendChild(h("p", { class: "a-foot" }, q.not_found
      ? "Stored answer from the pipeline run. It is marked not found: the pipeline found no page that supports an answer."
      : "Stored answer from the pipeline run. Click a source to open its page with the quoted words highlighted."));
  }
  function markCites() {
    Array.prototype.forEach.call(document.querySelectorAll("#answer [data-n]"), function (b) {
      b.setAttribute("aria-pressed", S.cite && String(S.cite.n) === b.getAttribute("data-n") ? "true" : "false");
    });
  }
  function showCite(c, opts) {
    var d = byId[c.doc];
    if (!d) return;
    S.cite = c;
    S.doc = d.id;
    S.page = pageIndex(d, c.page) >= 0 ? c.page : pageNo(d, 0);
    if (S.view === "image") S.view = "both";
    markDoc();
    renderViewer();
    markCites();
    if (opts.scroll || opts.focus) {
      var mark = document.querySelector("#v-wrap mark.cite.on");
      if (mark) {
        mark.scrollIntoView({ block: "center", behavior: BEHAVIOR });
        // On phones the image sits above the text: when it finishes loading, put the quote back in the middle.
        var img = document.querySelector("#v-wrap .zoom-btn img"), t0 = Date.now();
        if (img && !img.complete) {
          img.addEventListener("load", function () {
            if (Date.now() - t0 < 3000 && document.contains(mark)) mark.scrollIntoView({ block: "center", behavior: "auto" });
          }, { once: true });
        }
        if (opts.focus) { try { mark.focus({ preventScroll: true }); } catch (e) { mark.focus(); } }
        mark.classList.remove("flash");
        void mark.offsetWidth;
        mark.classList.add("flash");
      } else {
        $("viewer").scrollIntoView({ block: "start", behavior: BEHAVIOR });
        var t = $("v-title");
        if (t && opts.focus) { try { t.focus({ preventScroll: true }); } catch (e2) { t.focus(); } }
      }
      announce("Source " + c.n + ": " + (d.title || d.id) + ", page " + c.page + ".");
    }
  }

  /* ---------- viewer ---------- */
  var barObserver = null, lastShown = "";
  // Scroll only the viewer pane (not the page) so a highlighted quote sits in the middle of it.
  function centerInPane(el) {
    var pane = $("viewer");
    if (!el || pane.scrollHeight <= pane.clientHeight) return;
    var r = el.getBoundingClientRect(), pr = pane.getBoundingClientRect();
    pane.scrollTop += (r.top - pr.top) - (pane.clientHeight - r.height) / 2;
  }
  function openDoc(id, opts) {
    var d = byId[id];
    if (!d) return;
    opts = opts || {};
    S.doc = id;
    S.cite = S.cite && S.cite.doc === id ? S.cite : null;
    markCites();
    var hit = S.terms.length ? firstHit(d) : null;
    S.page = opts.page && pageIndex(d, opts.page) >= 0 ? opts.page : hit ? pageNo(d, hit.i) : pageNo(d, 0);
    markDoc();
    renderViewer();
    var v = $("viewer"), r = v.getBoundingClientRect(), moved = false;
    var phone = window.matchMedia ? window.matchMedia("(max-width: 700px)").matches : window.innerWidth <= 700;
    // Phones stack the viewer under the list, so bring it up; wider screens show it beside the list.
    if (opts.reveal || (opts.fromList && (phone ? (r.top > 120 || r.top < -40) : (r.top > window.innerHeight - 140 || r.bottom < 80)))) {
      v.scrollIntoView({ block: "start", behavior: BEHAVIOR });
      moved = true;
    }
    if (moved) { var t = $("v-title"); if (t) { try { t.focus({ preventScroll: true }); } catch (e) { t.focus(); } } }
    announce("Opened " + (d.title || d.id) + ", page " + S.page + " of " + d.pages.length + ".");
  }
  function goPage(n, via) {
    var d = byId[S.doc];
    if (!d || pageIndex(d, n) < 0) return;
    S.page = n;
    renderViewer();
    var again = via ? document.querySelector("#v-wrap .pg[data-step='" + via + "']") : null;
    var cur = again && !again.disabled ? again : document.querySelector("#v-wrap .pg[aria-current='true']");
    if (cur) cur.focus();
    announce("Page " + n + " of " + d.pages.length + ".");
  }
  function setView(mode) {
    S.view = mode;
    renderViewer();
    var b = document.querySelector("#v-wrap .seg button[data-mode='" + mode + "']");
    if (b) b.focus();
  }
  function openZoom(src, title, opener) {
    var dlg = $("zoom");
    if (!dlg || typeof dlg.showModal !== "function") { window.open(src, "_blank", "noopener"); return; }
    $("zoom-img").src = src;
    $("zoom-img").alt = title;
    $("zoom-title").textContent = title;
    dlg._opener = opener;
    dlg.showModal();
  }
  (function () {
    var dlg = $("zoom");
    if (!dlg) return;
    $("zoom-close").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", function () { if (dlg._opener && document.contains(dlg._opener)) dlg._opener.focus(); });
  })();

  // What the OCR router saw on this page and how the page scored against the text the generator drew.
  function ocrCheck(d, ck, lows, thr) {
    var box = h("div", { class: "ocr-check" }), under = thr !== null ? "under " + thr + "% confidence" : "low confidence";
    var minU = isNum(CK.route_min_unsure) ? CK.route_min_unsure : null;
    if (ck.engine === "tesseract") {
      var marked = lows.filter(function (w) { return isNum(w.start); });
      box.appendChild(h("p", null, h("b", null, "Read by Tesseract"), " (local OCR, no AI cost). ",
        marked.length ? [plural(marked.length, "word") + " " + under + ": ",
          marked.map(function (w, i) { return [i ? ", " : "", h("mark", { class: "lowc" }, w.word), " " + fmtConf(w.conf)]; }),
          minU !== null ? ". Fewer than " + minU + ", so the page stayed with Tesseract." : "."]
          : "No word " + under + (minU !== null ? ", so the page stayed with Tesseract." : ".")));
    } else if (ck.engine === "vision") {
      var shown = lows.slice(0, 6);
      box.appendChild(h("p", null, h("b", null, "Read by the vision model."), " Tesseract read the page first and was unsure of " +
        plural(isNum(ck.unsure_words) ? ck.unsure_words : lows.length, "word") + " (" + under + ")" +
        (minU !== null ? "; pages with " + minU + " or more go to the vision model" : "") + (shown.length ? ". Some of them: " : "."),
        shown.map(function (w, i) { return [i ? ", " : "", h("span", { class: "tw" }, "“" + w.word + "”"), " " + fmtConf(w.conf)]; }),
        shown.length ? (lows.length > shown.length ? ", and " + (lows.length - shown.length) + " more." : ".") : null,
        " The vision model gives no confidence score, so this page shows none."));
    } else {
      box.appendChild(h("p", null, h("b", null, "Not read again."), " Exact copy of " + (d.duplicate_of || "another document") +
        " (same pixels), caught at ingest; the text shown is the original's."));
    }
    if (isNum(ck.char_acc)) {
      box.appendChild(h("p", { class: "acc" }, "Measured against the text the generator drew: ", h("b", { class: "mono" }, fmtPct(ck.char_acc)),
        " of characters right (" + fmtInt(ck.errors) + " " + (ck.errors === 1 ? "error" : "errors") + " in " + fmtInt(ck.chars) + ")."));
    } else if (ck.engine === "copy") {
      box.appendChild(h("p", { class: "acc" }, "Not scored separately: it is the same page as the original."));
    }
    return box;
  }

  function renderViewer() {
    var wrap = $("v-wrap");
    wrap.textContent = "";
    if (barObserver) { barObserver.disconnect(); barObserver = null; }
    var d = byId[S.doc];
    if (!d) { wrap.appendChild(h("p", { class: "v-empty" }, "Pick a document to see its pages next to the OCR text.")); return; }
    var idx = pageIndex(d, S.page);
    if (idx < 0) { idx = 0; S.page = pageNo(d, 0); }
    var p = d.pages[idx], f = folderOf(d), title = d.title || d.id;

    /* head */
    var head = h("div", { class: "v-head" });
    head.appendChild(h("p", { class: "v-kicker" },
      [d.id, cap(d.type), fmtDate(d.date) || "No date", plural(d.pages.length, "page")].filter(Boolean).join(" \u00b7 ")));
    head.appendChild(h("h3", { class: "v-title", id: "v-title", tabindex: "-1" }, title));
    if (d.summary) head.appendChild(h("p", { class: "v-sum" }, h("span", { class: "lab" }, "Summary"), d.summary));
    if (f) {
      head.appendChild(h("p", { class: "v-folder" }, h("span", { class: "lab" }, "AI folder"),
        h("button", { type: "button", class: "link-btn", "data-track": "viewer folder", onclick: function () { pickFolder(f.id); } }, f.name || f.id),
        f.why ? h("span", { class: "v-why" }, " \u2014 why: " + f.why) : null));
    }
    if (Array.isArray(d.people) && d.people.length) {
      head.appendChild(h("div", { class: "v-people" }, h("span", { class: "lab" }, "People"),
        d.people.map(function (n) { return h("span", { class: "chip" }, n); })));
    }
    var pairs = pairsOf[d.id] || [];
    if (pairs.length || d.duplicate_of) {
      var note = h("div", { class: "dup-note" });
      pairs.forEach(function (pr) {
        var other = byId[pr.a === d.id ? pr.b : pr.a];
        var rel = d.duplicate_of === other.id ? "Copy of" : other.duplicate_of === d.id ? "Has a copy:" : "Flagged with";
        note.appendChild(h("div", { class: "row" },
          h("span", { class: "pill " + (pr.kind === "exact" ? "exact" : "near") }, kindLabel(pr.kind)),
          h("span", null, rel + " "),
          h("button", { type: "button", class: "link-btn", "data-track": "duplicate open", onclick: function () { openDoc(other.id, {}); } }, other.title || other.id),
          h("span", { class: "mono small" }, "score " + fmtScore(pr.score))));
        if (pr.evidence) note.appendChild(h("p", { class: "ev" }, pr.evidence));
      });
      if (!pairs.length && byId[d.duplicate_of]) {
        var o = byId[d.duplicate_of];
        note.appendChild(h("div", { class: "row" }, h("span", { class: "pill near" }, "Duplicate"), h("span", null, "Copy of "),
          h("button", { type: "button", class: "link-btn", onclick: function () { openDoc(o.id, {}); } }, o.title || o.id)));
      }
      head.appendChild(note);
    }
    wrap.appendChild(head);

    /* sticky bar: pages, flags, view mode */
    var cited = {};
    if (S.qa >= 0) citeList(qa[S.qa]).forEach(function (c) { if (c.doc === d.id) cited[c.page] = (cited[c.page] || []).concat(c.n); });
    var pager = h("div", { class: "pager", role: "group", "aria-label": "Pages" }, h("span", { class: "lab", "aria-hidden": "true" }, "Page"));
    if (d.pages.length > 1) {
      pager.appendChild(h("button", { type: "button", class: "pg", "aria-label": "Previous page", disabled: idx === 0, "data-step": "prev", "data-track": "page prev",
        onclick: function () { goPage(pageNo(d, idx - 1), "prev"); } }, icon("i-prev")));
    }
    d.pages.forEach(function (pp, i) {
      var n = pageNo(d, i), label = "Page " + n + (pp.handwritten ? ", handwriting-style font" : "") + (cited[n] ? ", quoted by source " + cited[n].join(" and ") : "");
      pager.appendChild(h("button", { type: "button", class: "pg" + (cited[n] ? " cited" : ""), "aria-label": label, title: label, "aria-current": i === idx ? "true" : "false", "data-track": "page",
        onclick: function () { goPage(n); } }, String(n), pp.handwritten ? h("span", { class: "hdot", "aria-hidden": "true" }) : null));
    });
    if (d.pages.length > 1) {
      pager.appendChild(h("button", { type: "button", class: "pg", "aria-label": "Next page", disabled: idx === d.pages.length - 1, "data-step": "next", "data-track": "page next",
        onclick: function () { goPage(pageNo(d, idx + 1), "next"); } }, icon("i-next")));
    }
    var flags = h("div", { class: "v-flags" });
    if (p.handwritten) flags.appendChild(h("span", { class: "tag hand" }, "Handwriting-style font"));
    var conf = fmtConf(p.confidence);
    if (conf) flags.appendChild(h("span", { class: "tag conf", title: "Tesseract's mean word confidence on this page" }, "OCR confidence " + conf));
    var seg = h("div", { class: "seg", role: "group", "aria-label": "Show" });
    [["both", "Image + text"], ["image", "Image"], ["text", "Text"]].forEach(function (m) {
      seg.appendChild(h("button", { type: "button", "data-mode": m[0], "aria-pressed": S.view === m[0] ? "true" : "false", "data-track": "view " + m[0],
        onclick: function () { setView(m[0]); } }, m[1]));
    });
    var bar = h("div", { class: "v-bar" }, pager, flags, seg);
    wrap.appendChild(bar);

    /* body: page image next to its OCR text */
    var body = h("div", { class: "v-body mode-" + S.view });
    var alt = "Page " + pageNo(d, idx) + " of " + title + (p.handwritten ? " (handwriting-style font)" : "");
    var zbtn = h("button", { type: "button", class: "zoom-btn", "aria-label": "Open the page image full size", "data-track": "zoom" },
      h("img", { src: p.image, alt: alt, decoding: "async" }));
    zbtn.addEventListener("click", function () { openZoom(p.image, "Page " + pageNo(d, idx) + " \u00b7 " + title, zbtn); });
    body.appendChild(h("figure", { class: "v-img" }, zbtn,
      h("figcaption", { class: "cap" }, h("span", null, "Page image"), h("span", { "aria-hidden": "true" }, icon("i-zoom"), " Full size"))));

    var text = String(p.text || "");
    var cands = [];
    if (S.qa >= 0) {
      var cs = citeList(qa[S.qa]).filter(function (c) { return c.doc === d.id && c.page === pageNo(d, idx); });
      cs.sort(function (a, b) { return (b === S.cite) - (a === S.cite); });
      cs.forEach(function (c) {
        var k = c.quote ? text.indexOf(c.quote) : -1;
        if (k >= 0) cands.push({ s: k, e: k + c.quote.length, cls: "cite", n: c.n, on: c === S.cite });
      });
    }
    if (S.terms.length) cands = cands.concat(termRanges(foldPage(d, idx)));
    var ck = pageCheck(d, pageNo(d, idx)), thr = isNum(CK.low_conf_threshold) ? CK.low_conf_threshold : null;
    var lows = ck && Array.isArray(ck.low_conf) ? ck.low_conf : [];
    if (ck && ck.engine === "tesseract") {
      lows.forEach(function (w) {
        if (isNum(w.start) && isNum(w.end) && text.slice(w.start, w.end) === w.word) {
          cands.push({ s: w.start, e: w.end, cls: "lowc", title: "Tesseract confidence " + fmtConf(w.conf) + (thr !== null ? ", under " + thr + "%" : "") });
        }
      });
    }
    var ocr = h("div", { class: "ocr", lang: "en" });
    ocr.appendChild(text ? markedText(text, pickRanges(cands), false) : document.createTextNode("(No text was read on this page.)"));
    var vt = h("div", { class: "v-text" }, h("span", { class: "lab" }, "OCR text"));
    if (ck) vt.appendChild(ocrCheck(d, ck, lows, thr));
    if (S.cite && S.cite.doc === d.id && S.cite.page === pageNo(d, idx) && text.indexOf(S.cite.quote) < 0) {
      vt.appendChild(h("p", { class: "v-miss" }, "The quoted words of source " + S.cite.n + " were not found on this page."));
    }
    vt.appendChild(ocr);
    body.appendChild(vt);
    wrap.appendChild(body);

    /* a new document or page starts at the top of the pane */
    var viewer = $("viewer"), shown = d.id + "\u0000" + pageNo(d, idx);
    if (shown !== lastShown) { viewer.scrollTop = 0; lastShown = shown; }
    /* keep the image below the sticky bar */
    var setBar = function () { viewer.style.setProperty("--bar-h", bar.offsetHeight + "px"); };
    setBar();
    if (window.ResizeObserver) { barObserver = new ResizeObserver(setBar); barObserver.observe(bar); }
  }

  /* ---------- duplicates and stats ---------- */
  function thumb(d) {
    var p = d.pages[0];
    var b = h("button", { type: "button", class: "thumb", "aria-label": "Open " + d.id + ", " + (d.title || d.id), "data-track": "duplicates thumb",
      onclick: function () { openDoc(d.id, { reveal: true }); } },
      h("img", { src: p.image, alt: "", loading: "lazy", decoding: "async", width: "1000", height: "1294" }));
    return b;
  }
  function docCell(d, label) {
    var sub = [d.id, cap(d.type), fmtDate(d.date)].filter(Boolean).join(" \u00b7 ");
    return h("td", { class: "dcell" }, h("span", { class: "mlab", "aria-hidden": "true" }, label),
      h("div", { class: "dcell-in" }, thumb(d), h("div", null,
        h("button", { type: "button", class: "link-btn", "data-track": "duplicates open", onclick: function () { openDoc(d.id, { reveal: true }); } }, d.title || d.id),
        sub ? h("span", { class: "sub" }, sub) : null)));
  }
  var METHOD = {
    exact: "SHA-256 hash of the page pixels, at ingest",
    near: "share of 3-word text shingles (MinHash + LSH to find candidates) plus a 64-bit image hash"
  };
  function renderDups() {
    var tb = document.querySelector("#dups tbody");
    var rows = dups.filter(function (p) { return p && byId[p.a] && byId[p.b]; });
    if (!rows.length) {
      tb.appendChild(h("tr", null, h("td", { colspan: "5" }, "No duplicate pairs were flagged in this run.")));
    }
    rows.forEach(function (p) {
      tb.appendChild(h("tr", null,
        docCell(byId[p.a], "Document"),
        docCell(byId[p.b], "Flagged with"),
        h("td", null, h("span", { class: "pill " + (p.kind === "exact" ? "exact" : "near") }, kindLabel(p.kind)),
          METHOD[p.kind] ? h("span", { class: "sub" }, "Method: " + METHOD[p.kind]) : null),
        h("td", { class: "n" }, h("span", { class: "mlab", "aria-hidden": "true" }, "Score"), fmtScore(p.score)),
        h("td", null, h("span", { class: "mlab", "aria-hidden": "true" }, "Evidence"), p.evidence || "")));
    });
    renderLookalike();
  }
  // The closest pair of different records that was NOT flagged, with the threshold it stayed under.
  function renderLookalike() {
    var box = $("lookalike"), la = CK.lookalike;
    if (!box || !la || !byId[la.a] || !byId[la.b] || !isNum(la.score) || !isNum(la.threshold)) return;
    var a = byId[la.a], b = byId[la.b];
    box.appendChild(h("div", { class: "la-head" }, h("span", { class: "pill found" }, "Not flagged"),
      h("h3", { id: "h-lookalike" }, "Closest pair of different records")));
    box.appendChild(h("div", { class: "la-pair" },
      h("div", { class: "la-doc" }, thumb(a), h("div", null,
        h("button", { type: "button", class: "link-btn", "data-track": "lookalike open", onclick: function () { openDoc(a.id, { reveal: true }); } }, a.title || a.id),
        h("span", { class: "sub" }, [a.id, cap(a.type), fmtDate(a.date)].filter(Boolean).join(" \u00b7 ")))),
      h("div", { class: "la-doc" }, thumb(b), h("div", null,
        h("button", { type: "button", class: "link-btn", "data-track": "lookalike open", onclick: function () { openDoc(b.id, { reveal: true }); } }, b.title || b.id),
        h("span", { class: "sub" }, [b.id, cap(b.type), fmtDate(b.date)].filter(Boolean).join(" \u00b7 "))))));
    box.appendChild(h("p", { class: "la-text" },
      "Score ", h("b", { class: "mono" }, fmtScore(la.score)), " against a near-duplicate threshold of ", h("b", { class: "mono" }, fmtScore(la.threshold)),
      " (share of 3-word text shingles), so the pair was not flagged. Apart from the flagged duplicates, it is the highest score among all " +
      (isNum(la.pairs_checked) ? fmtInt(la.pairs_checked) + " " : "") + "pairs of documents that were read, each pair scored exactly" +
      (la.lsh_candidate === false ? "; the MinHash index did not propose it as a candidate" : "") +
      (isNum(la.image_hash_bits) ? ". First-page image hashes are " + la.image_hash_bits + " of 64 bits apart." : ".")));
    box.hidden = false;
  }
  function renderStats() {
    var tb = document.querySelector("#stats tbody");
    var rows = stats.filter(function (s) { return s && s.label; });
    if (!rows.length) {
      tb.appendChild(h("tr", null, h("td", { colspan: "3" }, "No measurements in the data file.")));
      return;
    }
    rows.forEach(function (s) {
      tb.appendChild(h("tr", null, h("td", null, s.label), h("td", { class: "n" }, String(s.value)), h("td", null, s.note || "")));
    });
  }

  /* ---------- start ---------- */
  try {
    renderHeader();
    renderFolders();
    renderQuestions();
    renderDocs();
    renderDups();
    renderStats();
    if (docs.length) { S.doc = docs[0].id; S.page = pageNo(docs[0], 0); markDoc(); }
    renderViewer();
  } catch (e) {
    fail("The archive data could not be shown: " + (e && e.message ? e.message : e));
    return;
  }
  // Deep links for proposals: #ask=2 opens the second prepared question, #doc=<id>&page=<n> opens a page.
  try {
    var m = /^#ask=(\d+)$/.exec(location.hash), md = /^#doc=([^&]+)(?:&page=(\d+))?$/.exec(location.hash);
    var linked = md ? decodeURIComponent(md[1]) : null;
    var go = function () {
      if (m && qa[+m[1] - 1]) pickQuestion(+m[1] - 1);
      else if (linked && byId[linked]) openDoc(linked, { page: md[2] ? +md[2] : null, reveal: true });
    };
    // Scroll once the web fonts are in, so the target is measured with the final layout.
    if (m || linked) { if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); else go(); }
  } catch (e) { /* a malformed link just opens the page as usual */ }
})();
