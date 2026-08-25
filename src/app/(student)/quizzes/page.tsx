"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { mockGenerateQuiz } from "@/lib/ai/mock-responses";
import type { QuizQuestion } from "@/lib/types";

const TOPICS = [
  "Pharmacology",
  "Drug Interactions",
  "Clinical Pharmacokinetics",
  "Cardiovascular Drugs",
  "Diabetes Medications",
  "Antibiotics",
  "Analgesics",
];

const DIFFICULTIES = ["easy", "medium", "hard"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

type QuizPhase = "setup" | "loading" | "question" | "result";

interface Answer {
  questionId: string;
  selectedId: string;
  isCorrect: boolean;
}

export default function QuizzesPage() {
  const [phase, setPhase] = useState<QuizPhase>("setup");
  const [topic, setTopic] = useState("Pharmacology");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  async function startQuiz() {
    setPhase("loading");
    const qs = await mockGenerateQuiz(topic, difficulty, 5);
    setQuestions(qs);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setStartTime(new Date());
    setPhase("question");
  }

  function handleAnswer(optionId: string) {
    if (showAnswer) return;
    setSelectedAnswer(optionId);
    setShowAnswer(true);
    const question = questions[currentIndex];
    setAnswers((prev) => [
      ...prev,
      {
        questionId: question.id,
        selectedId: optionId,
        isCorrect: optionId === question.correct_option_id,
      },
    ]);
  }

  function next() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      // Save quiz result to history
      if (typeof window !== "undefined") {
        try {
          const existing = JSON.parse(localStorage.getItem("pharmaai_quiz_history") || "[]");
          const finalScore = answers.filter((a) => a.isCorrect).length;
          const finalTime = startTime ? Math.round((new Date().getTime() - startTime.getTime()) / 1000) : 0;
          const record = {
            id: `quiz_${Date.now()}`,
            topic,
            difficulty,
            score: finalScore,
            total: questions.length,
            percentage: Math.round((finalScore / questions.length) * 100),
            timeTaken: finalTime,
            completedAt: new Date().toISOString(),
          };
          localStorage.setItem("pharmaai_quiz_history", JSON.stringify([record, ...existing]));
        } catch (e) {
          console.warn("Failed to save quiz result:", e);
        }
      }
      setPhase("result");
    }
  }

  function reset() {
    setPhase("setup");
    setQuestions([]);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowAnswer(false);
  }

  const score = answers.filter((a) => a.isCorrect).length;
  const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const timeTaken = startTime
    ? Math.round((new Date().getTime() - startTime.getTime()) / 1000)
    : 0;

  return (
    <div className="w-full max-w-[430px] md:max-w-2xl mx-auto pb-6">
      {/* Header */}
      <div
        style={{
          background: "var(--color-bg)",
          padding: "16px 20px 14px",
          borderBottom: "1px solid var(--color-border-light)",
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--color-text-primary)" }}>
          AI Quizzes
        </h1>
        <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
          Test your pharmaceutical knowledge
        </p>
      </div>

      <div style={{ padding: "16px" }}>
        <AnimatePresence mode="wait">
          {/* ── SETUP ──────────────────────────────────────── */}
          {phase === "setup" && (
            <motion.div key="setup" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="card" style={{ padding: 16, marginBottom: 12 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: 10 }}>
                  SELECT TOPIC
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {TOPICS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      style={{
                        padding: "7px 14px",
                        borderRadius: "var(--radius-full)",
                        border: `1.5px solid ${topic === t ? "var(--color-primary)" : "var(--color-border)"}`,
                        background: topic === t ? "var(--color-primary)" : "var(--color-bg)",
                        color: topic === t ? "white" : "var(--color-text-secondary)",
                        fontSize: 13,
                        fontWeight: topic === t ? 700 : 500,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: 16, marginBottom: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: 10 }}>
                  DIFFICULTY
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  {DIFFICULTIES.map((d) => {
                    const colors = {
                      easy: { active: "#065f46", bg: "var(--color-success)", lightBg: "var(--color-success-bg)", border: "#a7f3d0" },
                      medium: { active: "#92400e", bg: "var(--color-warning)", lightBg: "var(--color-warning-bg)", border: "#fde68a" },
                      hard: { active: "#991b1b", bg: "var(--color-error)", lightBg: "var(--color-error-bg)", border: "#fecaca" },
                    };
                    const c = colors[d];
                    return (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        style={{
                          flex: 1,
                          padding: "10px 0",
                          borderRadius: "var(--radius-md)",
                          border: `1.5px solid ${difficulty === d ? c.bg : "var(--color-border)"}`,
                          background: difficulty === d ? c.lightBg : "var(--color-bg)",
                          color: difficulty === d ? c.active : "var(--color-text-secondary)",
                          fontSize: 13,
                          fontWeight: difficulty === d ? 700 : 500,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          textTransform: "capitalize",
                        }}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={startQuiz}
              >
                Start Quiz (5 Questions)
                <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {/* ── LOADING ─────────────────────────────────────── */}
          {phase === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "60px 20px" }}>
              <Loader2 size={32} style={{ color: "var(--color-primary)", margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
              <p style={{ fontWeight: 600, fontSize: 16, color: "var(--color-text-primary)", marginBottom: 6 }}>
                Generating {difficulty} quiz...
              </p>
              <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                Topic: {topic}
              </p>
            </motion.div>
          )}

          {/* ── QUESTION ─────────────────────────────────────── */}
          {phase === "question" && questions[currentIndex] && (
            <motion.div
              key={`q-${currentIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Progress */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)" }}>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="badge badge-primary">
                  {score} correct
                </span>
              </div>
              <div style={{ height: 4, background: "var(--color-border-light)", borderRadius: "var(--radius-full)", marginBottom: 16 }}>
                <div
                  style={{
                    height: "100%",
                    width: `${((currentIndex) / questions.length) * 100}%`,
                    background: "var(--color-primary)",
                    borderRadius: "var(--radius-full)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              {/* Question */}
              <div
                className="card"
                style={{
                  padding: 16,
                  marginBottom: 14,
                  background: "var(--color-primary-50)",
                  border: "1px solid var(--color-primary-200)",
                }}
              >
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1.6 }}>
                  {questions[currentIndex].question}
                </p>
              </div>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                {questions[currentIndex].options.map((option) => {
                  const isSelected = selectedAnswer === option.id;
                  const isCorrect = option.id === questions[currentIndex].correct_option_id;
                  let bg = "var(--color-bg)", border = "var(--color-border)", textColor = "var(--color-text-primary)";

                  if (showAnswer) {
                    if (isCorrect) { bg = "var(--color-success-bg)"; border = "#a7f3d0"; textColor = "#065f46"; }
                    else if (isSelected) { bg = "var(--color-error-bg)"; border = "#fecaca"; textColor = "#991b1b"; }
                  } else if (isSelected) {
                    bg = "var(--color-primary-50)"; border = "var(--color-primary-light)"; textColor = "var(--color-primary)";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      disabled={showAnswer}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "11px 14px",
                        borderRadius: "var(--radius-md)",
                        border: `1.5px solid ${border}`,
                        background: bg,
                        cursor: showAnswer ? "default" : "pointer",
                        textAlign: "left",
                        transition: "all 0.25s",
                      }}
                    >
                      <div
                        style={{
                          width: 26, height: 26, borderRadius: "50%",
                          background: showAnswer && isCorrect ? "var(--color-success)" : showAnswer && isSelected ? "var(--color-error)" : "var(--color-border-light)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, fontSize: 11, fontWeight: 800,
                          color: showAnswer && (isCorrect || isSelected) ? "white" : "var(--color-text-secondary)",
                        }}
                      >
                        {showAnswer && isCorrect ? <CheckCircle size={15} /> : showAnswer && isSelected ? <XCircle size={15} /> : option.id.toUpperCase()}
                      </div>
                      <p style={{ fontSize: 13, color: textColor, lineHeight: 1.5 }}>{option.text}</p>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showAnswer && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="card" style={{ padding: 14, marginBottom: 12 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "var(--color-primary)", marginBottom: 6 }}>
                      EXPLANATION
                    </p>
                    <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                      {questions[currentIndex].explanation}
                    </p>
                  </div>
                  <button
                    className="btn-primary"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={next}
                  >
                    {currentIndex < questions.length - 1 ? "Next Question" : "View Results"}
                    <ArrowRight size={18} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── RESULT ───────────────────────────────────────── */}
          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                style={{
                  width: 100, height: 100, background: percentage >= 80 ? "var(--color-success-bg)" : "var(--color-warning-bg)",
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <Trophy size={44} style={{ color: percentage >= 80 ? "var(--color-success)" : "var(--color-warning)" }} />
              </motion.div>

              <h2 style={{ fontWeight: 800, fontSize: 24, color: "var(--color-text-primary)", marginBottom: 6 }}>
                {percentage >= 80 ? "Excellent! 🎉" : percentage >= 60 ? "Good Job! 👍" : "Keep Studying 📚"}
              </h2>

              <p style={{ fontSize: 15, color: "var(--color-text-secondary)", marginBottom: 24 }}>
                You scored {score} out of {questions.length}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
                <StatBox label="Score" value={`${percentage}%`} color="var(--color-primary)" bg="var(--color-primary-50)" />
                <StatBox label="Correct" value={String(score)} color="var(--color-success)" bg="var(--color-success-bg)" />
                <StatBox label="Time" value={`${timeTaken}s`} color="#7c3aed" bg="#f5f3ff" />
              </div>

              {/* Answer Review */}
              <div className="card" style={{ padding: 14, textAlign: "left", marginBottom: 16 }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 10 }}>
                  ANSWER REVIEW
                </p>
                {answers.map((ans, i) => (
                  <div
                    key={ans.questionId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "7px 0",
                      borderBottom: i < answers.length - 1 ? "1px solid var(--color-border-light)" : "none",
                    }}
                  >
                    {ans.isCorrect ? (
                      <CheckCircle size={16} style={{ color: "var(--color-success)", flexShrink: 0 }} />
                    ) : (
                      <XCircle size={16} style={{ color: "var(--color-error)", flexShrink: 0 }} />
                    )}
                    <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                      Q{i + 1}: {ans.isCorrect ? "Correct" : "Incorrect"}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button className="btn-primary" style={{ justifyContent: "center" }} onClick={startQuiz}>
                  <RotateCcw size={16} /> Retry Quiz
                </button>
                <button className="btn-ghost" style={{ justifyContent: "center" }} onClick={reset}>
                  Choose Different Topic
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatBox({ label, value, color, bg }: { label: string; value: string; color: string; bg: string }) {
  return (
    <div style={{ background: bg, borderRadius: "var(--radius-md)", padding: "12px 8px" }}>
      <p style={{ fontSize: 20, fontWeight: 800, color, marginBottom: 3 }}>{value}</p>
      <p style={{ fontSize: 11, color, fontWeight: 500, opacity: 0.8 }}>{label}</p>
    </div>
  );
}
