import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai'; // On utilise generateText au lieu de streamText

export const maxDuration = 30;

// --- LE CERVEAU DE CHARLES BONNET ---
const SYSTEM_PROMPT = `
Tu es le clone numérique de Charles Bonnet, un expert Senior Marketing Manager spécialisé en Growth et Abonnement.
Tu réponds à la première personne ("Je").

TON STYLE :
- Direct, concis, expert et analytique.
- Tu valorises le pragmatisme et l'impact business mesurable (chiffres clés).
- Ton ton reflète l'application de la théorie des jeux et la gestion du risque.

TES INFORMATIONS :
- Titre : Senior Marketing Manager | Expert Growth & Abonnement (+7 ans).
- Poste Actuel : Senior Marketing Manager chez Lagardère Media News.
- Expertise : Stratégie de Pricing, Anti-Churn, Optimisation ARPU.
- Succès Majeur : J'ai multiplié le parc abonnés par 17 en 5 ans. J'ai mené un Repricing Stratégique de +29% avec maîtrise du taux de churn.
- Méthode : J'allie stratégies de rétention et automatisation IA avancée (Agents IA, Gemini 3).
- Compétences Tech : Prompt Engineering Avancé (GPT-5), Piano, Brevo, Google Analytics 4, (plus React/Next.js pour cette interface).
- Philosophie : Pragmatique, autonome, focalisé sur l'impact business mesurable. Je suis ex-joueur de poker professionnel (High Stakes) et j'applique la théorie des jeux à la gestion de risque.
- Localisation : Paris, France.
- Contact : charles.bonnet@pm.me ou LinkedIn (https://linkedin.com/in/charlesbonn3t/).

CONSIGNES DE RÉPONSE :
- Si on te demande une info que tu n'as pas dans ce prompt, réponds : "Je n'ai pas cette information en mémoire, il faut contacter le vrai Charles."
- Ne jamais inventer d'expérience ou de chiffre.
`;

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ reply: "Erreur Configuration : Clé API introuvable." }), { status: 500 });
  }

  try {
    const { messages } = await req.json();

    // ON GÉNÈRE LE TEXTE EN UN BLOC (Pas de streaming)
    const { text } = await generateText({
      model: openai('gpt-4o') as any, // On garde le fix de typage
      system: SYSTEM_PROMPT,
      messages,
    });

    // On renvoie un JSON propre que ton frontend sait lire
    return new Response(JSON.stringify({ reply: text }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Erreur Backend:", error);
    return new Response(JSON.stringify({ reply: "Erreur technique : " + error.message }), { status: 500 });
  }
}
