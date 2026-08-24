"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopNav } from "@/components/layout/TopNav";
import type { UserRole } from "@/lib/types";

export default function ProfileLayout({
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
  const [mode, setMode] = useState<UserRole>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pharmaai_role") as UserRole | null;
      if (stored === "patient" || stored === "student") {
        return stored;
      }
    }
    return "patient";
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
          if (role === "patient" || role === "student") {
            setMode(role as UserRole);
          } else if (!role) {
            router.replace("/role");
          }
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
      <TopNav mode={mode} userName={userName} userInitials={userName ? userName.charAt(0).toUpperCase() : "P"} />
      <main style={{ flex: 1 }}>{children}</main>
      <div className="md:hidden">
        <BottomNav mode={mode} />
      </div>
    </div>
  );
}
