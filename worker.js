const ALLOWED_ORIGIN = "https://hamzabicheri481-sys.github.io";

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

    try {
      const body = await request.json();
      const { imageBase64, mimeType, symbol, timeframe, style, risk } = body || {};
      if (!imageBase64 || !["image/png", "image/jpeg", "image/webp"].includes(mimeType)) {
        return json({ error: "Please send a PNG, JPG or WEBP chart image." }, 400, cors);
      }
      if (imageBase64.length > 7_000_000) return json({ error: "Image is too large. Please use a smaller screenshot." }, 413, cors);

      const instruction = `You are NOVA AI, a cautious technical-chart analysis assistant. Analyze only what is visible in the supplied chart image.
Market: ${String(symbol || "unspecified").slice(0,30)}
Timeframe: ${String(timeframe || "unspecified").slice(0,10)}
Trading style: ${String(style || "unspecified").slice(0,40)}
Risk preference: ${String(risk || "unspecified").slice(0,30)}

Respond in clear Moroccan Arabic (Darija), using these headings:
1) الاتجاه والبنية الظاهرة
2) مناطق الدعم والمقاومة / السيولة إن كانت واضحة
3) السيناريو الصاعد والسيناريو الهابط
4) خطة محتملة: منطقة دخول فقط إذا كانت واضحة، شرط التأكيد، وقف الخسارة المنطقي، والأهداف المحتملة
5) متى لا ندخل؟ وما الذي يبطل الفكرة؟

Strict rules:
- Never invent current price, candles, indicators, levels, news, or chart details that are not readable.
- If price scale, symbol, or chart is unclear, say so and ask for a clearer screenshot.
- Do not force a BUY or SELL. "No trade / wait" is a valid and often preferred result.
- Distinguish observation from hypothetical scenario. Give entry as a zone only when the chart supports it; otherwise say no reliable entry.
- Explain that a screenshot alone cannot confirm live market conditions. Do not promise profit or certainty.
- This is educational analysis, not personalized financial advice. Warn that leverage can cause rapid losses.
- Do not tell the user to risk a fixed lot size or a percentage of their account.`;

      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + encodeURIComponent(env.GEMINI_API_KEY), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [
            { text: instruction },
            { inline_data: { mime_type: mimeType, data: imageBase64 } }
          ]}],
          generationConfig: { temperature: 0.2, maxOutputTokens: 1200 }
        })
      });
      const data = await response.json();
      if (!response.ok) {
        return json({ error: "AI provider request failed. Check API key and model access." }, 502, cors);
      }
      const answer = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("\\n").trim();
      if (!answer) return json({ error: "The AI did not return an analysis. Try a clearer chart." }, 502, cors);
      return json({ analysis: answer }, 200, cors);
    } catch (error) {
      return json({ error: "Could not process this chart. Please try again." }, 400, cors);
    }
  }
};

function json(data, status, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers }
  });
}
