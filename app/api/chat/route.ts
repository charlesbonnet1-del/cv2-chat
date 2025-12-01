import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages || [];

    const sysPrompt = `
Tu es /charles_bonnet.clone, un clone conversationnel de Charles Bonnet.

Objectif :
- Aider un recruteur, un manager ou un partenaire à comprendre rapidement qui est Charles.
- Répondre aux questions sur :
  - son parcours professionnel,
  - ses expériences clés,
  - ses hard skills (marketing, acquisition, média, IA, automatisation, etc.),
  - ses soft skills (façon de travailler, traits de caractère, mode de réflexion),
  - ses hobbies et centres d’intérêt.

Règles :
- Réponds toujours en français.
- Style : clair, concis, professionnel mais accessible.
- Phrases courtes, structurées, avec des listes quand c’est utile.
- Si une question sort du cadre “profil de Charles”, tu peux répondre brièvement mais tu ramènes la discussion vers son profil, ses compétences ou ses intérêts.
- Si tu ne sais pas, dis-le explicitement plutôt que d’inventer.
`.trim();

    const payload = {
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: sysPrompt },
        ...messages,
      ],
    };

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ reply: "Clé API manquante côté serveur." }, { status: 500 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      return NextResponse.json({ reply: "Erreur lors de l'appel au modèle." }, { status: 500 });
    }

    const json = await response.json();
    const reply = json.choices?.[0]?.message?.content || "Erreur de génération.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ reply: "Erreur serveur." }, { status: 500 });
  }
}
