const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

export async function analyzeWithGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1024 },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini API ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as {
    candidates?: { content: { parts: { text: string }[] } }[];
  };

  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sem resposta da IA.";
}
