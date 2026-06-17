"use client";

import { useState, useEffect } from "react";
import SentimentHeatmap from "./apps/SentimentHeatmap";
import MailFinder from "./apps/MailFinder";
import ProcessAgent from "./apps/ProcessAgent";
import CompetitorWatch from "./apps/CompetitorWatch";

type AppId = "sentiment" | "mailfinder" | "process" | "competitorwatch" | null;

function AppsGridIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

type App = {
  id: AppId;
  name: string;
  description: string;
  icon: JSX.Element;
};

function TerminalGridIcon() {
  return (
    <svg viewBox="0 0 16 16">
      <rect x="2" y="2" width="5" height="5" rx="1"/>
      <rect x="9" y="2" width="5" height="5" rx="1"/>
      <rect x="2" y="9" width="5" height="5" rx="1"/>
      <rect x="9" y="9" width="5" height="5" rx="1"/>
    </svg>
  );
}

const apps: App[] = [
  {
    id: "sentiment",
    name: "Sentiment Heatmap",
    description: "AI-powered copy analysis",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <rect x="7" y="7" width="3" height="3" fill="currentColor" opacity="0.3" />
        <rect x="14" y="7" width="3" height="3" fill="currentColor" opacity="0.6" />
        <rect x="7" y="14" width="3" height="3" fill="currentColor" opacity="0.8" />
        <rect x="14" y="14" width="3" height="3" fill="currentColor" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: "mailfinder",
    name: "Mail Finder",
    description: "Smart email discovery",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <path d="M8 11h6" />
        <path d="M11 8v6" />
      </svg>
    ),
  },
  {
    id: "process",
    name: "Agentic SOP Builder",
    description: "Multi-tab workflow pack",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "competitorwatch",
    name: "CompetitorWatch",
    description: "Visual & price intelligence",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
  },
];

interface AppsShowcaseProps {
  variant?: "link" | "sidebar" | "terminal";
}

export default function AppsShowcase({ variant = "link" }: AppsShowcaseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeApp, setActiveApp] = useState<AppId>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen || activeApp) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, activeApp]);

  const handleAppClick = (appId: AppId) => {
    setIsOpen(false);
    setActiveApp(appId);
  };

  const handleBack = () => {
    setActiveApp(null);
    setIsOpen(true);
  };

  if (!mounted) return null;

  // Render active app — terminal fullscreen overlay
  if (activeApp) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col"
        style={{ backgroundColor: "#F7FBF8", padding: "12px", gap: "8px" }}
      >
        {/* Back button row */}
        <div className="shrink-0">
          <button
            onClick={handleBack}
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.08em",
              color: "#15803D",
              background: "none",
              border: "1px solid #86EFAC",
              padding: "5px 16px",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#4ADE80";
              (e.currentTarget as HTMLButtonElement).style.color = "#14532D";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#86EFAC";
              (e.currentTarget as HTMLButtonElement).style.color = "#15803D";
            }}
          >
            ← My Apps
          </button>
        </div>

        {/* App fullscreen */}
        <div
          className="flex-1 min-h-0 overflow-hidden"
          style={{ border: "1px solid #86EFAC" }}
        >
          {activeApp === "sentiment" && <SentimentHeatmap />}
          {activeApp === "mailfinder" && <MailFinder />}
          {activeApp === "process" && <ProcessAgent />}
          {activeApp === "competitorwatch" && <CompetitorWatch />}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Trigger */}
      {variant === "terminal" ? (
        <button className="nav-link" onClick={() => setIsOpen(true)}>
          <TerminalGridIcon />
          My Apps
        </button>
      ) : variant === "sidebar" ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bot-bubble-bg)] hover:text-[var(--accent)] transition-all"
          title="My Apps"
        >
          <AppsGridIcon />
          <span className="hidden md:inline text-sm">My Apps</span>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="text-xs font-bold underline underline-offset-4 decoration-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer bg-transparent border-none"
        >
          Apps I Built
        </button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(247,251,248,0.92)", backdropFilter: "blur(6px)", animation: "fadeIn 0.25s ease-out" }}
          onClick={() => setIsOpen(false)}
        >
          {/* Content */}
          <div
            className="relative flex flex-col items-center"
            style={{ gap: "28px", padding: "32px 40px", animation: "scaleIn 0.25s ease-out" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute", top: "8px", right: "8px",
                fontFamily: "'Share Tech Mono', monospace", fontSize: "10px",
                color: "#166534", background: "none", border: "none",
                cursor: "pointer", letterSpacing: "0.06em",
              }}
            >
              [ × ]
            </button>

            {/* Title */}
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", color: "#166534", letterSpacing: "0.14em", textTransform: "uppercase" }}>
              // my apps
            </div>

            {/* Apps Grid */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", maxWidth: "560px" }}>
              {apps.map((app, index) => (
                <button
                  key={app.id}
                  onClick={() => handleAppClick(app.id)}
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
                    padding: "20px 24px", width: "130px",
                    background: "none", border: "1px solid #86EFAC", cursor: "pointer",
                    color: "#15803D", transition: "all 0.18s",
                    animation: `slideUp 0.35s ease-out ${index * 0.07}s both`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#4ADE80";
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(21,128,61,0.05)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#14532D";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#86EFAC";
                    (e.currentTarget as HTMLButtonElement).style.background = "none";
                    (e.currentTarget as HTMLButtonElement).style.color = "#15803D";
                  }}
                >
                  <div style={{ color: "#15803D", opacity: 0.7 }}>{app.icon}</div>
                  <span style={{ fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center" }}>{app.name}</span>
                  <span style={{ fontSize: "9px", color: "#4A7A58", letterSpacing: "0.04em", textAlign: "center", lineHeight: "1.4" }}>{app.description}</span>
                </button>
              ))}
            </div>

            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", color: "#86EFAC", letterSpacing: "0.06em" }}>
              click anywhere to close
            </p>
          </div>
        </div>
      )}

      {/* Animations CSS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.95);
          }
          to { 
            opacity: 1; 
            transform: scale(1);
          }
        }
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
