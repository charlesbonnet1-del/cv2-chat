"use client";

import { ReactNode, useState, useEffect } from "react";
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
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('app-theme') as 'dark' | 'light';
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('app-theme', newTheme);
    };

    return (
        <div className={`flex flex-col h-full bg-[var(--app-bg-primary)] text-[var(--app-text-primary)] linear-mono selection:bg-[var(--app-accent)]/30 ${theme} ${className}`}>
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

                <button
                    onClick={toggleTheme}
                    className="p-1.5 rounded border border-[var(--app-border)] hover:bg-[var(--app-border)] transition-colors flex items-center gap-2 group"
                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {theme === 'dark' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--app-text-dim)] group-hover:text-[var(--app-accent)]"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--app-text-dim)] group-hover:text-[var(--app-accent)]"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                    )}
                    <span className="text-[9px] uppercase tracking-widest text-[var(--app-text-muted)] group-hover:text-[var(--app-text-dim)]">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                </button>
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
