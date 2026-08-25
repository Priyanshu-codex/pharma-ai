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
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-text-primary)] flex flex-col justify-between overflow-x-hidden w-full">
      {/* ── Public Header ────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[var(--color-border-light)] w-full">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 md:px-8 py-3 flex items-center justify-between gap-2 min-w-0">
          <Link href="/splash" className="flex items-center gap-2 flex-shrink-0">
            <Logo size="md" />
          </Link>
          <div className="flex items-center gap-2.5 sm:gap-4 text-xs md:text-sm font-medium flex-shrink-0">
            <Link
              href="/login"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors px-1"
            >
              Sign In
            </Link>
            <Link href="/signup" className="btn-primary text-xs py-1.5 px-2.5 sm:px-4">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ────────────────────────────── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 md:px-8 py-6 md:py-12 min-w-0">
        {/* Title Banner */}
        <div className="mb-6 md:mb-12 text-center md:text-left bg-gradient-to-r from-[#f0fdfa] to-white p-4 sm:p-6 md:p-10 rounded-xl md:rounded-2xl border border-[#ccfbf1] min-w-0 break-words">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary)] text-xs font-semibold mb-3 border border-[var(--color-primary-100)]">
            <ShieldCheck size={14} className="flex-shrink-0" /> <span>Official Document</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight break-words">
            {title}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[var(--color-text-secondary)] mt-2 max-w-2xl mx-auto md:mx-0 break-words">
            {subtitle}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-3 sm:mt-4 font-medium">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Grid Layout: TOC Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start min-w-0">
          {/* Table of Contents (Desktop Sidebar / Mobile Top Menu) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-20 bg-white p-3.5 sm:p-5 rounded-xl border border-[var(--color-border)] shadow-sm w-full min-w-0">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--color-text-primary)] mb-2.5 pb-2 border-b border-[var(--color-border-light)]">
              <BookOpen size={16} className="text-[var(--color-primary)] flex-shrink-0" />
              <span>Table of Contents</span>
            </div>
            <nav className="flex flex-col gap-1 max-h-[35vh] sm:max-h-[45vh] lg:max-h-[60vh] overflow-y-auto pr-1">
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
                    className={`flex items-center justify-between text-xs md:text-sm py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-lg transition-all min-w-0 ${
                      isActive
                        ? "bg-[var(--color-primary-50)] text-[var(--color-primary)] font-semibold border-l-2 border-[var(--color-primary)]"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    <span className="truncate pr-2">{idx + 1}. {item.title}</span>
                    <ChevronRight size={14} className={`flex-shrink-0 ${isActive ? "opacity-100" : "opacity-0"}`} />
                  </a>
                );
              })}
            </nav>
          </aside>

          {/* Document Content */}
          <article className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-10 rounded-xl md:rounded-2xl border border-[var(--color-border)] shadow-sm space-y-8 md:space-y-10 leading-relaxed text-xs sm:text-sm md:text-base text-[var(--color-text-secondary)] w-full min-w-0 break-words [overflow-wrap:anywhere]">
            {children}
          </article>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-[var(--color-border)] py-6 sm:py-8 mt-8 sm:mt-12 w-full">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left min-w-0">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Logo size="sm" />
            <span className="text-xs text-[var(--color-text-muted)]">
              © {new Date().getFullYear()} PharmaAI. All rights reserved.
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 sm:gap-6 text-xs text-[var(--color-text-secondary)] font-medium">
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
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 p-2.5 sm:p-3 rounded-full bg-[var(--color-primary)] text-white shadow-lg hover:bg-[var(--color-primary-dark)] transition-all transform hover:scale-105"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}
