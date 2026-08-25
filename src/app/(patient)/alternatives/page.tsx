"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Loader2, Search, TrendingDown } from "lucide-react";
import { MedDisclaimer } from "@/components/shared/MedDisclaimer";
import { formatCurrency } from "@/lib/utils";
import type { GenericAlternative } from "@/lib/types";

function AlternativesContent() {
  const searchParams = useSearchParams();
  const [alternatives, setAlternatives] = useState<GenericAlternative[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const drugParam = searchParams.get("drug") || "";
  const [prevDrug, setPrevDrug] = useState(drugParam);

  if (drugParam !== prevDrug) {
    setPrevDrug(drugParam);
    setSearchInput(drugParam);
    setActiveSearch(drugParam);
  }

  useEffect(() => {
    if (activeSearch) {
      load(activeSearch);
    }
  }, [activeSearch]);

  async function load(query: string) {
    setLoading(true);
    setError(false);
    try {
      const parts = query.trim().split(/\s+/);
      const strength = parts.find((p) => /\d/.test(p)) || "";
      const ingredient = parts.filter((p) => !/\d/.test(p)).join(" ") || query;

      const res = await fetch("/api/ai/alternatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredient, strength }),
      });
      const json = await res.json();
      setAlternatives(json.alternatives || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setActiveSearch(searchInput.trim());
  }

  // Derive savings summary across all alternatives
  const validPrices = alternatives.map((a) => a.price).filter((p): p is number => typeof p === "number" && p > 0);
  const lowestPrice = validPrices.length > 0 ? Math.min(...validPrices) : null;
  const highestSavings = alternatives
    .map((a) => a.savings)
    .filter((s): s is number => typeof s === "number" && s > 0);
  const maxSavingsAmount = highestSavings.length > 0 ? Math.max(...highestSavings) : null;

  return (
    <div className="w-full max-w-[430px] md:max-w-none mx-auto pb-6">
      {/* Mobile Header */}
      <div
        className="md:hidden"
        style={{
          background: "var(--color-bg)",
          padding: "16px 20px 14px",
          borderBottom: "1px solid var(--color-border-light)",
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--color-text-primary)" }}>
          Generic Alternatives
        </h1>
        <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
          Find lower-cost equivalent medicines & compare prices
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ marginTop: 12, position: "relative" }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            className="input-base"
            style={{ paddingLeft: 36, paddingRight: 80, fontSize: 13 }}
            placeholder="e.g. Paracetamol 500mg, Metformin…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{
              position: "absolute",
              right: 4,
              top: "50%",
              transform: "translateY(-50%)",
              padding: "6px 12px",
              fontSize: 12,
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Desktop Page Header */}
      <div className="hidden md:flex items-center justify-between px-6 py-6 border-b border-[var(--color-border-light)] bg-white mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
            Generic Alternatives & Price Comparison 💊
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Find therapeutically equivalent generic medicines with real-time price & savings comparison
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative w-80">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
            />
            <input
              type="search"
              className="input-base pl-9"
              placeholder="Search medicine or ingredient..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search generic alternatives"
            />
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>

      <div className="px-4 md:px-6">
        {/* Search Context & Savings Highlight Banner */}
        {activeSearch && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div
              className="card p-4"
              style={{
                background: "var(--color-primary-50)",
                border: "1px solid var(--color-primary-200)",
              }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--color-primary)", marginBottom: 2 }}>
                SEARCHING ALTERNATIVES FOR
              </p>
              <p style={{ fontWeight: 800, fontSize: 16, color: "var(--color-text-primary)" }}>
                {activeSearch}
              </p>
            </div>

            {maxSavingsAmount && maxSavingsAmount > 0 && (
              <div
                className="card p-4 flex items-center gap-3"
                style={{
                  background: "var(--color-success-bg)",
                  border: "1px solid #a7f3d0",
                }}
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-bold">
                  <TrendingDown size={22} />
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 14, color: "#065f46" }}>
                    Save up to {formatCurrency(maxSavingsAmount)}
                  </p>
                  <p style={{ fontSize: 12, color: "#047857" }}>
                    Lowest generic price: {lowestPrice ? formatCurrency(lowestPrice) : "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Medical Caution Alert */}
        <div
          style={{
            background: "var(--color-warning-bg)",
            border: "1px solid #fde68a",
            borderRadius: "var(--radius-md)",
            padding: "12px 14px",
            display: "flex",
            gap: 10,
            marginBottom: 16,
          }}
          role="note"
        >
          <AlertTriangle
            size={18}
            style={{ color: "var(--color-warning)", flexShrink: 0 }}
          />
          <div>
            <p style={{ fontWeight: 600, fontSize: 13, color: "#92400e", marginBottom: 2 }}>
              Medical Caution
            </p>
            <p style={{ fontSize: 12, color: "#78350f", lineHeight: 1.5 }}>
              These alternatives contain the same active ingredient. Always consult your doctor or pharmacist before switching medications.
            </p>
          </div>
        </div>

        {/* Results Container */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Loader2
              size={32}
              style={{
                color: "var(--color-primary)",
                margin: "0 auto 12px",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>
              Searching generic alternatives & comparing prices...
            </p>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ color: "var(--color-error)", marginBottom: 12 }}>
              Failed to load generic alternatives
            </p>
            <button className="btn-secondary" onClick={() => load(activeSearch)}>
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        ) : alternatives.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>
              {activeSearch ? `No alternatives found for "${activeSearch}".` : "Enter a medicine name above to find generic alternatives & compare prices."}
            </p>
          </div>
        ) : (
          <>
            <p className="section-title">
              {alternatives.length} Alternatives Found with Price Comparison
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {alternatives.map((alt, i) => (
                <motion.div
                  key={alt.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="card p-4 flex flex-col justify-between"
                  style={{
                    border: alt.savings && alt.savings > 0 ? "1.5px solid var(--color-primary-200)" : "1px solid var(--color-border)",
                  }}
                >
                  <div>
                    {/* Title & Availability */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-base text-[var(--color-text-primary)] leading-snug">
                          {alt.name}
                        </h3>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                          {alt.manufacturer}
                        </p>
                      </div>
                      <span className="badge badge-success flex-shrink-0 text-[10px]">
                        {alt.availability || "Available"}
                      </span>
                    </div>

                    {/* Active ingredient & form badges */}
                    <div className="flex flex-wrap gap-1.5 my-3">
                      <span className="badge badge-primary text-[11px]">{alt.active_ingredient}</span>
                      <span className="badge badge-muted text-[11px]">{alt.strength}</span>
                      <span className="badge badge-muted text-[11px]">{alt.dosage_form}</span>
                    </div>

                    {/* Integrated Price & Savings Block */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 my-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 font-medium block">Generic Price</span>
                          <span className="text-xl font-extrabold text-[var(--color-primary)]">
                            {alt.price ? formatCurrency(alt.price, alt.currency) : "Price unavailable"}
                          </span>
                          {alt.pack_size && (
                            <span className="text-[11px] text-slate-500 ml-1">/ {alt.pack_size}</span>
                          )}
                        </div>

                        {alt.original_price && alt.original_price > (alt.price || 0) && (
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block line-through">
                              Brand: {formatCurrency(alt.original_price, alt.currency)}
                            </span>
                            {alt.savings && (
                              <span className="badge badge-success text-[10px] font-bold mt-0.5 inline-block">
                                Save {formatCurrency(alt.savings)} ({alt.savings_percentage}%)
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Retailer price comparison if present */}
                      {alt.retailers && alt.retailers.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200/80">
                          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Pharmacy Comparison
                          </p>
                          <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                            {alt.retailers.map((r, idx) => (
                              <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                                {r.name}: <strong className="text-slate-800">{formatCurrency(r.price)}</strong>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-[10px] text-[var(--color-text-muted)] mt-2">
                    Source: {alt.data_source}
                    {alt.last_updated ? ` · Updated ${new Date(alt.last_updated).toLocaleDateString()}` : ""}
                  </p>
                </motion.div>
              ))}
            </div>
          </>
        )}

        <MedDisclaimer variant="full" />
      </div>
    </div>
  );
}

export default function AlternativesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading generic alternatives & prices...</div>}>
      <AlternativesContent />
    </Suspense>
  );
}
