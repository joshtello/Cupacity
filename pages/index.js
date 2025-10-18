"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Skip landing page for returning users
    const hasVisited = localStorage.getItem("hasVisitedCupacity");
    if (hasVisited) {
      router.push("/caffeine-calculator");
      return;
    }
    localStorage.setItem("hasVisitedCupacity", "true");

    // Detect mobile and iOS
    const userAgent = navigator.userAgent;
    const mobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
    const ios = /iPhone|iPad|iPod/i.test(userAgent);
    
    setIsMobile(mobile);
    setIsIOS(ios);

    // Check if user has already seen install prompt
    const hasSeenInstallPrompt = localStorage.getItem("hasSeenInstallPrompt");
    
    if (mobile && !hasSeenInstallPrompt) {
      // Listen for PWA install prompt (Android)
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowInstallPrompt(true);
      });

      // For iOS, show instructions after a short delay
      if (ios) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 1000);
      }
    }

    setIsLoading(false);
  }, [router]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        console.log("App installed");
      }
      setDeferredPrompt(null);
    }
    setShowInstallPrompt(false);
    localStorage.setItem("hasSeenInstallPrompt", "true");
  };

  const handleSkipInstall = () => {
    setShowInstallPrompt(false);
    localStorage.setItem("hasSeenInstallPrompt", "true");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-center px-6">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold mb-3 text-white">Cupacity</h1>
        <p className="text-gray-400 text-lg mb-6">
          Track and visualize your caffeine levels throughout the day.
        </p>
        <ul className="text-gray-300 text-sm mb-8 space-y-2">
          <li>☕ Log your drinks</li>
          <li>⏱️ See caffeine decay curves</li>
          <li>🌙 Plan your bedtime cutoff</li>
        </ul>
        <button
          onClick={() => router.push("/caffeine-calculator")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition duration-200"
        >
          Start Now
        </button>

        {isMobile && showInstallPrompt && (
          <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-sm mx-auto">
            <div className="text-4xl mb-3">📱</div>
            <h2 className="text-lg font-semibold text-white mb-3">
              Add Cupacity to your Home Screen
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              For quick access to your caffeine calculator
            </p>
            
            {isIOS ? (
              <div className="text-center text-sm text-gray-300 mb-4">
                <p><strong>On iPhone:</strong> Tap the Share icon → Add to Home Screen</p>
              </div>
            ) : (
              <div className="text-center text-sm text-gray-300 mb-4">
                <p><strong>On Android:</strong> Tap the ⋮ menu → Add to Home Screen</p>
              </div>
            )}

            <div className="flex flex-col space-y-2">
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Install Cupacity
                </button>
              )}
              <button
                onClick={handleSkipInstall}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Continue to Calculator
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
