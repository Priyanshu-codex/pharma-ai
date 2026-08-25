"use client";

import { useState, useEffect } from "react";
import { X, Smartphone, Share, PlusSquare, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "pharmaai_pwa_dismissed";
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Check if running in standalone / PWA mode
    const isStandaloneMedia = window.matchMedia("(display-mode: standalone)").matches;
    const isIOSStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true;
    const isAndroidAppReferrer = document.referrer.includes("android-app://");
    const standalone = isStandaloneMedia || isIOSStandalone || isAndroidAppReferrer;

    if (standalone) {
      queueMicrotask(() => setIsInstalled(true));
      return;
    }

    // 2. Check dismissal history
    let isDismissed = false;
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - parseInt(dismissedAt, 10);
      if (elapsed < DISMISS_DURATION_MS) {
        isDismissed = true;
      }
    }

    // 3. Detect iOS Safari
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(ua);

    if (isIOSDevice && isSafari && !isDismissed) {
      queueMicrotask(() => setIsIOS(true));
    }

    // 4. Handle beforeinstallprompt event (Android, Chrome, Edge, Brave, Opera)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      if (!isDismissed) {
        setShowBanner(true);
      }
    };

    // 5. Handle appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setIsIOS(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setShowBanner(false);
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.warn("[PWA Install] Error triggering prompt:", err);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setIsIOS(false);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {}
  };

  // Do not render if installed or suppressed
  if (isInstalled) return null;
  if (!showBanner && !isIOS) return null;

  return (
    <aside
      aria-label="App Installation Banner"
      className="w-full bg-slate-900 text-white border-b border-slate-800 transition-all duration-300 relative z-30 select-none"
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Banner Content */}
        <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto">
          <div className="w-8 h-8 rounded-lg bg-teal-600/90 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Smartphone size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 font-bold text-slate-100">
              <span className="truncate">Install PharmaAI App</span>
              <span className="bg-teal-500/20 text-teal-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border border-teal-500/30">
                PWA
              </span>
            </div>
            <p className="text-slate-300 text-[11px] sm:text-xs truncate">
              {isIOS
                ? "Tap Share ⎋ then 'Add to Home Screen' for app experience"
                : "Fast offline access, prescription scanner & AI assistant"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-800/80 pt-2 sm:pt-0">
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white text-xs font-bold transition-all shadow-2xs touch-manipulation cursor-pointer"
            >
              <Download size={14} />
              <span>Install</span>
            </button>
          )}

          {isIOS && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-teal-300 font-semibold bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-800/50">
              <Share size={12} />
              <span>Share</span>
              <span className="text-slate-400">→</span>
              <PlusSquare size={12} />
              <span>Add to Home Screen</span>
            </div>
          )}

          <button
            onClick={handleDismiss}
            aria-label="Close install notification"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors touch-manipulation cursor-pointer flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
