"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

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

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  
  // Use useSyncExternalStore for standalone check
  const isInstalled = useSyncExternalStore(
    subscribeToDisplayMode,
    getStandaloneSnapshot,
    getServerSnapshot
  );

  // Listen for the beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Listen for app installed event
  useEffect(() => {
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) {
      // Show instructions for installing
      alert("To install this app as a PWA:\n\n1. If viewing on mobile, open this page in a browser and look for the 'Add to Home Screen' or 'Install App' option in the browser menu\n\n2. If on desktop, look for the install icon in your browser's address bar\n\n3. The app must be accessed via HTTPS (or localhost) for the install prompt to appear\n\n4. Try visiting this site on your phone and look for the install option in Chrome's menu (three dots)");
      return;
    }

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user's response
    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
  }, [deferredPrompt]);

  // Don't show button if already installed
  if (isInstalled) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        App Installed
      </button>
    );
  }

  // Show the button always, but with different styling when install is available
  const canInstall = deferredPrompt !== null;

  return (
    <button
      onClick={handleInstallClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium shadow-lg ${
        canInstall 
          ? "bg-teal-600 text-white hover:bg-teal-700" 
          : "bg-teal-600/80 text-white hover:bg-teal-700"
      }`}
      title={canInstall ? "Click to install this app" : "Click for install instructions"}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Install App
    </button>
  );
}
