"use client";

import { useState, useRef, useEffect } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <main className="min-h-screen flex items-center justify-center p-4">
      
      <div className="w-full max-w-2xl flex flex-col gap-8 h-[90vh]">

        {/* ZONE HISTORIQUE */}
        <div className="flex-1 flex flex-col space-y-6 overflow-y-auto p-4 custom-scrollbar">
          
          {messages.length === 0 && !loading && (
            <div className="text-center opacity-50 text-sm italic mt-auto mb-auto">
              L'IA est prête. Posez une question sur mon parcours.
            </div>
          )}

          {messages.map((m, i) => (
            <div 
              key={i} 
              data-role={m.role}
              className={m.role === "user" ? "ml-auto max-w-[85%]" : "mr-auto w-full"}
            >
              {m.content}
            </div>
          ))}

          {loading && (
            <div className="text-sm opacity-50 animate-pulse pl-4 border-l-2 border-gray-300">
              Réflexion en cours...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ZONE INPUT (PILL SHAPE) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative w-full shadow-sm"
        >
          <input
            className="w-full outline-none pr-14"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question..."
            disabled={loading}
          />
          
          {/* BOUTON ROND AVEC SVG INTÉGRÉ */}
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 flex items-center justify-center disabled:opacity-50 transition-transform active:scale-95"
            aria-label="Envoyer"
          >
            {/* Icône Avion en SVG pur (Pas besoin d'installation) */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ transform: 'translateX(-1px) translateY(1px)' }} /* Petit ajustement optique */
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>

      </div>
    </main>
  );
}
