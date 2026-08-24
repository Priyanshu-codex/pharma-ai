"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Info, TrendingDown } from "lucide-react";
import { mockGetPrices } from "@/lib/ai/mock-responses";
import { formatCurrency } from "@/lib/utils";
import type { PriceEntry } from "@/lib/types";

export default function PricesPage() {
  const [prices, setPrices] = useState<PriceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("Paracetamol 500mg");
  const [query, setQuery] = useState("Paracetamol 500mg");

  useEffect(() => {
    let isMounted = true;
    mockGetPrices(query).then((data) => {
      if (isMounted) {
        setPrices(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [query]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    setQuery(search.trim());
  }

  const cheapest = prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : null;
  const mostExpensive = prices.length > 0 ? Math.max(...prices.map((p) => p.price)) : null;
  const savings = cheapest && mostExpensive ? mostExpensive - cheapest : null;

  return (
    <div style={{ maxWidth: 430, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          background: "var(--color-bg)",
          padding: "16px 20px 14px",
          borderBottom: "1px solid var(--color-border-light)",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--color-text-primary)" }}>
          Price Comparison
        </h1>
        <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
          Find the best price for your medicines
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 13,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-muted)",
                pointerEvents: "none",
              }}
            />
            <input
              type="search"
              className="input-base"
              style={{ paddingLeft: 38 }}
              placeholder="Search medicine name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search for medicine prices"
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: "0 16px" }}>
            Search
          </button>
        </form>
      </div>

      <div style={{ padding: "16px" }}>
        {/* Disclaimer */}
        <div
          style={{
            background: "var(--color-info-bg)",
            borderRadius: "var(--radius-md)",
            padding: "10px 14px",
            display: "flex",
            gap: 8,
            marginBottom: 14,
            alignItems: "flex-start",
          }}
        >
          <Info size={15} style={{ color: "var(--color-info)", flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#1e40af", lineHeight: 1.5 }}>
            Prices are indicative and may vary. Always verify current prices at the pharmacy. Last updated times are shown per source.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <Loader2
              size={28}
              style={{ color: "var(--color-primary)", margin: "0 auto 12px", animation: "spin 1s linear infinite" }}
            />
            <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Searching prices...</p>
          </div>
        ) : prices.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ color: "var(--color-text-muted)" }}>No prices found for this medicine.</p>
          </div>
        ) : (
          <>
            {/* Savings summary */}
            {savings && savings > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{
                  padding: 14,
                  marginBottom: 14,
                  background: "var(--color-success-bg)",
                  border: "1px solid #a7f3d0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <TrendingDown size={24} style={{ color: "var(--color-success)" }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: "#065f46" }}>
                      Save up to {formatCurrency(savings)} on {query}
                    </p>
                    <p style={{ fontSize: 12, color: "#047857" }}>
                      Best price: {formatCurrency(cheapest!)} vs highest: {formatCurrency(mostExpensive!)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <p className="section-title">
              {prices.length} prices found for &quot;{query}&quot;
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {prices
                .sort((a, b) => a.price - b.price)
                .map((entry, i) => {
                  const isCheapest = entry.price === cheapest;
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="card"
                      style={{
                        padding: 14,
                        border: isCheapest
                          ? "1.5px solid var(--color-primary-200)"
                          : "1px solid var(--color-border)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                            <p style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-primary)" }}>
                              {entry.brand}
                            </p>
                            {isCheapest && (
                              <span className="badge badge-success">Best Price</span>
                            )}
                          </div>
                          <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                            {entry.retailer} · {entry.pack_size}
                          </p>
                        </div>
                        <p
                          style={{
                            fontSize: 22,
                            fontWeight: 800,
                            color: isCheapest ? "var(--color-primary)" : "var(--color-text-primary)",
                          }}
                        >
                          {formatCurrency(entry.price, entry.currency)}
                        </p>
                      </div>

                      <p style={{ fontSize: 10, color: "var(--color-text-muted)", marginTop: 8 }}>
                        Source: {entry.source} · Updated: {new Date(entry.last_updated).toLocaleDateString()}
                      </p>
                    </motion.div>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
