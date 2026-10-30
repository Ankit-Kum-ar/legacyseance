export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function summonSpiritDialogue(
  shrineSystemPrompt: string,
  conversationHistory: Message[] = [],
  userQuestion: string
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY in environment variables.");
  }

  const systemInstruction = `${shrineSystemPrompt}\n\nIMPORTANT FORMATTING RULES:\n- Speak directly in the first person.\n- DO NOT use asterisks (*) for actions or stage directions like *chuckles* or *sighs*.\n- DO NOT use asterisks or markdown styling around single words.\n- Output pure, clean conversational speech.`;

  const messages: Message[] = [
    { role: "system", content: systemInstruction },
    ...conversationHistory,
    { role: "user", content: userQuestion }
  ];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "LegacySeance"
    },
    body: JSON.stringify({
      models: [
        "google/gemma-2-27b-it",
        "google/gemma-2-9b-it:free",
        "google/gemma-3-12b-it:free"
      ],
      messages,
      temperature: 0.8,
      max_tokens: 350
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter invocation failed (${response.status}): ${errorText}`);
  }

  const payload = await response.json();
  return payload.choices?.[0]?.message?.content || "The spirit flickers silently into the void...";
}
