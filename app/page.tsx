"use client";

import { useState, useRef, useEffect } from "react";
import ThemeToggle from "./components/ThemeToggle";

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
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="h-[100dvh] w-full flex flex-col items-center p-4 overflow-hidden overscroll-none">
      
      {/* --- EN-TÊTE --- */}
      <header className="w-full max-w-2xl flex items-center justify-between mb-2 pt-2 shrink-0 z-10">
        
        {/* Espaceur gauche */}
        <div className="w-16"></div>

        {/* Liens Centraux */}
        <div className="flex gap-6">
          <a 
            href="https://www.linkedin.com/in/charlesbonn3t/" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full opacity-60 hover:opacity-100 hover:bg-[var(--user-bg)] transition-all text-[var(--foreground)] hover:text-[var(--accent)]"
            title="LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          
          <a 
            href="mailto:charles.bonnet@pm.me" 
            className="flex items-center justify-center w-10 h-10 rounded-full opacity-60 hover:opacity-100 hover:bg-[var(--user-bg)] transition-all text-[var(--foreground)] hover:text-[var(--accent)]"
            title="Email"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
          </a>
        </div>

        {/* Switch Dark Mode */}
        <div className="w-16 flex justify-end">
          <ThemeToggle />
        </div>
      </header>


      {/* --- ZONE DE CHAT --- */}
      <div className="w-full max-w-2xl flex flex-col gap-4 flex-1 min-h-0">

        {/* Historique */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col">
          <div className="mt-auto flex flex-col space-y-6">
            
            {messages.length === 0 && !loading && (
              <div className="text-center opacity-40 text-sm italic py-10 px-4">
                Je suis le clone numérique de Charles à votre service : posez-moi vos questions.
              </div>
            )}
            
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                
                {/* AVATAR (CORRIGÉ EN .PNG) */}
                {m.role === "assistant" && (
                  <img 
                    src="/avatar.png" 
                    alt="IA" 
                    className="w-8 h-8 rounded-full object-cover mt-1 border border-black/10 dark:border-white/10 shrink-0"
                  />
                )}

                <div 
                  data-role={m.role} 
                  className={m.role === "user" ? "max-w-[85%]" : "max-w-full"}
                >
                  {m.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-4 justify-start">
                 {/* Avatar PNG pendant le chargement aussi */}
                 <img 
                    src="/avatar.png" 
                    alt="IA" 
                    className="w-8 h-8 rounded-full object-cover mt-1 opacity-50 shrink-0"
                  />
                <div className="text-sm opacity-50 animate-pulse pt-2">
                  Réflexion...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative w-full mb-2 shrink-0">
          <input
            className="w-full outline-none pr-14"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écrivez votre message..."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 flex items-center justify-center disabled:opacity-50 transition-transform active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateX(-1px) translateY(1px)' }}>
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>

      </div>
    </main>
  );
}
