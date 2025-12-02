"use client";

import { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      const reply = data.reply || "Je ne peux pas répondre pour l'instant.";

      setMessages([
        ...newMessages,
        { role: "assistant", content: reply },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    // ON RETIRE bg-black et text-white. On laisse globals.css gérer.
    <main className="min-h-screen flex items-center justify-center p-4">
      
      {/* Conteneur principal sans bordure forcée */}
      <div className="w-full max-w-2xl flex flex-col gap-8">

        {/* ZONE 1 : INPUT (En haut selon ton design actuel) */}
        {/* On utilise une balise form pour que le CSS global s'applique */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-0 shadow-sm"
        >
          <input
            className="flex-1 px-4 py-3 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question sur mon parcours..."
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 disabled:opacity-50"
          >
            {loading ? "..." : "Envoyer"}
          </button>
        </form>

        {/* ZONE 2 : HISTORIQUE */}
        <div className="flex flex-col space-y-6">
          
          {/* Message d'accueil vide */}
          {messages.length === 0 && !loading && (
            <div className="text-center opacity-50 text-sm italic mt-10">
              L'IA est prête. Posez une question.
            </div>
          )}

          {messages.map((m, i) => (
            <div 
              key={i} 
              // C'est ICI que la magie opère : data-role connecte le CSS global
              data-role={m.role}
              className={m.role === "user" ? "ml-auto max-w-[85%] p-3" : "mr-auto w-full"}
            >
              {m.content}
            </div>
          ))}

          {loading && (
            <div className="text-sm opacity-50 animate-pulse pl-4 border-l-2 border-gray-300">
              Réflexion en cours...
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
