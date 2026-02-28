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
  return window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true;
}

function getServerSnapshot() {
  return false;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Use useSyncExternalStore for standalone check
  const isInstalled = useSyncExternalStore(
    subscribeToDisplayMode,
    getStandaloneSnapshot,
    getServerSnapshot
  );

  // Detect device type
  const [deviceType, setDeviceType] = useState<"mobile" | "desktop" | "unknown">("unknown");

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isTablet = /ipad|android/i.test(userAgent.toLowerCase()) && !/mobile/i.test(userAgent.toLowerCase());
      
      if (isMobile || isTablet || window.innerWidth < 768) {
        setDeviceType("mobile");
      } else {
        setDeviceType("desktop");
      }
    };
    
    detectDevice();
    window.addEventListener("resize", detectDevice);
    return () => window.removeEventListener("resize", detectDevice);
  }, []);

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
      setShowInstructions(true);
      return;
    }

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("PWA installed successfully");
    }

    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleCloseInstructions = useCallback(() => {
    setShowInstructions(false);
  }, []);

  // Get installation instructions based on device
  const getInstructions = () => {
    if (deviceType === "mobile") {
      return {
        title: "Install on Android Phone",
        steps: [
          "Tap the menu button (three dots) in the top right corner",
          "Look for 'Add to Home Screen' or 'Install App'",
          "Tap 'Add' or 'Install'",
          "The app will appear on your home screen"
        ],
        alternative: "If you don't see the option, try Chrome browser and look for the install icon in the address bar"
      };
    } else {
      return {
        title: "Install on Computer",
        steps: [
          "Look for the install icon (⬇) in the browser's address bar",
          "Click the install icon",
          "Follow the prompts to install",
          "The app will appear in your Start menu or Applications"
        ],
        alternative: "In Chrome: Click the puzzle piece icon (Apps) in the bookmarks bar, then click 'PhysioMaint' > 'Open' > look for install option"
      };
    }
  };

  const instructions = getInstructions();

  // Don't show button if already installed
  if (isInstalled) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium cursor-default"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        App Installed ✓
      </button>
    );
  }

  const canInstall = deferredPrompt !== null;

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium shadow-lg ${
          canInstall 
            ? "bg-teal-600 text-white hover:bg-teal-700 hover:scale-105" 
            : "bg-teal-600/90 text-white hover:bg-teal-700 animate-pulse"
        }`}
        title={canInstall ? "Click to install this app" : "Click for install instructions"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {canInstall ? "Install App" : "Get App"}
      </button>

      {/* Installation Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">📱 Install PhysioMaint</h2>
                <button 
                  onClick={handleCloseInstructions}
                  className="text-white/80 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-teal-100 mt-2 text-sm">{instructions.title}</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                {instructions.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-600 text-sm">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm font-medium">💡 Tip</p>
                <p className="text-blue-700 text-sm mt-1">{instructions.alternative}</p>
              </div>

              {/* Direct Install Button (for browsers that support it) */}
              {canInstall && (
                <button
                  onClick={handleInstallClick}
                  className="w-full mt-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Install Now
                </button>
              )}

              <button
                onClick={handleCloseInstructions}
                className="w-full mt-3 py-2 text-gray-500 hover:text-gray-700 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Floating Install Button Component - for persistent visibility
export function FloatingInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  
  const isInstalled = useSyncExternalStore(
    subscribeToDisplayMode,
    getStandaloneSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Show after a delay if no prompt event
    const timer = setTimeout(() => {
      if (!isInstalled) {
        setShow(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [isInstalled]);

  useEffect(() => {
    const handleAppInstalled = () => {
      setShow(false);
    };

    window.addEventListener("appinstalled", handleAppInstalled);
    return () => window.removeEventListener("appinstalled", handleAppInstalled);
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) {
      // Open install instructions
      return;
    }

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShow(false);
  }, [deferredPrompt]);

  if (isInstalled || !show) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 hover:scale-105 transition-all font-medium animate-bounce"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span className="hidden sm:inline">Install App</span>
      </button>
    </div>
  );
}
