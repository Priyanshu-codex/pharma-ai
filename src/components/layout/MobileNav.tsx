"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  ChevronRight,
  Home,
  ScanLine,
  GraduationCap,
  User,
  Settings,
  LogOut,
  CheckCircle2,
  Tag,
  RefreshCw,
  Activity,
  BookOpen,
  AlertCircle,
  BarChart2,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";

interface MobileNavProps {
  mode?: "patient" | "student";
  userName?: string;
  userInitials?: string;
}

interface NavLinkItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

// SECONDARY FEATURES ONLY (Excludes primary items present in Patient BottomNav: /dashboard, /scan, /medicines, /reminders, /assistant)
const patientSecondaryNavItems: NavLinkItem[] = [
  { href: "/learn", label: "Learn Hub", icon: <GraduationCap size={18} /> },
  { href: "/prices", label: "Price Comparison", icon: <Tag size={18} /> },
  { href: "/alternatives", label: "Generic Alternatives", icon: <RefreshCw size={18} /> },
  { href: "/adherence", label: "Adherence Tracker", icon: <Activity size={18} /> },
  { href: "/terms", label: "Terms & Conditions", icon: <FileText size={18} /> },
  { href: "/privacy", label: "Privacy Policy", icon: <ShieldCheck size={18} /> },
];

// SECONDARY FEATURES ONLY (Excludes primary items present in Student BottomNav: /learn, /mechanisms, /interactions, /quizzes, /assistant)
const studentSecondaryNavItems: NavLinkItem[] = [
  { href: "/dashboard", label: "Main Dashboard", icon: <Home size={18} /> },
  { href: "/scan", label: "Scan & OCR", icon: <ScanLine size={18} /> },
  { href: "/cases", label: "Clinical Cases", icon: <BookOpen size={18} /> },
  { href: "/side-effects", label: "Side Effects Explorer", icon: <AlertCircle size={18} /> },
  { href: "/market", label: "Market Insights", icon: <BarChart2 size={18} /> },
  { href: "/terms", label: "Terms & Conditions", icon: <FileText size={18} /> },
  { href: "/privacy", label: "Privacy Policy", icon: <ShieldCheck size={18} /> },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "n1",
    title: "Medication Reminder",
    body: "Time to take Metformin 500mg (1 tablet with water).",
    time: "10 mins ago",
    unread: true,
  },
  {
    id: "n2",
    title: "Weekly Adherence Update",
    body: "You hit a 4-day streak! Adherence is at 78%.",
    time: "2 hours ago",
    unread: true,
  },
];

