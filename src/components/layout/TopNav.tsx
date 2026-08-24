"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  User,
  LogOut,
  ChevronDown,
  Settings,
  CheckCircle2,
  X,
  Sparkles,
  Home,
  Pill,
  ScanLine,
  GraduationCap,
  Zap,
  AlertTriangle,
  LineChart,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";

interface TopNavProps {
  mode: "patient" | "student";
  userName?: string;
  userInitials?: string;
  onRoleSwitch?: () => void;
}

interface NavLinkItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  isAi?: boolean;
}

// Navigation lists using Lucide React icons (no emojis)
const patientPrimaryItems: NavLinkItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <Home size={15} /> },
  { href: "/medicines", label: "My Medicines", icon: <Pill size={15} /> },
  { href: "/reminders", label: "Reminders", icon: <Bell size={15} /> },
  { href: "/assistant", label: "AI Assistant", icon: <Sparkles size={15} />, isAi: true },
];

const patientSecondaryItems: NavLinkItem[] = [
  { href: "/scan", label: "Scan & OCR", icon: <ScanLine size={15} /> },
  { href: "/learn", label: "Learn Hub", icon: <GraduationCap size={15} /> },
];

const studentPrimaryItems: NavLinkItem[] = [
  { href: "/learn", label: "Learn Hub", icon: <GraduationCap size={15} /> },
  { href: "/mechanisms", label: "Mechanisms", icon: <Zap size={15} /> },
  { href: "/interactions", label: "Interactions", icon: <AlertTriangle size={15} /> },
  { href: "/assistant", label: "AI Assistant", icon: <Sparkles size={15} />, isAi: true },
];

const studentSecondaryItems: NavLinkItem[] = [
  { href: "/quizzes", label: "Quizzes", icon: <LineChart size={15} /> },
  { href: "/dashboard", label: "Dashboard", icon: <Home size={15} /> },
];

// Unread notification state
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

