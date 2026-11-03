(function () {
  "use strict";
  var TYPES = {
    wh:   ["Warehouse & logistics", 55, "Warehouse or distribution site: forklift fleets often run on propane cylinders."],
    mfg:  ["Manufacturing & industrial", 55, "Industrial site: forklifts, process heat and space heating are common propane uses."],
    scr:  ["Scrap & salvage yard", 50, "Scrap or salvage yard: forklifts and loaders; cylinder use likely."],
    rest: ["Restaurant", 35, "Commercial kitchen: gas cooking is common; propane if the site is off the natural-gas main."],
    hot:  ["Hotel", 35, "Hotel: water heating, laundry and kitchen use gas; propane if off the gas main."],
    mot:  ["Motel", 25, "Motel: water heating and laundry; propane if off the gas main."],
    ff:   ["Fast food", 25, "Fast-food kitchen: fryers and grills often run on gas."],
    trd:  ["Trades & contractors", 20, "Trade business: torches, heaters and small cylinders."],
    cafe: ["Cafe", 15, "Cafe: small kitchen, lower gas use."],
    lpg:  ["Propane seller", 15, "Already sells propane: a competitor, or a reseller you could supply."]
  };
  var ST = { C: "Confirmed", A: "Assumed", U: "Unchecked" };
  var DOWNTOWN = [31.7587, -106.4869];
  var center = DOWNTOWN.slice();
  var rows = [], stats = {}, cust = [], map, layer, circle, cmark, markers = {};
  var sortK = "score", sortDir = -1, showAll = false, LIMIT = 150;
  var $ = function (id) { return document.getElementById(id); };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function km(a, b, c, d) {
    var p = Math.PI / 180, x = 0.5 - Math.cos((c - a) * p) / 2 + Math.cos(a * p) * Math.cos(c * p) * (1 - Math.cos((d - b) * p)) / 2;
    return 12742 * Math.asin(Math.sqrt(x));
  }
  function norm(s) {
    s = String(s || "").normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9 ]/g, " ");
    s = s.replace(/\b(the|inc|llc|co|corp|company|ltd|el paso|of)\b/g, " ");
    return s.replace(/\s+/g, " ").trim();
  }
  var SUF = { avenue: "ave", av: "ave", street: "st", boulevard: "blvd", drive: "dr", road: "rd", lane: "ln", court: "ct", place: "pl", parkway: "pkwy", highway: "hwy", north: "n", south: "s", east: "e", west: "w", suite: "", ste: "" };
  function naddr(s) {
    var t = String(s || "").split(",")[0].toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean).map(function (w) { return SUF.hasOwnProperty(w) ? SUF[w] : w; }).filter(Boolean);
    if (!t.length || !/^\d+$/.test(t[0])) return "";
    return t.join(" ");
  }
  function radius() { return +$("radius").value; }
  function score(r, R) {
    var s = TYPES[r.t][1];
    if (r.st === "C") s += 30;
    s += r.dd <= R ? Math.round(20 * (1 - r.dd / R)) : -40;
    if (r.br) s -= 10;
    if (r.a) s += 5;
    if (r.w) s += 5;
    return Math.max(0, Math.min(100, s));
  }
  function color(st) { return getComputedStyle(document.documentElement).getPropertyValue(st === "C" ? "--s-c" : st === "A" ? "--s-a" : st === "x" ? "--cust" : st === "area" ? "--area" : "--s-u").trim(); }

  function rules() {
    var R = [];
    Object.keys(TYPES).forEach(function (k) { R.push(["Type: " + TYPES[k][0] + " <span class='note'>(" + esc(TYPES[k][2]) + ")</span>", TYPES[k][1]]); });
    R.push(["Homepage confirms propane, LP gas, LPG or forklifts", "+30"]);
    R.push(["Inside the service radius: closer is better (20 at the center, 0 at the edge)", "+0 to +20"]);
    R.push(["Outside the service radius", "−40"]);
    R.push(["National chain (brand tag in OpenStreetMap): buying is often decided centrally", "−10"]);
    R.push(["Has a street address", "+5"]);
    R.push(["Has its own website (can be checked, and is a way in)", "+5"]);
    $("rules").tBodies[0].innerHTML = R.map(function (x) { return "<tr><td>" + x[0] + "</td><td class='num'>" + x[1] + "</td></tr>"; }).join("");
  }

  function filters() {
    var t = {}, s = {};
    Array.prototype.forEach.call($("types").querySelectorAll("input"), function (i) { t[i.value] = i.checked; });
    Array.prototype.forEach.call($("stats").querySelectorAll("input"), function (i) { s[i.value] = i.checked; });
    return { t: t, s: s, inonly: $("inonly").checked };
  }

  function recompute() {
    var R = radius();
    rows.forEach(function (r) { r.dd = Math.round(km(center[0], center[1], r.lat, r.lon) * 10) / 10; r.inr = r.dd <= R; r.score = score(r, R); });
  }

  function visible() {
    var f = filters();
    return rows.filter(function (r) { return f.t[r.t] && f.s[r.st] && (!f.inonly || r.inr); });
  }

  function sorted(v) {
    var k = sortK, d = sortDir;
    return v.slice().sort(function (a, b) {
      var x = k === "t" ? TYPES[a.t][0] : k === "d" ? a.dd : a[k], y = k === "t" ? TYPES[b.t][0] : k === "d" ? b.dd : b[k];
      if (typeof x === "string") { x = x.toLowerCase(); y = y.toLowerCase(); }
      if (x < y) return -d; if (x > y) return d;
      return b.score - a.score || a.dd - b.dd;
    });
  }

  function evCell(r) {
    var h = "";
    if (r.dup) h += "<span class='tag'>Existing customer</span>" + esc(r.dup) + "<br>";
    if (r.st === "C") {
      h += "<q>" + esc(r.ev) + "</q> <a href='" + esc(r.evu) + "' target='_blank' rel='noopener nofollow'>homepage</a>";
    } else {
      h += esc(r.why);
      if (r.note) h += " <span class='note'>(" + esc(r.note) + ")</span>";
    }
    if (r.llm) h += "<span class='llm'><span class='tag' title='Written by " + esc(stats.llm_model) + " from the facts in this row'>LLM-written</span>" + esc(r.llm) + "</span>";
    h += " <a class='note' href='https://www.openstreetmap.org/" + esc(r.osm) + "' target='_blank' rel='noopener nofollow'>OSM record</a>";
    return h;
  }

  function render() {
    var v = visible(), s = sorted(v), inr = rows.filter(function (r) { return r.inr; });
    var live = v.filter(function (r) { return !r.dup; });
    $("k-in").textContent = inr.filter(function (r) { return !r.dup; }).length;
    ["C", "A", "U"].forEach(function (k) {
      $("k-" + k.toLowerCase()).textContent = live.filter(function (r) { return r.st === k; }).length;
      $("n-" + k).textContent = inr.filter(function (r) { return r.st === k; }).length;
    });
    $("k-x").textContent = rows.filter(function (r) { return r.dup; }).length;
    Array.prototype.forEach.call($("types").querySelectorAll("input"), function (i) {
      i.parentNode.querySelector(".n").textContent = inr.filter(function (r) { return r.t === i.value; }).length;
    });
    $("count").textContent = v.length + " shown, " + (v.length - live.length) + " of them existing customers";
    var show = showAll ? s : s.slice(0, LIMIT);
    $("more").hidden = s.length <= LIMIT || showAll;
    $("more").textContent = "Show all " + s.length + " rows";
    $("list").tBodies[0].innerHTML = show.map(function (r) {
      return "<tr data-id='" + r.id + "' class='" + (r.dup ? "dup" : "") + (r.inr ? "" : " out") + "'>" +
        "<td class='num sc'><b>" + r.score + "</b></td>" +
        "<td class='nm'>" + esc(r.n) + (r.a ? "<span class='ad'>" + esc(r.a) + "</span>" : "") + "</td>" +
        "<td>" + esc(TYPES[r.t][0]) + (r.br ? " <span class='tag'>chain</span>" : "") + "</td>" +
        "<td class='num'>" + r.dd.toFixed(1) + "</td>" +
        "<td class='st'><span class='dot " + r.st.toLowerCase() + "'></span>" + ST[r.st] + "</td>" +
        "<td class='ev'>" + evCell(r) + "</td></tr>";
    }).join("");
    Array.prototype.forEach.call(document.querySelectorAll("#list th[data-k]"), function (th) {
      th.setAttribute("aria-sort", th.dataset.k === sortK ? (sortDir < 0 ? "descending" : "ascending") : "none");
    });
    drawMap(v);
  }

  function popup(r) {
    return "<b>" + esc(r.n) + "</b><br>" + esc(TYPES[r.t][0]) + " &middot; " + r.dd.toFixed(1) + " km &middot; score " + r.score +
      "<br><span class='dot " + r.st.toLowerCase() + "'></span>" + ST[r.st] + (r.dup ? " &middot; existing customer" : "") +
      (r.st === "C" ? "<br><q>" + esc(r.ev) + "</q>" : "<br>" + esc(r.why)) + (r.a ? "<br>" + esc(r.a) : "");
  }

  function drawMap(v) {
    if (!map) return;
    layer.clearLayers(); markers = {};
    var R = radius();
    circle.setLatLng(center).setRadius(R * 1000);
    cmark.setLatLng(center);
    v.slice().sort(function (a, b) { return a.score - b.score; }).forEach(function (r) {
      var m = r.dup
        ? L.circleMarker([r.lat, r.lon], { radius: 6, color: color("x"), weight: 2, fillOpacity: 0, opacity: .8, className: "pin-dup" })
        : L.circleMarker([r.lat, r.lon], { radius: r.st === "C" ? 9 : r.st === "A" ? 7 : r.score >= 60 ? 5 : 4, color: "rgba(0,0,0,.45)", weight: 1, fillColor: color(r.st), fillOpacity: !r.inr ? .3 : r.st === "U" ? .65 : .95, className: "pin-" + r.st });
      m.bindPopup(function () { return popup(r); });
      m.addTo(layer); markers[r.id] = m;
    });
  }

  function initMap() {
    map = L.map("map", { scrollWheelZoom: false }).setView(DOWNTOWN, 11);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>" }).addTo(map);
    circle = L.circle(DOWNTOWN, { radius: 20000, color: color("area"), weight: 2, fillOpacity: .04, interactive: false }).addTo(map);
    cmark = L.circleMarker(DOWNTOWN, { radius: 4, color: "#14202B", weight: 2, fillColor: "#fff", fillOpacity: 1, interactive: false }).addTo(map);
    layer = L.layerGroup().addTo(map);
    map.on("click", function (e) {
      center = [Math.round(e.latlng.lat * 1e4) / 1e4, Math.round(e.latlng.lng * 1e4) / 1e4];
      $("cname").textContent = "the point you clicked (" + center[0].toFixed(3) + ", " + center[1].toFixed(3) + ")";
      $("reset").hidden = false;
      recompute(); render();
    });
  }

  // ---- customer CSV ----
  function parseCSV(text) {
    var out = [], row = [], f = "", q = false, i, c;
    text = text.replace(/^﻿/, "");
    for (i = 0; i < text.length; i++) {
      c = text[i];
      if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
      else if (c === '"') q = true;
      else if (c === ",") { row.push(f); f = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(f); out.push(row); row = []; f = ""; }
      else f += c;
    }
    if (f || row.length) { row.push(f); out.push(row); }
    return out.filter(function (r) { return r.some(function (x) { return x.trim(); }); });
  }
  function loadCustomers(text, label) {
    var t = parseCSV(text);
    if (!t.length) { $("custmsg").textContent = "That file looks empty."; return; }
    var h = t[0].map(function (x) { return x.trim().toLowerCase(); });
    var col = function (names) { for (var i = 0; i < h.length; i++) if (names.indexOf(h[i]) >= 0) return i; return -1; };
    var ni = col(["name", "customer", "business", "company", "account"]), ai = col(["address", "street", "addr"]),
        la = col(["lat", "latitude"]), lo = col(["lon", "lng", "long", "longitude"]);
    if (ni < 0 && ai < 0 && (la < 0 || lo < 0)) { $("custmsg").textContent = "No name, address or lat/lon column found in the header row."; return; }
    cust = t.slice(1).map(function (r) {
      var lat = la >= 0 ? parseFloat(r[la]) : NaN, lon = lo >= 0 ? parseFloat(r[lo]) : NaN;
      return { name: ni >= 0 ? (r[ni] || "").trim() : "", nn: ni >= 0 ? norm(r[ni]) : "", na: ai >= 0 ? naddr(r[ai]) : "", lat: lat, lon: lon, geo: isFinite(lat) && isFinite(lon) };
    });
    var hits = match();
    $("custmsg").innerHTML = esc(label) + ": " + cust.length + " customers read, <b>" + hits + "</b> matched prospects (greyed out, left out of the export).";
    $("clear").hidden = false;
    render();
  }
  function match() {
    var n = 0, ac = {};
    rows.forEach(function (r) { var a = naddr(r.a); if (a) ac[a] = (ac[a] || 0) + 1; });
    rows.forEach(function (r) {
      r.dup = "";
      var rn = norm(r.n), ra = naddr(r.a);
      if (ra && ac[ra] > 1) ra = "";  // shared address (a plaza): never match on address alone
      for (var i = 0; i < cust.length; i++) {
        var c = cust[i], d = c.geo ? km(c.lat, c.lon, r.lat, r.lon) * 1000 : null;
        if (d !== null && d <= 75) { r.dup = "within " + Math.round(d) + " m of “" + (c.name || "a customer location") + "”"; break; }
        if (c.nn && c.nn === rn && (d === null || d <= 1000)) { r.dup = "same name as “" + c.name + "”"; break; }
        if (c.na && ra && c.na === ra) { r.dup = "same street address as “" + (c.name || "a customer") + "”"; break; }
      }
      if (r.dup) n++;
    });
    return n;
  }

  function exportCSV() {
    var v = sorted(visible().filter(function (r) { return !r.dup; }));
    var head = ["score", "name", "type", "status", "km_from_center", "in_service_area", "address", "website", "lat", "lon", "evidence_snippet", "evidence_url", "reason", "llm_line", "check_note", "osm_source"];
    var q = function (x) { x = String(x == null ? "" : x); return /[",\n]/.test(x) ? '"' + x.replace(/"/g, '""') + '"' : x; };
    var lines = [head.join(",")].concat(v.map(function (r) {
      return [r.score, r.n, TYPES[r.t][0], ST[r.st], r.dd, r.inr ? "yes" : "no", r.a, r.w, r.lat, r.lon, r.ev || "", r.evu || "", r.why, r.llm || "", r.note || "", "https://www.openstreetmap.org/" + r.osm].map(q).join(",");
    }));
    var blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "el-paso-propane-prospects.csv";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }

  function summary() {
    var by = stats.by_type, parts = Object.keys(TYPES).map(function (k) { return "<li>" + esc(TYPES[k][0]) + ": <b>" + by[k] + "</b></li>"; }).join("");
    $("found").innerHTML = "<p style='margin-top:0'><b>" + stats.prospects + "</b> businesses kept from <b>" + stats.osm_features + "</b> OpenStreetMap features (OSM data as of " + esc(stats.osm_timestamp.slice(0, 10)) + "; dropped: " + stats.unnamed + " unnamed, " + stats.irrelevant + " utilities or unrelated, " + stats.dupes + " duplicates).</p>" +
      "<ul style='columns:2;margin:.3rem 0 .8rem;padding-left:1.1rem'>" + parts + "</ul>" +
      "<p style='margin:0'>Homepages: <b>" + stats.homepages_tried + "</b> tried, <b>" + stats.homepages_read + "</b> read, <b>" + stats.confirmed + "</b> confirmed a mention, <b>" + stats.assumed + "</b> read with no mention. The other " + (stats.homepages_tried - stats.homepages_read) + " failed: dead domains, blocked readers or robots.txt. Small businesses rarely say “propane” on their homepage, so in a real project most confirmation comes from a short call or the B2B tool, logged in the same status column.</p>" +
      "<p class='note' style='margin:.6rem 0 0'>Industrial coverage in OpenStreetMap is thin: many warehouses are mapped as buildings without a name. The warehouses and plants in this list are real, but far from all of them.</p>";
    var c = rows.filter(function (r) { return r.st === "C"; });
    $("examples").innerHTML = c.length ? c.map(function (r) {
      return "<div class='card'><b>" + esc(r.n) + "</b> <span class='note'>" + esc(TYPES[r.t][0]) + (r.a ? ", " + esc(r.a) : "") + "</span><br><q>" + esc(r.ev) + "</q><br><a href='" + esc(r.evu) + "' target='_blank' rel='noopener nofollow'>" + esc(r.evu) + "</a> <span class='note'>(matched: " + esc(r.kw) + ")</span></div>";
    }).join("") + "<p class='note' style='margin:0'>Read the snippet before you call: a match on a product listing (a retailer selling propane heaters) is evidence of propane in the business, not of a forklift fleet.</p>" : "<p class='note'>None in this run.</p>";
    $("llmnote").innerHTML = stats.llm_model
      ? "The top " + stats.llm_lines + " rows at the default 20 km radius carry one line marked <span class='tag'>LLM-written</span>, made offline by " + esc(stats.llm_model) + " in " + stats.llm_calls + " batched call from the facts in that row only (type, distance, evidence). It suggests a first question for the call; the score never uses it."
      : "LLM lines were not used in this run; every reason shown is the type rule.";
    Array.prototype.forEach.call(document.querySelectorAll("[data-s]"), function (e) { e.textContent = stats[e.dataset.s]; });
  }

  function init(d) {
    stats = d.stats; rows = d.rows;
    $("types").insertAdjacentHTML("beforeend", Object.keys(TYPES).map(function (k) {
      return "<label class='chk'><input type='checkbox' value='" + k + "' checked>" + esc(TYPES[k][0]) + "<span class='n'></span></label>";
    }).join(""));
    rules(); summary(); initMap(); recompute(); render();
    $("radius").addEventListener("input", function () { $("rv").textContent = radius(); recompute(); render(); });
    $("inonly").addEventListener("change", render);
    $("types").addEventListener("change", render);
    $("stats").addEventListener("change", render);
    $("more").addEventListener("click", function () { showAll = true; render(); });
    $("reset").addEventListener("click", function () { center = DOWNTOWN.slice(); $("cname").textContent = "El Paso downtown"; $("reset").hidden = true; recompute(); render(); });
    $("csv").addEventListener("click", exportCSV);
    Array.prototype.forEach.call(document.querySelectorAll("#list th[data-k] button"), function (b) {
      b.addEventListener("click", function () {
        var k = b.parentNode.dataset.k;
        if (sortK === k) sortDir = -sortDir; else { sortK = k; sortDir = (k === "score") ? -1 : 1; }
        render();
      });
    });
    $("list").tBodies[0].addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      var tr = e.target.closest("tr"); if (!tr) return;
      var m = markers[tr.dataset.id]; if (!m) return;
      map.setView(m.getLatLng(), Math.max(map.getZoom(), 14)); m.openPopup();
      $("map").scrollIntoView({ behavior: "smooth", block: "center" });
    });
    var file = $("file"), zone = $("zone");
    file.addEventListener("change", function () { var f = file.files[0]; if (f) f.text().then(function (t) { loadCustomers(t, f.name); }); });
    zone.addEventListener("dragover", function (e) { e.preventDefault(); zone.classList.add("over"); });
    zone.addEventListener("dragleave", function () { zone.classList.remove("over"); });
    zone.addEventListener("drop", function (e) { e.preventDefault(); zone.classList.remove("over"); var f = e.dataTransfer.files[0]; if (f) f.text().then(function (t) { loadCustomers(t, f.name); }); });
    $("sample").addEventListener("click", function () { fetch("sample-customers.csv").then(function (r) { return r.text(); }).then(function (t) { loadCustomers(t, "Sample list (3 businesses from this data)"); }); });
    $("clear").addEventListener("click", function () { cust = []; match(); file.value = ""; $("custmsg").textContent = ""; $("clear").hidden = true; render(); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    fetch("data.json").then(function (r) { return r.json(); }).then(init).catch(function () {
      $("status").insertAdjacentHTML("beforeend", " <b>The data file did not load; please reload.</b>");
    });
  });
})();
