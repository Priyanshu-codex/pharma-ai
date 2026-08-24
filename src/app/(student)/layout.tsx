"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/layout/TopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { BottomNav } from "@/components/layout/BottomNav";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user && !localStorage.getItem("pharmaai_auth")) {
          router.replace("/login");
        } else if (user) {
          const name = user.user_metadata?.full_name || localStorage.getItem("pharmaai_name");
          if (name) {
            setUserName(name);
          }
          const role = user.user_metadata?.role || localStorage.getItem("pharmaai_role");
          if (!role) {
            router.replace("/role");
          }
        } else {
          const stored = localStorage.getItem("pharmaai_name");
          if (stored) setUserName(stored);
        }
      });
    });
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-surface)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Mobile Top Nav (hidden on desktop) */}
      <MobileNav
        mode="student"
        userName={userName}
        userInitials={userName ? userName.charAt(0).toUpperCase() : "P"}
      />

      {/* Desktop Top Nav */}
      <TopNav
        mode="student"
        userName={userName}
        userInitials={userName ? userName.charAt(0).toUpperCase() : "P"}
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