export function MobileNav({ mode = "patient", userName, userInitials }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const secondaryNavItems = mode === "student" ? studentSecondaryNavItems : patientSecondaryNavItems;
  const unreadCount = notifications.filter((n) => n.unread).length;
  const displayName = userName || "User";
  const initials =
    userInitials ||
    (displayName
      ? displayName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U");

  // Prevent background scroll when drawer or notification sheet is open
  useEffect(() => {
    if (drawerOpen || notifOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen, notifOpen]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <header
      className="md:hidden sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs select-none h-16"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      role="banner"
    >
      <div className="px-3.5 sm:px-4 h-full flex items-center justify-between max-w-7xl mx-auto w-full relative">
        {/* ── LEFT COLUMN: HAMBURGER BUTTON (44px TOUCH TARGET) ── */}
        <div className="flex items-center flex-1 justify-start">
          <button
            onClick={() => {
              setDrawerOpen((v) => !v);
              setNotifOpen(false);
            }}
            className={cn(
              "min-w-[44px] min-h-[44px] w-11 h-11 rounded-full flex items-center justify-center transition-colors touch-manipulation focus-visible:outline-2 focus-visible:outline-teal-600",
              drawerOpen
                ? "bg-teal-50 text-teal-700"
                : "text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 active:bg-slate-100"
            )}
            aria-label={drawerOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={drawerOpen}
          >
            {/* Animated 3-line Hamburger to X */}
            <div className="w-5 h-4 flex flex-col justify-between items-center relative" aria-hidden="true">
              <span
                className={cn(
                  "w-5 h-0.5 bg-current rounded-full transition-all duration-300 transform origin-center",
                  drawerOpen && "rotate-45 translate-y-[7px]"
                )}
              />
              <span
                className={cn(
                  "w-5 h-0.5 bg-current rounded-full transition-all duration-200",
                  drawerOpen && "opacity-0 scale-x-0"
                )}
              />
              <span
                className={cn(
                  "w-5 h-0.5 bg-current rounded-full transition-all duration-300 transform origin-center",
                  drawerOpen && "-rotate-45 -translate-y-[7px]"
                )}
              />
            </div>
          </button>
        </div>

        {/* ── CENTER COLUMN: BRAND LOGO ─────────────────────────── */}
        <div className="flex items-center justify-center flex-shrink-0">
          <Link
            href={mode === "patient" ? "/dashboard" : "/learn"}
            className="flex items-center gap-1.5"
            aria-label="PharmaAI Home"
          >
            <Logo size="sm" />
          </Link>
        </div>

        {/* ── RIGHT COLUMN: ACTIONS (BELL + PROFILE AVATAR) ─────── */}
        <div className="flex items-center flex-1 justify-end gap-1">
          {/* Notification Bell Button */}
          <button
            onClick={() => {
              setNotifOpen((v) => !v);
              setDrawerOpen(false);
            }}
            className={cn(
              "relative min-w-[44px] min-h-[44px] w-11 h-11 rounded-full flex items-center justify-center transition-colors touch-manipulation focus-visible:outline-2 focus-visible:outline-teal-600",
              notifOpen
                ? "bg-teal-50 text-teal-700"
                : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 active:bg-slate-100"
            )}
            aria-label="Notifications"
            aria-expanded={notifOpen}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-extrabold text-white shadow-2xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile Avatar Capsule */}
          <Link
            href="/profile"
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-600 to-sky-600 text-white text-xs font-black flex items-center justify-center border border-white shadow-2xs focus-visible:outline-2 focus-visible:outline-teal-600 flex-shrink-0"
            aria-label="User Profile"
          >
            {initials}
          </Link>
        </div>
      </div>

      {/* ── MOBILE NAVIGATION DRAWER (SECONDARY FEATURES ONLY) ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-[100] md:hidden"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Slide-over Drawer Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-[360px] bg-white border-r border-slate-200 z-[100] flex flex-col justify-between shadow-2xl md:hidden"
              style={{
                paddingTop: "env(safe-area-inset-top, 0px)",
                paddingBottom: "env(safe-area-inset-bottom, 0px)",
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation Menu"
            >
              {/* Drawer Header */}
              <div>
                <div className="px-4 h-16 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Logo size="sm" />
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors focus-visible:outline-2 focus-visible:outline-teal-600"
                    aria-label="Close navigation"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Section Header */}
                <div className="px-4 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Additional Features
                </div>

                {/* Secondary Navigation Items (Excludes Bottom Nav Items) */}
                <nav className="p-2.5 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
                  {secondaryNavItems.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/dashboard" &&
                        item.href !== "/learn" &&
                        pathname.startsWith(item.href));

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDrawerOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all touch-manipulation focus-visible:outline-2 focus-visible:outline-teal-600",
                          isActive
                            ? "bg-teal-50 text-teal-900 border-l-3 border-teal-600 font-bold"
                            : "text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "flex items-center justify-center",
                              isActive ? "text-teal-600" : "text-slate-400"
                            )}
                          >
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight
                          size={15}
                          className={cn(
                            "transition-colors",
                            isActive ? "text-teal-600" : "text-slate-300"
                          )}
                        />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Account / Footer Section */}
              <div className="p-3 border-t border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-sky-600 text-white text-xs font-black flex items-center justify-center shadow-2xs border border-white">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{displayName}</p>
                    <p className="text-[10px] text-slate-500">Authenticated User</p>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <Link
                    href="/profile"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:text-slate-900 transition-colors focus-visible:outline-2 focus-visible:outline-teal-600"
                  >
                    <User size={16} className="text-slate-400" />
                    My Profile
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:text-slate-900 transition-colors focus-visible:outline-2 focus-visible:outline-teal-600"
                  >
                    <Settings size={16} className="text-slate-400" />
                    Settings
                  </Link>

                  <button
                    onClick={async () => {
                      setDrawerOpen(false);
                      try {
                        const { createClient } = await import("@/lib/supabase/client");
                        const supabase = createClient();
                        await supabase.auth.signOut();
                      } catch {}
                      localStorage.removeItem("pharmaai_auth");
                      localStorage.removeItem("pharmaai_email");
                      localStorage.removeItem("pharmaai_name");
                      localStorage.removeItem("pharmaai_role");
                      router.push("/login");
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left focus-visible:outline-2 focus-visible:outline-teal-600"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MOBILE NOTIFICATION SHEET ──────────────────────────── */}
      <AnimatePresence>
        {notifOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-[100] md:hidden"
              onClick={() => setNotifOpen(false)}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-2xl border-t border-slate-200 z-[100] flex flex-col shadow-2xl md:hidden overflow-hidden"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
              role="dialog"
              aria-modal="true"
              aria-label="Notifications"
            >
              {/* Sheet Drag Indicator */}
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-2.5 mb-1" />

              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-teal-600" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-teal-600 hover:underline font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 size={12} />
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                    aria-label="Close notifications"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No notifications right now.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "p-4 transition-colors flex items-start gap-3 relative",
                        item.unread ? "bg-teal-50/50" : ""
                      )}
                    >
                      <div className="mt-0.5 p-1.5 rounded-full bg-teal-100/70 text-teal-700 flex-shrink-0">
                        <Bell size={14} />
                      </div>
                      <div className="flex-1 pr-4">
                        <p className="text-xs font-bold text-slate-800">{item.title}</p>
                        <p className="text-xs text-slate-600 mt-0.5 leading-snug">{item.body}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{item.time}</p>
                      </div>
                      <button
                        onClick={() => removeNotification(item.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded"
                        title="Dismiss"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                <Link
                  href="/reminders"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-bold text-teal-600 hover:text-teal-800 transition-colors"
                >
                  Manage Reminders & Schedules →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
