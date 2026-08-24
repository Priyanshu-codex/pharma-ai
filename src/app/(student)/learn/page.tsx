"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  AlertTriangle,
  Layers,
  BookOpen,
  TrendingUp,
  LineChart,
  MessageCircle,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

const FEATURES = [
  {
    href: "/mechanisms",
    icon: <Zap size={24} />,
    title: "Drug Mechanisms",
    description: "How drugs work at molecular level",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    href: "/side-effects",
    icon: <AlertTriangle size={24} />,
    title: "Side Effects",
    description: "Adverse effects & precautions",
    color: "#dc2626",
    bg: "#fef2f2",
  },
  {
    href: "/interactions",
    icon: <Layers size={24} />,
    title: "Drug Interactions",
    description: "Check drug-drug interactions",
    color: "#d97706",
    bg: "#fffbeb",
  },
  {
    href: "/cases",
    icon: <BookOpen size={24} />,
    title: "Clinical Cases",
    description: "Interactive case studies",
    color: "#0891b2",
    bg: "#ecfeff",
  },
  {
    href: "/market",
    icon: <TrendingUp size={24} />,
    title: "Market Insights",
    description: "Pharmaceutical market data",
    color: "#059669",
    bg: "#ecfdf5",
  },
  {
    href: "/quizzes",
    icon: <LineChart size={24} />,
    title: "AI Quizzes",
    description: "Test your knowledge",
    color: "#0d9488",
    bg: "#f0fdfa",
  },
];

const RECENT_TOPICS = [
  { name: "Beta-blockers", category: "Cardiovascular" },
  { name: "Metformin", category: "Diabetes" },
  { name: "ACE Inhibitors", category: "Cardiovascular" },
];

export default function LearnPage() {
  return (
    <div className="w-full max-w-[430px] md:max-w-none mx-auto pb-6">
      {/* ── Mobile Header (Hidden on Desktop) ──────────────────── */}
      <div
        className="md:hidden"
        style={{
          background: "var(--color-bg)",
          padding: "16px 20px 14px",
          borderBottom: "1px solid var(--color-border-light)",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 12, color: "var(--color-text-muted)", fontWeight: 500 }}>
              Study Dashboard
            </p>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--color-text-primary)" }}>
              Good morning, Student
            </h1>
          </div>
          <span className="badge" style={{ background: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe" }}>
            Student
          </span>
        </div>
      </div>

      {/* ── Desktop Page Header ─────────────────────────────── */}
      <div className="hidden md:flex items-center justify-between px-6 py-6 border-b border-[var(--color-border-light)] bg-white mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
            Pharmacy Student Learning Hub
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Master drug mechanisms, clinical cases, interactions, and AI-powered quizzes
          </p>
        </div>
        <Link href="/assistant" className="btn-primary" style={{ background: "#7c3aed" }}>
          <MessageCircle size={18} />
          AI Study Assistant
        </Link>
      </div>

      <div className="px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Column (2 cols on Desktop) */}
          <div className="md:col-span-2 space-y-6">
            {/* Progress summary */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
              style={{ padding: 16 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    background: "#f5f3ff",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <GraduationCap size={28} style={{ color: "#7c3aed" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-primary)", marginBottom: 4 }}>
                    Keep Learning!
                  </p>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div>
                      <span style={{ fontSize: 18, fontWeight: 800, color: "#7c3aed" }}>12</span>
                      <span style={{ fontSize: 11, color: "var(--color-text-muted)", marginLeft: 3 }}>quizzes completed</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 18, fontWeight: 800, color: "var(--color-primary)" }}>5</span>
                      <span style={{ fontSize: 11, color: "var(--color-text-muted)", marginLeft: 3 }}>cases solved</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 18, fontWeight: 800, color: "var(--color-success)" }}>82%</span>
                      <span style={{ fontSize: 11, color: "var(--color-text-muted)", marginLeft: 3 }}>avg score</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature Grid */}
            <div>
              <p className="section-title">Study Modules</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {FEATURES.map((feature, i) => (
                  <motion.div
                    key={feature.href}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link href={feature.href} style={{ textDecoration: "none" }}>
                      <div
                        className="card card-hover h-full"
                        style={{
                          padding: "16px 14px",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            background: feature.bg,
                            borderRadius: "var(--radius-md)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: feature.color,
                            marginBottom: 10,
                          }}
                        >
                          {feature.icon}
                        </div>
                        <p style={{ fontWeight: 700, fontSize: 13, color: "var(--color-text-primary)", marginBottom: 3 }}>
                          {feature.title}
                        </p>
                        <p style={{ fontSize: 11, color: "var(--color-text-muted)", lineHeight: 1.4 }}>
                          {feature.description}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Column (1 col on Desktop) */}
          <div className="space-y-6">
            {/* Quick Access: AI Assistant */}
            <Link href="/assistant" style={{ textDecoration: "none" }}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card"
                style={{
                  padding: "16px",
                  background: "linear-gradient(135deg, #f5f3ff, white)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #ddd6fe",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: "#7c3aed",
                      borderRadius: "var(--radius-md)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MessageCircle size={22} style={{ color: "white" }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: "var(--color-text-primary)" }}>
                      AI Study Assistant
                    </p>
                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                      Ask any pharmacology question
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} style={{ color: "var(--color-text-muted)" }} />
              </motion.div>
            </Link>

            {/* Recent Topics */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="section-title">Continue Learning</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {RECENT_TOPICS.map((topic) => (
                  <Link
                    key={topic.name}
                    href={`/mechanisms?drug=${encodeURIComponent(topic.name)}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className="card card-hover"
                      style={{
                        padding: "12px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          background: "#f5f3ff",
                          borderRadius: "var(--radius-md)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                          flexShrink: 0,
                        }}
                      >
                        🔬
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: 14, color: "var(--color-text-primary)" }}>
                          {topic.name}
                        </p>
                        <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                          {topic.category}
                        </p>
                      </div>
                      <ChevronRight size={16} style={{ color: "var(--color-text-muted)" }} />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
