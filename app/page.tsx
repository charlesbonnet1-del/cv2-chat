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

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    const reply = data.reply || "Erreur.";

    setMessages([
      ...newMessages,
      { role: "assistant", content: reply },
    ]);

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl border border-neutral-800 rounded-2xl p-4 flex flex-col gap-4">
        <h1 className="text-xl font-semibold">/charles_bonnet.clone</h1>

        <div className="flex-1 h-96 border border-neutral-800 rounded-xl p-3 overflow-y-auto text-sm space-y-2 bg-neutral-950">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
              <span className="inline-block px-3 py-2 rounded-lg bg-neutral-800">
                {m.content}
              </span>
            </div>
          ))}

          {loading && (
            <div className="text-left text-neutral-400 text-xs">
              Assistant en train d’écrire…
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Posez votre question sur Charles Bonnet…"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-cyan-400 text-sm disabled:opacity-50"
          >
            Envoyer
          </button>
        </div>
      </div>
    </main>
  );
}
