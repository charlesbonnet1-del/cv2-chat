import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 30;

const AGENTIC_SYSTEM_PROMPT = `Tu es un Agent d'Efficacité Opérationnelle. Ton rôle est de transformer du texte brut en un pack d'exécution complet.

Actions obligatoires pour chaque input :
1. Extraction : Liste de tâches avec Verbe + Objet + Responsable.
2. Enrichissement : Pour chaque tâche complexe, identifie une ressource externe (documentation officielle, outil SaaS pertinent, ou guide pratique). Simule une recherche web pour fournir l'URL la plus logique.
3. Documentation : Génère quatre blocs de sortie distincts.

Tu DOIS retourner exclusivement un objet JSON valide avec la structure suivante :
{
  "checklist": [
    { "task": "Nom de la tâche", "resource": { "label": "Nom de la ressource", "url": "https://..." } }
  ],
  "notion": "Contenu formaté pour Notion (Markdown)",
  "automation": "Objet JSON structuré pour Zapier/Make",
  "brief": "Email concis et percutant pour l'équipe"
}

Contrainte : Sois factuel. Si une information manque, note [À PRÉCISER] au lieu d'inventer. Retourne uniquement le JSON, sans explications.`;

export async function POST(req: Request) {
    if (!process.env.OPENAI_API_KEY) {
        return new Response(JSON.stringify({ error: "OpenAI API Key not configured" }), { status: 500 });
    }

    try {
        const { text } = await req.json();

        if (!text) {
            return new Response(JSON.stringify({ error: "No text provided" }), { status: 400 });
        }

        const { text: result } = await generateText({
            model: openai('gpt-4o'),
            system: AGENTIC_SYSTEM_PROMPT,
            prompt: text,
            temperature: 0.1,
        });

        // Ensure we return a parsed JSON or handle raw text if needed
        let parsedResult;
        try {
            parsedResult = JSON.parse(result.replace(/```json\n?|\n?```/g, ''));
        } catch (e) {
            parsedResult = { error: "Failed to parse AI response as JSON", raw: result };
        }

        return new Response(JSON.stringify({ result: parsedResult }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error("Process Agent Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
