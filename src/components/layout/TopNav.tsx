"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Scan,
  Pill,
  Bell,
  MessageCircle,
  GraduationCap,
  Zap,
  AlertTriangle,
  LineChart,
  User,
  LogOut,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Logo } from "@/components/shared/Logo";

interface TopNavProps {
  mode: "patient" | "student";
  userName?: string;
  userInitials?: string;
  onRoleSwitch?: () => void;
}

const patientLinks = [
  { href: "/dashboard", label: "Home", icon: <Home size={16} /> },
  { href: "/scan", label: "Scan", icon: <Scan size={16} /> },
  { href: "/medicines", label: "Medicines", icon: <Pill size={16} /> },
  { href: "/reminders", label: "Reminders", icon: <Bell size={16} /> },
  { href: "/assistant", label: "Assistant", icon: <MessageCircle size={16} /> },
];

const studentLinks = [
  { href: "/learn", label: "Learn", icon: <GraduationCap size={16} /> },
  { href: "/mechanisms", label: "Mechanisms", icon: <Zap size={16} /> },
  { href: "/interactions", label: "Interactions", icon: <AlertTriangle size={16} /> },
  { href: "/quizzes", label: "Quizzes", icon: <LineChart size={16} /> },
  { href: "/assistant", label: "Assistant", icon: <MessageCircle size={16} /> },
];

export function TopNav({ mode, userName, userInitials, onRoleSwitch }: TopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const links = mode === "patient" ? patientLinks : studentLinks;

  return (
    <header className="top-nav hidden md:flex" role="banner">
      {/* Logo */}
      <Link href={mode === "patient" ? "/dashboard" : "/learn"} className="flex items-center gap-2 mr-8 flex-shrink-0">
        <Logo size="md" />
      </Link>

      {/* Nav Links */}
      <nav className="flex items-center gap-1 flex-1" aria-label="Desktop navigation">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" && link.href !== "/learn" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--color-primary-50)] text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text-primary)]"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right Side */}
      <div className="flex items-center gap-3 ml-4">
        {/* Mode Badge */}
        <span
          className="badge badge-primary hidden lg:inline-flex"
          style={{ textTransform: "capitalize" }}
        >
          {mode === "patient" ? "🏥 Patient" : "🎓 Student"}
        </span>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[var(--color-surface-alt)] transition-colors"
            aria-label="Profile menu"
            aria-expanded={profileOpen}
          >
            <div
              className="avatar"
              style={{ width: 34, height: 34, fontSize: 13 }}
            >
              {userInitials || "U"}
            </div>
            <ChevronDown size={14} style={{ color: "var(--color-text-muted)" }} />
          </button>

          {profileOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileOpen(false)}
              />
              {/* Dropdown */}
              <div
                className="absolute right-0 top-full mt-2 w-52 bg-white border border-[var(--color-border)] rounded-xl shadow-lg z-50 py-1 overflow-hidden"
                role="menu"
              >
                <div className="px-4 py-3 border-b border-[var(--color-border-light)]">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {userName || "User"}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5 capitalize">
                    {mode} mode
                  </p>
                </div>

                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text-primary)] transition-colors"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                >
                  <User size={15} />
                  My Profile
                </Link>

                {onRoleSwitch && (
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onRoleSwitch();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text-primary)] transition-colors"
                    role="menuitem"
                  >
                    <RefreshCw size={15} />
                    Switch to {mode === "patient" ? "Student" : "Patient"} Mode
                  </button>
                )}

                <div className="border-t border-[var(--color-border-light)] mt-1">
                  <button
                    onClick={async () => {
                      setProfileOpen(false);
                      // Sign out handled by auth context
                      router.push("/login");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    role="menuitem"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
