"use client";

import { useRouter } from "next/navigation";
import { TopNav } from "@/components/layout/TopNav";
import { BottomNav } from "@/components/layout/BottomNav";

const DEMO_USER = { name: "Priyanshu", initials: "P" };

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function handleSwitchRole() {
    try {
      const isMockMode =
        process.env.NEXT_PUBLIC_AI_MODE === "mock" ||
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

      localStorage.setItem("pharmaai_role", "patient");

      if (!isMockMode) {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        await supabase.auth.updateUser({
          data: { role: "patient" },
        });
      }
    } catch {
      // Fallback
    } finally {
      router.replace("/dashboard");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-surface)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Desktop Top Nav */}
      <TopNav
        mode="student"
        userName={DEMO_USER.name}
        userInitials={DEMO_USER.initials}
        onRoleSwitch={handleSwitchRole}
      />

      {/* Page Content */}
      <main
        className="page-content-mobile md:pb-0"
        style={{
          flex: 1,
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        <BottomNav mode="student" />
      </div>
    </div>
  );
}
