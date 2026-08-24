"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Camera,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Loader2,
  ArrowRight,
  Info,
} from "lucide-react";
import { mockScanPrescription } from "@/lib/ai/mock-responses";
import { ConfidenceBadge } from "@/components/shared/ConfidenceBadge";
import { MedDisclaimer } from "@/components/shared/MedDisclaimer";
import type { PrescriptionMedicine } from "@/lib/types";

type PageState = "upload" | "scanning" | "review" | "confirmed";

export default function PrescriptionPage() {
  const [state, setState] = useState<PageState>("upload");
  const [preview, setPreview] = useState<string | null>(null);
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setState("scanning");

    const extracted = await mockScanPrescription();
    setMedicines(extracted);
    setState("review");
  }

  function handleRemove(id: string) {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  }

  function handleConfirm() {
    setState("confirmed");
  }

  const lowConfidenceCount = medicines.filter((m) => m.confidence < 0.7).length;

  return (
    <div className="w-full max-w-[430px] md:max-w-none mx-auto pb-6">
      {/* ── Mobile Header (Hidden on Desktop) ──────────────────── */}
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
          Scan Prescription
        </h1>
        <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
          Extract and schedule medicines from your prescription
        </p>
      </div>

      {/* ── Desktop Page Header ─────────────────────────────── */}
      <div className="hidden md:block px-6 py-6 border-b border-[var(--color-border-light)] bg-white mb-6">
        <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
          Prescription Scanner & Scheduler 📋
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Upload a paper prescription image to automatically extract medications and build your schedule
        </p>
      </div>

      {/* Progress indicator */}
      <div
        style={{
          padding: "12px 20px",
          background: "var(--color-bg)",
          borderBottom: "1px solid var(--color-border-light)",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        {(["upload", "scanning", "review", "confirmed"] as PageState[]).map(
          (step, i) => {
            const current = ["upload", "scanning", "review", "confirmed"].indexOf(state);
            const isActive = i <= current;
            return (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: isActive
                      ? "var(--color-primary)"
                      : "var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: isActive ? "white" : "var(--color-text-muted)",
                    transition: "background 0.3s",
                  }}
                >
                  {i + 1}
                </div>
                {i < 3 && (
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      background: isActive && i < current
                        ? "var(--color-primary)"
                        : "var(--color-border)",
                      minWidth: 20,
                      transition: "background 0.3s",
                    }}
                  />
                )}
              </div>
            );
          }
        )}
        <span style={{ fontSize: 12, color: "var(--color-text-secondary)", marginLeft: 4 }}>
          {state === "upload" ? "Upload" : state === "scanning" ? "Scanning" : state === "review" ? "Review" : "Scheduled"}
        </span>
      </div>

      <div style={{ padding: "16px" }}>
        <AnimatePresence mode="wait">
          {/* ── UPLOAD STATE ──────────────────────────────── */}
          {state === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <div
                style={{
                  background: "var(--color-primary-50)",
                  border: "2px dashed var(--color-primary-200)",
                  borderRadius: "var(--radius-xl)",
                  padding: "36px 24px",
                  textAlign: "center",
                  marginBottom: 16,
                  cursor: "pointer",
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div style={{ fontSize: 48, marginBottom: 14 }}>📋</div>
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: 17,
                    color: "var(--color-text-primary)",
                    marginBottom: 8,
                  }}
                >
                  Upload Prescription
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                    marginBottom: 20,
                    lineHeight: 1.6,
                  }}
                >
                  Take a photo or upload an image of your prescription. AI will extract the medicine details.
                </p>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: "center" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <Camera size={18} />
                    Camera
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ flex: 1, justifyContent: "center" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <Upload size={18} />
                    Gallery
                  </button>
                </div>
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

              <MedDisclaimer variant="full" />
            </motion.div>
          )}

          {/* ── SCANNING STATE ────────────────────────────── */}
          {state === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "40px 20px" }}
            >
              {preview && (
                <div
                  style={{
                    position: "relative",
                    borderRadius: "var(--radius-xl)",
                    overflow: "hidden",
                    marginBottom: 20,
                    maxHeight: 220,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Prescription being scanned"
                    style={{
                      width: "100%",
                      height: 220,
                      objectFit: "cover",
                      filter: "brightness(0.8)",
                    }}
                  />
                  <div className="scan-line" />
                </div>
              )}
              <Loader2
                size={28}
                style={{
                  color: "var(--color-primary)",
                  margin: "0 auto 12px",
                  animation: "spin 1s linear infinite",
                }}
              />
              <p
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: "var(--color-text-primary)",
                  marginBottom: 6,
                }}
              >
                Extracting prescription data...
              </p>
              <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                AI is reading your prescription
              </p>
            </motion.div>
          )}

          {/* ── REVIEW STATE ──────────────────────────────── */}
          {state === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Warning if low confidence */}
              {lowConfidenceCount > 0 && (
                <div
                  style={{
                    background: "var(--color-warning-bg)",
                    border: "1px solid #fde68a",
                    borderRadius: "var(--radius-md)",
                    padding: "12px 14px",
                    display: "flex",
                    gap: 10,
                    marginBottom: 14,
                  }}
                  role="alert"
                >
                  <AlertTriangle
                    size={18}
                    style={{ color: "var(--color-warning)", flexShrink: 0 }}
                  />
                  <div>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#92400e",
                        marginBottom: 2,
                      }}
                    >
                      Review Required
                    </p>
                    <p style={{ fontSize: 12, color: "#78350f", lineHeight: 1.5 }}>
                      {lowConfidenceCount} medicine(s) have low OCR confidence. Please verify
                      the highlighted items before confirming.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left side on desktop: Preview image */}
                {preview && (
                  <div className="md:col-span-1">
                    <p className="section-title">Original Prescription</p>
                    <div className="card p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview}
                        alt="Prescription"
                        className="w-full h-auto max-h-[400px] object-contain rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Right side on desktop: Extracted medicines */}
                <div className={preview ? "md:col-span-2" : "md:col-span-3"}>
                  <p className="section-title">
                    Extracted Medicines ({medicines.length})
                  </p>
                  <p className="section-subtitle">
                    Review, edit, or remove before creating your schedule
                  </p>

                  {/* Medicine Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {medicines.map((med) => (
                      <PrescriptionMedCard
                        key={med.id}
                        medicine={med}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>

                  <div
                    style={{
                      background: "var(--color-info-bg)",
                      borderRadius: "var(--radius-md)",
                      padding: "10px 14px",
                      display: "flex",
                      gap: 8,
                      marginBottom: 14,
                    }}
                  >
                    <Info size={15} style={{ color: "var(--color-info)", flexShrink: 0 }} />
                    <p style={{ fontSize: 12, color: "#1e40af", lineHeight: 1.5 }}>
                      Always verify extracted information against your original prescription. PharmaAI cannot guarantee 100% accuracy.
                    </p>
                  </div>

                  <button
                    className="btn-primary"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={handleConfirm}
                  >
                    Confirm & Create Schedule
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── CONFIRMED STATE ───────────────────────────── */}
          {state === "confirmed" && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center", padding: "40px 20px" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                style={{
                  width: 80,
                  height: 80,
                  background: "var(--color-success-bg)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <CheckCircle size={40} style={{ color: "var(--color-success)" }} />
              </motion.div>
              <h2
                style={{
                  fontWeight: 800,
                  fontSize: 20,
                  color: "var(--color-text-primary)",
                  marginBottom: 8,
                }}
              >
                Schedule Created! 🎉
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.6,
                  marginBottom: 24,
                }}
              >
                {medicines.length} medicine(s) have been added to your schedule with reminders.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="/reminders" className="btn-primary" style={{ justifyContent: "center" }}>
                  View My Reminders
                </a>
                <button
                  className="btn-ghost"
                  style={{ justifyContent: "center" }}
                  onClick={() => setState("upload")}
                >
                  Scan Another Prescription
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PrescriptionMedCard({
  medicine,
  onRemove,
}: {
  medicine: PrescriptionMedicine;
  onRemove: (id: string) => void;
}) {
  const isLowConf = medicine.confidence < 0.7;

  return (
    <div
      className="card"
      style={{
        padding: 14,
        border: isLowConf
          ? "1.5px solid #fde68a"
          : "1px solid var(--color-border)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 10,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "var(--color-text-primary)",
              }}
            >
              {medicine.name}
            </span>
            {isLowConf && (
              <AlertTriangle
                size={14}
                style={{ color: "var(--color-warning)", flexShrink: 0 }}
              />
            )}
          </div>
          <ConfidenceBadge confidence={medicine.confidence} />
        </div>
        <button
          onClick={() => onRemove(medicine.id)}
          style={{
            background: "none",
            border: "none",
            color: "var(--color-text-muted)",
            cursor: "pointer",
            padding: 4,
          }}
          aria-label={`Remove ${medicine.name}`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px 12px",
        }}
      >
        <SmallInfoRow label="Dosage" value={medicine.dosage} />
        <SmallInfoRow label="Frequency" value={medicine.frequency} />
        <SmallInfoRow label="Duration" value={medicine.duration} />
        {medicine.instructions && (
          <SmallInfoRow label="Instructions" value={medicine.instructions} />
        )}
      </div>
    </div>
  );
}

function SmallInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: 10, color: "var(--color-text-muted)", fontWeight: 600 }}>
        {label.toUpperCase()}
      </p>
      <p style={{ fontSize: 13, color: "var(--color-text-primary)", fontWeight: 500 }}>
        {value}
      </p>
    </div>
  );
}
