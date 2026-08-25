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
import { CameraModal } from "@/components/shared/CameraModal";
import { mockScanMedicine } from "@/lib/ai/mock-responses";
import type { ScanStatus, ScanResult } from "@/lib/types";
import Link from "next/link";

export default function ScanPage() {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showAllInfo, setShowAllInfo] = useState(false);
  const [addedToMeds, setAddedToMeds] = useState(false);
  const [scanErrorMsg, setScanErrorMsg] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [frequency, setFrequency] = useState("Once daily");
  const [nextDoseTime, setNextDoseTime] = useState("09:00");
  const [showCamera, setShowCamera] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  async function handleAddMedicineConfirm() {
    setShowAddModal(false);
    setAddedToMeds(true);
    if (result?.medicine) {
      const { addMedicineToDB } = await import("@/lib/supabase/data-service");
      await addMedicineToDB({
        name: result.medicine.name,
        generic_name: result.medicine.active_ingredient,
        brand_name: result.medicine.name,
        manufacturer: result.medicine.manufacturer,
        strength: result.medicine.strength,
        dosage_form: result.medicine.dosage_form,
        frequency,
        next_dose: nextDoseTime,
        reminder_enabled: true,
        icon: "💊",
      });
    }
  }

  async function handleFileSelect(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageBase64 = e.target?.result as string;
      setPreview(imageBase64);

      setStatus("scanning");
      setResult(null);
      setScanErrorMsg(null);
      setAddedToMeds(false);

      try {
        setStatus("processing");

        // Send both filename and imageBase64 to the server for Gemini Vision analysis
        const res = await fetch("/api/scan/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, imageBase64 }),
        });

        const validation = await res.json();

        if (!validation.isMedicine) {
          setScanErrorMsg(validation.error || "No medicine detected. Please upload a clear photo of a medicine strip, box, tablet, or bottle.");
          setStatus("error");
          return;
        }

        const scanResult: ScanResult = validation.scanResult || (await mockScanMedicine());
        if (scanResult.confidence < 0.6) {
          setStatus("low_confidence");
        } else {
          setStatus("success");
        }
        setResult(scanResult);
      } catch {
        setScanErrorMsg("Unable to process image. Please try again with a clearer photo of a medicine.");
        setStatus("error");
      }
    };
    reader.readAsDataURL(file);
  }

  function reset() {
    setStatus("idle");
    setResult(null);
    setPreview(null);
    setScanErrorMsg(null);
    setAddedToMeds(false);
    if (uploadInputRef.current) uploadInputRef.current.value = "";
  }

  async function handleCameraCapture(dataUrl: string, file: File) {
    setShowCamera(false);
    setPreview(dataUrl);
    setStatus("scanning");
    setResult(null);
    setScanErrorMsg(null);
    setAddedToMeds(false);

    try {
      setStatus("processing");
      const res = await fetch("/api/scan/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, imageBase64: dataUrl }),
      });
      const validation = await res.json();
      if (!validation.isMedicine) {
        setScanErrorMsg(validation.error || "No medicine detected. Please capture a clear photo of a medicine strip, box, tablet, or bottle.");
        setStatus("error");
        return;
      }
      const scanResult: ScanResult = validation.scanResult || (await mockScanMedicine());
      setStatus(scanResult.confidence < 0.6 ? "low_confidence" : "success");
      setResult(scanResult);
    } catch {
      setScanErrorMsg("Unable to process image. Please try again with a clearer photo.");
      setStatus("error");
    }
  }

  return (
    <div className="w-full max-w-[430px] md:max-w-none mx-auto">
      {/* Mobile Header */}
      <div
        className="md:hidden"
        style={{
          background: "var(--color-bg)",
          padding: "16px 20px 14px",
          borderBottom: "1px solid var(--color-border-light)",
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

      {/* Desktop Page Header */}
      <div className="hidden md:block px-6 py-6 border-b border-[var(--color-border-light)] bg-white mb-6">
        <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)]">Scan Medicine 💊</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Identify any medicine with AI — scan or upload a photo of the packaging, label, or blister pack
        </p>
      </div>

      <div className="px-4 md:px-6">
        {/* ── IDLE / CAPTURE STATES ─────────────────────── */}
        <AnimatePresence mode="wait">
          {(status === "idle" || status === "capturing") && !preview && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Left: Scanner Zone */}
                <div>
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
                        onClick={() => setShowCamera(true)}
                      >
                        <Camera size={18} />
                        Camera
                      </button>
                      <button
                        className="btn-secondary"
                        style={{ flex: 1, justifyContent: "center" }}
                        onClick={() => uploadInputRef.current?.click()}
                      >
                        <Upload size={18} />
                        Upload
                      </button>
                    </div>

                    {/* Upload input — opens file picker / gallery */}
                    <input
                      ref={uploadInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                    />
                  </div>
                </div>

                {/* Right: Tips + Disclaimer */}
                <div>
                  {/* Tips */}
                  <div className="card" style={{ padding: 14, marginBottom: 12 }}>
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

                  <MedDisclaimer style={{ marginTop: 0 }} />
                </div>
              </div>
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
                    /* eslint-disable-next-line @next/next/no-img-element */
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
                  onClick={() => setShowAddModal(true)}
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
                    href={`/alternatives?drug=${encodeURIComponent(result?.medicine?.name || "")}`}
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    Generic Alternatives & Prices
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
                No Medicine Detected
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--color-text-secondary)",
                  marginBottom: 20,
                  maxWidth: 320,
                  margin: "0 auto 20px",
                  lineHeight: 1.5,
                }}
              >
                {scanErrorMsg || "The uploaded image does not appear to be a medicine. Please upload or capture a clear photo of a medicine packaging, strip, bottle, or label."}
              </p>
              <button className="btn-primary" style={{ justifyContent: "center" }} onClick={reset}>
                <RefreshCw size={16} />
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      {/* ── ADD MEDICINE CONFIRMATION MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add to My Medicines</h3>
            <p className="text-xs text-slate-500">
              Confirm dosage schedule for <strong>{result?.medicine?.name}</strong>
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="input-base"
              >
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Four times daily">Four times daily</option>
                <option value="As needed">As needed</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Next Dose Time</label>
              <input
                type="time"
                value={nextDoseTime}
                onChange={(e) => setNextDoseTime(e.target.value)}
                className="input-base"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-secondary flex-1 justify-center text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMedicineConfirm}
                className="btn-primary flex-1 justify-center text-xs"
              >
                Confirm & Save
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraModal
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
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
