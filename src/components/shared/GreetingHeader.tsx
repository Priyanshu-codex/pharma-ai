import React from "react";
import Link from "next/link";
import { Scan, FileText } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface GreetingHeaderProps {
  greeting: string;
  userName: string;
  subtitle?: string;
  roleBadge?: string;
  actions?: React.ReactNode;
}

export function GreetingHeader({
  greeting,
  userName,
  subtitle = "Here is your daily medication summary & schedule",
  roleBadge = "🏥 Patient",
  actions,
}: GreetingHeaderProps) {
  const displayName = userName ? userName.split(" ")[0] : "there";
  const fullName = userName || "there";

  return (
    <div className="w-full bg-white border-b border-[var(--color-border-light)] relative z-10 mb-4 md:mb-6">
      <div className="px-4 py-3 md:px-6 md:py-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-2xl font-extrabold text-[var(--color-text-primary)]">
              {greeting}, {displayName}
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[var(--color-text-muted)] mt-0.5 md:mt-1">
            {subtitle}
          </p>
        </div>

        {/* Right side for desktop actions & mobile role/avatar badge */}
        <div className="flex items-center gap-2.5 md:gap-3">
          {/* Mobile Right: Role chip + Avatar */}
          <div className="flex md:hidden items-center gap-2">
            <span className="badge badge-primary text-[11px] px-2 py-0.5">
              {roleBadge}
            </span>
            <Link href="/profile" aria-label="Profile" className="flex-shrink-0">
              <div
                className="avatar"
                style={{
                  width: 34,
                  height: 34,
                  fontSize: 12,
                  fontWeight: 700,
                  background: "var(--color-primary)",
                  color: "white",
                }}
              >
                {getInitials(fullName)}
              </div>
            </Link>
          </div>

          {/* Desktop Right: Quick Action Buttons or custom actions */}
          <div className="hidden md:flex items-center gap-3">
            {actions || (
              <>
                <Link href="/scan" className="btn-primary text-sm py-2 px-4">
                  <Scan size={17} />
                  Scan Medicine
                </Link>
                <Link href="/scan/prescription" className="btn-secondary text-sm py-2 px-4">
                  <FileText size={17} />
                  Scan Prescription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
