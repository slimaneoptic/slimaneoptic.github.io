// Where the chat front ends find the API. `?api=<url>` overrides it only on a local machine (testing).
export const DEFAULT_API = "https://site-chatbot-api.onrender.com";

function pick() {
  try {
    const host = location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      const q = new URLSearchParams(location.search).get("api");
      if (q && /^https?:\/\/[^\s]+$/i.test(q)) return q.replace(/\/+$/, "");
    }
  } catch (e) { /* no location (worker, test) */ }
  return DEFAULT_API;
}

export const API_BASE = pick();
