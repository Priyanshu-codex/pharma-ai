"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
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
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) {
          setError(updateError.message);
          return;
        }
      } else {
        await new Promise((r) => setTimeout(r, 600));
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reset password.");
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
            Set New Password
          </h1>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 24, lineHeight: 1.5 }}>
            Create a strong new password for your PharmaAI account.
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
              Password Reset Complete!
            </h2>
            <p style={{ fontSize: 13, color: "#047857", marginBottom: 16 }}>
              Your password has been successfully updated.
            </p>
            <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => router.replace("/login")}>
              Sign In with New Password
            </button>
          </motion.div>
        ) : (
          <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                }}
              >
                <AlertCircle size={16} style={{ color: "var(--color-error)", flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: "#991b1b" }}>{error}</p>
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>
                New Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-base"
                  style={{ paddingLeft: 42, paddingRight: 46 }}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", padding: 4 }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>
                Confirm New Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-base"
                  style={{ paddingLeft: 42 }}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>Reset Password <ArrowRight size={18} /></>}
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}
