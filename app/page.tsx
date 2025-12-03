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
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll automatique
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus au démarrage
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100); 
    return () => clearTimeout(timer);
  }, []);

  // Fonction d'envoi (modifiée pour accepter un texte direct via les boutons)
  async function handleSend(textOverride?: string) {
    // Si on a un override (clic bouton), on l'utilise, sinon on prend l'input
    const textToSend = textOverride || input;

    if (!textToSend.trim()) return;

    // 1. Ajout message utilisateur
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: textToSend },
    ];
    setMessages(newMessages);
    setInput(""); // Reset de l'input visuel
    setLoading(true);

    try {
      // 2. Appel API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      
      const data = await res.json();
      const reply = data.reply || "Je ne peux pas répondre pour l'instant.";

      // 3. Réponse bot
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: "assistant", content: "Erreur de connexion. Veuillez réessayer." }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  return (
    <main className="h-[100dvh] w-full flex flex-col items-center p-4 pb-6 overflow-hidden overscroll-none bg-[var(--background)] text-[var(--foreground)] font-mono transition-colors duration-300">
      
      {/* --- EN-TÊTE --- */}
      <header className="w-full max-w-2xl flex items-center justify-between mb-4 pt-2 shrink-0 z-10">
        <div className="w-16"></div>
        <div className="flex gap-4">
          <a 
            href="https://www.linkedin.com/in/charlesbonn3t/" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--bot-bubble-bg)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all text-[var(--foreground)]"
            title="LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a 
            href="mailto:charles.bonnet@pm.me" 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--bot-bubble-bg)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all text-[var(--foreground)]"
            title="Email"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
          </a>
        </div>
        <div className="w-16 flex justify-end">
          <ThemeToggle />
        </div>
      </header>

      {/* --- ZONE DE CHAT --- */}
      <div className="w-full max-w-2xl flex flex-col gap-4 flex-1 min-h-0">

        {/* Historique */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col">
          <div className="mt-auto flex flex-col space-y-6 pb-4">
            
            {/* Intro (disparaît dès qu'il y a un message) */}
            {messages.length === 0 && !loading && (
              <div className="text-center opacity-40 text-sm italic py-20 px-4 font-mono">
                I am Charles' digital clone. Ask me anything.<br/>
                Je suis le clone numérique de Charles. Posez vos questions.
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <img src="/avatar.png" alt="IA" className="w-8 h-8 rounded-full object-cover mt-1 border border-black/10 dark:border-white/10 shrink-0 grayscale opacity-80" />
                )}
                <div 
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm font-mono ${m.role === "user" ? "rounded-br-none" : "rounded-bl-none whitespace-pre-wrap"}`}
                  style={{
                    backgroundColor: m.role === "user" ? "var(--user-bubble-bg)" : "var(--bot-bubble-bg)",
                    color: m.role === "user" ? "var(--user-bubble-text)" : "var(--bot-bubble-text)"
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-4 justify-start animate-in fade-in duration-300">
                 <img src="/avatar.png" alt="IA" className="w-8 h-8 rounded-full object-cover mt-1 opacity-50 shrink-0 grayscale" />
                <div 
                  className="flex items-center gap-1 h-10 px-4 rounded-full rounded-bl-none"
                  style={{ backgroundColor: "var(--bot-bubble-bg)" }}
                >
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* --- SUGGESTION CHIPS (SANS DRAPEAUX) --- */}
        {messages.length === 0 && !loading && (
          <div className="flex gap-2 justify-center pb-2 flex-wrap">
            <button 
              onClick={() => handleSend("Peux-tu me résumer ton parcours ?")}
              className="px-4 py-2 bg-[var(--bot-bubble-bg)] hover:bg-[var(--accent)] hover:text-white text-xs rounded-full transition-all border border-black/5 dark:border-white/5"
            >
              Peux-tu me résumer ton parcours ?
            </button>
            <button 
              onClick={() => handleSend("Tell me about your key achievements.")}
              className="px-4 py-2 bg-[var(--bot-bubble-bg)] hover:bg-[var(--accent)] hover:text-white text-xs rounded-full transition-all border border-black/5 dark:border-white/5"
            >
              Tell me about your key achievements.
            </button>
          </div>
        )}

        {/* BARRE DE SAISIE */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative w-full mb-2 shrink-0">
          <input
            ref={inputRef}
            className="w-full outline-none pr-14 bg-transparent placeholder:opacity-40 font-mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question... / Posez votre question..." 
            disabled={loading}
            autoFocus 
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 p-2 flex items-center justify-center disabled:opacity-30 transition-all rounded-full hover:bg-[var(--bot-bubble-bg)]"
            style={{ color: "var(--accent)" }}
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
