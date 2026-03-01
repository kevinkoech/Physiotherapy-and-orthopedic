"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const ONBOARDING_KEY = "physiomaint-onboarding-complete";

interface OnboardingSlide {
  title: string;
  description: string;
  icon: string;
  color: string;
}

const slides: OnboardingSlide[] = [
  {
    title: "Welcome to PhysioMaint",
    description: "Your comprehensive learning companion for physiotherapy equipment maintenance. Master the skills to maintain, diagnose, and calibrate medical equipment.",
    icon: "🏥",
    color: "from-teal-500 to-cyan-500",
  },
  {
    title: "12 Equipment Modules",
    description: "Learn about Short Wave Diathermy, Muscle Stimulators, Infrared Therapy, Hydro-Collators, and 8 more essential physiotherapy equipment types.",
    icon: "📚",
    color: "from-blue-500 to-indigo-500",
  },
  {
    title: "Interactive Simulations",
    description: "Practice with realistic parameter simulations. Adjust settings, see results, and understand safety thresholds for each equipment type.",
    icon: "🔬",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Print & Export",
    description: "Export learning notes and simulation results as PDF for offline study. Perfect for exam preparation and field reference.",
    icon: "📄",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Install for Offline Access",
    description: "Install this app on your device for offline access. Study anywhere, anytime - even without an internet connection.",
    icon: "📲",
    color: "from-green-500 to-teal-500",
  },
];

// Subscribe to localStorage changes
function subscribeToStorage(callback: () => void) {
  const handleChange = () => callback();
  window.addEventListener("storage", handleChange);
  return () => window.removeEventListener("storage", handleChange);
}

// Get snapshot of onboarding status
function getOnboardingSnapshot() {
  if (typeof window === "undefined") return false;
  return !localStorage.getItem(ONBOARDING_KEY);
}

function getServerSnapshot() {
  return false;
}

export function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  
  // Listen for install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  // Listen for app installed
  useEffect(() => {
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      // Auto-complete onboarding after install
      handleComplete();
    };
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => window.removeEventListener("appinstalled", handleAppInstalled);
  }, []);
  
  // Only check localStorage after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Use useSyncExternalStore for onboarding status
  const needsOnboarding = useSyncExternalStore(
    subscribeToStorage,
    getOnboardingSnapshot,
    getServerSnapshot
  );

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  const handleComplete = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    // Trigger storage event to update the store
    window.dispatchEvent(new StorageEvent("storage"));
  }, []);

  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      handleComplete();
    }
  }, [currentSlide, handleComplete]);

  const handlePrevious = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  const handleInstallNow = useCallback(async () => {
    if (!deferredPrompt) {
      // If no prompt, just mark complete
      handleComplete();
      return;
    }
    
    setIsInstalling(true);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("PWA installed from onboarding");
    }
    
    setDeferredPrompt(null);
    setIsInstalling(false);
    handleComplete();
  }, [deferredPrompt]);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  if (!needsOnboarding) {
    return null;
  }

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-teal-500 transition-all duration-300"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className={`bg-gradient-to-br ${slide.color} p-8 text-white text-center`}>
          <div className="text-6xl mb-4">{slide.icon}</div>
          <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
        </div>

        <div className="p-6">
          <p className="text-gray-600 text-center text-lg mb-6">{slide.description}</p>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mb-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? "bg-teal-500 w-6" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Skip
            </button>
            <div className="flex gap-2">
              {currentSlide > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Back
                </button>
              )}
              {currentSlide === slides.length - 1 ? (
                deferredPrompt ? (
                  <button
                    onClick={handleInstallNow}
                    disabled={isInstalling}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
                  >
                    {isInstalling ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Installing...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Install & Get Started
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                  >
                    Get Started
                  </button>
                )
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="bg-gray-50 px-6 py-3 text-center border-t">
          <p className="text-sm text-gray-500">
            Developed by <span className="font-semibold text-gray-700">Kevin Koech</span>
          </p>
          <a
            href="mailto:kevkokip@gmail.com"
            className="text-sm text-teal-600 hover:text-teal-700"
          >
            kevkokip@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
