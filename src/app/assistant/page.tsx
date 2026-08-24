"use client";

import { useState } from "react";
import { AIAssistant } from "@/components/shared/AIAssistant";
import type { UserRole } from "@/lib/types";

export default function AssistantPage() {
  const [mode] = useState<UserRole>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pharmaai_role") as UserRole | null;
      if (stored === "patient" || stored === "student") {
        return stored;
      }
    }
    return "patient";
  });

  return <AIAssistant mode={mode} />;
}
