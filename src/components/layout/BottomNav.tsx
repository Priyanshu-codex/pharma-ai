"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Scan,
  Pill,
  Bell,
  MessageCircle,
  Zap,
  AlertTriangle,
  LineChart,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const patientNavItems: NavItem[] = [
  { href: "/dashboard", icon: <Home size={22} />, label: "Home" },
  { href: "/scan", icon: <Scan size={22} />, label: "Scan" },
  { href: "/medicines", icon: <Pill size={22} />, label: "Medicines" },
  { href: "/reminders", icon: <Bell size={22} />, label: "Reminders" },
  { href: "/assistant", icon: <MessageCircle size={22} />, label: "Assistant" },
];

const studentNavItems: NavItem[] = [
  { href: "/learn", icon: <GraduationCap size={22} />, label: "Learn" },
  { href: "/mechanisms", icon: <Zap size={22} />, label: "Mechanisms" },
  { href: "/interactions", icon: <AlertTriangle size={22} />, label: "Interactions" },
  { href: "/quizzes", icon: <LineChart size={22} />, label: "Quiz" },
  { href: "/assistant", icon: <MessageCircle size={22} />, label: "Assistant" },
];

interface BottomNavProps {
  mode: "patient" | "student";
}

export function BottomNav({ mode }: BottomNavProps) {
  const pathname = usePathname();
  const items = mode === "patient" ? patientNavItems : studentNavItems;

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" &&
            item.href !== "/learn" &&
            pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn("bottom-nav-item", isActive && "active")}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="bottom-nav-icon" aria-hidden="true">
              {isActive && <span className="bottom-nav-indicator" />}
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
