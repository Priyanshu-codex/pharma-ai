"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export default function SplashPage() {
  const [phase, setPhase] = useState<"intro" | "content">("intro");

  useEffect(() => {
    // After logo animation, show content
    const t = setTimeout(() => setPhase("content"), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #f0fdfa 0%, #ffffff 60%)",
        padding: "24px 24px",
        paddingTop: "env(safe-area-inset-top, 24px)",
        paddingBottom: "env(safe-area-inset-bottom, 24px)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background decorative circles */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "rgba(20, 184, 166, 0.06)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "rgba(110, 231, 183, 0.08)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: 380, zIndex: 1 }}>
        {/* Logo & Animation */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          {/* Floating Medicine Illustration */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ marginBottom: 24 }}
          >
            <IllustrationMedicine />
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}
          >
            <Logo size="xl" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{
              fontSize: 14,
              color: "var(--color-text-secondary)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Scan · Learn · Save · Stay Healthy
          </motion.p>
        </div>

        {/* Value Props */}
        <AnimatePresence>
          {phase === "content" && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 32,
                }}
              >
                {[
                  { icon: "📷", label: "Scan Medicines", desc: "Instant identification" },
                  { icon: "💊", label: "Manage Meds", desc: "Never miss a dose" },
                  { icon: "💰", label: "Compare Prices", desc: "Find best deals" },
                  { icon: "🎓", label: "Learn Pharmacy", desc: "For students" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="card"
                    style={{ padding: "14px 14px", textAlign: "center" }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--color-text-primary)",
                        marginBottom: 2,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Link href="/signup" className="btn-primary" style={{ textAlign: "center" }}>
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="btn-ghost"
                  style={{ textAlign: "center" }}
                >
                  I already have an account
                </Link>
              </div>

              {/* Trust Badge */}
              <p
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  marginTop: 20,
                }}
              >
                🔒 Your health data is private and secure
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Inline Illustration ────────────────────────────────────
function IllustrationMedicine() {
  return (
    <svg
      width="180"
      height="160"
      viewBox="0 0 180 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ margin: "0 auto", display: "block" }}
      aria-hidden="true"
    >
      {/* Background circle */}
      <circle cx="90" cy="85" r="65" fill="#f0fdfa" />

      {/* Large pill / capsule */}
      <rect
        x="50"
        y="55"
        width="80"
        height="36"
        rx="18"
        fill="#0d9488"
      />
      <rect
        x="90"
        y="55"
        width="40"
        height="36"
        rx="18"
        fill="#14b8a6"
      />
      <line
        x1="90"
        y1="55"
        x2="90"
        y2="91"
        stroke="white"
        strokeWidth="2"
        opacity="0.4"
      />

      {/* Small pill top-right */}
      <rect
        x="120"
        y="30"
        width="40"
        height="20"
        rx="10"
        fill="#6ee7b7"
        transform="rotate(-20 120 30)"
      />

      {/* Small pill bottom-left */}
      <rect
        x="20"
        y="95"
        width="36"
        height="18"
        rx="9"
        fill="#99f6e4"
        transform="rotate(15 20 95)"
      />

      {/* Star / sparkle */}
      <circle cx="138" cy="68" r="4" fill="#fbbf24" />
      <circle cx="42" cy="52" r="3" fill="#fbbf24" opacity="0.7" />
      <circle cx="148" cy="100" r="3" fill="#0d9488" opacity="0.5" />

      {/* Cross / medical symbol */}
      <rect x="85" y="115" width="10" height="28" rx="5" fill="#0d9488" opacity="0.3" />
      <rect x="76" y="124" width="28" height="10" rx="5" fill="#0d9488" opacity="0.3" />
    </svg>
  );
}
