import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PharmaAI — Smart Pharmacy",
    template: "%s | PharmaAI",
  },
  description:
    "AI-Powered Smart Pharmacy Ecosystem. Scan medicines, understand prescriptions, manage medications, and learn pharmacology. Scan. Learn. Save. Stay Healthy.",
  keywords: [
    "pharmacy",
    "medicine",
    "prescription",
    "medication",
    "drug information",
    "pharmacology",
    "health",
    "AI",
  ],
  authors: [{ name: "PharmaAI" }],
  creator: "PharmaAI",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PharmaAI",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "PharmaAI",
    title: "PharmaAI — Smart Pharmacy Ecosystem",
    description:
      "Scan medicines, understand prescriptions, compare prices, and manage your medication schedule with AI assistance.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

import { PWAInstallBanner } from "@/components/shared/PWAInstallBanner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Apple touch icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/icon-152x152.png"
        />
        {/* Splash screens for iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PharmaAI" />
        {/* MS Tile */}
        <meta name="msapplication-TileColor" content="#0d9488" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
      </head>
      <body>
        <PWAInstallBanner />
        {children}
        {/* Service Worker Registration via Next.js Script */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .catch(function(err) {
                      console.log('SW registration failed: ', err);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
