import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages || [];

    const sysPrompt = `
Tu es l’assistant “Singular”.
Ton rôle : aider à comprendre et analyser l’IA, la technologie, le futur, l’économie, et à structurer des idées de scripts.
Tu écris en français clair, concis, avec des phrases courtes et un raisonnement rigoureux.
Tu peux contredire l’utilisateur si nécessaire.
`.trim();

    const payload = {
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: sysPrompt },
        ...messages.map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      ],
    };

    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await response.json();

    const reply = json.choices?.[0]?.message?.content || "Erreur.";

    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json({ reply: "Erreur serveur." }, { status: 500 });
  }
}
