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

  // Fonction d'envoi
  async function handleSend(textOverride?: string) {
    const textToSend = textOverride || input;

    if (!textToSend.trim()) return;

    // 1. Ajout message utilisateur
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: textToSend },
    ];
    setMessages(newMessages);
    setInput(""); 
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
      <header className="w-full max-w-2xl
