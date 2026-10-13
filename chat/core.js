/* Shared chat core for Demo 1 ("Ask any website", /ask/) and Demo 2 (widget.js, /assistant/).
 *
 * Exports
 *   mount(root, opts)        Build the chat UI inside `root` (an element in the page, or inside a shadowRoot).
 *                            Returns {ask(text), pick(kbId), readUrl(url), destroy(), state}.
 *     opts.mode      "page" (full Demo 1: history rail, Chat/Extract/Data/Insights) | "widget" (chat only)
 *     opts.api       API base URL (default: API_BASE from config.js)
 *     opts.kb        kb_id to chat with (an example id such as "ex-shop", or one returned by readSite)
 *     opts.site      a site URL: read on first use when no `kb` is given (widget)
 *     opts.color     brand color (hex) -> --brand / --blue on the root (widget)
 *     opts.greeting  first line shown in widget mode
 *     opts.starters  array of starter questions (strings) for widget mode
 *     opts.onEvent   function(type, detail): "ready", "kb", "answer", "notice", "error", "server"
 *     opts.menuButton (page) an element outside root that opens the history drawer below 1024 px
 *   streamChat({api, kb_id, messages, session_id, signal, on:{meta,sources,notice,delta,followups,done,error}})
 *                            POST /api/chat and dispatch the SSE events in order. Resolves when the stream ends.
 *   readSite({api, url | files, signal, onStart, onProgress}) -> Promise<summary>
 *                            POST /api/kb?stream=1 (JSON url or multipart PDFs). Rejects with {code, message}.
 *   getExamples(api)         examples.json next to this file (static, instant), else GET /api/examples.
 *   checkHealth(api, ms)     GET /healthz with a timeout -> true/false.
 *   history                  localStorage chat store: list, get, put, remove, rename, toMarkdown, sessionId.
 *   makeHistory(key)         the same store under another localStorage key (the widget keeps one store per site).
 *     opts.historyKey (added for the widget) keep chats under this key and the source under key + "-src"
 *                     instead of the shared Demo 1 keys. mount() also returns open(chatId).
 *   renderAnswer(el, text, {sources, idx, streaming})  safe Markdown subset + citation pills, DOM only.
 *   tidyCites(text)          moves [n] pills after punctuation, no space before.
 *   icon(name, size)         inline SVG icon element.
 *
 * Rules: every query and listener hangs off `root` (document-level keys only in page mode); server text goes
 * into the DOM through textContent only; links are http(s) only with rel="noopener noreferrer".
 */
import { API_BASE } from "./config.js";

/* ------------------------------------------------------------------ small helpers */
const SVGNS = "http://www.w3.org/2000/svg";
const IC = {menu:'M4 6h16M4 12h16M4 18h16',x:'M6 6l12 12M18 6L6 18',panel:'M4 5h16v14H4zM9.5 5v14',plus:'M12 5v14M5 12h14',
search:'M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM20 20l-4-4',chat:'M5 5h14v10H10l-5 4z',table:'M4 5h16v14H4zM4 10h16M10 5v14',
db:'M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3zM5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3',
chart:'M5 20V11M11 20V5M17 20v-6M3 20h18',up:'M12 19V5M6 11l6-6 6 6',stop:'M7 7h10v10H7z',
globe:'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM3.5 12h17M12 3c2.4 2.5 3.5 5.5 3.5 9s-1.1 6.5-3.5 9c-2.4-2.5-3.5-5.5-3.5-9s1.1-6.5 3.5-9z',
upload:'M12 16V4M7 9l5-5 5 5M5 20h14',file:'M7 3h7l5 5v13H7zM14 3v5h5',copy:'M9 9h11v11H9zM5 15H4V4h11v1',refresh:'M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7',
tup:'M7 10v10H4V10zM7 10l4-7c1.5 0 2.5 1 2.2 2.6L12.8 9H19a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 20H7',
tdown:'M7 14V4H4v10zM7 14l4 7c1.5 0 2.5-1 2.2-2.6L12.8 15H19a2 2 0 0 0 2-2.3l-1.2-7A2 2 0 0 0 17.8 4H7',
download:'M12 4v12M7 11l5 5 5-5M5 20h14',more:'M5 12h.01M12 12h.01M19 12h.01',pencil:'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
trash:'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',ext:'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',check:'M5 12.5l4.5 4.5L19 7',
corner:'M6 5v7a4 4 0 0 0 4 4h9M15 12l4 4-4 4',lines:'M4 7h16M4 12h16M4 17h10',book:'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11',
info:'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 11v5M12 8h.01',clock:'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 7v5l3 2',
server:'M4 4h16v7H4zM4 13h16v7H4zM8 7.5h.01M8 16.5h.01',shield:'M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z',
lock:'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',alert:'M12 4l9 16H3zM12 10v4M12 17h.01',
star:'M12 4l2.4 5 5.6.6-4.2 3.8 1.2 5.6L12 16.2 7 19l1.2-5.6L4 9.6l5.6-.6z'};

export function icon(name, size = 18) {
  const s = document.createElementNS(SVGNS, "svg");
  const filled = name === "stop";
  s.setAttribute("width", size); s.setAttribute("height", size); s.setAttribute("viewBox", "0 0 24 24");
  s.setAttribute("fill", filled ? "currentColor" : "none"); s.setAttribute("stroke", filled ? "none" : "currentColor");
  s.setAttribute("stroke-width", name === "more" ? 3 : 1.8); s.setAttribute("stroke-linecap", "round");
  s.setAttribute("stroke-linejoin", "round"); s.setAttribute("aria-hidden", "true"); s.setAttribute("focusable", "false");
  const p = document.createElementNS(SVGNS, "path"); p.setAttribute("d", IC[name] || ""); s.appendChild(p);
  return s;
}

/** DOM builder: h("div", {class, text, dataset, ...attrs}, ...children). Strings become text nodes. */
function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  if (props) for (const k in props) {
    const v = props[k];
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "text") el.textContent = v;
    else if (k === "dataset") Object.assign(el.dataset, v);
    else if (k === "style") el.style.cssText = v;
    else if (k === "value") el.value = v;
    else el.setAttribute(k, v === true ? "" : v);
  }
  add(el, kids);
  return el;
}
function add(el, kids) {
  for (const c of kids) {
    if (c == null || c === false) continue;
    if (Array.isArray(c)) add(el, c);
    else el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}
const dot = () => h("span", {class: "dot", "aria-hidden": "true"});
const AR = /[\u0600-\u06FF]/;
const CAP_CODES = ["session_cap", "ip_cap", "global_budget"];
const HIRE = "https://www.upwork.com/freelancers/~01d6ae0f1a06a43ac0";
const PER_CHAT = 12;

export function safeHref(u) {
  try { const x = new URL(u); return x.protocol === "http:" || x.protocol === "https:" ? x.href : null; } catch (e) { return null; }
}
function hostOf(u) {
  let x; try { x = new URL(u).host.replace(/^www\./, ""); } catch (e) { x = String(u || ""); }
  try { return decodeURIComponent(x); } catch (e) { return x; } // show what the visitor typed, not %20
}
function pathOf(u) { try { const x = new URL(u); return x.pathname + x.search; } catch (e) { return String(u || ""); } }
function secs(ms) { return ms == null ? "" : (ms / 1000).toFixed(1) + " s"; }
function money(c) { if (!c) return "$0"; const s = c.toFixed(4); return s === "0.0000" ? "<$0.0001" : "$" + s; }
function trunc(s, n) { s = String(s || ""); return s.length > n ? s.slice(0, n - 1) + "…" : s; }
function slug(s) { return (String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "chat").slice(0, 40); }
function uid() { return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function ext(a) { a.target = "_blank"; a.rel = "noopener noreferrer"; return a; }
function link(url, kids, cls) {
  const href = safeHref(url);
  if (!href) return h("span", {class: cls}, kids);
  return ext(h("a", {class: cls, href}, kids));
}

/* ------------------------------------------------------------------ network */
async function* sseEvents(resp) {
  const reader = resp.body.getReader();
  const dec = new TextDecoder();
  let buf = "", cr = "";
  const parse = (raw) => {
    let event = "message", data = "";
    for (const line of raw.split("\n")) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      else if (line.startsWith("data:")) data += (data ? "\n" : "") + line.slice(5).replace(/^ /, "");
    }
    if (!data) return null;
    try { return {event, data: JSON.parse(data)}; } catch (e) { return null; }
  };
  for (;;) {
    const {value, done} = await reader.read();
    // CR LF / CR -> LF on the whole stream; a CR at the end of a chunk waits for the next chunk (it may be CR LF)
    let chunk = cr + (done ? dec.decode() : dec.decode(value, {stream: true}));
    cr = "";
    if (!done && chunk.endsWith("\r")) { cr = "\r"; chunk = chunk.slice(0, -1); }
    buf += chunk.replace(/\r\n?/g, "\n");
    let i;
    while ((i = buf.indexOf("\n\n")) >= 0) {
      const ev = parse(buf.slice(0, i)); buf = buf.slice(i + 2);
      if (ev) yield ev;
    }
    if (done) { // flush a last event that has no blank line after it
      const ev = buf.trim() ? parse(buf.replace(/\n+$/, "")) : null; buf = "";
      if (ev) yield ev;
      break;
    }
  }
}

async function jsonError(resp) {
  try { const j = await resp.json(); if (j && j.error) return j.error; } catch (e) { /* not json */ }
  return {code: resp.status === 429 ? "ip_cap" : "server_error", message: "The demo server answered with an error (" + resp.status + "). Please try again."};
}
const NET = {code: "network", message: "Could not reach the demo server. Check your connection and try again."};

export async function streamChat({api = API_BASE, kb_id, messages, session_id, signal, on = {}}) {
  let resp;
  try {
    resp = await fetch(api + "/api/chat", {method: "POST", signal, headers: {"Content-Type": "application/json", Accept: "text/event-stream"},
      body: JSON.stringify({kb_id, messages, session_id})});
  } catch (e) { if (e && e.name === "AbortError") throw e; on.error && on.error(NET); return; }
  if (!resp.ok || !(resp.headers.get("content-type") || "").includes("event-stream")) { on.error && on.error(await jsonError(resp)); return; }
  for await (const ev of sseEvents(resp)) { const f = on[ev.event]; if (f) f(ev.data); }
}

export async function readSite({api = API_BASE, url, files, signal, onStart, onProgress}) {
  let resp;
  const opts = {method: "POST", signal, headers: {Accept: "text/event-stream"}};
  if (files && files.length) {
    const fd = new FormData();
    for (const f of files) fd.append("files", f, f.name);
    opts.body = fd;
  } else {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify({url});
  }
  try { resp = await fetch(api + "/api/kb?stream=1", opts); } catch (e) { if (e && e.name === "AbortError") throw e; throw NET; }
  if (!resp.ok) throw await jsonError(resp);
  if (!(resp.headers.get("content-type") || "").includes("event-stream")) {
    const j = await resp.json(); if (j && j.error) throw j.error; return j;
  }
  for await (const ev of sseEvents(resp)) {
    if (ev.event === "start" && onStart) onStart(ev.data);
    else if (ev.event === "progress" && onProgress) onProgress(ev.data);
    else if (ev.event === "done") return ev.data;
    else if (ev.event === "error") throw ev.data;
  }
  throw {code: "server_error", message: "The reading stopped before the end. Please try again."};
}

export async function checkHealth(api = API_BASE, ms = 5000) {
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), ms);
  try { const r = await fetch(api + "/healthz", {signal: ctrl.signal, cache: "no-store"}); return r.ok; }
  catch (e) { return false; } finally { clearTimeout(t); }
}

export async function getExamples(api = API_BASE) {
  try {
    const r = await fetch(new URL("./examples.json", import.meta.url), {cache: "no-cache"});
    if (r.ok) { const j = await r.json(); if (j && Array.isArray(j.examples)) return j.examples; }
  } catch (e) { /* fall back to the API */ }
  try {
    const r = await fetch(api + "/api/examples");
    const j = await r.json();
    return (j.examples || []).map((ex) => ({...ex, starters: (ex.starters || []).map((s) => s.answer ? {
      q: s.q, meta: {lang: ex.lang, dir: ex.lang === "ar" ? "rtl" : "ltr", pages: ex.pages},
      sources: s.answer.sources || [], notice: null, text: s.answer.text, followups: s.answer.followups || [],
      done: {cached: true, cost: 0, status: "cached", cited: s.answer.cited || [], ttfw_ms: null}} : {q: s.q})}));
  } catch (e) { return []; }
}

/* ------------------------------------------------------------------ history (localStorage) */
const HKEY = "sc-chats-v2", HMAX = 30;
function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
function cleanChat(c) {
  return {id: c.id, kb_id: c.kb_id, source: c.source, title: c.title, updatedAt: c.updatedAt, capped: c.capped || null, example: c.example || null,
    messages: (c.messages || []).map((m) => {
      if (m.role === "user") return {role: "user", content: m.content};
      const st = ["search", "stream", "wake", "reread"].includes(m.status) ? "stopped" : m.status;
      return {role: "assistant", content: m.content || "", meta: m.meta || null, sources: m.sources || [], notice: m.notice || null,
        followups: m.followups || [], done: m.done || null, status: st, error: m.error || null, v: m.v || 0, local: !!m.local};
    })};
}
export const history = {
  list() {
    try { const v = JSON.parse(lsGet(HKEY) || "[]"); return Array.isArray(v) ? v.filter((c) => c && c.id && Array.isArray(c.messages)) : []; }
    catch (e) { return []; }
  },
  saveAll(chats) {
    const all = chats.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, HMAX).map(cleanChat);
    let ok = lsSet(HKEY, JSON.stringify(all));
    while (!ok && all.length > 1) { all.pop(); ok = lsSet(HKEY, JSON.stringify(all)); } // quota: drop the oldest
    return ok;
  },
  get(id) { return this.list().find((c) => c.id === id) || null; },
  put(chat) { const l = this.list().filter((c) => c.id !== chat.id); l.unshift(chat); return this.saveAll(l); },
  remove(id) { return this.saveAll(this.list().filter((c) => c.id !== id)); },
  rename(id, title) { const l = this.list(); const c = l.find((x) => x.id === id); if (c) c.title = title; return this.saveAll(l); },
  toMarkdown(c, onlyIdx) {
    let o = "# " + c.title + "\n\nSource: " + (c.source && (c.source.url || c.source.label) || "") + "\n\n";
    for (let i = 0; i < c.messages.length; i += 2) {
      if (onlyIdx != null && i + 1 !== onlyIdx) continue;
      const q = c.messages[i], a = c.messages[i + 1];
      o += "## " + q.content + "\n\n";
      if (!a) continue;
      if (a.done && a.done.status === "no_match") { o += "Not on this site: none of the pages answers this.\n\n"; continue; }
      o += (a.content || "").trim() + "\n\n";
      const cited = new Set((a.done && a.done.cited) || []);
      if (a.sources && a.sources.length) o += "Sources:\n" + a.sources.map((s) => s.n + ". " + s.title + " - " + s.url + (cited.size && !cited.has(s.n) ? " (found, not used)" : "")).join("\n") + "\n\n";
    }
    return o + "_Exported from the Ask any website demo (slimanechanchoul.com/ask/)._\n";
  },
};

