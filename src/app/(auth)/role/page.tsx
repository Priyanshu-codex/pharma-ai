"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import type { UserRole } from "@/lib/types";

const roles: {
  id: UserRole;
  icon: string;
  title: string;
  subtitle: string;
  features: string[];
  color: string;
  bgColor: string;
}[] = [
  {
    id: "patient",
    icon: "🏥",
    title: "Patient",
    subtitle: "Understand and manage my medicines",
    features: [
      "Scan medicines to get instant information",
      "Read and review prescriptions",
      "Set medication reminders",
      "Track adherence & doses",
      "Compare generic alternatives & prices",
      "Ask the AI health assistant",
    ],
    color: "var(--color-primary)",
    bgColor: "var(--color-primary-50)",
  },
  {
    id: "student",
    icon: "🎓",
    title: "Pharmacy Student",
    subtitle: "Learn and practice pharmaceutical knowledge",
    features: [
      "Study drug mechanisms of action",
      "Explore side effects and interactions",
      "Practice interactive clinical cases",
      "Take AI-powered quizzes",
      "View pharmaceutical market insights",
      "Ask the AI study assistant",
    ],
    color: "#7c3aed",
    bgColor: "#f5f3ff",
  },
];

export default function RolePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Guard: Only authenticated users can access mode selection
  useEffect(() => {
    import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user && !localStorage.getItem("pharmaai_auth")) {
          router.replace("/login");
        } else {
          const storedRole = (user?.user_metadata?.role || localStorage.getItem("pharmaai_role")) as UserRole | null;
          if (storedRole === "patient" || storedRole === "student") {
            setSelected(storedRole);
          }
          setAuthChecking(false);
        }
      });
    });
  }, [router]);

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  async function handleContinue() {
    if (!selected) return;
    setLoading(true);

    try {
      localStorage.setItem("pharmaai_role", selected);

      const hasSupabase =
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("your-project") &&
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

      if (hasSupabase) {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        await supabase.auth.updateUser({
          data: { role: selected },
        });

        const { updateUserProfile } = await import("@/lib/supabase/data-service");
        await updateUserProfile({ role: selected });
      }

      if (selected === "patient") {
        router.replace("/dashboard");
      } else {
        router.replace("/learn");
      }
    } catch {
      if (selected === "patient") {
        router.replace("/dashboard");
      } else {
        router.replace("/learn");
      }
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
        padding: "24px 20px",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 24px)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
        maxWidth: 480,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", marginBottom: 32 }}
      >
        {/* Logo */}
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
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "var(--color-text-primary)",
            marginBottom: 8,
          }}
        >
          How will you use PharmaAI?
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "var(--color-text-secondary)",
            lineHeight: 1.6,
          }}
        >
          Choose your role to get a personalised experience. You can switch later.
        </p>
      </motion.div>

      {/* Role Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        {roles.map((role, i) => {
          const isSelected = selected === role.id;
          return (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              onClick={() => setSelected(role.id)}
              style={{
                background: isSelected ? role.bgColor : "var(--color-bg)",
                border: `2px solid ${isSelected ? role.color : "var(--color-border)"}`,
                borderRadius: "var(--radius-xl)",
                padding: 20,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
                boxShadow: isSelected
                  ? `0 4px 20px ${role.color}25`
                  : "var(--shadow-card)",
                transform: isSelected ? "translateY(-1px)" : "none",
              }}
              aria-pressed={isSelected}
              aria-label={`Select ${role.title} role`}
            >
              {/* Card Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "var(--radius-md)",
                      background: isSelected ? `${role.color}15` : "var(--color-surface-alt)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                      transition: "background 0.2s ease",
                    }}
                  >
                    {role.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 17,
                        color: isSelected ? role.color : "var(--color-text-primary)",
                        marginBottom: 2,
                      }}
                    >
                      {role.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--color-text-secondary)",
                        fontWeight: 500,
                      }}
                    >
                      {role.subtitle}
                    </div>
                  </div>
                </div>

                {/* Check circle */}
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: isSelected ? `2px solid ${role.color}` : "2px solid var(--color-border)",
                    background: isSelected ? role.color : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                  }}
                >
                  {isSelected && <CheckCircle size={14} style={{ color: "white" }} />}
                </div>
              </div>

              {/* Features */}
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {role.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      color: "var(--color-text-secondary)",
                      padding: "4px 0",
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: isSelected ? role.color : "var(--color-text-muted)",
                        flexShrink: 0,
                        transition: "background 0.2s ease",
                      }}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.button>
          );
        })}
      </div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{ marginTop: 24 }}
      >
        <button
          className="btn-primary"
          style={{
            width: "100%",
            justifyContent: "center",
            opacity: selected ? 1 : 0.5,
          }}
          disabled={!selected || loading}
          onClick={handleContinue}
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              Continue as {selected === "patient" ? "Patient" : selected === "student" ? "Student" : "..."}
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
