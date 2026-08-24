"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Trophy,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { mockGetClinicalCases } from "@/lib/ai/mock-responses";
import type { ClinicalCase } from "@/lib/types";

export default function CasesPage() {
  const [cases, setCases] = useState<ClinicalCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedCases, setCompletedCases] = useState<string[]>([]);

  useEffect(() => {
    mockGetClinicalCases().then((data) => {
      setCases(data);
      setLoading(false);
    });
  }, []);

  const currentCase = cases[currentIndex];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === currentCase?.correct_option_id;

  function handleAnswer(optionId: string) {
    if (isAnswered) return;
    setSelectedAnswer(optionId);
    setShowExplanation(true);
    if (!completedCases.includes(currentCase.id)) {
      setCompletedCases((prev) => [...prev, currentCase.id]);
    }
  }

  function nextCase() {
    if (currentIndex < cases.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <Loader2 size={28} style={{ color: "var(--color-primary)", margin: "0 auto 12px", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "var(--color-text-muted)" }}>Loading clinical cases...</p>
      </div>
    );
  }

  if (!currentCase) return null;

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--color-text-primary)" }}>
              Clinical Cases
            </h1>
            <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
              {completedCases.length}/{cases.length} completed
            </p>
          </div>
          <div
            style={{
              background: "var(--color-primary-50)",
              borderRadius: "var(--radius-md)",
              padding: "6px 12px",
              display: "flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            <Trophy size={14} style={{ color: "var(--color-primary)" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-primary)" }}>
              {completedCases.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 10, height: 4, background: "var(--color-border-light)", borderRadius: "var(--radius-full)" }}>
          <div
            style={{
              height: "100%",
              width: `${(completedCases.length / cases.length) * 100}%`,
              background: "var(--color-primary)",
              borderRadius: "var(--radius-full)",
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      <div style={{ padding: "16px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCase.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Case Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <span className="badge badge-primary">Case {currentCase.case_number}</span>
              <span className="badge badge-muted">{currentCase.category}</span>
              <span
                className="badge"
                style={{
                  background:
                    currentCase.difficulty === "advanced"
                      ? "#fef2f2"
                      : currentCase.difficulty === "intermediate"
                      ? "#fffbeb"
                      : "#f0fdf4",
                  color:
                    currentCase.difficulty === "advanced"
                      ? "#991b1b"
                      : currentCase.difficulty === "intermediate"
                      ? "#92400e"
                      : "#065f46",
                }}
              >
                {currentCase.difficulty}
              </span>
            </div>

            {/* Scenario */}
            <div
              className="card"
              style={{
                padding: 14,
                marginBottom: 12,
                background: "#fffbeb",
                border: "1px solid #fde68a",
              }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 6 }}>
                CLINICAL SCENARIO
              </p>
              <p style={{ fontSize: 14, color: "#78350f", lineHeight: 1.7 }}>
                {currentCase.scenario}
              </p>
            </div>

            {/* Patient Info */}
            <div className="card" style={{ padding: 14, marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: 8 }}>
                PATIENT INFORMATION
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px" }}>
                <InfoItem label="Age" value={`${currentCase.patient_info.age} years`} />
                <InfoItem label="Gender" value={currentCase.patient_info.gender} />
                {currentCase.patient_info.weight && (
                  <InfoItem label="Weight" value={`${currentCase.patient_info.weight} kg`} />
                )}
                {currentCase.patient_info.allergies && currentCase.patient_info.allergies.length > 0 && (
                  <InfoItem label="Allergies" value={currentCase.patient_info.allergies.join(", ")} />
                )}
              </div>
              {currentCase.patient_info.current_medications && (
                <div style={{ marginTop: 8 }}>
                  <InfoItem
                    label="Current Medications"
                    value={currentCase.patient_info.current_medications.join(", ")}
                  />
                </div>
              )}
              <div style={{ marginTop: 8 }}>
                <InfoItem
                  label="Chief Complaint"
                  value={currentCase.patient_info.chief_complaint}
                />
              </div>
            </div>

            {/* Question */}
            <div className="card" style={{ padding: 14, marginBottom: 12, border: "1.5px solid var(--color-primary-200)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--color-primary)", marginBottom: 6 }}>
                CLINICAL QUESTION
              </p>
              <p style={{ fontSize: 14, color: "var(--color-text-primary)", fontWeight: 600, lineHeight: 1.6 }}>
                {currentCase.question}
              </p>
            </div>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              {currentCase.options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const isCorrectOpt = option.id === currentCase.correct_option_id;
                const showResult = isAnswered;

                let bg = "var(--color-bg)";
                let border = "var(--color-border)";
                let textColor = "var(--color-text-primary)";

                if (showResult) {
                  if (isCorrectOpt) {
                    bg = "var(--color-success-bg)";
                    border = "#a7f3d0";
                    textColor = "#065f46";
                  } else if (isSelected && !isCorrectOpt) {
                    bg = "var(--color-error-bg)";
                    border = "#fecaca";
                    textColor = "#991b1b";
                  }
                } else if (isSelected) {
                  bg = "var(--color-primary-50)";
                  border = "var(--color-primary-light)";
                  textColor = "var(--color-primary)";
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    disabled={isAnswered}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: "var(--radius-md)",
                      border: `1.5px solid ${border}`,
                      background: bg,
                      cursor: isAnswered ? "default" : "pointer",
                      textAlign: "left",
                      transition: "all 0.25s",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: isAnswered && isCorrectOpt
                          ? "var(--color-success)"
                          : isAnswered && isSelected && !isCorrectOpt
                          ? "var(--color-error)"
                          : "var(--color-border-light)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontWeight: 800,
                        fontSize: 12,
                        color:
                          isAnswered && (isCorrectOpt || (isSelected && !isCorrectOpt))
                            ? "white"
                            : "var(--color-text-secondary)",
                      }}
                    >
                      {isAnswered && isCorrectOpt ? (
                        <CheckCircle size={16} />
                      ) : isAnswered && isSelected && !isCorrectOpt ? (
                        <XCircle size={16} />
                      ) : (
                        option.id.toUpperCase()
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: textColor, lineHeight: 1.5 }}>
                      {option.text}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Result banner */}
                  <div
                    style={{
                      background: isCorrect ? "var(--color-success-bg)" : "var(--color-error-bg)",
                      borderRadius: "var(--radius-md)",
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    {isCorrect ? (
                      <CheckCircle size={18} style={{ color: "var(--color-success)" }} />
                    ) : (
                      <XCircle size={18} style={{ color: "var(--color-error)" }} />
                    )}
                    <p style={{ fontWeight: 700, fontSize: 14, color: isCorrect ? "#065f46" : "#991b1b" }}>
                      {isCorrect ? "Correct! Well done." : "Incorrect — review the explanation."}
                    </p>
                  </div>

                  {/* Explanation */}
                  <div className="card" style={{ padding: 14, marginBottom: 10 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: 8 }}>
                      EXPLANATION
                    </p>
                    <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                      {currentCase.explanation}
                    </p>
                  </div>

                  {/* Learning Points */}
                  <div className="card" style={{ padding: 14, marginBottom: 12 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "var(--color-primary)", marginBottom: 8 }}>
                      🎯 LEARNING POINTS
                    </p>
                    {currentCase.learning_points.map((point, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          padding: "5px 0",
                        }}
                      >
                        <div
                          style={{
                            width: 5,
                            height: 5,
                            background: "var(--color-primary)",
                            borderRadius: "50%",
                            marginTop: 7,
                            flexShrink: 0,
                          }}
                        />
                        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>

                  {currentIndex < cases.length - 1 && (
                    <button
                      className="btn-primary"
                      style={{ width: "100%", justifyContent: "center" }}
                      onClick={nextCase}
                    >
                      Next Case
                      <ArrowRight size={18} />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-muted)", marginBottom: 2 }}>
        {label.toUpperCase()}
      </p>
      <p style={{ fontSize: 13, color: "var(--color-text-primary)", fontWeight: 500 }}>
        {value}
      </p>
    </div>
  );
}
