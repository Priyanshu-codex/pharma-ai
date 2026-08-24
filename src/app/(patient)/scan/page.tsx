"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { MedDisclaimer } from "@/components/shared/MedDisclaimer";
import { ConfidenceBadge } from "@/components/shared/ConfidenceBadge";
import { mockScanMedicine } from "@/lib/ai/mock-responses";
import type { ScanStatus, ScanResult } from "@/lib/types";
import Link from "next/link";

export default function ScanPage() {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showAllInfo, setShowAllInfo] = useState(false);
  const [addedToMeds, setAddedToMeds] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setStatus("scanning");
    setResult(null);
    setAddedToMeds(false);

    try {
      setStatus("processing");
      const scanResult = await mockScanMedicine();
      if (scanResult.confidence < 0.6) {
        setStatus("low_confidence");
      } else {
        setStatus("success");
      }
      setResult(scanResult);
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
    setResult(null);
    setPreview(null);
    setAddedToMeds(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
        <h1
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "var(--color-text-primary)",
          }}
        >
          Scan Medicine
        </h1>
        <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
          Identify any medicine with AI
        </p>
      </div>

      <div style={{ padding: "16px 16px" }}>
        {/* ── IDLE / CAPTURE STATES ─────────────────────── */}
        <AnimatePresence mode="wait">
          {(status === "idle" || status === "capturing") && !preview && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              {/* Scanner Zone */}
              <div
                style={{
                  background: "var(--color-primary-50)",
                  border: "2px dashed var(--color-primary-200)",
                  borderRadius: "var(--radius-xl)",
                  padding: "36px 24px",
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                {/* Capsule illustration */}
                <div style={{ fontSize: 56, marginBottom: 16 }}>💊</div>
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: 17,
                    color: "var(--color-text-primary)",
                    marginBottom: 8,
                  }}
                >
                  Point camera at medicine
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.6,
                    marginBottom: 20,
                  }}
                >
                  Scan the medicine packaging, label, or blister pack. AI will identify the medicine and provide key information.
                </p>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: "center" }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera size={18} />
                    Camera
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ flex: 1, justifyContent: "center" }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={18} />
                    Upload
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </div>

              {/* Tips */}
              <div className="card" style={{ padding: 14 }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                    marginBottom: 8,
                  }}
                >
                  📸 Tips for best results
                </p>
                {[
                  "Ensure the label is clearly visible and in focus",
                  "Good lighting improves accuracy",
                  "Capture the full medicine name",
                  "Avoid glare and shadows",
                ].map((tip) => (
                  <p
                    key={tip}
                    style={{
                      fontSize: 12,
                      color: "var(--color-text-muted)",
                      padding: "3px 0",
                    }}
                  >
                    · {tip}
                  </p>
                ))}
              </div>

              <MedDisclaimer style={{ marginTop: 12 }} />
            </motion.div>
          )}

          {/* ── SCANNING / PROCESSING STATE ─────────────── */}
          {(status === "scanning" || status === "processing") && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center" }}
            >
              {/* Preview Image with scan line */}
              {preview && (
                <div
                  style={{
                    position: "relative",
                    borderRadius: "var(--radius-xl)",
                    overflow: "hidden",
                    marginBottom: 20,
                    aspectRatio: "4/3",
                  }}
                >
                  <img
                    src={preview}
                    alt="Medicine being scanned"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "brightness(0.85)",
                    }}
                  />
                  {/* Scan line animation */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      border: "2px solid var(--color-primary)",
                      borderRadius: "var(--radius-xl)",
                    }}
                  />
                  <div className="scan-line" />
                  {/* Corner markers */}
                  {[
                    { top: 12, left: 12, borderWidth: "2px 0 0 2px" },
                    { top: 12, right: 12, borderWidth: "2px 2px 0 0" },
                    { bottom: 12, left: 12, borderWidth: "0 0 2px 2px" },
                    { bottom: 12, right: 12, borderWidth: "0 2px 2px 0" },
                  ].map((style, i) => (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        width: 20,
                        height: 20,
                        borderColor: "var(--color-primary)",
                        borderStyle: "solid",
                        ...style,
                      }}
                    />
                  ))}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <Loader2
                  size={22}
                  style={{ color: "var(--color-primary)", animation: "spin 1s linear infinite" }}
                />
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {status === "scanning"
                    ? "Scanning medicine..."
                    : "Processing with AI..."}
                </p>
              </div>
              <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                This may take a few seconds
              </p>
            </motion.div>
          )}

          {/* ── RESULT STATE ─────────────────────────────── */}
          {(status === "success" || status === "low_confidence") && result?.medicine && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Medicine Card */}
              <div className="card" style={{ padding: 16, marginBottom: 12 }}>
                {/* Image + Name */}
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    marginBottom: 14,
                    alignItems: "flex-start",
                  }}
                >
                  {preview && (
                    <img
                      src={preview}
                      alt={result.medicine.name}
                      style={{
                        width: 72,
                        height: 72,
                        objectFit: "cover",
                        borderRadius: "var(--radius-md)",
                        flexShrink: 0,
                        border: "1px solid var(--color-border)",
                      }}
                    />
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2
                      style={{
                        fontSize: 17,
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                        marginBottom: 2,
                      }}
                    >
                      {result.medicine.name}
                    </h2>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--color-text-secondary)",
                        marginBottom: 4,
                      }}
                    >
                      {result.medicine.active_ingredient} · {result.medicine.dosage_form}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                      {result.medicine.manufacturer}
                    </p>
                  </div>
                </div>

                {/* Confidence */}
                <ConfidenceBadge
                  confidence={result.confidence}
                  showDescription={status === "low_confidence"}
                />

                {/* Low confidence warning */}
                {status === "low_confidence" && (
                  <div
                    style={{
                      background: "var(--color-warning-bg)",
                      border: "1px solid #fde68a",
                      borderRadius: "var(--radius-md)",
                      padding: "10px 12px",
                      display: "flex",
                      gap: 8,
                      marginTop: 10,
                    }}
                    role="alert"
                  >
                    <AlertTriangle
                      size={15}
                      style={{ color: "var(--color-warning)", flexShrink: 0, marginTop: 1 }}
                    />
                    <p style={{ fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
                      Low confidence result. Please verify this information manually before acting on it.
                    </p>
                  </div>
                )}

                {/* Details */}
                <div
                  style={{
                    marginTop: 14,
                    borderTop: "1px solid var(--color-border-light)",
                    paddingTop: 14,
                  }}
                >
                  <InfoRow label="Strength" value={result.medicine.strength} />
                  <InfoRow
                    label="Manufacturer"
                    value={result.medicine.manufacturer ?? "—"}
                  />

                  {result.medicine.description && (
                    <div style={{ marginTop: 10 }}>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--color-text-secondary)",
                          marginBottom: 4,
                        }}
                      >
                        About
                      </p>
                      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                        {result.medicine.description}
                      </p>
                    </div>
                  )}

                  {/* Expandable: Uses & Side Effects */}
                  <button
                    onClick={() => setShowAllInfo((v) => !v)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 10,
                      background: "none",
                      border: "none",
                      color: "var(--color-primary)",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {showAllInfo ? (
                      <>
                        Show less <ChevronUp size={15} />
                      </>
                    ) : (
                      <>
                        Show uses & side effects <ChevronDown size={15} />
                      </>
                    )}
                  </button>

                  {showAllInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      style={{ marginTop: 10 }}
                    >
                      {result.medicine.uses && result.medicine.uses.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 4 }}>
                            Uses
                          </p>
                          {result.medicine.uses.map((use) => (
                            <p key={use} style={{ fontSize: 12, color: "var(--color-text-secondary)", padding: "2px 0" }}>
                              · {use}
                            </p>
                          ))}
                        </div>
                      )}
                      {result.medicine.side_effects && (
                        <div style={{ marginBottom: 10 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 4 }}>
                            Side Effects
                          </p>
                          {result.medicine.side_effects.map((se) => (
                            <p key={se} style={{ fontSize: 12, color: "var(--color-text-secondary)", padding: "2px 0" }}>
                              · {se}
                            </p>
                          ))}
                        </div>
                      )}
                      {result.medicine.warnings && (
                        <div
                          style={{
                            background: "var(--color-warning-bg)",
                            borderRadius: "var(--radius-sm)",
                            padding: "10px 12px",
                          }}
                        >
                          <p style={{ fontSize: 12, fontWeight: 600, color: "#92400e", marginBottom: 4 }}>
                            ⚠️ Warnings
                          </p>
                          {result.medicine.warnings.map((w) => (
                            <p key={w} style={{ fontSize: 12, color: "#92400e", padding: "2px 0" }}>
                              · {w}
                            </p>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Data source */}
                  <p style={{ fontSize: 10, color: "var(--color-text-muted)", marginTop: 12 }}>
                    Source: {result.medicine.data_source}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                <button
                  className="btn-primary"
                  style={{ justifyContent: "center" }}
                  onClick={() => setAddedToMeds(true)}
                  disabled={addedToMeds}
                >
                  {addedToMeds ? (
                    <>
                      <CheckCircle size={18} />
                      Added to My Medicines
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Add to My Medicines
                    </>
                  )}
                </button>

                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href="/alternatives"
                    className="btn-secondary"
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    View Alternatives
                  </Link>
                  <Link
                    href="/prices"
                    className="btn-secondary"
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    Compare Prices
                  </Link>
                </div>

                <button className="btn-ghost" style={{ justifyContent: "center" }} onClick={reset}>
                  <RefreshCw size={16} />
                  Scan Another
                </button>
              </div>

              <MedDisclaimer />
            </motion.div>
          )}

          {/* ── ERROR STATE ───────────────────────────────── */}
          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: "center", padding: "40px 20px" }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  background: "var(--color-error-bg)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <AlertTriangle
                  size={32}
                  style={{ color: "var(--color-error)" }}
                />
              </div>
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: 17,
                  color: "var(--color-text-primary)",
                  marginBottom: 8,
                }}
              >
                Scan Failed
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--color-text-secondary)",
                  marginBottom: 20,
                }}
              >
                Unable to identify this medicine. Please try again with a
                clearer image.
              </p>
              <button className="btn-primary" style={{ justifyContent: "center" }} onClick={reset}>
                <RefreshCw size={16} />
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "5px 0",
        fontSize: 13,
        borderBottom: "1px solid var(--color-border-light)",
      }}
    >
      <span style={{ color: "var(--color-text-muted)" }}>{label}</span>
      <span
        style={{ color: "var(--color-text-primary)", fontWeight: 500, textAlign: "right" }}
      >
        {value}
      </span>
    </div>
  );
}
