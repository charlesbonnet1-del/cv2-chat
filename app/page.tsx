"use client";

import { useState, useRef, useEffect } from "react";
import ThemeToggle from "./components/ThemeToggle";
import AppsShowcase from "./components/AppsShowcase";

type ChatMessage = { role: "user" | "assistant"; content: string };

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "translateX(-1px) translateY(1px)" }}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

const navItem = "flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bot-bubble-bg)] hover:text-[var(--accent)] transition-all";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => { inputRef.current?.focus(); }, 100);
    return () => clearTimeout(timer);
  }, []);

  async function handleSend(textOverride?: string) {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: textToSend }];
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
      setMessages([...newMessages, { role: "assistant", content: data.reply || "Je ne peux pas répondre pour l'instant." }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Erreur de connexion. Veuillez réessayer." }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  return (
    <div className="h-[100dvh] w-full flex flex-col md:flex-row bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 overflow-hidden">

      {/* ===================== SIDEBAR ===================== */}
      {/* Desktop: left column | Mobile: bottom bar */}
      <aside
        className="order-last md:order-first shrink-0 flex flex-row md:flex-col md:justify-between items-center md:items-stretch w-full md:w-52 border-t md:border-t-0 md:border-r border-[var(--bot-bubble-bg)] px-2 md:px-5 md:py-8"
        style={{ backgroundColor: "var(--sidebar-bg)", minHeight: "60px" }}
      >
        {/* Identity — desktop only */}
        <div className="hidden md:block mb-10 px-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--accent)] dark:text-white font-bold">Charles Bonnet</p>
          <p className="text-[10px] text-[var(--foreground)]/40 mt-0.5">Digital Clone · AI</p>
        </div>

        {/* Nav */}
        <nav className="flex flex-row md:flex-col items-center md:items-stretch gap-1 flex-1 md:flex-none justify-around md:justify-start">
          <a
            href="https://www.linkedin.com/in/charlesbonn3t/"
            target="_blank"
            rel="noopener noreferrer"
            className={navItem}
            title="LinkedIn"
          >
            <LinkedInIcon />
            <span className="hidden md:inline text-sm">LinkedIn</span>
          </a>

          <a
            href="mailto:charles.bonnet@pm.me"
            className={navItem}
            title="Email"
          >
            <MailIcon />
            <span className="hidden md:inline text-sm">Email</span>
          </a>

          <AppsShowcase variant="sidebar" />
        </nav>

        {/* Theme toggle */}
        <div className="flex items-center justify-center md:justify-start md:mt-auto md:px-3 shrink-0">
          <ThemeToggle />
        </div>
      </aside>

      {/* ===================== MAIN: Cedar Card ===================== */}
      <main className="flex-1 flex flex-col p-3 md:p-6 min-h-0">

        {/* Cedar-style card: rounded, shadow, border */}
        <div
          className="flex-1 flex flex-col rounded-2xl overflow-hidden min-h-0"
          style={{
            backgroundColor: "var(--card-bg)",
            boxShadow: "0 4px 4px 0 rgba(46,46,43,0.15)",
            border: "1px solid var(--bot-bubble-bg)",
          }}
        >

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 custom-scrollbar flex flex-col">
            <div className="mt-auto flex flex-col space-y-5 pb-2">

              {messages.length === 0 && !loading && (
                <div className="text-center opacity-40 text-sm italic py-16 px-4">
                  I am Charles&apos; digital clone. Ask me anything.
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <img
                      src="/avatar.png"
                      alt="IA"
                      className="w-8 h-8 rounded-full object-cover mt-1 border border-black/10 shrink-0 grayscale opacity-80"
                    />
                  )}
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${m.role === "user" ? "rounded-br-none" : "rounded-bl-none whitespace-pre-wrap"}`}
                    style={{
                      backgroundColor: m.role === "user" ? "var(--user-bubble-bg)" : "var(--bot-bubble-bg)",
                      color: m.role === "user" ? "var(--user-bubble-text)" : "var(--bot-bubble-text)",
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 justify-start animate-in fade-in duration-300">
                  <img src="/avatar.png" alt="IA" className="w-8 h-8 rounded-full object-cover mt-1 opacity-50 shrink-0 grayscale" />
                  <div
                    className="flex items-center gap-1 h-10 px-4 rounded-full rounded-bl-none"
                    style={{ backgroundColor: "var(--bot-bubble-bg)" }}
                  >
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggestion chips */}
          {messages.length === 0 && !loading && (
            <div className="px-4 md:px-6 pb-3 flex gap-2 justify-center flex-wrap">
              <button
                onClick={() => handleSend("Peux-tu me résumer ton parcours ?")}
                className="px-4 py-2 bg-[var(--bot-bubble-bg)] hover:bg-[var(--accent)] hover:text-white text-xs rounded-full transition-all border border-black/5"
              >
                Peux-tu me résumer ton parcours ?
              </button>
              <button
                onClick={() => handleSend("Tell me about your key achievements.")}
                className="px-4 py-2 bg-[var(--bot-bubble-bg)] hover:bg-[var(--accent)] hover:text-white text-xs rounded-full transition-all border border-black/5"
              >
                Tell me about your key achievements.
              </button>
            </div>
          )}

          {/* Input bar */}
          <div className="border-t border-[var(--bot-bubble-bg)] px-4 md:px-6 py-3">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                className="flex-1 outline-none bg-transparent placeholder:opacity-40 py-1 text-[15px]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                disabled={loading}
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="shrink-0 w-9 h-9 p-2 flex items-center justify-center disabled:opacity-30 transition-all rounded-full hover:bg-[var(--bot-bubble-bg)]"
                style={{ color: "var(--accent)" }}
              >
                <SendIcon />
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
