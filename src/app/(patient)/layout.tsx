"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/layout/TopNav";
import { BottomNav } from "@/components/layout/BottomNav";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userName, setUserName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pharmaai_name") || "User";
    }
    return "User";
  });

  useEffect(() => {
    import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user && !localStorage.getItem("pharmaai_auth")) {
          router.replace("/login");
        } else if (user) {
          if (user.user_metadata?.full_name) {
            setUserName(user.user_metadata.full_name);
          }
          const role = user.user_metadata?.role || localStorage.getItem("pharmaai_role");
          if (!role) {
            router.replace("/role");
          }
        }
      });
    });
  }, [router]);

  async function handleSwitchRole() {
    try {
      localStorage.setItem("pharmaai_role", "student");
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: { role: "student" },
      });
    } catch {
      // Fallback
    } finally {
      router.replace("/learn");
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
      {/* Desktop Top Nav (hidden on mobile) */}
      <TopNav
        mode="patient"
        userName={userName}
        userInitials={userName ? userName.charAt(0).toUpperCase() : "P"}
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
        {/* Desktop: constrained width wrapper */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        <BottomNav mode="patient" />
      </div>
    </div>
  );
}
