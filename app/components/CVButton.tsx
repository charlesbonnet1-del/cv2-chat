"use client";

import { useState, useEffect, lazy, Suspense } from "react";

const Mindmap3D = lazy(() => import("./apps/Mindmap3D"));

export default function CVButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* CV Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--bot-bubble-bg)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all text-[var(--foreground)] font-bold text-xs border-none cursor-pointer"
        title="Interactive CV"
      >
        CV
      </button>

      {/* Fullscreen Mindmap */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--background)]">
          {/* Back button */}
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bot-bubble-bg)] hover:bg-[var(--accent)] hover:text-white transition-all text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Chat
            </button>
          </div>

          {/* Mindmap content */}
          <div className="w-full h-full">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-[var(--foreground)]">Loading 3D...</div>
              </div>
            }>
              <Mindmap3D />
            </Suspense>
          </div>
        </div>
      )}
    </>
  );
}
