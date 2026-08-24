"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Loader2, Search } from "lucide-react";
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

  return (
    <div className="w-full max-w-[430px] md:max-w-none mx-auto">
      {/* Header */}
      <div
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
          Same active ingredient, possibly lower cost
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

      <div style={{ padding: "16px" }}>
        {/* Current search context */}
        {activeSearch && (
          <div
            className="card"
            style={{
              padding: 14,
              marginBottom: 12,
              background: "var(--color-primary-50)",
              border: "1px solid var(--color-primary-200)",
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--color-primary)", marginBottom: 4 }}>
              SEARCHING ALTERNATIVES FOR
            </p>
            <p style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-primary)" }}>
              {activeSearch}
            </p>
          </div>
        )}

        {/* Important warning */}
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
              Consult before switching
            </p>
            <p style={{ fontSize: 12, color: "#78350f", lineHeight: 1.5 }}>
              These are possible alternatives with the same active ingredient. Do NOT switch medicines without discussing with your pharmacist or doctor first.
            </p>
          </div>
        </div>

        {/* Alternatives list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <Loader2
              size={28}
              style={{
                color: "var(--color-primary)",
                margin: "0 auto 12px",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>
              Finding alternatives...
            </p>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ color: "var(--color-error)", marginBottom: 12 }}>
              Failed to load alternatives
            </p>
            <button className="btn-secondary" onClick={() => load(activeSearch)}>
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        ) : (
          <>
            <p className="section-title">
              {alternatives.length} Alternatives Found
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
              {alternatives.map((alt, i) => (
                <motion.div
                  key={alt.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="card"
                  style={{ padding: 14 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {alt.name}
                      </p>
                      <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                        {alt.manufacturer}
                      </p>
                    </div>
                    {alt.price && (
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p
                          style={{
                            fontSize: 17,
                            fontWeight: 800,
                            color: "var(--color-primary)",
                          }}
                        >
                          {formatCurrency(alt.price, alt.currency)}
                        </p>
                        {alt.pack_size && (
                          <p style={{ fontSize: 10, color: "var(--color-text-muted)" }}>
                            per {alt.pack_size}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <span className="badge badge-primary">{alt.active_ingredient}</span>
                    <span className="badge badge-muted">{alt.strength}</span>
                    <span className="badge badge-muted">{alt.dosage_form}</span>
                  </div>

                  <p
                    style={{
                      fontSize: 10,
                      color: "var(--color-text-muted)",
                      marginTop: 8,
                    }}
                  >
                    Source: {alt.data_source}
                    {alt.last_updated
                      ? ` · Updated ${new Date(alt.last_updated).toLocaleDateString()}`
                      : ""}
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
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading alternatives...</div>}>
      <AlternativesContent />
    </Suspense>
  );
}
