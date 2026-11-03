(function () {
  "use strict";
  var D, filter = "all", selected = null;
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fmt(n) { return Number(n).toLocaleString("en-US"); }
  var CHIP = { "full text": "s-full", "abstract only": "s-abs", "not OA": "s-noa", "duplicate (merged)": "s-dup", "not found": "s-nf" };
  function chip(s) { return '<span class="chip ' + (CHIP[s] || "s-nf") + '">' + esc(s) + "</span>"; }

  function parseCSV(text) {
    var rows = [], row = [], f = "", q = false, i, c;
    for (i = 0; i < text.length; i++) {
      c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c;
      } else if (c === '"') q = true;
      else if (c === ",") { row.push(f); f = ""; }
      else if (c === "\n") { row.push(f); rows.push(row); row = []; f = ""; }
      else if (c !== "\r") f += c;
    }
    if (f !== "" || row.length) { row.push(f); rows.push(row); }
    return rows;
  }

  function tiles() {
    var s = D.summary;
    var t = [
      ["Input IDs", s.inputs, "PMIDs and DOIs"],
      ["Unique after dedupe", s.unique, s.duplicates_merged + " duplicates merged"],
      ["Full text", s.full_text, "open licence, JATS parsed"],
      ["Abstract only", s.abstract_only, "no open licence in PMC"],
      ["Not open access", s.not_oa, "paywalled"],
      ["Tables extracted", s.tables, s.tables_csv + " to CSV, " + (s.tables - s.tables_csv) + " image only"],
      ["References", s.references, s.refs_with_doi + " with DOI, " + s.refs_with_pmid + " with PMID"],
      ["Supplements", s.supplements, "file links found"],
      ["Metadata OK", s.metadata_ok, "of " + s.unique + " agree with Crossref"]
    ];
    if (s.not_found) t.splice(5, 0, ["Not found", s.not_found, "ID did not resolve"]);
    $("tiles").innerHTML = t.map(function (x) { return '<div class="tile">' + esc(x[0]) + "<b>" + fmt(x[1]) + "</b><small>" + esc(x[2]) + "</small></div>"; }).join("");
    $("tilenote").textContent = "Status counts are per unique article (" + s.full_text + " + " + s.abstract_only + " + " + s.not_oa +
      (s.not_found ? " + " + s.not_found : "") + " = " + s.unique + "). Tables, references and supplements come from the " + s.full_text + " full-text articles. " + s.tables_csv_public + " of the " + s.tables_csv + " table CSVs are published on this page; the " + (s.tables_csv - s.tables_csv_public) + " from non-commercial (NC) licensed articles are extracted and counted but not republished here.";
    var q = s.query;
    $("status").innerHTML = "<b>Status:</b> stand-in topic, real data. One public PubMed query, <code>" + esc(q.query) + "</code>, published " +
      esc(q.mindate) + " to " + esc(q.maxdate) + ", sorted by relevance (" + fmt(q.hits) + " hits). Inputs: the first 40 PMIDs, 5 DOIs from later results that have no PMC copy and are closed in Unpaywall, and 2 deliberate duplicates (a PMID given again as its DOI). Open-access full text only. Run on " + esc(s.run_date) + ".";
    $("foot").innerHTML = "Python 3 (requests, lxml), run on " + esc(s.run_date) + " against NCBI E-utilities, the PMC ID Converter, PMC OAI-PMH, Europe PMC REST, Crossref REST and Unpaywall, with the tool name <code>slimanechanchoul-demo</code>. The topic is a stand-in; the same code takes any PMID/DOI list or PubMed query.";
  }

  function filters() {
    var counts = {};
    D.coverage.forEach(function (r) { counts[r.status] = (counts[r.status] || 0) + 1; });
    var opts = [["all", "All", D.coverage.length]];
    ["full text", "abstract only", "not OA", "not found", "duplicate (merged)"].forEach(function (k) { if (counts[k]) opts.push([k, k.charAt(0).toUpperCase() + k.slice(1), counts[k]]); });
    $("filters").innerHTML = opts.map(function (o) {
      return '<button type="button" class="fbtn" data-f="' + esc(o[0]) + '" aria-pressed="' + (o[0] === filter) + '">' + esc(o[1]) + " <span>" + o[2] + "</span></button>";
    }).join("");
    $("filters").onclick = function (e) {
      var b = e.target.closest("button"); if (!b) return;
      filter = b.getAttribute("data-f");
      Array.prototype.forEach.call($("filters").children, function (x) { x.setAttribute("aria-pressed", x === b); });
      table();
    };
  }

  function table() {
    var rows = D.coverage.filter(function (r) { return filter === "all" || r.status === filter; });
    var h = '<thead><tr><th class="n">#</th><th>Input ID</th><th>Status</th><th>Article</th><th>Licence</th><th class="n">Sections</th><th class="n">Tables</th><th class="n">Refs</th><th class="n">Supp.</th><th>Metadata</th><th>Access route</th></tr></thead><tbody>';
    h += rows.map(function (r) {
      var tb = r.n_tables ? r.n_tables_csv + "/" + r.n_tables : "0";
      return '<tr tabindex="0" data-n="' + r.n + '"' + (selected === r.n ? ' class="on"' : "") + '><td class="n">' + r.n + '</td><td class="id" title="' + esc(r.input_id) + '">' + esc(r.input_id) +
        "<br><span class=\"note\">" + esc(r.input_type.toUpperCase()) + "</span></td><td>" + chip(r.status) + "</td><td style=\"min-width:15rem\">" + esc(r.title.length > 90 ? r.title.slice(0, 88) + "…" : r.title) +
        '<br><span class="note">' + esc(r.journal) + (r.year ? ", " + r.year : "") + "</span></td><td>" + esc(r.license) + '</td><td class="n">' + r.n_sections + '</td><td class="n">' + tb +
        '</td><td class="n">' + r.n_refs + '</td><td class="n">' + r.n_supplements + "</td><td>" + (r.metadata_ok ? '<span class="yes">OK</span>' : '<span class="no">check</span>') +
        (r.metadata_notes ? '<br><span class="note">' + esc(r.metadata_notes) + "</span>" : "") + '</td><td class="why">' + esc(r.status === "duplicate (merged)" ? "duplicate of #" + r.duplicate_of_input + ", counted once" : r.access_route) + "</td></tr>";
    }).join("") + "</tbody>";
    $("cov").innerHTML = h;
  }

  function onPick(e) {
    var tr = e.target.closest("tbody tr"); if (!tr) return;
    if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
    if (e.type === "keydown") e.preventDefault();
    pick(+tr.getAttribute("data-n"), true);
  }

  function pick(n, scroll) {
    selected = n;
    Array.prototype.forEach.call($("cov").querySelectorAll("tbody tr"), function (tr) { tr.classList.toggle("on", +tr.getAttribute("data-n") === n); });
    detail(n);
    if (scroll) $("detail").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function link(href, text) { return '<a href="' + esc(href) + '" target="_blank" rel="noopener">' + esc(text) + "</a>"; }

  function detail(n) {
    var r = D.coverage.filter(function (x) { return x.n === n; })[0];
    var a = D.articles.filter(function (x) { return x.id === r.article_id; })[0];
    var inputs = D.coverage.filter(function (x) { return x.article_id === a.id; }).map(function (x) { return "#" + x.n + " " + x.input_id; });
    var h = "<h3>" + esc(a.title || "(no title)") + "</h3>";
    h += '<div class="ids">' + (a.pmid ? "<span>PMID " + link("https://pubmed.ncbi.nlm.nih.gov/" + a.pmid + "/", a.pmid) + "</span>" : "") +
      (a.pmcid ? "<span>PMCID " + link("https://pmc.ncbi.nlm.nih.gov/articles/" + a.pmcid + "/", a.pmcid) + "</span>" : "") +
      (a.doi ? "<span>DOI " + link("https://doi.org/" + a.doi, a.doi) + "</span>" : "") + "</div>";
    h += '<dl class="facts"><dt>Status</dt><dd>' + chip(a.status) + (r.status === "duplicate (merged)" ? " (this input is a duplicate of #" + r.duplicate_of_input + ")" : "") + "</dd>";
    h += "<dt>Input IDs</dt><dd>" + esc(inputs.join("; ")) + "</dd>";
    h += "<dt>Journal</dt><dd>" + esc(a.journal) + (a.year ? ", " + a.year : "") + (a.n_authors != null ? " · " + a.n_authors + " authors" : "") + "</dd>";
    h += "<dt>Licence</dt><dd>" + (a.license_url ? link(a.license_url, a.license) : esc(a.license)) + "</dd>";
    h += "<dt>Access route</dt><dd>" + esc(a.access) + "</dd>";
    if (a.source) h += "<dt>Full text from</dt><dd>" + esc(a.source) + "</dd>";
    if (a.check) h += "<dt>Crossref check</dt><dd>title similarity " + a.check.title_score + ", year " + a.check.year_pubmed + " vs " + esc(a.check.years_crossref.join("/")) +
      ", journal similarity " + a.check.journal_score + " (" + esc(a.check.crossref_journal) + ") → " + (a.metadata_ok ? '<span class="yes">OK</span>' : '<span class="no">check</span>') +
      (a.metadata_notes ? ". " + esc(a.metadata_notes) : "") + "</dd>";
    if (a.reason) h += "<dt>Reason</dt><dd>" + esc(a.reason) + "</dd>";
    h += "</dl>";
    if (a.status === "full text") {
      h += '<div class="two"><div><h3>Sections (' + a.n_sections + " main, " + fmt(a.fulltext_words) + " words)</h3><ul class=\"plain\">" +
        a.sections.map(function (s) { return "<li" + (s.kind === "main" ? "" : ' class="bm"') + "><span>" + esc(s.title) + (s.kind === "main" ? "" : " (back matter)") + "</span><span>" + fmt(s.words) + " words</span></li>"; }).join("") + "</ul></div>";
      h += "<div><h3>References (" + a.n_refs + ")</h3><p class=\"note\" style=\"margin:0 0 .4rem\">" + a.refs_with_doi + " with a DOI, " + a.refs_with_pmid + " with a PMID. First IDs found:</p><ul class=\"plain\">" +
        a.ref_ids_sample.map(function (x) { return "<li><span>" + (x.indexOf("PMID:") === 0 ? link("https://pubmed.ncbi.nlm.nih.gov/" + x.slice(5) + "/", x) : link("https://doi.org/" + x, x)) + "</span></li>"; }).join("") + "</ul>";
      h += "<h3>Supplementary material (" + a.n_supplements + ")</h3>" + (a.supplements.length ? '<ul class="plain">' + a.supplements.map(function (s) {
        return "<li><span>" + (s.url ? link(s.url, s.file) : esc(s.label)) + "</span><span>" + esc(s.label) + "</span></li>"; }).join("") + "</ul>" : '<p class="note">None listed in the XML.</p>') + "</div></div>";
      h += "<h3>Tables (" + a.n_tables + ")</h3>";
      if (!a.tables.length) h += '<p class="note">No tables in this article.</p>';
      else if (a.tables.some(function (t) { return t.csv_public; })) h += '<p class="note" style="margin:0">Reproduced from ' + esc(a.journal) + (a.year ? " (" + a.year + ")" : "") + ", " + link("https://doi.org/" + a.doi, "doi:" + a.doi) + ", under " + (a.license_url ? link(a.license_url, a.license) : esc(a.license)) + ". Cells are copied as published; header cells that span columns are repeated.</p>";
      var shown = 0;
      a.tables.forEach(function (t, i) {
        h += '<p class="cap"><b>' + esc(t.label) + ".</b> " + esc(t.caption) + " " + (t.csv_public ? '<span class="note">(' + t.n_rows + " rows × " + t.n_cols + " columns, " + '<a href="tables/' + esc(t.file) + '" download>CSV</a>)</span>' :
          t.file ? '<span class="note">(' + esc(t.public_note) + ")</span>" : '<span class="no">' + esc(t.note) + "</span>") + "</p>";
        if (t.csv_public && shown < 2) { h += '<div class="scroll" style="max-height:22rem" data-csv="' + esc(t.file) + '" data-hr="' + (t.header_rows || 1) + '"><p class="note" style="padding:.5rem">Loading table…</p></div>'; shown++; }
      });
    }
    $("detail").innerHTML = h;
    Array.prototype.forEach.call($("detail").querySelectorAll("[data-csv]"), function (box) {
      fetch("tables/" + box.getAttribute("data-csv")).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); }).then(function (txt) {
        var rows = parseCSV(txt), hr = +box.getAttribute("data-hr");
        box.innerHTML = '<table class="t data">' + rows.map(function (row, i) {
          return "<tr" + (i < hr ? ' class="h"' : "") + ">" + row.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>";
        }).join("") + "</table>";
      }).catch(function () { box.innerHTML = '<p class="note" style="padding:.5rem">Could not load the CSV.</p>'; });
    });
  }

  function merges() {
    $("merges").innerHTML = "<thead><tr><th>Input</th><th>Merged into</th><th>Rule</th><th>Key</th></tr></thead><tbody>" + D.merges.map(function (m) {
      return "<tr><td>#" + m.input_n + " " + esc(m.input_id) + "</td><td>#" + m.merged_into_n + " " + esc(m.merged_into_id) + "</td><td>" + esc(m.rule) + "</td><td>" + esc(m.key) + "</td></tr>";
    }).join("") + "</tbody>";
  }

  document.addEventListener("DOMContentLoaded", function () {
    fetch("data.json").then(function (r) { return r.json(); }).then(function (d) {
      D = d; tiles(); filters(); table(); merges();
      $("cov").addEventListener("click", onPick);
      $("cov").addEventListener("keydown", onPick);
      var first = D.coverage.filter(function (r) { return r.status === "full text" && r.n_tables_csv >= 2; })[0] || D.coverage[0];
      pick(first.n, false);
    }).catch(function () { $("status").innerHTML = "<b>Status:</b> could not load data.json."; });
  });
})();
