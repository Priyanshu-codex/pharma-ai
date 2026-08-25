"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("error") === "oauth_failed") {
        return "Google authentication failed. Please try again.";
      }
    }
    return null;
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("signup") === "success") {
        return "Account created successfully. Please login to continue.";
      }
    }
    return null;
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const newErrors: typeof errors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (authError || !data.user) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      localStorage.setItem("pharmaai_auth", "true");
      localStorage.setItem("pharmaai_email", data.user.email || formData.email.trim());
      if (data.user.user_metadata?.full_name) {
        localStorage.setItem("pharmaai_name", data.user.user_metadata.full_name);
      }

      // Check whether user has selected an application mode
      let userRole: string | undefined = data.user.user_metadata?.role;

      if (!userRole) {
        // Check profiles database table
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();

          if (profile?.role) {
            userRole = profile.role;
          }
        } catch {
          // Profile lookup fallback
        }
      }

      if (!userRole) {
        userRole = localStorage.getItem("pharmaai_role") || undefined;
      }

      if (userRole === "patient") {
        localStorage.setItem("pharmaai_role", "patient");
        router.replace("/dashboard");
      } else if (userRole === "student" || userRole === "pharmacy_student") {
        localStorage.setItem("pharmaai_role", "student");
        router.replace("/learn");
      } else {
        // No mode selected yet — route to Select Mode
        router.replace("/role");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to connect to authentication server. Please try again.";
      setError(msg);
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
      {/* Top: Logo */}
      <div style={{ padding: "20px 0", textAlign: "center" }}>
        <Link
          href="/splash"
          style={{
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
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
          gap: 0,
        }}
      >
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 28 }}
        >
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "var(--color-text-primary)",
              marginBottom: 6,
            }}
          >
            Welcome back 👋
          </h1>
          <p style={{ fontSize: 15, color: "var(--color-text-secondary)" }}>
            Sign in to continue managing your health
          </p>
        </motion.div>

        {/* Success Banner (e.g. from Signup) */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: "var(--radius-md)",
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
            role="status"
          >
            <CheckCircle2 size={16} style={{ color: "#059669", flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: "#065f46", fontWeight: 500 }}>{successMessage}</p>
          </motion.div>
        )}

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
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
            role="alert"
          >
            <AlertCircle size={16} style={{ color: "var(--color-error)", flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: "#991b1b" }}>{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onSubmit={handleSubmit}
          noValidate
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-text-secondary)",
                marginBottom: 6,
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={17}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                id="email"
                type="email"
                className={`input-base ${errors.email ? "error" : ""}`}
                style={{ paddingLeft: 42 }}
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, email: e.target.value }));
                  if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                }}
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && (
              <p
                id="email-error"
                style={{
                  fontSize: 12,
                  color: "var(--color-error)",
                  marginTop: 4,
                }}
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <label
                htmlFor="password"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--color-text-secondary)",
                }}
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                style={{
                  fontSize: 12,
                  color: "var(--color-primary)",
                  fontWeight: 500,
                }}
              >
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <Lock
                size={17}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`input-base ${errors.password ? "error" : ""}`}
                style={{ paddingLeft: 42, paddingRight: 46 }}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, password: e.target.value }));
                  if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                }}
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--color-text-muted)",
                  cursor: "pointer",
                  padding: 4,
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && (
              <p
                id="password-error"
                style={{ fontSize: 12, color: "var(--color-error)", marginTop: 4 }}
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: 4, width: "100%", justifyContent: "center" }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </motion.form>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "20px 0",
          }}
        >
          <div
            style={{ flex: 1, height: 1, background: "var(--color-border)" }}
          />
          <span
            style={{
              fontSize: 12,
              color: "var(--color-text-muted)",
              fontWeight: 500,
            }}
          >
            or
          </span>
          <div
            style={{ flex: 1, height: 1, background: "var(--color-border)" }}
          />
        </div>

        {/* Google Social Button */}
        <button
          type="button"
          className="btn-ghost"
          style={{
            width: "100%",
            justifyContent: "center",
            gap: 10,
            border: "1px solid var(--color-border)",
            padding: "10px 16px",
            borderRadius: "var(--radius-md)",
            fontWeight: 600,
            fontSize: 14,
          }}
          onClick={async () => {
            try {
              const { createClient } = await import("@/lib/supabase/client");
              const { getAuthRedirectUrl } = await import("@/lib/utils");
              const supabase = createClient();
              await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: getAuthRedirectUrl("/auth/callback") },
              });
            } catch (err) {
              console.error("Google Auth Error:", err);
              setError("Failed to initialize Google sign-in. Please try again.");
            }
          }}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: 16,
              fontFamily: "sans-serif",
              color: "#4285F4",
            }}
          >
            G
          </span>
          Continue with Google
        </button>

        {/* Sign Up Link */}
        <p
          style={{
            textAlign: "center",
            fontSize: 14,
            color: "var(--color-text-secondary)",
            marginTop: 24,
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            style={{
              color: "var(--color-primary)",
              fontWeight: 600,
            }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
