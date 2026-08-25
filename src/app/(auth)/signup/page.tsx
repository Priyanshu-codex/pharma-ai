"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";

interface FormData {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  agree_terms: boolean;
}

interface FormErrors {
  full_name?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
  agree_terms?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    agree_terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successScreen, setSuccessScreen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.confirm_password)
      newErrors.confirm_password = "Please confirm your password";
    else if (formData.password !== formData.confirm_password)
      newErrors.confirm_password = "Passwords do not match";
    if (!formData.agree_terms)
      newErrors.agree_terms = "You must agree to the terms to continue";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const passwordStrength = getPasswordStrength(formData.password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || successScreen) return;
    if (!validate()) return;
    setLoading(true);
    setServerError(null);

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name.trim(),
          },
        },
      });

      if (signUpError || !data.user) {
        const errorMsg = signUpError?.message || "";
        if (
          errorMsg.toLowerCase().includes("already registered") ||
          errorMsg.toLowerCase().includes("already exists") ||
          errorMsg.toLowerCase().includes("user already")
        ) {
          setServerError("An account with this email already exists. Please login.");
        } else {
          setServerError(signUpError?.message || "Failed to create account. Please try again.");
        }
        setLoading(false);
        return;
      }

      // Clear any auto-session
      await supabase.auth.signOut();
      localStorage.removeItem("pharmaai_auth");
      localStorage.removeItem("pharmaai_email");
      localStorage.removeItem("pharmaai_name");
      localStorage.removeItem("pharmaai_role");

      // Show Success Animation Screen
      setSuccessScreen(true);
      setLoading(false);

      // Smooth transition to /login
      setTimeout(() => {
        router.replace("/login?signup=success");
      }, 1600);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create account. Please check your internet connection.";
      setServerError(msg);
      setLoading(false);
    }
  }

  function updateField(field: keyof FormData, value: string | boolean) {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field as keyof FormErrors])
      setErrors((p) => ({ ...p, [field]: undefined }));
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
        overflowY: "auto",
      }}
    >
      {/* Top: Logo */}
      <div style={{ padding: "16px 0", textAlign: "center" }}>
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
          maxWidth: 400,
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {successScreen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="card"
            style={{
              padding: "36px 24px",
              textAlign: "center",
              background: "linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)",
              border: "1px solid #ccfbf1",
              boxShadow: "0 10px 25px -5px rgba(13, 148, 136, 0.15)",
              borderRadius: "var(--radius-xl)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--color-primary-50)",
                border: "2px solid var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <CheckCircle size={36} style={{ color: "var(--color-primary)" }} />
            </motion.div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "var(--color-text-primary)",
                marginBottom: 8,
              }}
            >
              Account Created! 🎉
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--color-text-secondary)",
                marginBottom: 20,
                lineHeight: 1.5,
              }}
            >
              Your PharmaAI account is ready. Redirecting you to login...
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                color: "var(--color-primary)",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <Loader2 size={16} className="animate-spin" />
              <span>Opening login page</span>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: 24 }}
            >
              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "var(--color-text-primary)",
                  marginBottom: 4,
                }}
              >
                Create your account
              </h1>
              <p style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
                Join PharmaAI to manage your health smarter
              </p>
            </motion.div>

        {/* Error Banner */}
        {serverError && (
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
            role="alert"
          >
            <AlertCircle size={16} style={{ color: "var(--color-error)", flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: "#991b1b" }}>{serverError}</p>
          </div>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          noValidate
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          {/* Full Name */}
          <FormField label="Full Name" error={errors.full_name} htmlFor="full_name">
            <InputWithIcon
              id="full_name"
              type="text"
              icon={<User size={17} />}
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={(v) => updateField("full_name", v)}
              hasError={!!errors.full_name}
              autoComplete="name"
            />
          </FormField>

          {/* Email */}
          <FormField label="Email Address" error={errors.email} htmlFor="email">
            <InputWithIcon
              id="email"
              type="email"
              icon={<Mail size={17} />}
              placeholder="Enter your email"
              value={formData.email}
              onChange={(v) => updateField("email", v)}
              hasError={!!errors.email}
              autoComplete="email"
            />
          </FormField>

          {/* Password */}
          <FormField label="Password" error={errors.password} htmlFor="password">
            <InputWithIcon
              id="password"
              type={showPassword ? "text" : "password"}
              icon={<Lock size={17} />}
              placeholder="Create a password (8+ characters)"
              value={formData.password}
              onChange={(v) => updateField("password", v)}
              hasError={!!errors.password}
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
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
              }
            />
            {/* Password Strength */}
            {formData.password && (
              <PasswordStrengthBar strength={passwordStrength} />
            )}
          </FormField>

          {/* Confirm Password */}
          <FormField
            label="Confirm Password"
            error={errors.confirm_password}
            htmlFor="confirm_password"
          >
            <InputWithIcon
              id="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              icon={<Lock size={17} />}
              placeholder="Confirm your password"
              value={formData.confirm_password}
              onChange={(v) => updateField("confirm_password", v)}
              hasError={!!errors.confirm_password}
              autoComplete="new-password"
              rightElement={
                formData.confirm_password &&
                formData.password === formData.confirm_password ? (
                  <CheckCircle
                    size={17}
                    style={{ color: "var(--color-success)", marginRight: 4 }}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-text-muted)",
                      cursor: "pointer",
                      padding: 4,
                    }}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                )
              }
            />
          </FormField>

          {/* Terms */}
          <div>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                id="agree_terms"
                checked={formData.agree_terms}
                onChange={(e) => updateField("agree_terms", e.target.checked)}
                style={{
                  marginTop: 2,
                  width: 16,
                  height: 16,
                  accentColor: "var(--color-primary)",
                  flexShrink: 0,
                  cursor: "pointer",
                }}
              />
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                I agree to the{" "}
                <Link href="/terms" style={{ color: "var(--color-primary)", fontWeight: 500 }}>
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" style={{ color: "var(--color-primary)", fontWeight: 500 }}>
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agree_terms && (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--color-error)",
                  marginTop: 4,
                }}
                role="alert"
              >
                {errors.agree_terms}
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
                Create Account
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
          <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
          <span style={{ fontSize: 12, color: "var(--color-text-muted)", fontWeight: 500 }}>
            or
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
        </div>

        {/* Google Sign-Up Button */}
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
              setServerError("Failed to initialize Google sign-in. Please try again.");
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

        {/* Login Link */}
        <p
          style={{
            textAlign: "center",
            fontSize: 14,
            color: "var(--color-text-secondary)",
            marginTop: 20,
            paddingBottom: 24,
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{ color: "var(--color-primary)", fontWeight: 600 }}
          >
            Sign In
          </Link>
        </p>
          </>
        )}
      </div>
    </div>
  );
}

