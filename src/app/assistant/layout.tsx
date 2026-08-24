"use client";

import { useState } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopNav } from "@/components/layout/TopNav";
import type { UserRole } from "@/lib/types";

const DEMO_USER = { name: "Priyanshu", initials: "P" };

export default function AssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode] = useState<UserRole>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pharmaai_role") as UserRole | null;
      if (stored === "patient" || stored === "student") {
        return stored;
      }
    }
    return "patient";
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-surface)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopNav mode={mode} userName={DEMO_USER.name} userInitials={DEMO_USER.initials} />
      <main style={{ flex: 1 }}>{children}</main>
      <div className="md:hidden">
        <BottomNav mode={mode} />
      </div>
    </div>
  );
}