/** A chat store like `history`, under its own localStorage key (Demo 2 widget: one store per site). */
export function makeHistory(key) {
  return {
    list() {
      try { const v = JSON.parse(lsGet(key) || "[]"); return Array.isArray(v) ? v.filter((c) => c && c.id && Array.isArray(c.messages)) : []; }
      catch (e) { return []; }
    },
    saveAll(chats) {
      const all = chats.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, HMAX).map(cleanChat);
      let ok = lsSet(key, JSON.stringify(all));
      while (!ok && all.length > 1) { all.pop(); ok = lsSet(key, JSON.stringify(all)); }
      return ok;
    },
    get(id) { return this.list().find((c) => c.id === id) || null; },
    put(chat) { const l = this.list().filter((c) => c.id !== chat.id); l.unshift(chat); return this.saveAll(l); },
    remove(id) { return this.saveAll(this.list().filter((c) => c.id !== id)); },
    rename(id, title) { const l = this.list(); const c = l.find((x) => x.id === id); if (c) c.title = title; return this.saveAll(l); },
    toMarkdown(c, onlyIdx) { return history.toMarkdown(c, onlyIdx); },
    sessionId() { return history.sessionId(); },
  };
}

/* ------------------------------------------------------------------ answer text -> DOM */
const G = "\\[\\d+(?:\\s*,\\s*\\d+)*\\](?:\\s*,?\\s*\\[\\d+(?:\\s*,\\s*\\d+)*\\])*";
const RE_BEFORE_PUNCT = new RegExp("[ \\t]*(" + G + ")[ \\t]*([.,;:!?\u061F\u060C])", "g");
const RE_SPACE = new RegExp("[ \\t]+(" + G + ")", "g");
const RE_TAIL = new RegExp("[ \\t]*(?:" + G + ")?[ \\t]*\\[[\\d,\\s]*$|[ \\t]*" + G + "[ \\t]*$");
export function tidyCites(t) { return t.replace(RE_BEFORE_PUNCT, "$2$1").replace(RE_SPACE, "$1"); }

/* Markdown backslash escapes (the passages-only fallback escapes the passage text so it shows literally):
   \x -> a private-use placeholder before parsing, back to "x" in text and to "\x" inside code. */