// ── Helper Components ─────────────────────────────────────

function FormField({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 600,
          color: "var(--color-text-secondary)",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          style={{ fontSize: 12, color: "var(--color-error)", marginTop: 4 }}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function InputWithIcon({
  id,
  type,
  icon,
  placeholder,
  value,
  onChange,
  hasError,
  autoComplete,
  rightElement,
}: {
  id: string;
  type: string;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
  autoComplete?: string;
  rightElement?: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--color-text-muted)",
          pointerEvents: "none",
        }}
      >
        {icon}
      </div>
      <input
        id={id}
        type={type}
        className={`input-base ${hasError ? "error" : ""}`}
        style={{ paddingLeft: 42, paddingRight: rightElement ? 42 : 16 }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        aria-invalid={hasError}
      />
      {rightElement && (
        <div
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
          }}
        >
          {rightElement}
        </div>
      )}
    </div>
  );
}

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "var(--color-error)" };
  if (score <= 2) return { score: 2, label: "Fair", color: "var(--color-warning)" };
  if (score <= 3) return { score: 3, label: "Good", color: "#84cc16" };
  return { score: 4, label: "Strong", color: "var(--color-success)" };
}

function PasswordStrengthBar({
  strength,
}: {
  strength: ReturnType<typeof getPasswordStrength>;
}) {
  return (
    <div style={{ marginTop: 6 }}>
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 3,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background:
                i <= strength.score ? strength.color : "var(--color-border)",
              transition: "background 0.3s ease",
            }}
          />
        ))}
      </div>
      {strength.label && (
        <p
          style={{
            fontSize: 11,
            color: strength.color,
            fontWeight: 600,
          }}
        >
          {strength.label} password
        </p>
      )}
    </div>
  );
}
