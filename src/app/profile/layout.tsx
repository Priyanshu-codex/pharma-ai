"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopNav } from "@/components/layout/TopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { NotificationProvider } from "@/lib/context/NotificationContext";
import type { UserRole } from "@/lib/types";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const [mode, setMode] = useState<UserRole>("patient");

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
          if (role === "patient" || role === "student") {
            setMode(role as UserRole);
          } else if (!role) {
            router.replace("/role");
          }
        } else {
          const storedName = localStorage.getItem("pharmaai_name");
          if (storedName) setUserName(storedName);
          const storedRole = localStorage.getItem("pharmaai_role") as UserRole | null;
          if (storedRole === "patient" || storedRole === "student") {
            setMode(storedRole);
          }
        }
      });
    });
  }, [router]);

  return (
    <NotificationProvider>
      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-surface)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MobileNav mode={mode} userName={userName} userInitials={userName ? userName.charAt(0).toUpperCase() : "P"} />
        <TopNav mode={mode} userName={userName} userInitials={userName ? userName.charAt(0).toUpperCase() : "P"} />
        <main style={{ flex: 1 }}>{children}</main>
        <div className="md:hidden">
          <BottomNav mode={mode} />
        </div>
      </div>
    </NotificationProvider>
  );
}
