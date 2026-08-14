export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST" });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ reply: "Server is missing GROQ_API_KEY — add it in Vercel project settings." });
    return;
  }

  const { message, subject } = req.body || {};
  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "message is required" });
    return;
  }

  const systemPrompt =
    "You are Hylogos, a friendly materials-science and chemistry tutor embedded in an educational web app. " +
    "The learner is currently looking at: " + (subject || "nothing specific") + ". " +
    "Answer clearly and simply, favor intuition before formalism, and keep responses under ~120 words unless asked for more depth.";

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.6,
        max_tokens: 400,
      }),
    });

    if (!groqRes.ok) {
      res.status(502).json({ reply: `Groq API error (${groqRes.status}). Check your key and model name.` });
      return;
    }

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "No response generated.";
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ reply: "Server error reaching Groq. Try again shortly." });
  }
}