export function TopNav({ mode, userName, userInitials }: TopNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const primaryLinks = mode === "student" ? studentPrimaryItems : patientPrimaryItems;
  const secondaryLinks = mode === "student" ? studentSecondaryItems : patientSecondaryItems;
  const allLinks = [...primaryLinks, ...secondaryLinks];

  const unreadCount = notifications.filter((n) => n.unread).length;
  const displayName = userName || "User";
  
  // Initials formatting with fallback
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <header
      className="hidden md:block sticky top-0 z-40 w-full pointer-events-none"
      role="banner"
    >
      <div className="max-w-[1440px] mx-auto px-4 xl:px-6 pt-3 pb-3 pointer-events-auto">
        <div
          className={cn(
            "flex items-center justify-between gap-4 px-5 xl:px-7 h-16 rounded-[20px] transition-all duration-300",
            "bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)]",
            scrolled && "bg-white/95 border-slate-300/80 shadow-[0_8px_30px_rgba(13,148,136,0.08)]"
          )}
        >
          {/* ── ZONE 1: BRAND LOGO ONLY ─────────────────────────── */}
          <div className="flex items-center flex-shrink-0">
            <Link
              href={mode === "patient" ? "/dashboard" : "/learn"}
              className="flex items-center gap-2 group select-none py-1"
              aria-label="PharmaAI Home"
            >
              <div className="transition-transform duration-200 group-hover:scale-[1.02]">
                <Logo size="md" />
              </div>
            </Link>
          </div>

          {/* ── ZONE 2: NAVIGATION ──────────────────────────────── */}
          <nav
            className="flex items-center gap-1 xl:gap-1.5"
            aria-label="Desktop Navigation"
          >
            {/* XL+ view (Full 6 items direct) */}
            <div className="hidden xl:flex items-center gap-1.5">
              {allLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/dashboard" && link.href !== "/learn" && pathname.startsWith(link.href));

                if (link.isAi) {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 select-none whitespace-nowrap",
                        isActive
                          ? "bg-teal-50 text-teal-800 border border-teal-200/90 shadow-2xs"
                          : "text-teal-700 bg-teal-50/40 hover:bg-teal-50 hover:text-teal-900 border border-teal-100/70"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Sparkles size={15} className="text-teal-600 flex-shrink-0" />
                      <span>{link.label}</span>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13.5px] font-medium transition-all duration-200 select-none whitespace-nowrap group",
                      isActive
                        ? "text-teal-700 bg-teal-50/80 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span
                      className={cn(
                        "transition-colors duration-200 flex items-center justify-center",
                        isActive ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600"
                      )}
                    >
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="topNavActiveBarDesktop"
                        className="absolute bottom-0 left-3 right-3 h-[2px] bg-teal-600 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* LG view (4 Primary items + More Menu dropdown) */}
            <div className="flex xl:hidden items-center gap-1">
              {primaryLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/dashboard" && link.href !== "/learn" && pathname.startsWith(link.href));

                if (link.isAi) {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-semibold transition-all duration-200 select-none whitespace-nowrap",
                        isActive
                          ? "bg-teal-50 text-teal-800 border border-teal-200/90 shadow-2xs"
                          : "text-teal-700 bg-teal-50/40 hover:bg-teal-50 hover:text-teal-900 border border-teal-100/70"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Sparkles size={14} className="text-teal-600 flex-shrink-0" />
                      <span>{link.label}</span>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 select-none whitespace-nowrap group",
                      isActive
                        ? "text-teal-700 bg-teal-50/80 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span
                      className={cn(
                        "transition-colors duration-200 flex items-center justify-center",
                        isActive ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600"
                      )}
                    >
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* More Menu for LG screens */}
              <div className="relative">
                <button
                  onClick={() => {
                    setMoreOpen((v) => !v);
                    setNotifOpen(false);
                    setProfileOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-200 text-slate-600 hover:bg-slate-100/60 hover:text-slate-900",
                    moreOpen && "bg-slate-100 text-slate-900"
                  )}
                  aria-expanded={moreOpen}
                  aria-label="More options menu"
                >
                  <MoreHorizontal size={15} />
                  <span>More</span>
                  <ChevronDown
                    size={12}
                    className={cn("transition-transform duration-200", moreOpen && "transform rotate-180")}
                  />
                </button>

                <AnimatePresence>
                  {moreOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute left-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1.5 overflow-hidden"
                      >
                        {secondaryLinks.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMoreOpen(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-teal-50/60 hover:text-teal-900 transition-colors"
                          >
                            <span className="text-slate-400">{item.icon}</span>
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </nav>

          {/* ── ZONE 3: RIGHT COMMAND AREA (NOTIFICATIONS & PROFILE) ─ */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Notification Button (40px) */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setProfileOpen(false);
                  setMoreOpen(false);
                }}
                className={cn(
                  "relative w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 select-none",
                  notifOpen
                    ? "bg-teal-50 border-teal-200 text-teal-600 shadow-2xs"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
                )}
                aria-label="Notifications"
                aria-expanded={notifOpen}
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-2xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Panel */}
              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2.5 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell size={15} className="text-teal-600" />
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Notifications
                          </span>
                          {unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                              {unreadCount} unread
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-xs text-teal-600 hover:underline font-semibold flex items-center gap-1"
                          >
                            <CheckCircle2 size={12} />
                            Mark read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-400">
                            No notifications right now.
                          </div>
                        ) : (
                          notifications.map((item) => (
                            <div
                              key={item.id}
                              className={cn(
                                "p-3.5 transition-colors flex items-start gap-3 relative group",
                                item.unread ? "bg-teal-50/50" : "hover:bg-slate-50"
                              )}
                            >
                              <div className="mt-0.5 p-1.5 rounded-full bg-teal-100/70 text-teal-700 flex-shrink-0">
                                <Bell size={13} />
                              </div>
                              <div className="flex-1 pr-4">
                                <p className="text-xs font-bold text-slate-800">{item.title}</p>
                                <p className="text-xs text-slate-600 mt-0.5 leading-snug">{item.body}</p>
                                <p className="text-[10px] text-slate-400 mt-1">{item.time}</p>
                              </div>
                              <button
                                onClick={() => removeNotification(item.id)}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 rounded transition-opacity"
                                title="Dismiss"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
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
            </div>

            {/* Profile Capsule */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen((v) => !v);
                  setNotifOpen(false);
                  setMoreOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 h-10 pl-2 pr-3 rounded-full border transition-all duration-200 select-none",
                  profileOpen
                    ? "bg-teal-50 border-teal-200 shadow-2xs"
                    : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                )}
                aria-label="User profile menu"
                aria-expanded={profileOpen}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-teal-600 to-sky-600 text-white text-xs font-black flex items-center justify-center shadow-2xs border border-white">
                  {initials}
                </div>
                <span className="text-xs font-bold text-slate-800 max-w-[110px] truncate">
                  {displayName}
                </span>
                <ChevronDown
                  size={14}
                  className={cn(
                    "text-slate-400 transition-transform duration-200",
                    profileOpen && "transform rotate-180 text-teal-600"
                  )}
                />
              </button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2.5 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-1.5 overflow-hidden"
                      role="menu"
                    >
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-800 truncate">{displayName}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                          Authenticated User
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-teal-50/60 hover:text-slate-900 transition-colors"
                          role="menuitem"
                          onClick={() => setProfileOpen(false)}
                        >
                          <User size={14} className="text-slate-400" />
                          My Profile
                        </Link>

                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-teal-50/60 hover:text-slate-900 transition-colors"
                          role="menuitem"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Settings size={14} className="text-slate-400" />
                          Settings
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 pt-1 mt-1">
                        <button
                          onClick={async () => {
                            setProfileOpen(false);
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
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                          role="menuitem"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
