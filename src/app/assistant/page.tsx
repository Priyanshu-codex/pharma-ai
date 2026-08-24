"use client";

import { useState, useEffect } from "react";
import { AIAssistant } from "@/components/shared/AIAssistant";
import type { UserRole } from "@/lib/types";

export default function AssistantPage() {
  const [mode, setMode] = useState<UserRole>("patient");

  useEffect(() => {
    const stored = localStorage.getItem("pharmaai_role") as UserRole | null;
    queueMicrotask(() => {
      if (stored === "patient" || stored === "student") {
        setMode(stored);
      }
    });

    import("@/lib/supabase/data-service").then(({ fetchUserProfile }) => {
      fetchUserProfile().then((profile) => {
        if (profile?.role) {
          const userRole = profile.role === "student" || profile.role === "pharmacy_student" ? "student" : "patient";
          setMode(userRole);
          localStorage.setItem("pharmaai_role", userRole);
        }
      });
    });
  }, []);

  return <AIAssistant mode={mode} />;
}
