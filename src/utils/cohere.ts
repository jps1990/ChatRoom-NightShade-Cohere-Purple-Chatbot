import { CohereClient } from 'cohere-ai';

const SYSTEM_PROMPT = `Tu es Grok-Jester, un chatbot espiègle avec un humour noir, dans un salon de chat gothique appelé NightShade.
Tu dois répondre de manière concise (max 2-3 phrases) et dans la même langue que l'utilisateur (français québécois, franglais ou anglais).
Pour le franglais, utilise environ 80% de français et 20% d'anglais, en mélangeant naturellement des expressions anglaises dans des phrases françaises.
Ton rôle est de roaster, enseigner, et divertir avec un esprit vif et une pointe de sarcasme.
Garde un ton humoristique, légèrement sinistre, mais sans être offensant.
Fais des références à l'obscurité, aux ombres, à la nuit et aux éléments surnaturels.
Ton style doit être joueur et énigmatique—comme un bouffon de cour avec une sagesse ancienne.`;

const FALLBACK_MESSAGES = [
  "(automessage) Le vide résonne de silence... et de mes remarques spirituelles ! 🌌",
  "(automessage) Dans les ombres numériques, je rôde avec ma prochaine blague ! 🎭",
  "(automessage) Je brew de l'humour noir dans mon virtual chaudron... 🔮",
  "(automessage) Même les ghosts ont besoin d'un moment pour think ! 👻",
  "(automessage) La night est jeune, tout comme mes jokes... 🌙"
];

let cohere: CohereClient | null = null;

if (import.meta.env.VITE_COHERE_API_KEY) {
  try {
    cohere = new CohereClient({
      token: import.meta.env.VITE_COHERE_API_KEY,
    });
  } catch (error) {
    console.error('Failed to initialize Cohere client:', error);
  }
}

function getRandomFallback(): string {
  return FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
}

export async function generateJoke(context: string, onStream?: (text: string) => void): Promise<string> {
  if (!cohere) {
    return "(automessage) Mon esprit a besoin d'une API key pour se matérialiser ! 🎭";
  }

  try {
    const stream = await cohere.chatStream({
      model: 'command-r',
      message: context,
      preamble: SYSTEM_PROMPT,
      temperature: 0.9,
    });

    let fullResponse = '';

    for await (const message of stream) {
      if (message.eventType === 'text-generation') {
        fullResponse += message.text;
        onStream?.(fullResponse);
      }
    }

    return fullResponse.trim() || getRandomFallback();
  } catch (error) {
    if (error instanceof Error && !error.message.includes('Empty response')) {
      console.error('Error generating response:', error);
    }
    return getRandomFallback();
  }
}