"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "./AppLayout";

type AgenticResult = {
    checklist: Array<{ task: string; resource?: { label: string; url: string } }>;
    notion: string;
    automation: any;
    brief: string;
};

export default function ProcessAgent() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState<AgenticResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"checklist" | "notion" | "automation" | "brief">("checklist");

    const handleConvert = async () => {
        if (!input.trim() || isLoading) return;

        setIsLoading(true);
        setResult(null);
        try {
            const response = await fetch("/api/process-agent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: input }),
            });
            const data = await response.json();
            if (data.result) {
                setResult(data.result);
                setActiveTab("checklist");
            }
        } catch (error) {
            console.error("Conversion failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (content: string, type: string) => {
        if (!content) return;
        navigator.clipboard.writeText(content);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const getTabContent = () => {
        if (!result) return null;
        switch (activeTab) {
            case "checklist":
                return (
                    <div className="space-y-3">
                        {result.checklist.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-3 bg-[var(--app-bg-secondary)] border border-[var(--app-border)] rounded-md group hover:border-[var(--app-accent)] transition-all">
                                <div className="mt-1 h-4 w-4 rounded border border-[var(--app-accent)] flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm text-[var(--app-text-primary)]/90 leading-snug">{item.task}</p>
                                    {item.resource && (
                                        <a
                                            href={item.resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-[var(--app-accent)]/10 text-[var(--app-accent)] text-[9px] uppercase font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                                            {item.resource.label}
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case "notion":
                return <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-[var(--app-text-primary)]/80">{result.notion}</pre>;
            case "automation":
                return <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-[var(--app-text-primary)]/80">{JSON.stringify(result.automation, null, 2)}</pre>;
            case "brief":
                return <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-[var(--app-text-primary)]/80">{result.brief}</pre>;
            default:
                return null;
        }
    };

    const getCopyContent = () => {
        if (!result) return "";
        if (activeTab === "checklist") return result.checklist.map(i => `[ ] ${i.task}${i.resource ? ` (${i.resource.label}: ${i.resource.url})` : ''}`).join('\n');
        if (activeTab === "automation") return JSON.stringify(result.automation, null, 2);
        return result[activeTab] as string;
    };

    return (
        <AppLayout
            title="SOP-Builder // Agentic Workflow Builder"
            description="Transformation agentique de notes brutes en pack d'exécution complet."
        >
            {/* Left: Input */}
            <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-[var(--app-border)]">
                <div className="px-4 py-2 border-b border-[var(--app-border)] bg-[var(--app-bg-secondary)]">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--app-text-muted)]">Input: Messy Signal</span>
                </div>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter raw notes, meeting transcripts, or messy thoughts..."
                    className="flex-1 p-6 bg-transparent resize-none outline-none text-sm leading-relaxed placeholder:text-[var(--app-text-muted)]"
                />
            </div>

            {/* Center: Action */}
            <div className="flex md:flex-col items-center justify-center p-4 bg-[var(--app-bg-secondary)] border-b md:border-b-0 md:border-r border-[var(--app-border)] gap-4">
                <button
                    onClick={handleConvert}
                    disabled={!input.trim() || isLoading}
                    className={`
            relative flex items-center gap-2 px-6 py-3 rounded-md transition-all duration-300 text-xs font-bold uppercase tracking-wider
            ${input.trim() && !isLoading
                            ? "bg-[var(--app-accent)] text-white hover:bg-[#0060df] shadow-[0_0_20px_rgba(0,112,243,0.2)] active:scale-95"
                            : "bg-[var(--app-border)] text-[var(--app-text-muted)] cursor-not-allowed"}
          `}
                >
                    {isLoading && (
                        <motion.div
                            className="absolute inset-0 rounded-md border-2 border-[var(--app-accent)]"
                            animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                        />
                    )}
                    {isLoading ? "Reasoning..." : "Build Workflow"}
                </button>
            </div>

            {/* Right: Output */}
            <div className="flex-1 flex flex-col bg-[var(--app-bg-primary)]">
                <div className="border-b border-[var(--app-border)] bg-[var(--app-bg-secondary)] flex items-center overflow-x-auto no-scrollbar">
                    {["checklist", "notion", "automation", "brief"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 text-[9px] uppercase tracking-widest transition-colors border-r border-[var(--app-border)] whitespace-nowrap ${activeTab === tab ? 'text-[var(--app-accent)] bg-[var(--app-bg-primary)]' : 'text-[var(--app-text-muted)] hover:text-[var(--app-text-dim)]'
                                }`}
                        >
                            {tab.replace('checklist', 'Checklist').replace('notion', 'Notion Doc').replace('automation', 'JSON/Automation').replace('brief', 'Email Brief')}
                        </button>
                    ))}
                </div>

                <div className="flex justify-between items-center px-4 py-2 border-b border-[var(--app-border)] bg-[var(--app-bg-secondary)]/50">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--app-text-muted)]">Output Pack</span>
                    {result && (
                        <button
                            onClick={() => handleCopy(getCopyContent(), activeTab)}
                            className="text-[9px] uppercase tracking-widest text-[var(--app-accent)] hover:underline"
                        >
                            {copied === activeTab ? "√ Copied" : "[ Copy Content ]"}
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-auto p-6">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="h-4 bg-[var(--app-border)] rounded animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }} />
                                ))}
                            </motion.div>
                        ) : result ? (
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {getTabContent()}
                            </motion.div>
                        ) : (
                            <div key="empty" className="h-full flex flex-col items-center justify-center text-[var(--app-text-dim)] space-y-4 opacity-20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="9" y1="9" x2="15" y2="9" />
                                    <line x1="9" y1="13" x2="15" y2="13" />
                                    <line x1="9" y1="17" x2="13" y2="17" />
                                </svg>
                                <span className="text-[10px] uppercase tracking-[0.3em]">Waiting for input</span>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AppLayout>
    );
}
