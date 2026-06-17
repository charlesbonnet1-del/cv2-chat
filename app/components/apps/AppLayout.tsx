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
    statusText = "online",
    footerLeft = "claude-sonnet-4-6",
    className = "",
}: AppLayoutProps) {
    return (
        <div
            className={`flex flex-col h-full min-h-0 ${className}`}
            style={{
                backgroundColor: "var(--app-bg-primary)",
                color: "var(--app-text-primary)",
                fontFamily: "var(--app-font)",
            }}
        >
            {/* ── Header ── */}
            <div
                className="shrink-0 flex items-center justify-between px-4 py-2 border-b"
                style={{ borderColor: "var(--app-border)", backgroundColor: "var(--app-bg-secondary)" }}
            >
                <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span style={{ color: "#4ADE80", fontSize: "10px" }}>// </span>
                        <h1
                            className="truncate"
                            style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--app-text-dim)" }}
                        >
                            {title}
                        </h1>
                    </div>
                    {description && (
                        <p style={{ fontSize: "9px", color: "var(--app-text-muted)", paddingLeft: "18px" }} className="truncate">
                            {description}
                        </p>
                    )}
                </div>

                <span
                    className="shrink-0 ml-4"
                    style={{
                        fontSize: "9px",
                        letterSpacing: "0.08em",
                        color: "var(--app-accent)",
                        border: "1px solid var(--app-border)",
                        padding: "2px 8px",
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
                className="shrink-0 flex items-center justify-between px-4 py-1 border-t"
                style={{ borderColor: "var(--app-border)", backgroundColor: "var(--app-bg-secondary)" }}
            >
                <span style={{ fontSize: "9px", color: "var(--app-text-muted)", letterSpacing: "0.04em" }}>
                    {footerLeft}
                </span>
                <span style={{ fontSize: "9px", color: "var(--app-accent)", letterSpacing: "0.04em" }}>
                    claude-sonnet-4-6
                </span>
            </div>
        </div>
    );
}
