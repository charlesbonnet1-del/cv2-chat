"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "./AppLayout";

export default function ProcessAgent() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const resultRef = useRef<HTMLDivElement>(null);

    const handleConvert = async () => {
        if (!input.trim() || isLoading) return;

        setIsLoading(true);
        setResult("");
        try {
            const response = await fetch("/api/process-agent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: input }),
            });
            const data = await response.json();
            if (data.result) {
                setResult(data.result);
            }
        } catch (error) {
            console.error("Conversion failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AppLayout
            title="SOP-Extract // The Process Agent"
            description="Entrez vos notes en vrac pour les structurer en procédures actionnables."
        >
            {/* Left: Input */}
            <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-[var(--app-border)]">
                <div className="px-4 py-2 border-b border-[var(--app-border)] bg-[var(--app-bg-secondary)]">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--app-text-muted)]">Raw Notes</span>
                </div>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste your messy notes here..."
                    className="flex-1 p-6 bg-transparent resize-none outline-none text-sm leading-relaxed placeholder:text-[var(--app-text-muted)]"
                />
            </div>

            {/* Center: Action */}
            <div className="flex md:flex-col items-center justify-center p-4 bg-[var(--app-bg-secondary)] border-b md:border-b-0 md:border-r border-[var(--app-border)] gap-4">
                <button
                    onClick={handleConvert}
                    disabled={!input.trim() || isLoading}
                    className={`
            flex items-center gap-2 px-6 py-3 rounded-md transition-all duration-300 text-xs font-bold uppercase tracking-wider
            ${input.trim() && !isLoading
                            ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-[0_0_20px_rgba(0,112,243,0.2)] active:scale-95"
                            : "bg-[var(--app-border)] text-[var(--app-text-muted)] cursor-not-allowed"}
          `}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing
                        </div>
                    ) : (
                        "Convert to Workflow"
                    )}
                </button>
            </div>

            {/* Right: Output */}
            <div className="flex-1 flex flex-col bg-[var(--app-bg-primary)]">
                <div className="px-4 py-2 border-b border-[var(--app-border)] flex justify-between items-center bg-[var(--app-bg-secondary)]">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--app-text-muted)]">SOP Result</span>
                    {result && (
                        <button
                            onClick={handleCopy}
                            className="text-[10px] uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors bg-transparent border-none cursor-pointer"
                        >
                            {copied ? "√ Copied" : "Copy Markdown"}
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-auto p-6 relative">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                <div className="h-4 bg-[var(--app-border)] rounded w-3/4 animate-pulse" />
                                <div className="h-4 bg-[var(--app-border)] rounded w-full animate-pulse" />
                                <div className="h-4 bg-[var(--app-border)] rounded w-5/6 animate-pulse" />
                                <div className="h-4 bg-[var(--app-border)] rounded w-1/2 animate-pulse" />
                                <div className="h-4 bg-[var(--app-border)] rounded w-2/3 animate-pulse" />
                            </motion.div>
                        ) : result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="prose prose-invert prose-sm max-w-none"
                            >
                                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-[var(--app-text-primary)]/80">
                                    {result}
                                </pre>
                            </motion.div>
                        ) : (
                            <div key="empty" className="h-full flex flex-col items-center justify-center text-[var(--app-text-dim)] space-y-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="9" y1="9" x2="15" y2="9" />
                                    <line x1="9" y1="13" x2="15" y2="13" />
                                    <line x1="9" y1="17" x2="13" y2="17" />
                                </svg>
                                <span className="text-xs uppercase tracking-[0.3em]">Waiting for input</span>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AppLayout>
    );
}