const ESC_RE = /\\([\\`*_{}\[\]<>#+\-!|.()])/g;
function protect(t) { return t.replace(ESC_RE, (m, c) => String.fromCharCode(0xE000 + c.charCodeAt(0))); }
function unprot(t, code) { return String(t).replace(/[\uE000-\uE07F]/g, (c) => (code ? "\\" : "") + String.fromCharCode(c.charCodeAt(0) - 0xE000)); }
function mdBlocks(text) {
  const lines = text.replace(/\r/g, "").split("\n"), out = [];
  const LI = /^\s*([-*\u2022]|\d+[.)])\s+/;
  let i = 0;
  while (i < lines.length) {
    const ln = lines[i];
    if (/^\s*```/.test(ln)) {
      const buf = []; i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) buf.push(lines[i++]);
      i++; out.push({t: "code", text: buf.join("\n")}); continue;
    }
    if (!ln.trim()) { i++; continue; }
    if (/^\s*#{1,6}\s/.test(ln)) { out.push({t: "h", text: ln.replace(/^\s*#+\s*/, "")}); i++; continue; }
    if (/^\s*>/.test(ln)) { // blockquote (the passages-only fallback quotes each passage)
      const buf = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, ""));
      out.push({t: "quote", text: buf.join("\n")}); continue;
    }
    if (/^\s*\|.*\|\s*$/.test(ln) && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
      const row = (s) => s.trim().replace(/^\||\|$/g, "").split("|").map((x) => x.trim());
      const head = row(ln); i += 2; const rows = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) rows.push(row(lines[i++]));
      out.push({t: "table", head, rows}); continue;
    }
    if (LI.test(ln)) {
      const ordered = /^\s*\d/.test(ln), items = [];
      while (i < lines.length && (LI.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        if (LI.test(lines[i])) items.push(lines[i].replace(LI, "")); else items[items.length - 1] += " " + lines[i].trim();
        i++;
      }
      out.push({t: ordered ? "ol" : "ul", items}); continue;
    }
    const buf = [ln]; i++;
    while (i < lines.length && lines[i].trim() && !/^\s*(```|#{1,6}\s|>)/.test(lines[i]) && !LI.test(lines[i])) buf.push(lines[i++]);
    out.push({t: "p", text: buf.join("\n")});
  }
  return out;
}

function pill(n, ctx) {
  const s = ctx.sources[n - 1];
  return h("bdi", null, h("button", {type: "button", class: "cite", dataset: {a: ctx.idx, c: n},
    "aria-label": "Source " + n + (s ? ": " + s.title : ""), "aria-expanded": "false"}, String(n)));
}
function inline(el, text, ctx) {
  const parts = text.split(/(`[^`\n]+`)/);
  for (const part of parts) {
    if (!part) continue;
    if (part.length > 2 && part[0] === "`" && part[part.length - 1] === "`") { el.appendChild(h("code", {text: unprot(part.slice(1, -1), true)})); continue; }
    const t = tidyCites(part);
    const re = new RegExp("(\\*\\*[^*\\n]+\\*\\*)|\\[([^\\]\\n]+)\\]\\((https?:\\/\\/[^\\s)]+)\\)|(" + G + ")|(\\n)", "g");
    let last = 0, m;
    while ((m = re.exec(t))) {
      if (m.index > last) el.appendChild(document.createTextNode(t.slice(last, m.index)));
      if (m[1]) inline(el.appendChild(h("strong")), m[1].slice(2, -2), ctx);
      else if (m[2]) el.appendChild(link(m[3], m[2])); // [text](http(s) url): safe link, text only
      else if (m[4]) {
        const nums = [...new Set((m[4].match(/\d+/g) || []).map(Number))].filter((n) => n >= 1 && n <= ctx.sources.length);
        nums.forEach((n) => el.appendChild(pill(n, ctx)));
      } else el.appendChild(h("br"));
      last = re.lastIndex;
    }
    if (last < t.length) el.appendChild(document.createTextNode(t.slice(last)));
  }
}
/** Render answer text (a safe Markdown subset) into `el` with citation pills. Never uses innerHTML. */
export function renderAnswer(el, text, {sources = [], idx = 0, streaming = false} = {}) {
  let t = protect(String(text || ""));
  if (streaming) t = t.replace(RE_TAIL, "");
  const ctx = {sources, idx};
  const frag = document.createDocumentFragment();
  for (const b of mdBlocks(t)) {
    if (b.t === "code") frag.appendChild(h("pre", {dir: "ltr"}, h("code", {text: unprot(b.text, true)})));
    else if (b.t === "h") { const x = h("h3"); inline(x, b.text, ctx); frag.appendChild(x); }
    else if (b.t === "ol" || b.t === "ul") { const l = h(b.t); b.items.forEach((it) => { const li = h("li"); inline(li, it, ctx); l.appendChild(li); }); frag.appendChild(l); }
    else if (b.t === "table") {
      const tb = h("tbody");
      b.rows.forEach((r) => { const tr = h("tr"); r.forEach((c) => { const td = h("td"); inline(td, c, ctx); tr.appendChild(td); }); tb.appendChild(tr); });
      frag.appendChild(h("div", {class: "tw"}, h("table", null, h("thead", null, h("tr", null, b.head.map((x) => h("th", {text: x})))), tb)));
    } else if (b.t === "quote") { const bq = h("blockquote", {class: "quote", dir: "auto"}); inline(bq, b.text, ctx); frag.appendChild(bq); }
    else { const p = h("p"); inline(p, b.text, ctx); frag.appendChild(p); }
  }
  { const tw = document.createTreeWalker(frag, NodeFilter.SHOW_TEXT); let n; while ((n = tw.nextNode())) if (/[\uE000-\uE07F]/.test(n.data)) n.data = unprot(n.data); }
  frag.querySelectorAll("th").forEach((th) => { th.textContent = unprot(th.textContent); });
  if (streaming) {
    const last = frag.lastChild && frag.lastChild.nodeName === "P" ? frag.lastChild : frag.appendChild(h("p"));
    last.appendChild(h("span", {class: "caret", "aria-hidden": "true"}));
  }
  el.replaceChildren(frag);
}
/** A passage with its best sentence in <mark>. */
function passageNode(s, onlyHl) {
  const p = String(s.passage || ""), hl = s.hl || "";
  let a = -1, b = -1;
  if (Array.isArray(s.hl_at) && p.slice(s.hl_at[0], s.hl_at[1]) === hl) { a = s.hl_at[0]; b = s.hl_at[1]; }
  else if (hl) { a = p.indexOf(hl); b = a < 0 ? -1 : a + hl.length; }
  const span = h("bdi", {lang: AR.test(p) ? "ar" : null});
  if (a < 0) { span.textContent = onlyHl ? trunc(p, 220) : p; return span; }
  if (onlyHl) { span.appendChild(h("mark", {text: hl})); return span; }
  add(span, [p.slice(0, a), h("mark", {text: p.slice(a, b)}), p.slice(b)]);
  return span;
}
function firstSentence(t) {
  const s = String(t || "").replace(/```[\s\S]*?```/g, "").replace(new RegExp(G, "g"), "").replace(/[*`#]/g, "").trim();
  return trunc(s.split(/(?<=[.!?\u061F])\s/)[0] || "", 160);
}

/* ------------------------------------------------------------------ mount */
let MOUNTS = 0;
const NOMATCH = {"ex-shop": "Do you have a loyalty program?", "ex-shop_ar": "من هو المدير العام؟", "ex-python_tutorial": "Who is the CEO?", "ex-fastapi_tutorial": "Do you offer paid support plans?"}; // checked: no passage matches, no AI call
const SHORT = {"ex-shop": "Shop help", "ex-shop_ar": "Arabic shop", "ex-python_tutorial": "Python docs", "ex-fastapi_tutorial": "FastAPI docs"};
const GENERIC = [
  {q: "What does this site offer?", k: "Answer with sources", ic: "book"},
  {q: "How can I contact you?", k: "Cites the exact page", ic: "info"},
  {q: "What are the prices?", k: "Says so when it is not there", ic: "info"},
  {q: "Summarize the main pages in 3 points", k: "Ask in Arabic or French too", ic: "globe"}];

export function mount(root, opts = {}) {
  const mode = opts.mode === "widget" ? "widget" : "page";
  const api = (opts.api || API_BASE).replace(/\/+$/, "");
  const P = "sc" + (++MOUNTS);
  const page = mode === "page";
  const emit = (type, detail) => { try { opts.onEvent && opts.onEvent(type, detail); } catch (e) { /* host bug */ } };
  const docRoot = root.getRootNode ? root.getRootNode() : document;
  const activeEl = () => (docRoot.activeElement || document.activeElement);
  const q = (s) => root.querySelector(s);
  const qa = (s) => Array.from(root.querySelectorAll(s));
  let REDUCE = false; try { REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { /* old browser */ }
  const narrow = () => innerWidth < 1024, phone = () => innerWidth <= 640;

  const STORE = opts.historyKey ? makeHistory(String(opts.historyKey)) : history;
  const SRC_KEY = opts.historyKey ? String(opts.historyKey) + "-src" : "sc-src";
  const S = {
    examples: [], src: null, chats: STORE.list(), active: null, view: "chat", rail: lsGet("sc-rail") === "1",
    crawl: null, err: null, server: "checking", streaming: null, queue: [], waitQ: [], rereading: false, capped: null, left: null,
    pend: null, renaming: null, ex: {kb: null, fields: ["topic", "price", "time limit"], state: "idle", res: null, error: null},
  };
  if (S.rail === false && lsGet("sc-rail") == null && S.chats.length >= 2) S.rail = true;

  root.classList.add("sc");
  if (page) root.classList.add("frame"); else root.classList.add("widget");
  if (opts.color && /^#[0-9a-f]{3,8}$/i.test(opts.color)) { root.style.setProperty("--brand", opts.color); root.style.setProperty("--blue", opts.color); }

  /* ---------- skeleton */
  const live = h("div", {class: "sr", role: "status", "aria-live": "polite"});
  const pop = h("div", {class: "pop", role: "tooltip", id: P + "-pop", hidden: true});
  const scrim = h("div", {class: "scrim", hidden: true});
  const railScrim = h("div", {class: "scrim", hidden: true});
  const drawer = h("aside", {class: "dr", role: "dialog", "aria-modal": "true", "aria-labelledby": P + "-drT", hidden: true});
  const menu = h("div", {class: "menu", role: "menu", "aria-label": "Chat actions", hidden: true});
  const toast = h("div", {class: "toast", hidden: true});
  const statusEl = h("span", {class: "st", "aria-hidden": "true"});
  const counter = h("span", {class: "ctr"});
  const msrc = h("span", {class: "msrc"});
  const hint = h("span", {class: "hint", text: "Enter to send, Shift+Enter for a new line"});
  const ask = h("textarea", {id: P + "-ask", rows: 1, dir: "auto", enterkeyhint: "send", placeholder: "Ask a follow-up...", "aria-label": "Ask a follow-up question"});
  const sendBtn = h("button", {class: "send", type: "submit", "aria-label": "Send question"}, icon("up"));
  const stopBtn = h("button", {class: "send stop", type: "button", "aria-label": "Stop generating", hidden: true, dataset: {act: "stop"}}, icon("stop"), "Stop");
  const composer = h("form", {class: "composer", autocomplete: "off"}, ask, sendBtn, stopBtn);
  const capSlot = h("div");
  const dock = h("div", {class: "dock"}, capSlot, composer,
    h("div", {class: "meta"}, msrc, page ? hint : null, statusEl, counter));
  const thread = h("div", {class: "thread", role: "log", "aria-live": "off", "aria-label": "Conversation"});
  const threadCol = h("div", {class: "col"}, thread);
  const hero = h("div");
  const chatScroll = h("div", {class: "scroll"}, hero, threadCol);
  const pChat = h("section", {class: "panel", role: page ? "tabpanel" : null, id: P + "-p-chat"}, chatScroll, dock);

  let rail, rows, rq, pEx, pData, pIns, exCol, dataCol, insCol, tabs = [];
  if (page) {
    rows = h("div");
    rq = h("input", {type: "search", placeholder: "Search chats", autocomplete: "off", "aria-label": "Search chats"});
    rail = h("nav", {class: "rail", "aria-label": "Chat history", id: P + "-rail"},
      h("div", {class: "rail-top"},
        h("div", {class: "rail-dh"}, h("b", {text: "Chats"}), h("button", {class: "ibtn rail-x", type: "button", "aria-label": "Close chat history", dataset: {act: "railclose"}}, icon("x"))),
        h("button", {class: "rbtn rtgl", type: "button", "aria-expanded": "false", "aria-label": "Show chat history", dataset: {act: "railtoggle"}, id: P + "-rt"}, icon("panel"), h("span", {class: "lbl", text: "Hide history"})),
        h("button", {class: "rbtn", type: "button", "aria-label": "New chat", dataset: {act: "newchat"}}, icon("plus"), h("span", {class: "lbl", text: "New chat"})),
        h("button", {class: "rbtn sbtn", type: "button", "aria-label": "Search chats (Ctrl+K)", dataset: {act: "search"}, id: P + "-sb"}, icon("search"), h("span", {class: "lbl", text: "Search chats"}), h("span", {class: "kbd", text: /Mac|iPhone|iPad/.test(navigator.platform || "") ? "⌘K" : "Ctrl K"}))),
      h("div", {class: "rail-body"}, h("div", {class: "rail-search"}, h("label", {class: "field"}, icon("search", 16), rq)), rows),
      h("div", {class: "rail-foot"}, h("span", {class: "lock", style: "margin-bottom:6px"}, icon("lock", 11), "Chats are saved only in this browser"), h("br"),
        "The server keeps a site's pages for 1 hour, then deletes them. Up to " + HMAX + " chats."));
    exCol = h("div", {class: "col"}); dataCol = h("div", {class: "col"}); insCol = h("div", {class: "col"});
    pEx = h("section", {class: "panel", role: "tabpanel", id: P + "-p-extract", hidden: true}, h("div", {class: "scroll"}, exCol));
    pData = h("section", {class: "panel", role: "tabpanel", id: P + "-p-data", hidden: true}, h("div", {class: "scroll"}, dataCol));
    pIns = h("section", {class: "panel", role: "tabpanel", id: P + "-p-insights", hidden: true}, h("div", {class: "scroll"}, insCol));
    const tabDef = [["chat", "chat", "Chat"], ["extract", "table", "Extract"], ["data", "db", "Data"], ["insights", "chart", "Insights"]];
    tabs = tabDef.map(([v, i, l]) => h("button", {role: "tab", type: "button", id: P + "-tab-" + v, "aria-controls": P + "-p-" + v, "aria-selected": String(v === "chat"), tabindex: v === "chat" ? null : "-1", dataset: {v}}, icon(i), l));
    [pChat, pEx, pData, pIns].forEach((p, k) => p.setAttribute("aria-labelledby", tabs[k].id));
    const main = h("main", {id: "main", tabindex: "-1"},
      h("div", {class: "subbar"},
        opts.menuButton ? null : h("button", {class: "ibtn hist-btn", type: "button", "aria-label": "Open chat history", dataset: {act: "railopen"}, style: "position:absolute;left:12px;top:10px"}, icon("menu")),
        h("div", {class: "seg", role: "tablist", "aria-label": "Demo views"}, tabs),
        h("span", {class: "mock"}, h("span", {class: "lock"}, icon("lock", 12), "Live demo: real AI answers, small daily limit"))),
      pChat, pEx, pData, pIns);
    root.replaceChildren(rail, main, railScrim, pop, scrim, drawer, menu, toast, live);
    if (opts.menuButton) {
      opts.menuButton.setAttribute("aria-controls", P + "-rail");
      opts.menuButton.addEventListener("click", openRailDrawer);
    }
  } else {
    root.replaceChildren(pChat, pop, scrim, drawer, toast, live);
  }

  /* ---------- status + live region */
  let stT = null;
  function status(t, keep, say) {
    statusEl.textContent = t || ""; clearTimeout(stT);
    if (!keep && t) stT = setTimeout(() => { if (statusEl.textContent === t) statusEl.textContent = ""; }, 4000);
    if (t || say) { live.textContent = ""; setTimeout(() => { live.textContent = say || t; }, 30); }
  }

  /* ---------- state helpers */
  const chat = () => S.chats.find((c) => c.id === S.active) || null;
  function save() { STORE.saveAll(S.chats); }
  function exampleOf(kb) { return S.examples.find((e) => e.kb_id === kb) || null; }
  function srcFromExample(e) { return {kb_id: e.kb_id, kind: "example", label: e.label, url: e.url, pages: e.pages, lang: e.lang, page_list: e.page_list || []}; }
  function srcLabel(s) { return s ? (s.kind === "site" ? hostOf(s.url) : s.label) : ""; }
  function usedIn(c) { return c.messages.filter((m) => m.role === "assistant" && m.done && !m.done.cached && !m.local && m.done.status !== "no_match" && m.done.cost > 0).length; }
  function cappedFor(c) { return !!(S.capped || (c && (c.capped || usedIn(c) >= PER_CHAT))); }
  function cachedAns(kind, kb, text) {
    if (kind !== "example") return null;
    const e = exampleOf(kb);
    const st = e && (e.starters || []).find((s) => s.q === text && s.text);
    return st || null;
  }
  function starterAnswer(c, text) { return c ? cachedAns(c.source.kind, c.kb_id, text) : null; }
  /** One question at a time: a stream, a question waiting for the server, or a re-read all count as busy. */
  function busy() { return !!(S.streaming || S.rereading || S.waitQ.length); }
  function saveSrc() { if (S.src) lsSet(SRC_KEY, JSON.stringify(S.src)); }

  /* ---------- server wake */
  const DOWN = {code: "server_down", message: "The demo server did not start. Please try again in a few minutes."};
  let wakeT = null, wakeStart = 0, readyWaiters = [];
  function setServer(v) {
    if (S.server === v) return;
    S.server = v; emit("server", v);
    if (v === "ready") {
      clearInterval(wakeT); wakeT = null;
      const w = readyWaiters; readyWaiters = []; w.forEach((f) => f.ok());
      pump();
    } else if (v === "down") {
      // nothing waits forever: reads/extracts get an error, waiting questions become "did not finish" with Try again
      const w = readyWaiters; readyWaiters = []; w.forEach((f) => f.no(DOWN));
      const qd = S.waitQ; S.waitQ = [];
      qd.forEach(({chatId, mi}) => {
        const c = S.chats.find((x) => x.id === chatId), a = c && c.messages[mi];
        if (a && a.status === "wake") { a.status = "error"; a.error = DOWN; if (c.id === S.active) renderTurn(mi); }
      });
      if (S.queue.length) { const first = S.queue[0]; S.queue = []; if (!ask.value.trim()) ask.value = first.text; }
      save(); status(DOWN.message, true);
    }
    if (!chat() && S.view === "chat") renderHero();
    renderDock();
  }
  function whenReady() { return S.server === "ready" ? Promise.resolve() : new Promise((ok, no) => { readyWaiters.push({ok, no}); ensureWake(); }); }
  function ensureWake() {
    if (wakeT || S.server === "ready") return;
    if (S.server === "down" || !wakeStart) wakeStart = Date.now(); // a new wake cycle starts its own 3-minute clock
    if (S.server !== "checking") setServer("waking");
    wakeT = setInterval(async () => {
      // tick the visible timers
      qa(".wake .tm, .crawlc .tm").forEach((t) => { t.textContent = clock(Date.now() - wakeStart); });
      if (wakeT && !ensureWake.busy) {
        ensureWake.busy = true;
        const ok = await checkHealth(api, 4000);
        ensureWake.busy = false;
        if (!wakeT) return;
        if (ok) { wakeStart = 0; setServer("ready"); }
        else if (Date.now() - wakeStart > 180000) { clearInterval(wakeT); wakeT = null; setServer("down"); }
      }
    }, 3000);
  }
  /** Start the next waiting question (server ready) or the next typed one, one at a time. */
  function pump() {
    if (S.streaming || S.rereading) return;
    if (S.server === "ready") {
      while (S.waitQ.length) {
        const w = S.waitQ.shift(), c = S.chats.find((x) => x.id === w.chatId);
        if (c && c.messages[w.mi] && c.messages[w.mi].status === "wake") { run(c, w.mi); return; }
      }
    }
    if (!S.waitQ.length && S.queue.length) { const nx = S.queue.shift(); setTimeout(() => askText(nx.text, nx.from), 250); }
  }
  function clock(ms) { const s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }

  /* ---------- hero (new chat screen) */
  function startersFor(src) {
    if (!src) return [];
    if (src.kind === "example") {
      // The 4 cards show what the demo does: sources, honesty (no AI call), Arabic, Extract (user-approved mockup a2)
      const e = exampleOf(src.kb_id);
      const ar = e && e.lang === "ar";
      const sts = (e && e.starters || []).filter((s) => s.text);
      const out = [];
      if (ar) {
        sts.slice(0, 2).forEach((s, i) => out.push({q: s.q, k: i ? "Right-to-left layout" : "Answers in Arabic", ic: "globe", kind: "cached"}));
      } else {
        if (sts[0]) out.push({q: sts[0].q, k: "Answer with sources", ic: "book", kind: "cached"});
      }
      if (NOMATCH[src.kb_id]) out.push({q: NOMATCH[src.kb_id], k: "Honest when it is not there", ic: "info", kind: "nomatch"});
      if (!ar) {
        const arEx = exampleOf("ex-shop_ar"), arQ = arEx && (arEx.starters || []).filter((s) => s.text)[1];
        if (arQ) out.push({q: arQ.q, k: "Ask in Arabic or French", ic: "globe", kind: "cached", kb: arEx.kb_id});
      }
      out.push({q: "Extract " + S.ex.fields.join(", "), k: src.kb_id === "ex-shop" || ar ? "Turn a shop into a table" : "Turn pages into a table", ic: "table", kind: "extract"});
      for (const s of sts) { if (out.length >= 4) break; if (!out.some((o) => o.q === s.q)) out.splice(out.length - 1, 0, {q: s.q, k: "Cites the exact passage", ic: "lines", kind: "cached"}); }
      return out.slice(0, 4);
    }
    return GENERIC.map((g) => ({...g, kind: "live"}));
  }
  function costTag(st) {
    if (st.kind === "cached") return h("span", {class: "tag cache"}, "Cached", dot(), "$0");
    if (st.kind === "nomatch") return h("span", {class: "tag cache"}, "No AI call", dot(), "$0");
    if (st.kind === "extract") return h("span", {class: "tag plain"}, icon("table", 13), "Opens Extract");
    return h("span", {class: "tag plain", text: "Uses 1 question"});
  }
  function renderHero() {
    if (chat() || S.view !== "chat") { hero.replaceChildren(); return; }
    if (!page) { renderWidgetIntro(); return; }
    const keepQ = q("." + P + "-hq"), keepU = q("." + P + "-hu");
    const vq = keepQ ? keepQ.value : "", vu = keepU ? keepU.value : "";
    const fid = activeEl() && activeEl().dataset ? activeEl().dataset.fid : null;
    const s = S.src, busy = !!(S.crawl || S.err);
    const sec = h("section", {class: "hero" + (busy ? " compact" : ""), "aria-labelledby": P + "-heroT"});
    sec.appendChild(h("h1", {id: P + "-heroT"}, "Ask any website or PDF.", h("br"), "Get answers with sources."));
    if (!busy) sec.appendChild(h("p", {class: "lead", text: "Paste a link or upload PDFs, then ask. Each answer shows the passages it used, and says so when the answer is not there."}));
    if (s && !busy) {
      const capped = !!S.capped;
      const grid = h("div", {class: "grid4"});
      startersFor(s).forEach((st) => {
        const off = capped && (st.kind === "live" || st.kind === "nomatch");
        const ds = st.kind === "extract" ? {xt: "1", fid: "st-xt"} : {ask: st.q, kb: st.kb || null, fid: "st-" + st.q};
        if (!ds.kb) delete ds.kb;
        const b = h("button", {type: "button", class: "starter s4", dataset: ds, disabled: off},
          h("span", {class: "shd"}, h("span", {class: "sk"}, icon(st.ic, 15), st.k),
            h("span", {class: "sf"}, off ? h("span", {class: "tag plain", text: "Paused today"}) : costTag(st))),
          h("span", {class: "sq", dir: "auto", lang: AR.test(st.q) ? "ar" : null, text: st.q}));
        grid.appendChild(b);
      });
      sec.appendChild(h("div", {class: "starters"}, h("h2", {class: "lab"}, icon("star", 15), "Start here ", h("span", {class: "n", text: "4 questions that show what it does"})), grid));
    }
    const pillEl = S.crawl
      ? h("span", {class: "srcpill"}, h("span", {class: "ok"}, icon("clock", 14)), h("span", {class: "sl", dir: "auto", text: S.crawl.label}), h("span", {class: "pc", text: "reading"}))
      : s && !S.err
      ? h("span", {class: "srcpill", title: srcLabel(s)}, h("span", {class: "ok"}, icon(S.crawl ? "clock" : "check", 14)), h("span", {class: "sl", dir: "auto", text: s.kind === "example" && SHORT[s.kb_id] ? SHORT[s.kb_id] : srcLabel(s)}),
        s.kind === "example" ? h("span", {class: "lock sm"}, icon("lock", 11), "Example") : null,
        h("span", {class: "pc", text: S.crawl ? "reading" : (s.pages + (s.kind === "pdf" ? " pages of PDF" : " pages"))}))
      : h("span", {class: "srcpill none"}, icon("globe", 14), S.examples.length ? "No source yet" : "Loading examples...");
    const exs = h("span", {class: "exs", role: "group", "aria-label": "Examples"}, h("span", {class: "exl", text: "Examples:"}),
      S.examples.map((e) => h("button", {type: "button", class: "exb", dataset: {ex: e.kb_id, fid: "ex-" + e.kb_id}, "aria-pressed": String(!!(s && s.kb_id === e.kb_id && !S.err && !S.crawl)),
        lang: AR.test(SHORT[e.kb_id] || e.label) ? "ar" : null, text: SHORT[e.kb_id] || trunc(e.label, 18), title: e.label})));
    const hq = h("textarea", {class: P + "-hq", rows: 2, dir: "auto", enterkeyhint: "send", "aria-label": "Your question", dataset: {fid: "hq", enter: "hero"}, disabled: !!S.capped,
      placeholder: S.capped ? "AI answers are paused until 00:00 GMT. The cached example questions above still work."
        : s && !S.err ? "Ask anything about " + (s.kind === "pdf" ? "your PDFs" : s.kind === "example" && SHORT[s.kb_id] ? (s.label || "").replace(/\s*\(.*\)$/, "") : srcLabel(s)) + "..." : "Ask a question..."});
    const hu = h("input", {class: P + "-hu", type: "text", inputmode: "url", autocapitalize: "off", spellcheck: "false", "aria-label": "Your website link", dataset: {fid: "hu"},
      placeholder: "Or paste your site: your-site.com/help"});
    const file = h("input", {type: "file", accept: "application/pdf", multiple: true, hidden: true, class: P + "-pdf"});
    const form = h("form", {class: "big", dataset: {form: "hero"}},
      h("div", {class: "boxhd"}, pillEl, exs), hq,
      h("div", {class: "bar"}, h("label", {class: "field"}, icon("globe", 16), hu),
        h("button", {type: "button", class: "ghost", dataset: {act: "pdf", fid: "pdf"}}, icon("upload", 16), "Upload PDFs"), file,
        h("button", {class: "send", type: "submit", "aria-label": S.capped ? "Ask (paused until 00:00 GMT)" : "Ask", dataset: {fid: "send"}, disabled: !!S.capped}, icon("up"))));
    sec.appendChild(form);
    sec.appendChild(h("p", {class: "err " + P + "-herr", role: "alert"}));
    if (S.crawl) sec.appendChild(crawlCard());
    if (S.err) sec.appendChild(errCard());
    if (!S.crawl) {
      const w = S.server === "ready";
      sec.appendChild(h("p", {class: "srv"}, h("span", {class: "sdot" + (w ? "" : " warn"), "aria-hidden": "true"}),
        S.server === "down" ? "The demo server did not start. Example answers still work; please try again in a few minutes."
          : w ? "Example answers are cached: instant and $0. Your own site uses the demo server, which starts on demand (about 1 min)."
            : "The demo server starts on demand (about 1 min). Example answers work now."));
      sec.appendChild(h("p", {class: "quiet"}, h("a", {href: "/assistant/"}, "Want this on your website? See the widget demo ", icon("ext", 13))));
    }
    hero.replaceChildren(sec);
    hq.value = vq; hu.value = vu;
    if (fid) { const f = hero.querySelector('[data-fid="' + CSS.escape(fid) + '"]'); if (f) f.focus(); }
  }
  function renderWidgetIntro() {
    const ex = S.src && S.src.kind === "example" ? exampleOf(S.src.kb_id) : null;
    const list = Array.isArray(opts.starters) && opts.starters.length ? opts.starters.map((x) => ({q: String(x), cached: false}))
      : ex ? (ex.starters || []).map((x) => ({q: x.q, cached: !!x.text})) : GENERIC.map((g) => ({q: g.q, cached: false}));
    hero.replaceChildren(h("div", {class: "col"},
      h("p", {class: "greet", dir: "auto", text: opts.greeting || "Hi! Ask me anything about this site. I answer from its pages, with sources."}),
      S.crawl ? h("p", {class: "note"}, h("span", {class: "spin", "aria-hidden": "true"}), " Reading " + S.crawl.label + (S.crawl.n ? " (" + S.crawl.n + " pages)" : "") + "...") : null,
      S.err ? h("p", {class: "errline", role: "alert", text: S.err.message}) : null,
      S.src && !S.crawl ? h("div", {class: "chips"}, list.slice(0, 4).map((st) => {
        const cached = st.cached || !!(ex && (ex.starters || []).some((x) => x.q === st.q && x.text));
        return h("button", {type: "button", class: "chip", dataset: {ask: st.q}, dir: "auto", lang: AR.test(st.q) ? "ar" : null, disabled: !!S.capped && !cached}, icon("plus", 14), st.q);
      })) : null));
  }
  function heroErr(t) { const e = q("." + P + "-herr"); if (e) e.textContent = t; }

  function crawlCard() {
    const c = S.crawl, pdf = c.kind === "pdf";
    const ok = () => h("span", {class: "d"}, icon("check", 12));
    const now = () => h("span", {class: "d"});
    const pct = c.max ? Math.min(100, Math.round(c.n / c.max * 100)) : 0;
    const lis = [];
    if (c.waiting) lis.push(h("li", {class: "now"}, now(), h("div", null, "Waiting for the demo server", h("small", null, "It starts on demand (about 1 min). Reading begins by itself. ", h("span", {class: "tm", text: clock(Date.now() - (wakeStart || Date.now()))})))));
    else lis.push(h("li", {class: "done"}, ok(), h("div", null, pdf ? "Sent the files" : "Checked robots.txt", h("small", {text: pdf ? "Text PDFs only, up to 20 MB" : "Pages it asks crawlers to skip are skipped"}))));
    const track = h("div", {class: "track" + (pdf || !c.n ? " indet" : ""), role: "progressbar", "aria-label": "Pages read", "aria-valuemin": "0", "aria-valuemax": String(c.max || 0), "aria-valuenow": String(c.n || 0)}, h("i", {style: pdf || !c.n ? "" : "width:" + pct + "%"}));
    lis.push(h("li", {class: c.waiting ? "" : "now"}, c.waiting ? now() : now(), h("div", null,
      pdf ? "Reading " + c.label : "Reading pages " + c.n + (c.max ? " (up to " + c.max + ")" : ""), c.waiting ? null : track,
      pdf ? null : h("ul", {class: "feed", "aria-hidden": "true"}, c.feed.slice(-3).reverse().map((u) => h("li", {text: u})))), h("span", {class: "r", text: pdf || !c.max ? "" : pct + "%"})));
    lis.push(h("li", null, now(), h("div", null, "Splitting into passages", h("small", {text: "Short passages make exact citations possible"}))));
    lis.push(h("li", null, now(), h("div", null, "Suggested questions", h("small", {text: "Appear when reading is done. A question you type now runs then."}))));
    return h("div", {class: "card crawlc", style: "margin-top:22px"},
      h("div", {style: "display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:6px"},
        h("b", {style: "color:var(--ink)", dir: "auto", text: "Reading " + c.label}),
        h("span", {class: "tag ok"}, icon("shield", 14), pdf ? "Text PDFs only" : "Same site, follows robots.txt")),
      h("ol", {class: "tl", "aria-label": "Reading progress"}, lis),
      h("div", {class: "row3", style: "margin-top:8px"}, h("button", {type: "button", class: "ghost", dataset: {act: "cancelread"}, text: "Cancel"})));
  }
  function errCard() {
    const e = S.err;
    const scanned = e.kind === "pdf";
    return h("div", {class: "card errc", role: "alert"},
      h("p", {class: "cap-h"}, icon(scanned ? "file" : "alert", 18), scanned ? "Could not read these PDFs" : "Could not read " + e.label),
      h("p", {text: e.message || "Something went wrong."}),
      h("div", {class: "row3"},
        S.examples[0] ? h("button", {type: "button", class: "btn", dataset: {ex: S.examples[0].kb_id}}, icon("globe", 16), "Use an example site") : null,
        h("button", {type: "button", class: "ghost", dataset: {act: "pdf"}}, icon("upload", 16), scanned ? "Upload another PDF" : "Upload pages as PDFs"),
        h("span", {class: "note", text: scanned ? "This demo reads PDFs that contain text. A scanned page is a picture; save it again with text (OCR)." : "Tip: a help center or docs link (often /help or /docs) works best."})));
  }

  /* ---------- thread */
  function stepsEl(c, a) {
    const ok = () => h("span", {class: "ok"}, icon("check", 14));
    const sp = () => h("span", {class: "spin", "aria-hidden": "true"});
    const pages = (a.meta && a.meta.pages) || c.source.pages || 0;
    const what = c.source.kind === "pdf" ? pages + " PDF pages" : pages + " pages";
    const ul = h("ul", {class: "steps", "aria-label": "Progress"});
    if (a.status === "wake") { add(ul, [h("li", {class: "now"}, sp(), "Server starting (about 1 min)"), h("li", {text: "Search " + what}), h("li", {text: "Write"})]); return ul; }
    if (a.status === "reread") { add(ul, [h("li", {class: "now"}, sp(), "Reading the site again (about 20 s)"), h("li", {text: "Search"}), h("li", {text: "Write"})]); return ul; }
    if (a.status === "search" && !a.sources.length) { add(ul, [h("li", {class: "now"}, sp(), "Searching " + what), h("li", {text: "Passages"}), h("li", {text: "Writing"})]); return ul; }
    const d = a.done;
    if (!page && d && a.status === "done" && d.status !== "no_match") { // widget (mockup c2): one stats line
      const n = a.sources.length, t = d.cached || a.local ? "cached" : a.notice ? "no AI call" : d.ttfw_ms != null ? secs(d.ttfw_ms) : "";
      ul.classList.add("one");
      ul.appendChild(h("li", null, ok(), h("bdi", null, "Searched " + what, dot(), n + " passage" + (n === 1 ? "" : "s"), t ? [dot(), t] : null)));
      return ul;
    }
    ul.appendChild(h("li", null, ok(), h("bdi", {text: "Searched " + what})));
    if (a.status === "stopped" && !a.sources.length) { ul.appendChild(h("li", {text: "Stopped"})); return ul; }
    if (d && d.status === "no_match") { add(ul, [h("li", null, ok(), "No passage matched well enough"), h("li", null, ok(), "No AI call")]); return ul; }
    ul.appendChild(h("li", null, ok(), h("bdi", {text: a.sources.length + " passage" + (a.sources.length === 1 ? "" : "s") + " found"})));
    if (a.notice) ul.appendChild(h("li", {class: "warn"}, icon("info", 14), "Passages only, no AI call"));
    else if (a.status === "search" || a.status === "stream") ul.appendChild(h("li", {class: "now"}, sp(), "Writing"));
    else if (a.status === "stopped") ul.appendChild(h("li", {text: "Stopped"}));
    else if (a.status === "error") ul.appendChild(h("li", {class: "warn"}, icon("info", 14), "Not finished"));
    else if (d && (d.cached || a.local)) ul.appendChild(h("li", null, ok(), h("bdi", {text: a.local ? "Cached answer" : "Cached answer, " + secs(d.ttfw_ms)})));
    else if (d) ul.appendChild(h("li", null, ok(), h("bdi", {text: "First words in " + secs(d.ttfw_ms)})));
    return ul;
  }
  function srcCard(a, idx, s, done, cited) {
    const un = done && cited.size > 0 && !cited.has(s.n);
    return h("li", null, h("button", {type: "button", class: "src" + (un ? " unused" : ""), dataset: {a: idx, c: s.n},
      "aria-label": "Source " + s.n + ": " + s.title + ", " + hostOf(s.url) + (un ? ", found but not used" : "") + ". Open details"},
      h("span", {class: "badge", "aria-hidden": "true", text: String(s.n)}),
      h("span", {class: "tx"}, h("b", null, h("bdi", {text: s.title || pathOf(s.url)})),
        h("small", null, h("bdi", {text: hostOf(s.url)}), un && page ? [dot(), "not used"] : null),
        h("span", {class: "snip"}, passageNode(s, true)))));
  }
  function nfCard(c, a) {
    const close = (a.sources || []).slice(0, 2);
    return h("div", {class: "card nf"},
      h("span", {class: "tag warn"}, icon("info", 14), "Not on this site"),
      h("p", {text: "I searched " + ((a.meta && a.meta.pages) || c.source.pages || 0) + " pages on " + srcLabel(c.source) + " and no passage answers this. I would rather tell you than guess."}),
      close.length ? [h("h3", {class: "lab", text: "Closest pages"}), h("ul", {class: "close2"}, close.map((s) => h("li", null,
        link(s.url, h("span", {class: "tx"}, h("b", {dir: "auto", text: s.title}), h("small", {text: "Closest sentence:"}), h("span", {class: "snip", dir: "auto", text: "“" + trunc(s.hl || s.passage, 200) + "”"}))))))] : null,
      h("p", {class: "note"}, icon("chart", 14), page ? "Added to Insights as a gap to cover. No question used." : "No question used."));
  }
  function acts(c, a, idx) {
    const off = cappedFor(c) || busy();
    const d = a.done || {};
    return h("div", {class: "acts", role: "group", "aria-label": "Answer actions"},
      h("button", {type: "button", class: "act", dataset: {act: "copy", a: idx, tip: "Copy"}, "aria-label": "Copy answer"}, icon("copy", 17)),
      h("button", {type: "button", class: "act", dataset: {act: "regen", a: idx}, disabled: off, "aria-label": "Regenerate answer, uses 1 of your " + PER_CHAT + " questions"}, icon("refresh", 17), h("span", {class: "txt"}, "Regenerate ", h("span", {class: "cost", text: "(1 question)"}))),
      h("button", {type: "button", class: "act", dataset: {act: "up", a: idx, tip: "Helpful"}, "aria-pressed": String(a.v === 1), "aria-label": "Helpful"}, icon("tup", 17)),
      h("button", {type: "button", class: "act", dataset: {act: "down", a: idx, tip: "Not helpful"}, "aria-pressed": String(a.v === -1), "aria-label": "Not helpful"}, icon("tdown", 17)),
      page ? [h("span", {class: "sep", "aria-hidden": "true"}), h("button", {type: "button", class: "act", dataset: {act: "export", a: idx, tip: "Export Markdown"}, "aria-label": "Export this answer as Markdown"}, icon("download", 17))] : null,
      !a.done ? null : h("span", {class: "meta2"}, d.cached || a.local ? h("span", {class: "tag cache"}, h("bdi", null, "Cached", dot(), "$0"))
        : a.notice || d.status === "extractive" || d.status === "no_match" ? h("span", {class: "tag cache"}, h("bdi", null, "No AI call", dot(), "$0"))
        : h("bdi", null, d.ttfw_ms != null ? "First words " + secs(d.ttfw_ms) : "", d.ttfw_ms != null ? dot() : null, money(d.cost || 0))));
  }
  function turnEl(c, i) {
    const qm = c.messages[i], a = c.messages[i + 1], idx = i + 1;
    const ar = (a && a.meta && a.meta.dir === "rtl") || AR.test(qm.content);
    const art = h("article", {class: "turn", dataset: {i: idx}, "aria-labelledby": P + "-q" + i, dir: ar ? "rtl" : null, lang: ar ? "ar" : null});
    art.appendChild(h("h2", {class: "q", id: P + "-q" + i, tabindex: "-1", dir: "auto", text: qm.content}));
    if (!a) return art;
    art.appendChild(stepsEl(c, a));
    if (a.status === "wake") {
      art.appendChild(h("div", {class: "card wake"},
        h("p", {class: "cap-h"}, icon("server", 18), "The demo server is starting"),
        h("p", null, "It starts on demand and takes ", h("strong", {text: "about 1 minute"}), ". Your question is saved and sends by itself; after that, answers start in 1 to 3 seconds."),
        h("div", {class: "row3"}, h("button", {type: "button", class: "ghost", dataset: {act: "cancelq", a: idx}, text: "Cancel question"}),
          h("span", {class: "note"}, icon("clock", 14), "Waiting ", h("span", {class: "tm", text: clock(Date.now() - (wakeStart || Date.now()))})))));
      return art;
    }
    if (a.status === "reread") return art;
    if (a.error && a.error.code === "kb_gone_pdf") {
      art.appendChild(h("div", {class: "card reread", role: "status"},
        h("p", {class: "cap-h"}, icon("refresh", 18), "Attach the PDFs again to keep asking"),
        h("p", {text: "The server keeps uploaded files for 1 hour, then deletes them. Attach " + (c.source.label || "the PDFs") + " again; your old answers stay here."}),
        h("div", {class: "row3"}, h("button", {type: "button", class: "btn", dataset: {act: "repdf", a: idx}}, icon("upload", 16), "Attach PDFs"))));
      return art;
    }
    if (a.done && a.done.status === "no_match") { art.appendChild(nfCard(c, a)); return art; }
    if (a.notice) {
      const capN = CAP_CODES.includes(a.notice.code);
      art.appendChild(h("div", {class: "card ntc", role: "note"}, h("span", {class: "tag warn"}, icon("info", 14), capN ? "AI answers paused" : "The AI is busy"), h("p", {text: a.notice.message})));
    }
    const done = !["search", "stream"].includes(a.status);
    const cited = new Set((a.done && a.done.cited) || []);
    if (a.sources.length) {
      art.appendChild(page ? h("h3", {class: "lab"}, icon("book", 15), "Sources ", h("span", {class: "n"}, h("bdi", null, a.sources.length + " passage" + (a.sources.length === 1 ? "" : "s") + " found", done && a.done ? [dot(), cited.size + " used"] : null)))
        : h("h3", {class: "lab", text: "Sources"}));
      art.appendChild(h("ol", {class: "srcs", "aria-label": "Sources"}, a.sources.map((s) => srcCard(a, idx, s, done && !!a.done, cited))));
    }
    const ans = h("div", {class: "ans", dataset: {ans: idx}, lang: ar ? "ar" : "en", dir: a.meta && a.meta.dir ? a.meta.dir : "auto"});
    renderAnswer(ans, a.content, {sources: a.sources, idx, streaming: a.status === "stream" || a.status === "search"});
    art.appendChild(ans);
    if (a.status === "search" || a.status === "stream") return art;
    if (a.status === "stopped") art.appendChild(h("p", {class: "stopped", text: "Stopped. Regenerate to get the full answer."}));
    if (a.status === "error" && a.error) {
      art.appendChild(h("div", {class: "card errc", role: "alert"}, h("p", {class: "cap-h"}, icon("alert", 18), "This answer did not finish"),
        h("p", {text: a.error.message || "Something went wrong."}),
        h("div", {class: "row3"}, h("button", {type: "button", class: "btn", dataset: {act: "regen", a: idx}, disabled: cappedFor(c)}, icon("refresh", 16), "Try again"))));
    }
    const off = cappedFor(c);
    if (a.followups && a.followups.length && a.status === "done") {
      art.appendChild(h("div", {class: "fu"}, h("h3", {class: "lab"}, icon("corner", 15), "Follow-ups"),
        h("div", {class: "chips"}, a.followups.map((f) => h("button", {type: "button", class: "chip", dataset: {ask: f}, dir: "auto", lang: AR.test(f) ? "ar" : "en", disabled: off}, icon("plus", 14), f))),
        off ? h("p", {class: "note"}, icon("info", 14), S.capped ? "No AI answers left today." : "No questions left in this chat.") : null));
    }
    if (a.status !== "error") art.appendChild(acts(c, a, idx));
    if (idx === 3 && page) art.appendChild(h("p", {class: "quiet"}, h("a", {href: "/assistant/"}, "Want this on your website? See the widget demo ", icon("ext", 13))));
    return art;
  }
  function renderThread() {
    const c = chat();
    threadCol.hidden = !c;
    if (!c) { thread.replaceChildren(); return; }
    const kids = [];
    if (c.example) kids.push(h("p", {class: "exhd"}, h("span", {class: "lock"}, icon("lock", 12), "Example"), "A cached example answer. Ask a follow-up to try it live."));
    if (!page && opts.greeting) kids.push(h("p", {class: "greet", dir: "auto", text: opts.greeting}));
    for (let i = 0; i < c.messages.length; i += 2) kids.push(turnEl(c, i));
    thread.replaceChildren(...kids);
    if (thread.dataset.chat !== c.id) { thread.classList.remove("fill"); following = false; thread.dataset.chat = c.id; }
  }
  function renderTurn(idx) {
    const c = chat(); if (!c) return;
    const old = thread.querySelector('article[data-i="' + idx + '"]');
    if (!old) { renderThread(); return; }
    const ae = activeEl(); let keep = null;
    if (ae && old.contains(ae)) keep = ae.dataset && ae.dataset.act ? '[data-act="' + ae.dataset.act + '"]' : ".q";
    const nu = turnEl(c, idx - 1); old.replaceWith(nu);
    if (keep) { const f = nu.querySelector(keep + ":not([disabled])") || nu.querySelector(".q"); if (f) f.focus({preventScroll: true}); }
  }
  let rafAns = 0;
  function paintAnswer(idx) {
    if (rafAns) return;
    rafAns = requestAnimationFrame(() => {
      rafAns = 0;
      const c = chat(); if (!c) return;
      const a = c.messages[idx], el = thread.querySelector('[data-ans="' + idx + '"]');
      if (!a || !el) return;
      renderAnswer(el, a.content, {sources: a.sources, idx, streaming: true});
      follow(idx);
    });
  }
  /** While an answer streams, keep its newest line above the composer (unless the visitor scrolled away). */
  let following = false;
  function follow(idx) {
    if (!following) return;
    const el = thread.querySelector('[data-ans="' + idx + '"]'); if (!el) return;
    const over = el.getBoundingClientRect().bottom - (chatScroll.getBoundingClientRect().bottom - 16);
    if (over > 0) { chatScroll.style.scrollBehavior = "auto"; chatScroll.scrollTop += over; chatScroll.style.scrollBehavior = ""; }
  }
  /** Put a new turn at the top of the thread: the last turn gets the scroll height (`fill`) so it can reach the top. */
  function scrollTurn(idx) {
    const el = thread.querySelector('article[data-i="' + idx + '"]'); if (!el) return;
    thread.style.setProperty("--fill", Math.max(0, chatScroll.clientHeight - 24) + "px");
    thread.classList.add("fill"); following = true;
    chatScroll.style.scrollBehavior = "auto";
    const first = el === thread.querySelector("article.turn"); // the first turn shows the lines above it too (example note, greeting)
    chatScroll.scrollTop = first ? 0 : Math.max(0, el.getBoundingClientRect().top - chatScroll.getBoundingClientRect().top + chatScroll.scrollTop - 12);
    chatScroll.style.scrollBehavior = "";
  }
  const stopFollow = () => { following = false; };
  chatScroll.addEventListener("wheel", stopFollow, {passive: true});
  chatScroll.addEventListener("touchmove", stopFollow, {passive: true});

  /* ---------- dock */
  function capCard(t, p, btn) {
    return h("div", {class: "card capcard", role: "status"}, h("span", {class: "badge warnb", "aria-hidden": "true"}, icon("info", 16)),
      h("div", null, h("p", {class: "cap-h", text: t}), h("p", {text: p}), h("div", {class: "row3"}, btn,
        page ? ext(h("a", {class: "ghost", href: HIRE}, "Hire me on Upwork ", icon("ext", 14))) : null)));
  }
  function renderDock() {
    const c = chat();
    const show = S.view === "chat" && (!!c || !page);
    dock.hidden = !show; if (!show) return;
    if (!c) {
      capSlot.replaceChildren(); composer.hidden = !!S.capped; stopBtn.hidden = true; sendBtn.hidden = false;
      ask.placeholder = S.crawl ? "Reading the site... your question runs when it is ready." : !page && opts.placeholder ? String(opts.placeholder) : "Ask a question...";
      msrc.replaceChildren(...(S.src ? [icon("globe", 14), h("bdi", {text: srcLabel(S.src)})] : []));
      counter.replaceChildren();
      return;
    }
    const capChat = !S.capped && (c.capped || usedIn(c) >= PER_CHAT);
    capSlot.replaceChildren(S.capped ? capCard("Today's AI answers are used up", (S.capped === "ip_cap" ? "Your network has used today's demo AI answers." : "The demo has used today's small AI budget.") + " Cached example answers still work. AI answers come back at 00:00 GMT.",
      h("button", {type: "button", class: "btn", dataset: {act: "newchat"}}, icon("star", 16), "Open the examples"))
      : capChat ? capCard("You have used the AI answers in this chat", "Each chat allows " + PER_CHAT + " AI answers. Cached answers and “not on this site” replies do not count." + (S.left != null ? " You have " + S.left + " left today." : ""),
        h("button", {type: "button", class: "btn", dataset: {act: "newchat"}}, icon("plus", 16), "New chat")) : "");
    const off = S.capped || capChat;
    composer.hidden = off; hint.hidden = off;
    const str = !!S.streaming; stopBtn.hidden = !str; sendBtn.hidden = str;
    const waking = c.messages.some((m) => m.status === "wake");
    ask.placeholder = waking ? "Your question waits for the server..." : str ? "Type your next question. It sends when this answer ends." : !page && opts.placeholder ? String(opts.placeholder) : "Ask a follow-up...";
    msrc.replaceChildren(icon(c.source.kind === "pdf" ? "file" : "globe", 14), h("bdi", {text: srcLabel(c.source)}));
    if (S.queue.length) counter.replaceChildren(h("span", {class: "tag plain", text: S.queue.length + (S.queue.length === 1 ? " question waiting" : " questions waiting")}));
    else counter.replaceChildren(h("b", {text: String(usedIn(c))}), " of " + PER_CHAT + " questions", ...(S.left != null ? [dot(), S.left + " left today"] : []));
  }

  /* ---------- rail */
  function renderRail() {
    if (!page) return;
    rail.classList.toggle("open", S.rail);
    const tg = q("#" + P + "-rt"); tg.setAttribute("aria-expanded", String(S.rail)); tg.setAttribute("aria-label", S.rail ? "Hide chat history" : "Show chat history");
    const term = (rq.value || "").trim().toLowerCase();
    const list = S.chats.slice().sort((a, b) => b.updatedAt - a.updatedAt).filter((c) => !term || c.title.toLowerCase().includes(term) || srcLabel(c.source).toLowerCase().includes(term));
    const t0 = new Date(); t0.setHours(0, 0, 0, 0);
    const grp = (n, arr) => arr.length ? [h("h2", {class: "grp", text: n}), h("ul", {class: "rows"}, arr.map(rowEl))] : null;
    rows.replaceChildren(...(list.length ? [grp("Today", list.filter((c) => c.updatedAt >= +t0)), grp("Earlier", list.filter((c) => c.updatedAt < +t0))].flat().filter(Boolean)
      : [h("p", {class: "rail-empty", text: term ? "No chats match “" + term + "”." : "No chats yet. Ask a question to start one."})]));
  }
  function rowEl(c) {
    const on = c.id === S.active;
    if (S.renaming === c.id) {
      return h("li", {class: "row on"}, h("input", {dir: "auto", value: c.title, dataset: {rn: c.id}, "aria-label": "Rename chat"}));
    }
    return h("li", {class: "row" + (on ? " on" : "")},
      h("button", {type: "button", class: "open-c", dataset: {open: c.id}, "aria-current": on ? "true" : null},
        h("span", {class: "t", dir: "auto", lang: AR.test(c.title) ? "ar" : null, text: c.title}),
        h("span", {class: "site"}, c.example ? [h("span", {class: "lock sm"}, icon("lock", 11), "Example"), srcLabel(c.source)] : [icon(c.source.kind === "pdf" ? "file" : "globe", 12), h("bdi", {text: srcLabel(c.source)})])),
      h("button", {type: "button", class: "ibtn more", dataset: {more: c.id}, "aria-label": "More actions for " + c.title, "aria-haspopup": "menu", "aria-expanded": "false"}, icon("more", 18)));
  }

  /* ---------- views */
  function renderTabs() {
    if (!page) return;
    tabs.forEach((b) => { const on = b.dataset.v === S.view; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; });
    pChat.hidden = S.view !== "chat"; pEx.hidden = S.view !== "extract"; pData.hidden = S.view !== "data"; pIns.hidden = S.view !== "insights";
  }
  function knownSources() {
    const out = [], seen = new Set();
    const push = (s) => { if (s && s.kb_id && !seen.has(s.kb_id)) { seen.add(s.kb_id); out.push(s); } };
    const c = chat(); if (c) push({...c.source, kb_id: c.kb_id});
    push(S.src);
    S.chats.forEach((x) => { if (x.source.kind !== "example" && Date.now() - x.updatedAt < 3600e3) push({...x.source, kb_id: x.kb_id}); });
    S.examples.forEach((e) => push(srcFromExample(e)));
    return out;
  }
  function renderExtract() {
    const e = S.ex, srcs = knownSources();
    if (!e.kb || !srcs.some((s) => s.kb_id === e.kb)) e.kb = srcs[0] ? srcs[0].kb_id : null;
    const sel = h("select", {class: "sel", id: P + "-exSrc", dataset: {exsrc: "1"}}, srcs.map((s) => h("option", {value: s.kb_id, selected: s.kb_id === e.kb, text: srcLabel(s) + (s.kind === "example" ? " (example)" : "")})));
    const fieldsBox = h("div", {class: "fields"}, e.fields.map((f, i) => h("span", {class: "ftag"}, f, h("button", {type: "button", dataset: {rmf: i}, "aria-label": "Remove field " + f}, icon("x", 14)))),
      h("input", {id: P + "-exAdd", placeholder: "Add a field, press Enter", dataset: {exadd: "1"}}));
    const kids = [
      h("div", {class: "vh"}, h("div", null, h("h1", {text: "Extract a table"}), h("p", {text: "Name the fields you want. You get one row per page, filled only from the page text, with the page each row came from."})),
        h("span", {class: "tag plain", text: "Reads up to 5 pages per run"})),
      h("form", {class: "card", dataset: {form: "extract"}}, h("div", {class: "form-row"},
        h("div", null, h("label", {for: P + "-exSrc", text: "Website"}), sel),
        h("div", {style: "flex:1;min-width:240px"}, h("label", {for: P + "-exAdd", text: "Fields"}), fieldsBox),
        h("button", {class: "btn", type: "submit", disabled: e.state === "run" || !e.kb || S.server === "down"}, icon("table", 16), e.state === "run" ? "Extracting..." : "Extract table")))];
    if (e.state === "run") kids.push(h("div", {class: "card xrun", role: "status"}, h("b", {text: "Reading the pages and filling the fields"}), h("div", {class: "track indet"}, h("i")),
      h("small", {style: "color:var(--slate)", text: S.server === "ready" ? "One AI call per page. This takes 5 to 20 seconds." : "Waiting for the demo server to start (about 1 min)."})));
    if (e.error) kids.push(h("p", {class: "errline", role: "alert", text: e.error}));
    if (e.state === "done" && e.res) {
      const r = e.res, fields = r.fields && r.fields.length ? r.fields.map((f) => (Array.isArray(f) ? f[0] : (f.label || f))) : e.fields;
      const labels = r.rows[0] ? Object.keys(r.rows[0]).filter((k) => k !== "source") : fields;
      kids.push(h("div", {class: "tbar"}, h("span", {class: "sum"}, h("b", {text: r.rows.length + " row" + (r.rows.length === 1 ? "" : "s")}), " from " + r.pages_read + " page" + (r.pages_read === 1 ? "" : "s"), dot(), labels.length + " fields"),
        h("span", {class: "ex"}, // built in the browser from this visitor's own result (the server keeps only the last extract per site)
          h("button", {type: "button", class: "ghost", dataset: {act: "xcsv"}, disabled: !r.rows.length, "aria-label": "Download this table as CSV"}, icon("download", 16), "CSV"),
          h("button", {type: "button", class: "ghost", dataset: {act: "xjson"}, disabled: !r.rows.length, "aria-label": "Download this table as JSON"}, icon("download", 16), "JSON"))));
      kids.push(h("div", {class: "tw cards"}, h("table", null, h("caption", {class: "sr", text: "Extracted rows"}),
        h("thead", null, h("tr", null, h("th", {text: "#"}), labels.map((l) => h("th", {text: l})), h("th", {text: "Source page"}))),
        h("tbody", null, r.rows.map((row, i) => h("tr", null, h("td", {class: "n idx", text: String(i + 1)}),
          labels.map((l, j) => { const v = row[l]; const empty = v == null || v === ""; return h("td", {class: j === 0 ? "k" : "", dataset: {l}, style: empty ? "color:var(--slate)" : null, dir: "auto", text: empty ? "—" : String(v)}); }),
          h("td", {dataset: {l: "Source page"}}, row.source ? link(row.source.url, [pathOf(row.source.url), " ", icon("ext", 12)]) : "")))))));
      if (!r.rows.length) kids.push(h("p", {class: "tfoot", text: "No page had these fields. Try fields that appear on the pages, such as a price or a contact."}));
      (r.warnings || []).forEach((w) => kids.push(h("p", {class: "xwarn", text: w})));
    }
    exCol.replaceChildren(...kids);
  }
  async function runExtract() {
    const e = S.ex;
    const add = q("#" + P + "-exAdd"); if (add && add.value.trim()) { e.fields.push(add.value.trim()); add.value = ""; }
    if (!e.kb || !e.fields.length) { e.error = "Name at least one field."; renderExtract(); return; }
    e.state = "run"; e.error = null; e.res = null; renderExtract(); status("Extracting...", true);
    try { await whenReady(); } catch (err) { e.state = "idle"; e.error = err.message; status(e.error); if (S.view === "extract") renderExtract(); return; }
    try {
      const r = await fetch(api + "/api/extract", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({kb_id: e.kb, fields: e.fields, session_id: history.sessionId()})});
      const j = await r.json();
      if (j.error) {
        e.state = "idle";
        e.error = j.error.code === "kb_expired" ? "The server cleared this site after 1 hour. Read it again from the Chat tab, then extract." : j.error.message;
      } else { e.state = "done"; e.res = j; status("Table ready: " + j.rows.length + " rows"); }
    } catch (err) { e.state = "idle"; e.error = NET.message; }
    if (e.state !== "done") status(e.error || "");
    if (S.view === "extract") renderExtract();
  }
  function csvOf(head, rows) {
    const cell = (v) => { let x = v == null ? "" : String(v); if (/^[=+\-@\t\r]/.test(x)) x = "'" + x; return /[",\n\r]/.test(x) ? '"' + x.replace(/"/g, '""') + '"' : x; };
    return "\ufeff" + [head, ...rows].map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";
  }
  function exportExtract(kind) {
    const r = S.ex.res; if (!r || !r.rows.length) return;
    const labels = Object.keys(r.rows[0]).filter((k) => k !== "source");
    const name = slug((S.ex.kb || "table").replace(/^ex-/, "")) + "-table";
    if (kind === "json") download(name + ".json", JSON.stringify({fields: labels, rows: r.rows}, null, 2), "application/json");
    else download(name + ".csv", csvOf([...labels, "source_url", "source_title"], r.rows.map((x) => [...labels.map((l) => x[l]), x.source && x.source.url, x.source && x.source.title])), "text/csv");
  }
  async function exportPages(kb, kind) {
    status("Preparing the download...", true);
    try {
      const r = await fetch(api + "/api/kb/" + encodeURIComponent(kb) + ".json"); const j = await r.json();
      if (j.error || !Array.isArray(j.pages_text)) { status(j.error && j.error.code === "kb_expired" ? "The server cleared this site after 1 hour. Read it again first." : "Could not download the pages."); return; }
      const pages = j.pages_text.map((p) => ({url: p.url, title: p.title, words: p.words, text: p.text}));
      const name = slug(kb.replace(/^ex-/, "")) + "-pages";
      if (kind === "json") download(name + ".json", JSON.stringify({kb_id: kb, pages}, null, 2), "application/json");
      else download(name + ".csv", csvOf(["url", "title", "words"], pages.map((p) => [p.url, p.title, p.words])), "text/csv");
    } catch (e) { status(S.server === "ready" ? "Could not download the pages." : "The demo server is starting. Try again in a minute."); }
  }
  function renderData() {
    const c = chat(), s = c ? {...c.source, kb_id: c.kb_id} : S.src;
    if (!s) { dataCol.replaceChildren(h("p", {class: "empty-s", text: "Pick an example or read a site first."})); return; }
    const pl = s.page_list || (s.kind === "example" && exampleOf(s.kb_id) ? exampleOf(s.kb_id).page_list : []) || [];
    dataCol.replaceChildren(
      h("div", {class: "vh"}, h("div", null, h("h1", {text: "Pages read"}), h("p", {text: "The pages the crawler read from " + srcLabel(s) + ". The server keeps them for 1 hour, then deletes them (examples stay)."})),
        h("span", {class: "ex", style: "display:flex;gap:8px"},
          h("button", {type: "button", class: "ghost", dataset: {act: "pcsv", kb: s.kb_id}, "aria-label": "Download the page list as CSV"}, icon("download", 16), "CSV"),
          h("button", {type: "button", class: "ghost", dataset: {act: "pjson", kb: s.kb_id}, "aria-label": "Download the pages as JSON"}, icon("download", 16), "JSON"))),
      h("div", {class: "tbar", style: "margin-top:0"}, h("span", {class: "sum"}, h("b", {text: (s.pages || pl.length) + " pages read"}), s.words ? [dot(), s.words + " words"] : null)),
      pl.length ? h("div", {class: "tw"}, h("table", null, h("caption", {class: "sr", text: "Pages read"}), h("thead", null, h("tr", null, h("th", {text: "Page"}), h("th", {text: "URL"}))),
        h("tbody", null, pl.map((p) => h("tr", null, h("td", {class: "k", dir: "auto", text: p.title || "(no title)"}), h("td", null, link(p.url, pathOf(p.url)))))))) : h("p", {class: "empty-s", text: "The page list appears after a site is read."}),
      pl.length ? h("p", {class: "tfoot", text: "Showing the first " + pl.length + " pages in reading order. CSV and JSON include every page."}) : null);
  }
  function stats() {
    let qn = 0, ans = 0, up = 0, down = 0; const un = {}, cp = {};
    S.chats.forEach((c) => { for (let i = 0; i < c.messages.length; i += 2) {
      const u = c.messages[i], a = c.messages[i + 1]; if (!a || !a.done) continue; qn++;
      if (a.done.status === "no_match") un[u.content] = (un[u.content] || 0) + 1;
      else { ans++; const cited = new Set(a.done.cited || []); a.sources.forEach((s) => { if (cited.has(s.n)) { const k = s.title + "\u0000" + hostOf(s.url); cp[k] = (cp[k] || 0) + 1; } }); }
      if (a.v === 1) up++; if (a.v === -1) down++;
    } });
    const top = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return {q: qn, ans, up, down, un: top(un), cited: top(cp)};
  }
  function renderIns() {
    const s = stats(), pct = s.q ? Math.round(s.ans / s.q * 100) : 0, max = s.cited.length ? s.cited[0][1] : 1;
    const kpi = (l, v, sub) => h("div", {class: "kpi"}, h("span", {class: "l", text: l}), h("span", {class: "v", text: String(v)}), h("span", {class: "s", text: sub}));
    insCol.replaceChildren(
      h("div", {class: "vh"}, h("div", null, h("h1", {text: "Insights"}), h("p", {text: "What visitors asked, what the pages could not answer, and which pages did the work."})),
        h("span", {class: "lock"}, icon("lock", 12), "From chats in this browser only")),
      h("div", {class: "kpis"}, kpi("Questions asked", s.q, "in " + S.chats.length + " chats"), kpi("Answered", pct + "%", s.ans + " of " + s.q + ", from the pages"),
        kpi("Marked helpful", s.up, s.down + " marked not helpful"), kpi("Not on the site", s.q - s.ans, "questions to cover next")),
      h("div", {class: "two"},
        h("section", {class: "card", "aria-labelledby": P + "-unT"}, h("h2", {id: P + "-unT", text: "Top unanswered questions"}), h("p", {class: "sub", text: "Add a page about these and the next answer can come from it."}),
          h("ul", {class: "ul"}, s.un.length ? s.un.map(([t, n]) => h("li", null, h("span", {class: "tag warn", "aria-hidden": "true"}, icon("info", 13)), h("span", {dir: "auto", text: t}), h("span", {class: "c", text: "asked " + n + "×"})))
            : h("li", {class: "empty-s", text: s.q ? "Every question was answered." : "No questions yet."}))),
        h("section", {class: "card", "aria-labelledby": P + "-ciT"}, h("h2", {id: P + "-ciT", text: "Top cited pages"}), h("p", {class: "sub", text: "Times each page was used as a source."}),
          s.cited.length ? h("ul", {class: "bars"}, s.cited.map(([k, n]) => { const [t, d] = k.split("\u0000"); return h("li", {title: t + ": cited " + n + " times"}, h("span", {dir: "auto"}, t + " ", h("small", {class: "dm", text: d})), h("span", {class: "v", text: String(n)}), h("span", {class: "bt", "aria-hidden": "true"}, h("i", {style: "width:" + Math.max(6, Math.round(n / max * 100)) + "%"}))); }))
            : h("p", {class: "empty-s", text: "No cited pages yet."}))),
      h("p", {class: "tfoot", style: "margin-top:14px", text: "Counted from the chats saved in this browser only. Nothing here leaves your browser."}));
  }
  function renderAll() {
    renderRail(); renderTabs();
    if (S.view === "chat") { renderHero(); renderThread(); }
    else if (S.view === "extract") renderExtract(); else if (S.view === "data") renderData(); else if (S.view === "insights") renderIns();
    renderDock();
  }
  function setView(v) { S.view = v; hidePop(); renderAll(); }

  /* ---------- ask + stream */
  function newChatFor(src, text) {
    const c = {id: uid(), kb_id: src.kb_id, source: {kind: src.kind, url: src.url || "", label: src.label, pages: src.pages, page_list: (src.page_list || []).slice(0, 20), words: src.words},
      title: trunc(text, 80), messages: [], updatedAt: Date.now()};
    S.chats.unshift(c); S.active = c.id;
    if (S.chats.length > HMAX) S.chats = S.chats.slice(0, HMAX);
    return c;
  }
  function askText(text, from) {
    text = String(text || "").trim(); if (!text) return;
    if (/^extract\b/i.test(text) && page) { setView("extract"); return; }
    if (busy()) { S.queue.push({text, from}); renderDock(); status(S.queue.length > 1 ? S.queue.length + " questions wait their turn" : "Your question waits for this answer to end"); return; }
    let c = chat();
    if (!c) {
      if (S.crawl) { S.pend = text; heroErr(""); status("Still reading the pages. Your question runs when they are ready."); return; }
      if (!S.src) { heroErr("Pick an example or paste a link first."); return; }
      if (S.capped && !cachedAns(S.src.kind, S.src.kb_id, text)) { heroErr("AI answers are paused until 00:00 GMT. The cached example questions still work."); status("No AI answers left today"); return; }
      c = newChatFor(S.src, text);
    }
    const first = c.messages.length === 0;
    const cachedSt = first ? starterAnswer(c, text) : null;
    if (!cachedSt && cappedFor(c)) { renderDock(); status("No questions left"); return; }
    c.updatedAt = Date.now();
    c.messages.push({role: "user", content: text});
    const a = {role: "assistant", content: "", meta: null, sources: [], notice: null, followups: [], done: null, status: "search", error: null, v: 0};
    c.messages.push(a);
    const mi = c.messages.length - 1;
    S.view = "chat";
    if (cachedSt) {
      Object.assign(a, {content: cachedSt.text, meta: cachedSt.meta, sources: cachedSt.sources || [], notice: cachedSt.notice || null, followups: cachedSt.followups || [],
        done: {...cachedSt.done, cached: true, cost: 0}, status: "done", local: true});
      if (first) c.example = "Cached example";
      save(); renderAll(); scrollTurn(mi); focusAfter(mi, from);
      const n = (a.done.cited || []).length;
      status("Answer ready", false, firstSentence(a.content) + " " + n + " source" + (n === 1 ? "" : "s") + " used.");
      emit("answer", {chat: c.id, cached: true});
      return;
    }
    save(); renderAll(); scrollTurn(mi); focusAfter(mi, from);
    run(c, mi);
  }
  function focusAfter(mi, from) {
    if (from === "composer") { if (!composer.hidden) ask.focus(); return; }
    const hd = q("#" + P + "-q" + (mi - 1)); if (hd) hd.focus({preventScroll: true});
  }
  function priorTurns(c, mi) {
    const out = [];
    for (let i = 0; i < mi - 1; i += 2) {
      const u = c.messages[i], a = c.messages[i + 1];
      if (a && a.content && a.status === "done" && !(a.done && a.done.status === "no_match")) out.push({role: "user", content: u.content}, {role: "assistant", content: a.content});
    }
    return out.slice(-4); // only the last 2 turns
  }
  async function run(c, mi) {
    const a = c.messages[mi], question = c.messages[mi - 1].content;
    Object.assign(a, {content: "", meta: null, sources: [], notice: null, followups: [], done: null, error: null, local: false, status: "search"});
    if (S.server !== "ready") {
      a.status = "wake"; if (!S.waitQ.some((w) => w.chatId === c.id && w.mi === mi)) S.waitQ.push({chatId: c.id, mi}); ensureWake();
      if (c.id === S.active) { renderTurn(mi); renderDock(); }
      status("Server starting...", true);
      return;
    }
    const ctrl = new AbortController();
    S.streaming = {chatId: c.id, mi, ctrl};
    if (c.id === S.active) { renderTurn(mi); renderDock(); }
    status("Searching the pages", true);
    const repaint = () => { if (c.id === S.active) { renderTurn(mi); follow(mi); } };
    try {
      await streamChat({api, kb_id: c.kb_id, session_id: c.id, signal: ctrl.signal,
        messages: [...priorTurns(c, mi), {role: "user", content: question}],
        on: {
          meta: (d) => { a.meta = d; },
          sources: (d) => { a.sources = Array.isArray(d) ? d : []; repaint(); },
          notice: (d) => {
            a.notice = d; emit("notice", d);
            if (d.code === "session_cap") c.capped = d.code;
            else if (CAP_CODES.includes(d.code)) { S.capped = d.code; S.cappedMsg = d.message; }
            repaint();
          },
          delta: (d) => {
            a.content += d.text || "";
            if (a.status !== "stream") { a.status = "stream"; repaint(); status("Writing...", true); }
            else if (c.id === S.active) paintAnswer(mi);
          },
          followups: (d) => { a.followups = Array.isArray(d) ? d.slice(0, 3) : []; },
          done: (d) => {
            a.done = d; if (d.left_today != null) S.left = d.left_today;
            // done.hl {"<n>": {hl, hl_at}}: the sentence the answer actually used replaces the question-based guess
            if (d.hl && typeof d.hl === "object") for (const s of a.sources) {
              const m = d.hl[String(s.n)];
              if (m && typeof m.hl === "string" && m.hl) { s.hl = m.hl; s.hl_at = Array.isArray(m.hl_at) ? m.hl_at : null; }
            }
          },
          error: (d) => { a.error = d; },
        }});
    } catch (e) {
      if (e && e.name === "AbortError") a.status = "stopped";
      else a.error = NET;
    }
    if (S.streaming && S.streaming.ctrl === ctrl) S.streaming = null;
    // a stream that ends with neither done nor error was cut (server restart, proxy): never save it as an answer
    if (a.status !== "stopped" && !a.error && !a.done) a.error = {code: "incomplete", message: "The connection closed before the answer finished. Please try again."};
    if (rafAns) { cancelAnimationFrame(rafAns); rafAns = 0; }
    if (a.error && a.error.code === "kb_expired") {
      if (c.source.kind === "site" && c.source.url) {
        a.status = "reread"; a.error = null; S.rereading = true; repaint(); renderDock(); status("Reading the site again", true);
        try {
          const sum = await readSite({api, url: c.source.url});
          S.rereading = false;
          c.kb_id = sum.kb_id; c.source.pages = sum.pages; c.source.page_list = sum.page_list || c.source.page_list;
          if (S.src && S.src.url === c.source.url) { S.src.kb_id = sum.kb_id; saveSrc(); }
          save(); return run(c, mi);
        } catch (err) { S.rereading = false; a.status = "error"; a.error = {code: err.code || "server_error", message: "Could not read the site again: " + (err.message || "")}; }
      } else if (c.source.kind === "pdf") { a.status = "error"; a.error = {code: "kb_gone_pdf", message: ""}; }
      else { a.status = "error"; }
    } else if (a.status !== "stopped") a.status = a.error ? "error" : "done";
    if (a.status === "error" && a.error && a.error.code === "network") { checkHealth(api, 4000).then((ok) => { if (!ok) { S.server = "waking"; wakeStart = Date.now(); ensureWake(); } }); }
    c.updatedAt = Date.now(); save();
    if (c.id === S.active) {
      const keepComposer = activeEl() === ask;
      if (cappedFor(c)) renderThread(); else renderTurn(mi); // at a cap every ask button in the chat turns off
      renderDock(); renderRail();
      if (!keepComposer && a.status !== "done") { const hd = q("#" + P + "-q" + (mi - 1)); if (hd && !thread.contains(activeEl())) hd.focus({preventScroll: true}); }
    }
    if (a.status === "done") {
      if (a.done && a.done.status === "no_match") status("Not on this site", false, "Not on this site. No passage answers this question. Closest pages shown.");
      else { const n = ((a.done && a.done.cited) || []).length; status("Answer ready", false, firstSentence(a.content) + " " + n + " source" + (n === 1 ? "" : "s") + " used."); }
      emit("answer", {chat: c.id, status: a.done && a.done.status, cost: a.done && a.done.cost});
    } else if (a.status === "stopped") status("Stopped");
    else if (a.error) { status(a.error.message || "Error"); emit("error", a.error); }
    if (S.capped && S.queue.length) { if (!ask.value.trim()) ask.value = S.queue[0].text; S.queue = []; renderDock(); }
    pump();
  }
  function stop() { if (S.streaming) S.streaming.ctrl.abort(); }

  /* ---------- read a site / PDFs */
  let readCtrl = null;
  async function readSource({url, files}) {
    const pdf = !!(files && files.length);
    const label = pdf ? (files.length === 1 ? files[0].name : files.length + " PDFs") : hostOf(url);
    if (readCtrl) readCtrl.abort(); // one read at a time: a new read replaces the old one
    S.active = null; S.err = null; S.view = "chat";
    S.crawl = {kind: pdf ? "pdf" : "site", label, url, n: 0, max: 0, feed: [], waiting: S.server !== "ready"};
    renderAll(); status("Reading " + label, true);
    const myCtrl = readCtrl = new AbortController();
    if (S.server !== "ready") {
      try { await whenReady(); }
      catch (e) { if (readCtrl !== myCtrl || !S.crawl) return; S.crawl = null; readCtrl = null; S.err = {label, kind: pdf ? "pdf" : "site", code: e.code, message: e.message}; S.pend = null; renderAll(); status("Could not read " + label); return; }
      if (readCtrl !== myCtrl || !S.crawl || myCtrl.signal.aborted) return;
      S.crawl.waiting = false; renderHero();
    }
    try {
      const sum = await readSite({api, url, files, signal: myCtrl.signal,
        onStart: (d) => { if (S.crawl) { S.crawl.max = d.max_pages || 0; } },
        onProgress: (d) => { if (!S.crawl) return; S.crawl.n = d.n; S.crawl.feed.push(d.url); const card = q(".crawlc"); if (card) card.replaceWith(crawlCard()); }});
      S.crawl = null;
      S.src = {kb_id: sum.kb_id, kind: sum.kind === "pdf" ? "pdf" : "site", label: sum.kind === "pdf" ? sum.label : hostOf(sum.url || url), url: sum.url || url || "",
        pages: sum.pages, words: sum.words, lang: sum.lang, page_list: sum.page_list || [], input: pdf ? "" : url, at: Date.now()};
      saveSrc(); emit("kb", sum);
      { const hu = q("." + P + "-hu"); if (hu) hu.value = ""; const hq = q("." + P + "-hq"); if (hq && S.pend) hq.value = ""; }
      const warn = (sum.warnings || []).length ? " " + sum.warnings[0] : "";
      renderAll(); status("Ready: " + sum.pages + " pages read." + warn);
      if (S.pend) { const p = S.pend; S.pend = null; askText(p); }
      else { const hq = q("." + P + "-hq"); if (hq) hq.focus(); }
    } catch (e) {
      if (readCtrl !== myCtrl && !(e && e.name === "AbortError")) return; // a newer read replaced this one
      const was = S.crawl; S.crawl = null;
      if (e && e.name === "AbortError") { if (readCtrl === myCtrl) { readCtrl = null; renderAll(); status("Reading cancelled"); } return; }
      S.err = {label: was ? was.label : label, kind: pdf ? "pdf" : "site", code: e.code, message: e.message || NET.message};
      S.pend = null; renderAll(); status("Could not read " + (was ? was.label : label));
      emit("error", e);
    }
    if (readCtrl === myCtrl) readCtrl = null;
  }
  function normUrl(u) { u = String(u || "").trim(); if (!u || /\s/.test(u)) return ""; if (!/^https?:\/\//i.test(u)) u = "https://" + u; return safeHref(u) ? u : ""; }
  function pickExample(kb, quiet) {
    const e = exampleOf(kb); if (!e) return;
    S.src = srcFromExample(e); S.crawl = null; S.err = null; S.active = null; S.view = "chat"; saveSrc();
    if (quiet) return;
    renderAll(); status(e.label + " selected. Example answers are cached");
    const b = q('[data-ex="' + CSS.escape(kb) + '"].exb'); if (b) b.focus();
  }
  function newChat() {
    if (S.streaming) stop();
    S.active = null; S.view = "chat"; renderAll(); if (page && narrow()) closeRailDrawer();
    const hq = q("." + P + "-hq"); if (hq) hq.focus();
  }

  /* ---------- citation popover + drawer */
  let popT = null, popBtn = null, opener = null;
  function srcOf(b) { const c = chat(); if (!c) return null; const a = c.messages[+b.dataset.a]; if (!a) return null; const j = +b.dataset.c; return {a, j, s: a.sources[j - 1]}; }
  function lite(idx, j) { qa(".src.lit,.cite.lit").forEach((x) => x.classList.remove("lit")); if (idx == null) return; qa('.thread [data-a="' + idx + '"][data-c="' + j + '"]').forEach((x) => x.classList.add("lit")); }
  function showPop(b) {
    const o = srcOf(b); if (!o || !o.s) return; hidePop(); popBtn = b; b.setAttribute("aria-expanded", "true"); b.setAttribute("aria-describedby", P + "-pop"); lite(b.dataset.a, o.j);
    pop.replaceChildren(h("div", {class: "ph"}, h("span", {class: "badge", "aria-hidden": "true", text: String(o.j)}), h("div", null, h("b", {dir: "auto", text: o.s.title}), h("small", {text: hostOf(o.s.url)}))),
      h("blockquote", {class: "quote", dir: "auto"}, passageNode(o.s, false)),
      h("div", {class: "pf"}, h("span", {text: "Highlighted: the sentence that matched. Select the number to open it."})));
    pop.hidden = false;
    const r = b.getBoundingClientRect(), w = pop.offsetWidth, hh = pop.offsetHeight;
    const x = Math.max(12, Math.min(r.left - 24, innerWidth - w - 12)); let y = r.bottom + 10; if (y + hh > innerHeight - 12) y = r.top - hh - 10;
    pop.style.left = x + "px"; pop.style.top = y + "px";
  }
  function hidePop() { clearTimeout(popT); if (popBtn) popBtn.setAttribute("aria-expanded", "false"); popBtn = null; pop.hidden = true; if (drawer.hidden) lite(null); }
  function openDrawer(idx, j, from) {
    const c = chat(); if (!c) return; const a = c.messages[idx]; if (!a) return; const s = a.sources[j - 1]; if (!s) return;
    const cited = new Set((a.done && a.done.cited) || []), used = !a.done || !cited.size || cited.has(j);
    const sheet = phone() || !page; hidePop(); if (from) opener = from;
    drawer.classList.toggle("sheet", sheet); drawer.setAttribute("aria-modal", String(sheet)); lite(idx, j);
    drawer.replaceChildren(
      h("div", {class: "dh"}, h("h2", {id: P + "-drT", text: "Source " + j + " of " + a.sources.length + (used ? "" : ", not used")}),
        h("button", {type: "button", class: "ibtn", dataset: {act: "drclose"}, "aria-label": "Close source panel"}, icon("x", 18))),
      h("div", {class: "db"},
        a.sources.length < 2 ? null : h("div", {class: "tabs", role: "group", "aria-label": "Sources in this answer"}, a.sources.map((x) => {
          const u = a.done && cited.size && !cited.has(x.n);
          return h("button", {type: "button", class: u ? "unused" : "", "aria-pressed": String(x.n === j), dataset: {dsrc: x.n, a: idx}, "aria-label": "Source " + x.n + ": " + x.title + (u ? ", not used" : ""), text: String(x.n)});
        })),
        h("div", {style: "display:flex;gap:12px;align-items:center;margin-bottom:4px"}, h("span", {class: "badge", "aria-hidden": "true", text: String(j)}), h("h3", {dir: "auto", text: s.title})),
        h("p", {class: "url", text: s.url}),
        h("h4", {class: "lab", text: used ? "Passage used in this answer" : "Passage found, not used in this answer"}),
        h("blockquote", {class: "quote", dir: "auto"}, passageNode(s, false)),
        safeHref(s.url) && !/\.example(\/|$)/.test(hostOf(s.url)) ? link(s.url, ["Open page ", icon("ext", 15)], "btn open") : h("p", {class: "note", text: "Example page: the text above is the full passage."})));
    scrim.hidden = !sheet; drawer.hidden = false; root.classList.toggle("pinned", !sheet);
    const cb = drawer.querySelector('[data-act="drclose"]'); if (cb && (from || sheet)) cb.focus();
  }
  function closeDrawer() {
    if (drawer.hidden) return false;
    drawer.hidden = true; scrim.hidden = true; root.classList.remove("pinned"); lite(null);
    if (opener && opener.isConnected) opener.focus(); else { const hd = thread.querySelector(".q"); if (hd) hd.focus({preventScroll: true}); }
    opener = null; return true;
  }

  /* ---------- rail drawer, menu, rename, delete */
  let railOpener = null;
  function openRailDrawer() {
    if (!page) return; railOpener = activeEl(); rail.classList.add("drawer"); railScrim.hidden = false;
    if (opts.menuButton) opts.menuButton.setAttribute("aria-expanded", "true");
    setTimeout(() => { const x = rail.querySelector(".rail-x"); if (x) x.focus(); }, 30);
  }
  function closeRailDrawer() {
    if (!page || !rail.classList.contains("drawer")) return false;
    rail.classList.remove("drawer"); railScrim.hidden = true;
    if (opts.menuButton) opts.menuButton.setAttribute("aria-expanded", "false");
    const back = railOpener && railOpener.isConnected ? railOpener : opts.menuButton || q(".hist-btn"); if (back) back.focus();
    return true;
  }
  let menuBtn = null;
  function openMenu(b) {
    closeMenu(); menuBtn = b; b.setAttribute("aria-expanded", "true"); const id = b.dataset.more;
    menu.replaceChildren(
      h("button", {type: "button", role: "menuitem", dataset: {m: "rename", id}}, icon("pencil", 16), "Rename"),
      h("button", {type: "button", role: "menuitem", dataset: {m: "md", id}}, icon("download", 16), "Export as Markdown"),
      h("button", {type: "button", role: "menuitem", class: "danger", dataset: {m: "del", id}}, icon("trash", 16), "Delete"));
    menu.hidden = false; const r = b.getBoundingClientRect();
    menu.style.left = Math.min(r.left, innerWidth - menu.offsetWidth - 8) + "px"; menu.style.top = Math.min(r.bottom + 4, innerHeight - menu.offsetHeight - 8) + "px";
    menu.querySelector("button").focus();
  }
  function closeMenu(ret) { if (menu.hidden) return false; menu.hidden = true; if (menuBtn) { menuBtn.setAttribute("aria-expanded", "false"); if (ret && menuBtn.isConnected) menuBtn.focus(); } menuBtn = null; return true; }
  function startRename(id) { S.renaming = id; renderRail(); const i = rail.querySelector("[data-rn]"); if (i) { i.focus(); i.select(); } }
  function endRename(ok) {
    const i = rail.querySelector("[data-rn]"); if (!i) { S.renaming = null; return; }
    const id = i.dataset.rn, v = i.value.trim(); S.renaming = null;
    const c = S.chats.find((x) => x.id === id); if (ok && v && c) { c.title = trunc(v, 120); save(); }
    renderRail(); const b = rail.querySelector('[data-more="' + CSS.escape(id) + '"]'); if (b) b.focus(); if (ok) status("Chat renamed");
  }
  let toastIv = null, toastHold = false;
  function delChat(id) {
    const i = S.chats.findIndex((c) => c.id === id); if (i < 0) return;
    if (S.streaming && S.streaming.chatId === id) stop();
    const c = S.chats.splice(i, 1)[0]; if (S.active === id) S.active = null; save(); renderAll();
    showToast("Chat deleted: “" + trunc(c.title, 26) + "”", () => {
      S.chats.splice(Math.min(i, S.chats.length), 0, c); save(); renderAll(); status("Chat restored");
      const b = rail.querySelector('[data-open="' + CSS.escape(c.id) + '"]'); if (b) b.focus();
    });
  }
  function endToast() {
    clearInterval(toastIv); const had = toast.contains(activeEl()); toast.hidden = true;
    if (had) { const t = rq && rq.offsetParent ? rq : rail.querySelector('[data-act="newchat"]'); if (t) t.focus(); }
  }
  function showToast(msg, undo) {
    let left = 5000; clearInterval(toastIv); toastHold = false;
    const ub = h("button", {type: "button", text: "Undo"}), cd = h("span", {class: "cd", "aria-hidden": "true", text: "5 s"}), bar = h("i");
    toast.replaceChildren(h("span", {dir: "auto", text: msg}), cd, ub, h("span", {class: "tbar2", "aria-hidden": "true"}, bar));
    toast.hidden = false; status("", false, msg + ". Undo is available for 5 seconds");
    ub.addEventListener("click", () => { clearInterval(toastIv); toast.hidden = true; undo(); });
    ub.focus(); toastHold = true; toast.classList.add("hold"); // focus is inside: the countdown waits
    toastIv = setInterval(() => { if (toastHold) return; left -= 100; cd.textContent = Math.ceil(left / 1000) + " s"; bar.style.width = (left / 50) + "%"; if (left <= 0) endToast(); }, 100);
  }
  { // pause the Undo countdown while the pointer or the keyboard focus is on the toast (attached once)
    const hold = () => { toastHold = true; toast.classList.add("hold"); };
    const release = () => setTimeout(() => { if (!toast.contains(activeEl()) && !toast.matches(":hover")) { toastHold = false; toast.classList.remove("hold"); } }, 0);
    toast.addEventListener("mouseenter", hold); toast.addEventListener("focusin", hold);
    toast.addEventListener("mouseleave", release); toast.addEventListener("focusout", release);
  }
  function download(name, text, type) {
    try {
      const a = h("a", {href: URL.createObjectURL(new Blob([text], {type: type || "text/plain"})), download: name});
      root.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800); status("Downloaded " + name);
    } catch (e) { status("Download blocked in this browser"); }
  }

  /* ---------- events (all on root) */
  function onClick(e) {
    const t = e.target; let b;
    if ((b = t.closest("[data-ask]")) && !b.disabled) {
      e.preventDefault();
      if (b.dataset.kb && (!S.src || S.src.kb_id !== b.dataset.kb) && !chat()) pickExample(b.dataset.kb, true); // e.g. the Arabic card
      askText(b.dataset.ask, b.classList.contains("chip") ? "chip" : "starter"); return;
    }
    if ((b = t.closest("[data-xt]")) && !b.disabled) {
      e.preventDefault(); if (S.src) { S.ex.kb = S.src.kb_id; S.ex.res = null; S.ex.state = "idle"; S.ex.error = null; }
      setView("extract"); const sb = q('#' + P + "-p-extract button[type=submit]"); if (sb) sb.focus(); return;
    }
    if ((b = t.closest(".cite"))) { e.preventDefault(); openDrawer(+b.dataset.a, +b.dataset.c, b); return; }
    if ((b = t.closest(".src"))) { openDrawer(+b.dataset.a, +b.dataset.c, b); return; }
    if ((b = t.closest("[data-dsrc]"))) { openDrawer(+b.dataset.a, +b.dataset.dsrc, null); const nb = drawer.querySelector('[data-dsrc="' + b.dataset.dsrc + '"]'); if (nb) nb.focus(); return; }
    if (t === scrim) { closeDrawer(); return; }
    if (t === railScrim) { closeRailDrawer(); return; }
    if ((b = t.closest("[data-open]"))) {
      S.active = b.dataset.open; S.view = "chat"; renderAll(); chatScroll.scrollTop = 0; if (narrow()) closeRailDrawer();
      const hd = thread.querySelector(".q"); if (hd && !narrow()) hd.focus({preventScroll: true});
      return;
    }
    if ((b = t.closest("[data-more]"))) { e.stopPropagation(); if (menuBtn === b) closeMenu(true); else openMenu(b); return; }
    if ((b = t.closest("[data-m]"))) {
      const id = b.dataset.id, m = b.dataset.m; closeMenu(); const c = S.chats.find((x) => x.id === id); if (!c) return;
      if (m === "rename") startRename(id); else if (m === "md") download(slug(c.title) + ".md", history.toMarkdown(c), "text/markdown"); else delChat(id);
      return;
    }
    if (!menu.hidden && !t.closest(".menu")) closeMenu();
    if ((b = t.closest("[data-ex]"))) { heroErr(""); pickExample(b.dataset.ex); return; }
    if ((b = t.closest("[data-v]")) && b.getAttribute("role") === "tab") { setView(b.dataset.v); return; }
    if ((b = t.closest("[data-rmf]"))) { S.ex.fields.splice(+b.dataset.rmf, 1); renderExtract(); const fi = q("#" + P + "-exAdd"); if (fi) fi.focus(); return; }
    if ((b = t.closest("[data-act]"))) {
      const act = b.dataset.act, c = chat(), idx = +b.dataset.a, a = c && c.messages[idx];
      if (act === "stop") { stop(); ask.focus(); return; }
      if (act === "newchat") { newChat(); return; }
      if (act === "railtoggle") { S.rail = !S.rail; lsSet("sc-rail", S.rail ? "1" : "0"); renderRail(); return; }
      if (act === "railopen") { openRailDrawer(); return; }
      if (act === "railclose") { closeRailDrawer(); return; }
      if (act === "search") { openSearch(); return; }
      if (act === "drclose") { closeDrawer(); return; }
      if (act === "pdf" || act === "repdf") { const pi = q("." + P + "-pdf") || mkPdfInput(); pi.click(); return; }
      if (act === "xcsv" || act === "xjson") { exportExtract(act === "xjson" ? "json" : "csv"); return; }
      if (act === "pcsv" || act === "pjson") { exportPages(b.dataset.kb, act === "pjson" ? "json" : "csv"); return; }
      if (act === "cancelread") { const rc = readCtrl; if (rc) rc.abort(); if (!rc || S.crawl && S.crawl.waiting) { readCtrl = null; S.crawl = null; S.pend = null; renderAll(); status("Reading cancelled"); } return; }
      if (!a) return;
      if (act === "cancelq") { c.messages.splice(idx - 1, 2); S.waitQ = S.waitQ.filter((w) => !(w.chatId === c.id && w.mi === idx)); if (!c.messages.length) { S.chats = S.chats.filter((x) => x !== c); S.active = null; } save(); renderAll(); status("Question cancelled"); (c.messages.length ? ask : (q("." + P + "-hq") || ask)).focus(); pump(); return; }
      if (act === "copy") {
        const done = () => { status("Answer copied"); b.replaceChildren(icon("check", 17)); b.dataset.tip = "Copied"; setTimeout(() => { b.replaceChildren(icon("copy", 17)); b.dataset.tip = "Copy"; }, 2000); };
        try { navigator.clipboard.writeText(a.content.trim()).then(done, () => status("Copy is blocked in this browser")); } catch (err) { status("Copy is blocked in this browser"); }
        return;
      }
      if (act === "up" || act === "down") {
        const v = act === "up" ? 1 : -1; a.v = a.v === v ? 0 : v; save(); renderTurn(idx); status(a.v ? "Thanks, counted in Insights" : "Vote removed");
        const nb = thread.querySelector('[data-act="' + act + '"][data-a="' + idx + '"]'); if (nb) nb.focus(); return;
      }
      if (act === "export") { download(slug(c.messages[idx - 1].content) + ".md", history.toMarkdown(c, idx), "text/markdown"); return; }
      if (act === "regen") { if (busy() || cappedFor(c)) return; const hd = q("#" + P + "-q" + (idx - 1)); if (hd) hd.focus({preventScroll: true}); run(c, idx); return; }
    }
  }
  function mkPdfInput() { const i = h("input", {type: "file", accept: "application/pdf", multiple: true, hidden: true, class: P + "-pdf"}); root.appendChild(i); return i; }
  let searchOpener = null;
  function openSearch() {
    if (!page) return;
    searchOpener = activeEl();
    if (narrow()) { if (!rail.classList.contains("drawer")) openRailDrawer(); } else if (!S.rail) { S.rail = true; renderRail(); }
    setTimeout(() => rq.focus(), 40);
  }
  function onSubmit(e) {
    const f = e.target; e.preventDefault();
    if (f === composer) { const v = ask.value; if (!v.trim()) return; ask.value = ""; grow(ask); askText(v, "composer"); return; }
    if (f.dataset.form === "hero") {
      heroErr("");
      const u = normUrl((q("." + P + "-hu") || {}).value), text = ((q("." + P + "-hq") || {}).value || "").trim();
      const rawU = ((q("." + P + "-hu") || {}).value || "").trim();
      if (rawU && !u) { heroErr("That link does not look like a web address. Try something like your-site.com/help."); return; }
      if (u) { S.pend = text || null; readSource({url: u}); return; }
      if (!text) { heroErr("Type a question, or pick one of the 4 above."); const hq = q("." + P + "-hq"); if (hq) hq.focus(); return; }
      askText(text, "hero"); return;
    }
    if (f.dataset.form === "extract") { runExtract(); return; }
  }
  function onChange(e) {
    const t = e.target;
    if (t.classList && t.classList.contains(P + "-pdf") && t.files && t.files.length) {
      const files = Array.from(t.files); t.value = "";
      if (files.some((x) => !/\.pdf$/i.test(x.name) && x.type !== "application/pdf")) { heroErr("Only PDF files work here."); return; }
      S.pend = ((q("." + P + "-hq") || {}).value || "").trim() || null;
      readSource({files}); return;
    }
    if (t.dataset && t.dataset.exsrc) { S.ex.kb = t.value; S.ex.res = null; S.ex.state = "idle"; renderExtract(); const s = q("#" + P + "-exSrc"); if (s) s.focus(); }
  }
  function grow(t) { t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 160) + "px"; }
  function onInput(e) { if (e.target === ask) grow(ask); else if (rq && e.target === rq) { renderRail(); rq.focus(); } }
  function onKey(e) {
    const t = e.target;
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing && e.keyCode !== 229) {
      if (t === ask) { e.preventDefault(); if (!S.streaming || ask.value.trim()) composer.requestSubmit(); return; }
      if (t.dataset && t.dataset.enter === "hero") { e.preventDefault(); t.form.requestSubmit(); return; }
      if (t.dataset && t.dataset.exadd) { e.preventDefault(); const v = t.value.trim(); if (v) { S.ex.fields.push(v); renderExtract(); q("#" + P + "-exAdd").focus(); } return; }
    }
    if (t.dataset && t.dataset.rn) { if (e.key === "Enter") { e.preventDefault(); endRename(true); } else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); endRename(false); } return; }
    if (t.getAttribute && t.getAttribute("role") === "tab" && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      const i = tabs.indexOf(t), n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length]; setView(n.dataset.v); n.focus(); return;
    }
    if (!menu.hidden && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault(); const it = Array.from(menu.querySelectorAll("button")), k = it.indexOf(activeEl()); it[(k + (e.key === "ArrowDown" ? 1 : it.length - 1)) % it.length].focus(); return;
    }
    if (e.key === "Escape" && rq && t === rq && !(page && narrow() && rail.classList.contains("drawer"))) {
      // Esc in Search chats: clear the search, then leave the box
      e.preventDefault(); e.stopPropagation();
      if (rq.value) { rq.value = ""; renderRail(); rq.focus(); return; }
      const back = searchOpener && searchOpener.isConnected && searchOpener !== rq ? searchOpener : (chat() ? ask : q("." + P + "-hq")) || q("#" + P + "-sb");
      if (back && back.offsetParent !== null) back.focus(); else rq.blur();
      return;
    }
    if (e.key === "Escape") { if (escTop()) { e.preventDefault(); e.stopPropagation(); } return; }
    if (e.key === "Tab") {
      const box = !drawer.hidden && drawer.classList.contains("sheet") ? drawer : page && rail.classList.contains("drawer") ? rail : !menu.hidden ? menu : null;
      if (!box) return;
      if (box === menu) { closeMenu(true); return; }
      const f = Array.from(box.querySelectorAll("a[href],button:not([disabled]),input,textarea,select")).filter((x) => x.offsetParent !== null); if (!f.length) return;
      const ae = activeEl();
      if (e.shiftKey && ae === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && ae === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      else if (!box.contains(ae)) { e.preventDefault(); f[0].focus(); }
    }
  }
  function escTop() { return closeMenu(true) || (!pop.hidden && (hidePop(), true)) || closeDrawer() || closeRailDrawer(); }
  function onFocusOut(e) { if (e.target.dataset && e.target.dataset.rn) setTimeout(() => { if (rail.querySelector("[data-rn]")) endRename(true); }, 0); }
  function onOver(e) { const b = e.target.closest && e.target.closest(".cite"); if (b && !phone() && page) { clearTimeout(popT); popT = setTimeout(() => showPop(b), 140); } }
  function onOut(e) { if (e.target.closest && e.target.closest(".cite")) { clearTimeout(popT); popT = setTimeout(hidePop, 240); } }
  function onFocusIn(e) { const b = e.target.closest && e.target.closest(".cite"); if (b && !phone() && page && e.target.matches(":focus-visible")) showPop(b); }
  function onThreadFocusOut(e) { if (e.target.closest && e.target.closest(".cite")) hidePop(); }

  root.addEventListener("click", onClick);
  root.addEventListener("submit", onSubmit);
  root.addEventListener("change", onChange);
  root.addEventListener("input", onInput);
  root.addEventListener("keydown", onKey);
  root.addEventListener("focusout", onFocusOut);
  thread.addEventListener("mouseover", onOver);
  thread.addEventListener("mouseout", onOut);
  thread.addEventListener("focusin", onFocusIn);
  thread.addEventListener("focusout", onThreadFocusOut);
  pop.addEventListener("mouseenter", () => clearTimeout(popT));
  pop.addEventListener("mouseleave", () => { popT = setTimeout(hidePop, 240); });
  chatScroll.addEventListener("scroll", () => { if (!pop.hidden) hidePop(); }, {passive: true});
  const onResize = () => { hidePop(); closeMenu(); if (!narrow()) closeRailDrawer(); };
  const onDocKey = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); return; }
    if (e.key === "Escape" && !root.contains(e.target) && escTop()) e.preventDefault();
  };
  if (page) { addEventListener("resize", onResize); document.addEventListener("keydown", onDocKey); }

  /* ---------- start */
  try { const s = JSON.parse(lsGet(SRC_KEY) || "null"); if (s && s.kb_id && s.kind) S.src = s; } catch (e) { /* none saved */ }
  const ticker = setInterval(() => { if (S.server !== "ready") qa(".wake .tm, .crawlc .tm").forEach((t) => { t.textContent = clock(Date.now() - (wakeStart || Date.now())); }); }, 1000);
  renderAll();
  getExamples(api).then((ex) => {
    S.examples = ex || [];
    if (opts.kb) { const e = exampleOf(opts.kb); S.src = e ? srcFromExample(e) : {kb_id: opts.kb, kind: "site", label: hostOf(opts.site || ""), url: opts.site || "", pages: 0}; }
    else if (!S.src || (S.src.kind === "example" && !exampleOf(S.src.kb_id))) { if (S.examples[0]) S.src = srcFromExample(S.examples[0]); }
    renderAll(); emit("ready", {examples: S.examples.length});
    if (!opts.kb && opts.site && mode === "widget") {
      // reuse the site this browser read in the last 50 minutes (the server keeps it 1 hour; kb_expired re-reads it)
      const want = normUrl(opts.site), sv = S.src;
      const fresh = sv && sv.kind === "site" && (sv.input === want || sv.url === want) && sv.at && Date.now() - sv.at < 50 * 60e3;
      if (fresh) emit("kb", {...sv, reused: true}); else readSource({url: want});
    }
  });
  wakeStart = Date.now();
  checkHealth(api, 6000).then((ok) => {
    if (ok) setServer("ready");
    else { S.server = "waking"; emit("server", "waking"); ensureWake(); renderAll(); }
  });

  return {
    ask: (text) => askText(text, "api"),
    pick: pickExample,
    readUrl: (url) => readSource({url: normUrl(url)}),
    newChat,
    open(id) { if (!S.chats.some((c) => c.id === id)) return false; S.active = id; S.view = "chat"; renderAll(); chatScroll.scrollTop = 0; return true; },
    get state() { return S; },
    destroy() {
      stop(); clearInterval(ticker); clearInterval(wakeT); wakeT = null; clearInterval(toastIv);
      if (readCtrl) { const rc = readCtrl; readCtrl = null; rc.abort(); } S.crawl = null; readyWaiters = [];
      if (page) { removeEventListener("resize", onResize); document.removeEventListener("keydown", onDocKey); }
      root.replaceChildren();
    },
  };
}

/** One session id per browser for calls outside a chat (extract). */
history.sessionId = function () {
  let s = lsGet("sc-session");
  if (!s) { s = "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); lsSet("sc-session", s); }
  return s;
};
