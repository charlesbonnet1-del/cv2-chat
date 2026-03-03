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
    footerLeft = "Claude Sonnet 4.5",
    className = "",
}: AppLayoutProps) {
    return (
        <div
            className={`flex flex-col h-full text-[var(--app-text-primary)] selection:bg-[var(--app-accent)]/20 ${className}`}
            style={{ backgroundColor: "var(--app-bg-primary)" }}
        >
            {/* ── Header ── */}
            <div
                className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[var(--app-border)] shrink-0"
                style={{ backgroundColor: "var(--app-bg-secondary)" }}
            >
                <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: "var(--app-accent)" }}
                        />
                        <h1 className="text-xs font-semibold text-[var(--app-text-dim)] truncate">
                            {title}
                        </h1>
                    </div>
                    {description && (
                        <p className="text-[10px] text-[var(--app-text-muted)] pl-3.5 truncate">
                            {description}
                        </p>
                    )}
                </div>

                <span
                    className="text-[10px] font-medium shrink-0 ml-4 px-2 py-0.5 rounded-full"
                    style={{
                        backgroundColor: "var(--app-accent)",
                        color: "#fff",
                        opacity: 0.85,
                    }}
                >
                    {statusText}
                </span>
            </div>

            {/* ── Content ── */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
                {children}
            </div>

            {/* ── Footer ── */}
            <div
                className="px-4 md:px-6 py-1.5 border-t border-[var(--app-border)] flex justify-between items-center gap-2 text-[9px] text-[var(--app-text-muted)] shrink-0"
                style={{ backgroundColor: "var(--app-bg-secondary)" }}
            >
                <span className="hidden sm:inline truncate min-w-0">{footerLeft}</span>
                <span className="ml-auto shrink-0" style={{ color: "var(--app-accent)" }}>
                    Claude Sonnet 4.5
                </span>
            </div>
        </div>
    );
}
