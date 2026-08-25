"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopNav } from "@/components/layout/TopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { NotificationProvider } from "@/lib/context/NotificationContext";
import type { UserRole } from "@/lib/types";

export default function AssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const [mode, setMode] = useState<UserRole>("patient");

  useEffect(() => {
    const storedName = localStorage.getItem("pharmaai_name");
    const storedRole = localStorage.getItem("pharmaai_role") as UserRole | null;
    queueMicrotask(() => {
      if (storedName) setUserName(storedName);
      if (storedRole === "patient" || storedRole === "student") {
        setMode(storedRole);
      }
    });

    import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user && !localStorage.getItem("pharmaai_auth")) {
          router.replace("/login");
        } else if (user) {
          const name = user.user_metadata?.full_name || localStorage.getItem("pharmaai_name");
          if (name) setUserName(name);
          const role = user.user_metadata?.role || localStorage.getItem("pharmaai_role");
          if (role === "patient" || role === "student") {
            setMode(role as UserRole);
          }
        }
      });
    });
  }, [router]);

  const userInitials = userName && userName !== "User" ? userName.charAt(0).toUpperCase() : "U";

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
        <MobileNav mode={mode} userName={userName} userInitials={userInitials} />
        <TopNav mode={mode} userName={userName} userInitials={userInitials} />
        <main style={{ flex: 1 }}>{children}</main>
        <div className="md:hidden">
          <BottomNav mode={mode} />
        </div>
      </div>
    </NotificationProvider>
  );
}
