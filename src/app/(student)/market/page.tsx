"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart2, Loader2 } from "lucide-react";
import { mockGetMarketInsights } from "@/lib/ai/mock-responses";
import type { MarketInsight } from "@/lib/types";

export default function MarketPage() {
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockGetMarketInsights().then((data) => {
      setInsights(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ maxWidth: 430, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          background: "var(--color-bg)",
          padding: "16px 20px 14px",
          borderBottom: "1px solid var(--color-border-light)",
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--color-text-primary)" }}>
          Market Insights
        </h1>
        <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
          Pharmaceutical market data & trends
        </p>
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
            marginBottom: 16,
            alignItems: "flex-start",
            fontSize: 12,
            color: "#1e40af",
            lineHeight: 1.5,
          }}
        >
          <BarChart2 size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          Data shown is for educational purposes. Sources are indicated per insight. Do not use for investment or clinical decisions without verified data.
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <Loader2 size={28} style={{ color: "var(--color-primary)", margin: "0 auto 12px", animation: "spin 1s linear infinite" }} />
            <p style={{ color: "var(--color-text-muted)" }}>Loading market data...</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {insights.map((insight, i) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card"
                style={{ padding: 16 }}
              >
                {/* Category */}
                <span
                  className="badge badge-primary"
                  style={{ marginBottom: 10, display: "inline-flex" }}
                >
                  {insight.category}
                </span>

                {/* Title */}
                <h2 style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-primary)", marginBottom: 8, lineHeight: 1.4 }}>
                  {insight.title}
                </h2>

                {/* Summary */}
                <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: 12 }}>
                  {insight.summary}
                </p>

                {/* Data Points */}
                {insight.data_points && insight.data_points.length > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    {insight.data_points.map((dp) => (
                      <div
                        key={dp.label}
                        style={{
                          background: "var(--color-primary-50)",
                          borderRadius: "var(--radius-md)",
                          padding: "10px 8px",
                          textAlign: "center",
                        }}
                      >
                        <p style={{ fontSize: 15, fontWeight: 800, color: "var(--color-primary)", marginBottom: 2 }}>
                          {dp.value}
                        </p>
                        <p style={{ fontSize: 10, color: "var(--color-text-secondary)", lineHeight: 1.3 }}>
                          {dp.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Source */}
                <p style={{ fontSize: 10, color: "var(--color-text-muted)" }}>
                  📊 Source: {insight.source} ·{" "}
                  {new Date(insight.published_date).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
