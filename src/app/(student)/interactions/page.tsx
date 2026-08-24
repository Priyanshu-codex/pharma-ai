"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, AlertTriangle, Shield, Info, Loader2 } from "lucide-react";
import { mockGetInteractions } from "@/lib/ai/mock-responses";
import type { DrugInteraction } from "@/lib/types";

export default function InteractionsPage() {
  const [drugA, setDrugA] = useState("");
  const [drugB, setDrugB] = useState("");
  const [loading, setLoading] = useState(false);
  const [interactions, setInteractions] = useState<DrugInteraction[] | null>(null);

  async function checkInteractions(e: React.FormEvent) {
    e.preventDefault();
    if (!drugA.trim() || !drugB.trim()) return;
    setLoading(true);
    setInteractions(null);
    try {
      const data = await mockGetInteractions(drugA, drugB);
      setInteractions(data);
    } finally {
      setLoading(false);
    }
  }

  const severityConfig: Record<string, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
    contraindicated: {
      label: "Contraindicated",
      bg: "#fff1f2",
      text: "#9f1239",
      border: "#fecdd3",
      icon: <AlertTriangle size={18} />,
    },
    major: {
      label: "Major",
      bg: "var(--color-error-bg)",
      text: "#991b1b",
      border: "#fecaca",
      icon: <AlertTriangle size={18} />,
    },
    moderate: {
      label: "Moderate",
      bg: "var(--color-warning-bg)",
      text: "#92400e",
      border: "#fde68a",
      icon: <Shield size={18} />,
    },
    minor: {
      label: "Minor",
      bg: "var(--color-info-bg)",
      text: "#1e40af",
      border: "#bfdbfe",
      icon: <Info size={18} />,
    },
  };

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
          Drug Interactions
        </h1>
        <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
          Check interactions between two drugs
        </p>
      </div>

      <div style={{ padding: "16px" }}>
        {/* Search Form */}
        <form onSubmit={checkInteractions} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 4, display: "block" }}>
                Drug A
              </label>
              <input
                type="text"
                className="input-base"
                placeholder="e.g. Warfarin"
                value={drugA}
                onChange={(e) => setDrugA(e.target.value)}
                required
              />
            </div>
            <div style={{ textAlign: "center", fontSize: 20 }}>⚡</div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 4, display: "block" }}>
                Drug B
              </label>
              <input
                type="text"
                className="input-base"
                placeholder="e.g. Aspirin"
                value={drugB}
                onChange={(e) => setDrugB(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={loading || !drugA.trim() || !drugB.trim()}
          >
            {loading ? (
              <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <>
                <Search size={18} />
                Check Interactions
              </>
            )}
          </button>
        </form>

        {/* Disclaimer */}
        <div
          style={{
            background: "var(--color-warning-bg)",
            border: "1px solid #fde68a",
            borderRadius: "var(--radius-md)",
            padding: "10px 14px",
            display: "flex",
            gap: 8,
            marginBottom: 16,
            alignItems: "flex-start",
          }}
        >
          <AlertTriangle size={15} style={{ color: "var(--color-warning)", flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#92400e", lineHeight: 1.5 }}>
            This tool is for educational purposes only. Always verify drug interactions with a clinical pharmacist or trusted drug interaction database (e.g. Micromedex, Drug.com) for patient care.
          </p>
        </div>

        {/* Results */}
        {interactions !== null && !loading && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {interactions.length === 0 ? (
              <div
                className="card"
                style={{ padding: 20, textAlign: "center" }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
                <p style={{ fontWeight: 700, color: "var(--color-success)", marginBottom: 4 }}>
                  No Known Interactions Found
                </p>
                <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                  No significant interactions between {drugA} and {drugB} were found in our database. However, always verify with a pharmacist.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p className="section-title">
                  {interactions.length} Interaction{interactions.length !== 1 ? "s" : ""} Found
                </p>
                {interactions.map((interaction) => {
                  const config = severityConfig[interaction.severity] || severityConfig.moderate;
                  return (
                    <div
                      key={interaction.id}
                      style={{
                        background: config.bg,
                        border: `1.5px solid ${config.border}`,
                        borderRadius: "var(--radius-lg)",
                        padding: 16,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <span style={{ color: config.text }}>{config.icon}</span>
                        <div>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              background: "white",
                              border: `1px solid ${config.border}`,
                              color: config.text,
                              padding: "2px 10px",
                              borderRadius: "var(--radius-full)",
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {config.label} Interaction
                          </span>
                        </div>
                      </div>

                      <p style={{ fontWeight: 700, fontSize: 14, color: config.text, marginBottom: 8 }}>
                        {interaction.drug_a} + {interaction.drug_b}
                      </p>

                      <p style={{ fontSize: 13, color: config.text, lineHeight: 1.6, marginBottom: 10 }}>
                        {interaction.description}
                      </p>

                      {interaction.mechanism && (
                        <div style={{ marginBottom: 8 }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: config.text, opacity: 0.8, marginBottom: 3 }}>
                            MECHANISM
                          </p>
                          <p style={{ fontSize: 12, color: config.text, lineHeight: 1.5 }}>
                            {interaction.mechanism}
                          </p>
                        </div>
                      )}

                      {interaction.management && (
                        <div
                          style={{
                            background: "white",
                            borderRadius: "var(--radius-sm)",
                            padding: "8px 12px",
                            marginTop: 8,
                          }}
                        >
                          <p style={{ fontSize: 11, fontWeight: 700, color: config.text, marginBottom: 3 }}>
                            MANAGEMENT
                          </p>
                          <p style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                            {interaction.management}
                          </p>
                        </div>
                      )}

                      <p style={{ fontSize: 10, color: config.text, opacity: 0.7, marginTop: 10 }}>
                        Source: {interaction.data_source}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
