"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { mockGetMechanism } from "@/lib/ai/mock-responses";
import type { DrugMechanism } from "@/lib/types";

const POPULAR_DRUGS = [
  "Metformin", "Atorvastatin", "Lisinopril", "Omeprazole",
  "Amoxicillin", "Salbutamol", "Warfarin", "Aspirin",
];

export default function MechanismsPage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [mechanism, setMechanism] = useState<DrugMechanism | null>(null);
  const [showPK, setShowPK] = useState(false);

  async function lookup(drugName: string) {
    if (!drugName.trim()) return;
    setLoading(true);
    setMechanism(null);
    try {
      const data = await mockGetMechanism(drugName);
      setMechanism(data);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    lookup(search);
  }

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
          Drug Mechanisms
        </h1>
        <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
          Learn how drugs work
        </p>

        <form onSubmit={handleSearch} style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={16}
              style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", pointerEvents: "none" }}
            />
            <input
              type="search"
              className="input-base"
              style={{ paddingLeft: 38 }}
              placeholder="Search drug name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search drug name"
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: "0 16px" }}>
            Search
          </button>
        </form>
      </div>

      <div style={{ padding: "16px" }}>
        {/* Popular Drugs */}
        {!mechanism && !loading && (
          <div style={{ marginBottom: 20 }}>
            <p className="section-title">Popular Drugs</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {POPULAR_DRUGS.map((drug) => (
                <button
                  key={drug}
                  onClick={() => { setSearch(drug); lookup(drug); }}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "var(--radius-full)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg)",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--color-text-secondary)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = "var(--color-primary-50)";
                    (e.target as HTMLElement).style.color = "var(--color-primary)";
                    (e.target as HTMLElement).style.borderColor = "var(--color-primary-light)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = "var(--color-bg)";
                    (e.target as HTMLElement).style.color = "var(--color-text-secondary)";
                    (e.target as HTMLElement).style.borderColor = "var(--color-border)";
                  }}
                >
                  {drug}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <Loader2 size={28} style={{ color: "var(--color-primary)", margin: "0 auto 12px", animation: "spin 1s linear infinite" }} />
            <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>
              Loading drug information...
            </p>
          </div>
        )}

        {/* Result */}
        {mechanism && !loading && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            {/* Drug header */}
            <div
              className="card"
              style={{
                padding: 16,
                marginBottom: 12,
                background: "linear-gradient(135deg, #f5f3ff, white)",
                border: "1px solid #ddd6fe",
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    background: "#ede9fe",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    flexShrink: 0,
                  }}
                >
                  💊
                </div>
                <div>
                  <h2 style={{ fontWeight: 800, fontSize: 18, color: "var(--color-text-primary)", marginBottom: 2 }}>
                    {mechanism.drug_name}
                  </h2>
                  <span className="badge" style={{ background: "#ede9fe", color: "#7c3aed" }}>
                    {mechanism.drug_class}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #ddd6fe" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#7c3aed", marginBottom: 4 }}>
                  THERAPEUTIC USE
                </p>
                <p style={{ fontSize: 14, color: "var(--color-text-primary)", fontWeight: 500 }}>
                  {mechanism.therapeutic_use}
                </p>
              </div>
            </div>

            {/* Mechanism */}
            <div className="card" style={{ padding: 14, marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: 8 }}>
                MECHANISM OF ACTION
              </p>
              <p style={{ fontSize: 14, color: "var(--color-text-primary)", fontWeight: 600, marginBottom: 8 }}>
                {mechanism.mechanism}
              </p>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                {mechanism.how_it_works}
              </p>
            </div>

            {/* Key Points */}
            <div className="card" style={{ padding: 14, marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: 10 }}>
                🔑 KEY LEARNING POINTS
              </p>
              {mechanism.key_points.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "7px 0",
                    borderBottom: i < mechanism.key_points.length - 1 ? "1px solid var(--color-border-light)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      background: "var(--color-primary-100)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 800,
                      color: "var(--color-primary)",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                    {point}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Pharmacokinetics */}
            {mechanism.pharmacokinetics && (
              <div className="card" style={{ padding: 14 }}>
                <button
                  onClick={() => setShowPK((v) => !v)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-secondary)" }}>
                    PHARMACOKINETICS (ADME)
                  </p>
                  {showPK ? (
                    <ChevronUp size={18} style={{ color: "var(--color-text-muted)" }} />
                  ) : (
                    <ChevronDown size={18} style={{ color: "var(--color-text-muted)" }} />
                  )}
                </button>

                {showPK && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    style={{ marginTop: 12 }}
                  >
                    {Object.entries(mechanism.pharmacokinetics).map(([key, value]) => (
                      value && (
                        <div
                          key={key}
                          style={{
                            padding: "8px 0",
                            borderBottom: "1px solid var(--color-border-light)",
                          }}
                        >
                          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", marginBottom: 3 }}>
                            {key}
                          </p>
                          <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                            {value as string}
                          </p>
                        </div>
                      )
                    ))}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
