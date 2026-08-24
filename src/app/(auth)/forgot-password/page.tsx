"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const isMockMode =
        process.env.NEXT_PUBLIC_AI_MODE === "mock" ||
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

      if (!isMockMode) {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (resetError) {
          setError(resetError.message);
          return;
        }
      } else {
        await new Promise((r) => setTimeout(r, 600));
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "0 24px",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 32px)",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "20px 0", textAlign: "center" }}>
        <Link href="/login" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
          <Logo size="lg" />
        </Link>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: 400,
          width: "100%",
          margin: "0 auto",
        }}
      >
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--color-text-primary)", marginBottom: 8 }}>
            Reset Password
          </h1>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 24, lineHeight: 1.5 }}>
            Enter your registered email address and we&apos;ll send you instructions to reset your password.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
            style={{ padding: 20, textAlign: "center", background: "var(--color-success-bg)", border: "1px solid #a7f3d0" }}
          >
            <CheckCircle2 size={40} style={{ color: "var(--color-success)", margin: "0 auto 12px" }} />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#065f46", marginBottom: 6 }}>
              Check your email
            </h2>
            <p style={{ fontSize: 13, color: "#047857", marginBottom: 16, lineHeight: 1.5 }}>
              We sent a password reset link to <strong>{email}</strong>.
            </p>
            <Link href="/login" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Return to Sign In
            </Link>
          </motion.div>
        ) : (
          <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  background: "var(--color-error-bg)",
                  border: "1px solid #fecaca",
                  borderRadius: "var(--radius-md)",
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <AlertCircle size={16} style={{ color: "var(--color-error)", flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: "#991b1b" }}>{error}</p>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
                <input
                  type="email"
                  className="input-base"
                  style={{ paddingLeft: 42 }}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>Send Reset Link <ArrowRight size={18} /></>}
            </button>

            <p style={{ textAlign: "center", fontSize: 14, color: "var(--color-text-secondary)", marginTop: 20 }}>
              Remember your password?{" "}
              <Link href="/login" style={{ color: "var(--color-primary)", fontWeight: 600 }}>
                Sign In
              </Link>
            </p>
          </motion.form>
        )}
      </div>
    </div>
  );
}
