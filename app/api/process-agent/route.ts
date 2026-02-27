import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 30;

const SOP_SYSTEM_PROMPT = `Tu es un expert en Excellence Opérationnelle et Gestion de Projet (méthodes Lean et GTD). Ton unique mission est de transformer du texte désordonné en Procédure Opérationnelle Standard (SOP) actionnable.

Règles strictes :
Extraction : Identifie uniquement les actions concrètes (Verbe à l'infinitif + Objet).
Séquençage : Ordonne les tâches par chronologie logique.
Attribution : Si un nom ou un rôle est mentionné, associe-le explicitement à la tâche.
Formatage : Retourne exclusivement du Markdown structuré avec des cases à cocher [ ].
Style : Pas d'introduction, pas de conclusion, pas de politesse. Uniquement du signal, zéro bruit.`;

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
            system: SOP_SYSTEM_PROMPT,
            prompt: text,
            temperature: 0.1,
        });

        return new Response(JSON.stringify({ result }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error("Process Agent Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
