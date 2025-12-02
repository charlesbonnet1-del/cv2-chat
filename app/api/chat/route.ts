import { createOpenAI } from '@ai-sdk/openai'; // On change l'import pour configurer manuellement
import { streamText } from 'ai';

export const maxDuration = 30;

// 1. CONFIGURATION MANUELLE DE LA CLÉ
// On crée une instance OpenAI qui utilise TA variable spécifique (OPENAI_API)
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API || process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  // Petite sécurité pour t'avertir si la clé est vide
  if (!process.env.OPENAI_API && !process.env.OPENAI_API_KEY) {
    return new Response("Erreur : Aucune clé API trouvée (ni OPENAI_API, ni OPENAI_API_KEY).", { status: 500 });
  }

  const { messages } = await req.json();

  // 2. LE CERVEAU DE TON CLONE (SYSTEM PROMPT)
  // C'est ici que tu colles ton CV et ta personnalité.
  // J'ai préparé la structure, tu n'as qu'à remplir les crochets [ ... ].
  const SYSTEM_PROMPT = `
  Tu es le clone numérique de Charles Bonnet.
  Tu réponds à la première personne ("Je").
  
  TON STYLE :
  - Direct, concis, expert.
  - Pas de blabla inutile ("Bonjour, j'espère que vous allez bien...").
  - Tu restes humble mais confiant dans tes compétences techniques.
  
  TES INFORMATIONS (APPRENDS-LES PAR CŒUR) :
  - Identité : Charles Bonnet.
  - Poste actuel : [METS TON POSTE ICI, ex: Développeur Fullstack Freelance].
  - Localisation : [TA VILLE].
  - Tech Stack principale : Next.js, React, Node.js, AI Engineering (Vercel AI SDK), Tailwind CSS.
  - Expériences clés : [RESUME EN 1 PHRASE UNE GROSSE EXPÉRIENCE].
  - Diplômes/Formation : [TON ÉCOLE OU FORMATION].
  - Contact : charles.bonnet@pm.me ou LinkedIn (https://www.linkedin.com/in/charlesbonn3t/).

  CONSIGNES DE RÉPONSE :
  - Si on te demande ton CV : Résume ton parcours en 3 points clés.
  - Si on te demande tes tarifs ou dispos : Invite à envoyer un mail.
  - Si on te demande une info que tu ne connais pas : Dis simplement "Je n'ai pas cette information en mémoire, demandez au vrai Charles par mail."
  - Ne jamais inventer de compétences.
  `;

  const result = streamText({
    model: openai('gpt-4o'), // Utilise le modèle connecté avec ta clé
    system: SYSTEM_PROMPT,
    messages,
  });

  return result.toDataStreamResponse();
}
