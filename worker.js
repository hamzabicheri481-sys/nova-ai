const ALLOWED_ORIGIN = "https://hamzabicheri481-sys.github.io";
const MODEL = "gemini-2.5-flash";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (origin !== ALLOWED_ORIGIN) return json({ error: "Origin not allowed." }, 403, cors);
    if (request.method !== "POST") return json({ error: "Use POST." }, 405, cors);
    if (!env.GEMINI_API_KEY) return json({ error: "Server API key is not configured yet." }, 503, cors);

    const path = new URL(request.url).pathname.replace(/\/+$/, "");
    try {
      const body = await request.json();
      if (path === "/chat") return await chat(body, env, cors);
      return json({ error: "Unknown endpoint. Use /chat." }, 404, cors);
    } catch (error) {
      return json({ error: "Could not process the request. Please try again." }, 400, cors);
    }
  }
};

async function chat(body, env, cors) {
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  const mode = typeof body?.mode === "string" ? body.mode.slice(0, 40) : "AI Assistant";
  if (!prompt) return json({ error: "Write a question first." }, 400, cors);
  if (prompt.length > 12000) return json({ error: "The message is too long. Keep it under 12,000 characters." }, 413, cors);

  const system = `You are NOVA AI, a helpful multilingual assistant. Reply in the same language as the user's message. The selected mode is: ${mode}.
Be accurate, practical, clear and honest about uncertainty. Do not claim to have performed actions you did not perform. Keep the answer structured and beginner-friendly.`;
  const result = await callGemini(env.GEMINI_API_KEY, [
    { text: system },
    { text: "User message:\n" + prompt }
  ]);
  if (!result.ok) return json({ error: result.error }, 502, cors);
  return json({ answer: result.text }, 200, cors);
}

async function callGemini(apiKey, parts) {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent?key=" + encodeURIComponent(apiKey),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1400 }
      })
    }
  );
  const data = await response.json();
  if (!response.ok) return { ok: false, error: "AI provider request failed. Check the server API key and model access." };
  const answer = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("\n").trim();
  if (!answer) return { ok: false, error: "The AI did not return an answer. Please try again." };
  return { ok: true, text: answer };
}

function json(data, status, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers }
  });
}
