"use client";

import { useState, useEffect } from "react";
import SentimentHeatmap from "./apps/SentimentHeatmap";
import MailFinder from "./apps/MailFinder";

type AppId = "sentiment" | "mailfinder" | null;

type App = {
  id: AppId;
  name: string;
  description: string;
  icon: JSX.Element;
};

const apps: App[] = [
  {
    id: "sentiment",
    name: "Sentiment Heatmap",
    description: "AI-powered copy analysis",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <rect x="7" y="7" width="3" height="3" fill="currentColor" opacity="0.3"/>
        <rect x="14" y="7" width="3" height="3" fill="currentColor" opacity="0.6"/>
        <rect x="7" y="14" width="3" height="3" fill="currentColor" opacity="0.8"/>
        <rect x="14" y="14" width="3" height="3" fill="currentColor" opacity="0.4"/>
      </svg>
    ),
  },
  {
    id: "mailfinder",
    name: "Mail Finder",
    description: "Smart email discovery",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <path d="M8 11h6"/>
        <path d="M11 8v6"/>
      </svg>
    ),
  },
];

export default function AppsShowcase() {
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

  const handleClose = () => {
    setActiveApp(null);
    setIsOpen(false);
  };

  if (!mounted) return null;

  // Render active app fullscreen
  if (activeApp) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--background)]">
        {/* Header with back button */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bot-bubble-bg)] hover:bg-[var(--accent)] hover:text-white transition-all text-sm font-mono"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Apps
          </button>
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--bot-bubble-bg)] hover:bg-[var(--accent)] hover:text-white transition-all"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* App content */}
        <div className="w-full h-full overflow-auto pt-16">
          {activeApp === "sentiment" && <SentimentHeatmap />}
          {activeApp === "mailfinder" && <MailFinder />}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Trigger Link */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs font-bold underline underline-offset-4 decoration-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer bg-transparent border-none"
      >
        Apps I Built
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-md transition-all duration-300"
            style={{ animation: "fadeIn 0.3s ease-out" }}
          />

          {/* Content */}
          <div
            className="relative z-10 flex flex-col items-center gap-8 p-8"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "scaleIn 0.3s ease-out" }}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-2 -right-2 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bot-bubble-bg)] hover:bg-[var(--accent)] hover:text-white transition-all"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-[var(--foreground)] font-mono tracking-tight">
              Apps I Built
            </h2>

            {/* Apps Grid */}
            <div className="flex flex-wrap justify-center gap-8 max-w-2xl">
              {apps.map((app, index) => (
                <button
                  key={app.id}
                  onClick={() => handleAppClick(app.id)}
                  className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-[var(--bot-bubble-bg)] hover:bg-[var(--accent)] transition-all duration-300 w-44 border-none cursor-pointer"
                  style={{
                    animation: `slideUp 0.4s ease-out ${index * 0.1}s both`,
                  }}
                >
                  {/* Icon */}
                  <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-[var(--background)] text-[var(--accent)] group-hover:bg-white group-hover:text-[var(--accent)] transition-all duration-300 shadow-sm">
                    {app.icon}
                  </div>

                  {/* Name */}
                  <span className="text-sm font-bold text-[var(--foreground)] group-hover:text-white transition-colors font-mono">
                    {app.name}
                  </span>

                  {/* Description */}
                  <span className="text-xs text-center text-[var(--foreground)]/60 group-hover:text-white/80 transition-colors font-mono leading-tight">
                    {app.description}
                  </span>
                </button>
              ))}
            </div>

            {/* Hint */}
            <p className="text-xs text-[var(--foreground)]/40 font-mono">
              Click anywhere to close
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
