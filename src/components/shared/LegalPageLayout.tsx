"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUp, BookOpen, ShieldCheck, ChevronRight } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

interface TocItem {
  id: string;
  title: string;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  toc: TocItem[];
  children: React.ReactNode;
}

export function LegalPageLayout({
  title,
  subtitle,
  lastUpdated,
  toc,
  children,
}: LegalPageLayoutProps) {
  const [activeId, setActiveId] = useState<string>(toc[0]?.id || "");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      const sectionElements = toc
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      const scrollPosition = window.scrollY + 140;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el.offsetTop <= scrollPosition) {
          setActiveId(el.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-text-primary)] flex flex-col justify-between">
      {/* ── Public Header ────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[var(--color-border-light)]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          <Link href="/splash" className="flex items-center gap-2">
            <Logo size="md" />
          </Link>
          <div className="flex items-center gap-4 text-xs md:text-sm font-medium">
            <Link
              href="/login"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            >
              Sign In
            </Link>
            <Link href="/signup" className="btn-primary text-xs py-1.5 px-3 md:py-2 md:px-4">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ────────────────────────────── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Title Banner */}
        <div className="mb-8 md:mb-12 text-center md:text-left bg-gradient-to-r from-[#f0fdfa] to-white p-6 md:p-10 rounded-2xl border border-[#ccfbf1]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary)] text-xs font-semibold mb-3 border border-[var(--color-primary-100)]">
            <ShieldCheck size={14} /> Official Document
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
            {title}
          </h1>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] mt-2 max-w-2xl">
            {subtitle}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-4 font-medium">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Grid Layout: TOC Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Table of Contents (Desktop Sidebar / Mobile Top Dropdown) */}
          <aside className="lg:col-span-4 sticky top-20 bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
              <BookOpen size={16} className="text-[var(--color-primary)]" />
              Table of Contents
            </div>
            <nav className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-1">
              {toc.map((item, idx) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.getElementById(item.id);
                      if (target) {
                        const yOffset = -90;
                        const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: "smooth" });
                        setActiveId(item.id);
                      }
                    }}
                    className={`flex items-center justify-between text-xs md:text-sm py-2 px-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-[var(--color-primary-50)] text-[var(--color-primary)] font-semibold border-l-2 border-[var(--color-primary)]"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    <span className="truncate">{idx + 1}. {item.title}</span>
                    <ChevronRight size={14} className={isActive ? "opacity-100" : "opacity-0"} />
                  </a>
                );
              })}
            </nav>
          </aside>

          {/* Document Content */}
          <article className="lg:col-span-8 bg-white p-6 md:p-10 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-10 leading-relaxed text-sm md:text-base text-[var(--color-text-secondary)]">
            {children}
          </article>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-[var(--color-border)] py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="text-xs text-[var(--color-text-muted)]">
              © {new Date().getFullYear()} PharmaAI. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-[var(--color-text-secondary)] font-medium">
            <Link href="/terms" className="hover:text-[var(--color-primary)] transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-[var(--color-primary)] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/splash" className="hover:text-[var(--color-primary)] transition-colors">
              Home
            </Link>
          </div>
        </div>
      </footer>

      {/* ── Back to top floating button ─────────────────────── */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[var(--color-primary)] text-white shadow-lg hover:bg-[var(--color-primary-dark)] transition-all transform hover:scale-105"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}
