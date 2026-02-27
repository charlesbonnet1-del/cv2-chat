"use client";

import { ReactNode } from "react";
import "./apps.css";

interface AppLayoutProps {
    children: ReactNode;
    title: string;
    description?: string;
    statusText?: string;
    footerLeft?: string;
    className?: string;
}

export default function AppLayout({
    children,
    title,
    description,
    statusText = "Active",
    footerLeft = "Build v1.0.4 // Excellence Opérationnelle",
    className = "",
}: AppLayoutProps) {
    return (
        <div className={`flex flex-col h-full bg-[var(--app-bg-primary)] text-[var(--app-text-primary)] linear-mono selection:bg-[var(--app-accent)]/30 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--app-border)] bg-[var(--app-bg-secondary)]">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[var(--app-accent)] shadow-[0_0_10px_var(--app-accent-glow)]" />
                        <h1 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--app-text-dim)]">
                            {title}
                        </h1>
                    </div>
                    {description && (
                        <p className="text-[10px] text-[var(--app-text-muted)] ml-5 font-mono">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {children}
            </div>

            {/* Footer */}
            <div className="px-6 py-2 border-t border-[var(--app-border)] bg-[var(--app-bg-secondary)] flex justify-between items-center text-[9px] text-[var(--app-text-muted)] uppercase tracking-widest">
                <div>{footerLeft}</div>
                <div className="flex items-center gap-4">
                    <span>GPT-4o Engine</span>
                    <span className="text-[var(--app-accent)]">{statusText}</span>
                </div>
            </div>
        </div>
    );
}
