"use client";

import { useState, useEffect, useSyncExternalStore } from "react";

// Subscribe to display mode changes
function subscribeToDisplayMode(callback: () => void) {
  const mediaQuery = window.matchMedia("(display-mode: standalone)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

// Get snapshot of standalone status
function getStandaloneSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches;
}

function getServerSnapshot() {
  return false;
}

export function SplashScreen() {
  const [isFading, setIsFading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  
  // Use useSyncExternalStore for standalone check
  const isStandalone = useSyncExternalStore(
    subscribeToDisplayMode,
    getStandaloneSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    // Only show splash on standalone PWA mode
    if (!isStandalone) {
      return;
    }

    // Start fade after 2 seconds
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2000);

    // Remove splash after fade animation
    const removeTimer = setTimeout(() => {
      setIsDone(true);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [isStandalone]);

  // Don't render if not standalone or done
  if (!isStandalone || isDone) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] bg-gradient-to-br from-teal-600 to-cyan-700 flex flex-col items-center justify-center transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Logo */}
      <div className="mb-8">
        <div className="w-24 h-24 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-teal-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
        </div>
      </div>

      {/* App Name */}
      <h1 className="text-4xl font-bold text-white mb-2">PhysioMaint</h1>
      <p className="text-teal-100 text-lg mb-8">Equipment Maintenance Learning</p>

      {/* Loading indicator */}
      <div className="flex gap-1">
        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>

      {/* Credits */}
      <div className="absolute bottom-8 text-center">
        <p className="text-teal-100 text-sm">Developed by</p>
        <p className="text-white font-semibold">Kevin Koech</p>
        <p className="text-teal-200 text-xs mt-1">kevkokip@gmail.com</p>
      </div>
    </div>
  );
}
