"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Scan,
  FileText,
  ChevronRight,
  Pill,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { getGreeting, formatTime, adherenceLabel, getInitials } from "@/lib/utils";

// ── Default Fallback Data ──────────────────────────────────
const DEMO_USER = { name: "", role: "Patient" };

const MOCK_ADHERENCE = {
  percentage: 78,
  taken: 14,
  total: 18,
  streak: 4,
};

interface DashboardReminder {
  id: string;
  medicine: string;
  time: string;
  status: "taken" | "pending" | "skipped" | "snoozed";
  dosage: string;
}

const MOCK_REMINDERS: DashboardReminder[] = [
  {
    id: "r1",
    medicine: "Metformin 500mg",
    time: "08:00",
    status: "taken",
    dosage: "1 tablet",
  },
  {
    id: "r2",
    medicine: "Lisinopril 10mg",
    time: "08:00",
    status: "pending",
    dosage: "1 tablet",
  },
  {
    id: "r3",
    medicine: "Atorvastatin 20mg",
    time: "21:00",
    status: "pending",
    dosage: "1 tablet",
  },
];

const MOCK_MEDICINES = [
  {
    id: "m1",
    name: "Metformin 500mg",
    generic: "Metformin HCl",
    nextDose: "20:00",
    icon: "💊",
  },
  {
    id: "m2",
    name: "Lisinopril 10mg",
    generic: "Lisinopril",
    nextDose: "08:00",
    icon: "💊",
  },
  {
    id: "m3",
    name: "Atorvastatin 20mg",
    generic: "Atorvastatin",
    nextDose: "21:00",
    icon: "💊",
  },
];

export default function DashboardPage() {
  const greeting = getGreeting();
  const [userName, setUserName] = useState(DEMO_USER.name);
  const [userReminders, setUserReminders] = useState(MOCK_REMINDERS);
  const [userMedicines, setUserMedicines] = useState(MOCK_MEDICINES);
  const [adherenceStats, setAdherenceStats] = useState(MOCK_ADHERENCE);

  useEffect(() => {
    import("@/lib/supabase/data-service").then(
      async ({ fetchUserProfile, fetchUserReminders, fetchUserMedicines }) => {
        const prof = await fetchUserProfile();
        if (prof?.full_name) setUserName(prof.full_name);

        const rems = await fetchUserReminders();
        if (rems && rems.length > 0) {
          const formatted = rems.map((r) => ({
            id: r.id,
            medicine: r.medicine,
            time: r.time,
            status: r.status as "taken" | "pending" | "skipped" | "snoozed",
            dosage: r.dosage,
          }));
          setUserReminders(formatted);

          const taken = formatted.filter((r) => r.status === "taken").length;
          const total = formatted.length;
          const percentage = total > 0 ? Math.round((taken / total) * 100) : 100;
          setAdherenceStats({
            percentage,
            taken,
            total,
            streak: 4,
          });
        }

        const meds = await fetchUserMedicines();
        if (meds && meds.length > 0) {
          setUserMedicines(
            meds.map((m) => ({
              id: m.id,
              name: m.name,
              generic: m.generic_name || m.name,
              nextDose: m.next_dose || "08:00",
              icon: m.icon || "💊",
            }))
          );
        }
      }
    );
  }, []);

  const takenCount = userReminders.filter((r) => r.status === "taken").length;
  const pendingCount = userReminders.filter((r) => r.status === "pending").length;

  return (
    <div className="w-full max-w-[430px] md:max-w-none mx-auto pb-6">
      {/* ── Mobile Header (Hidden on Desktop) ──────────────────── */}
      <div
        className="md:hidden"
        style={{
          background: "var(--color-bg)",
          padding: "16px 20px 12px",
          borderBottom: "1px solid var(--color-border-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 12,
              color: "var(--color-text-muted)",
              fontWeight: 500,
            }}
          >
            {greeting},
          </p>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "var(--color-text-primary)",
              lineHeight: 1.2,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {userName || "there"}
            <span className="animate-spark-pulse inline-flex items-center justify-center" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="var(--color-primary)" strokeWidth="2" strokeOpacity="0.3" />
                <circle cx="12" cy="12" r="5" fill="var(--color-primary)" />
                <circle cx="12" cy="12" r="9" stroke="var(--color-primary)" strokeWidth="1.5" strokeDasharray="4 4" />
              </svg>
            </span>
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Role chip */}
          <span className="badge badge-primary">🏥 Patient</span>

          {/* Avatar */}
          <Link href="/profile" aria-label="Profile">
            <div
              className="avatar"
              style={{
                width: 40,
                height: 40,
                fontSize: 14,
                fontWeight: 700,
                background: "var(--color-primary)",
                color: "white",
              }}
            >
              {getInitials(userName)}
            </div>
          </Link>
        </div>
      </div>

      {/* ── Desktop Page Header ─────────────────────────────── */}
      <div className="hidden md:flex items-center justify-between px-6 py-6 border-b border-[var(--color-border-light)] bg-white mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)] flex items-center gap-2.5">
            {greeting}, {userName}
            <span className="animate-spark-pulse inline-flex items-center justify-center" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="var(--color-primary)" strokeWidth="2" strokeOpacity="0.3" />
                <circle cx="12" cy="12" r="5" fill="var(--color-primary)" />
                <circle cx="12" cy="12" r="9" stroke="var(--color-primary)" strokeWidth="1.5" strokeDasharray="4 4" />
              </svg>
            </span>
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Here is your daily medication summary & schedule
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/scan" className="btn-primary">
            <Scan size={18} />
            Scan Medicine
          </Link>
          <Link href="/scan/prescription" className="btn-secondary">
            <FileText size={18} />
            Scan Prescription
          </Link>
        </div>
      </div>

      <div className="px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column (Desktop 2 cols): Adherence & Schedule */}
          <div className="md:col-span-2 space-y-6">
            {/* ── Adherence Summary Card ─────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="card"
              style={{
                padding: 16,
                background: "linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--color-text-muted)",
                      fontWeight: 500,
                      marginBottom: 4,
                    }}
                  >
                    Weekly Adherence
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span
                      style={{
                        fontSize: 32,
                        fontWeight: 800,
                        color: "var(--color-primary)",
                      }}
                    >
                      {adherenceStats.percentage}%
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--color-success)",
                        fontWeight: 600,
                      }}
                    >
                      {adherenceLabel(adherenceStats.percentage)}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--color-text-secondary)",
                      marginTop: 4,
                    }}
                  >
                    {adherenceStats.taken} of {adherenceStats.total} doses taken ·{" "}
                    🔥 {adherenceStats.streak} day streak
                  </p>
                </div>

                {/* Circle Progress */}
                <CircleProgress value={adherenceStats.percentage} />
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  marginTop: 12,
                  height: 6,
                  background: "var(--color-border-light)",
                  borderRadius: "var(--radius-full)",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${adherenceStats.percentage}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  style={{
                    height: "100%",
                    background: "var(--color-primary)",
                    borderRadius: "var(--radius-full)",
                  }}
                />
              </div>
            </motion.div>

            {/* ── Today's Schedule Summary ───────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              <SummaryChip
                icon={<CheckCircle2 size={16} />}
                value={String(takenCount)}
                label="Taken"
                color="var(--color-success)"
                bg="var(--color-success-bg)"
              />
              <SummaryChip
                icon={<Clock size={16} />}
                value={String(pendingCount)}
                label="Pending"
                color="var(--color-warning)"
                bg="var(--color-warning-bg)"
              />
              <SummaryChip
                icon={<Pill size={16} />}
                value={String(userMedicines.length)}
                label="Medicines"
                color="var(--color-primary)"
                bg="var(--color-primary-50)"
              />
            </motion.div>

            {/* ── Today's Reminders ─────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <p className="section-title" style={{ marginBottom: 0 }}>
                  Today&apos;s Schedule
                </p>
                <Link
                  href="/reminders"
                  style={{
                    fontSize: 12,
                    color: "var(--color-primary)",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  View all <ChevronRight size={14} />
                </Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {userReminders.map((reminder, i) => (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.05 }}
                  >
                    <ReminderCard reminder={reminder} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column (Desktop 1 col): Quick Actions & Medicines */}
          <div className="space-y-6">
            {/* ── Quick Actions (Hidden on desktop header, visible on mobile) ──────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="md:hidden"
            >
              <p className="section-title">Quick Actions</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <QuickAction
                  href="/scan"
                  icon={<Scan size={24} />}
                  label="Scan Medicine"
                  description="Identify any medicine"
                  color="var(--color-primary)"
                  bg="var(--color-primary-50)"
                />
                <QuickAction
                  href="/scan/prescription"
                  icon={<FileText size={24} />}
                  label="Scan Prescription"
                  description="Extract & schedule"
                  color="#7c3aed"
                  bg="#f5f3ff"
                />
              </div>
            </motion.div>

            {/* ── My Medicines ──────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <p className="section-title" style={{ marginBottom: 0 }}>
                  My Medicines
                </p>
                <Link
                  href="/medicines"
                  style={{
                    fontSize: 12,
                    color: "var(--color-primary)",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  See all <ChevronRight size={14} />
                </Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {userMedicines.map((med, i) => (
                  <motion.div
                    key={med.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                  >
                    <MedicineCard medicine={med} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────

function CircleProgress({ value }: { value: number }) {
  const r = 28;
  const circumference = 2 * Math.PI * r;
  const progress = ((100 - value) / 100) * circumference;

  return (
    <svg width="72" height="72" aria-hidden="true">
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke="var(--color-border-light)"
        strokeWidth="6"
      />
      <motion.circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: progress }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        transform="rotate(-90 36 36)"
      />
      <text
        x="36"
        y="41"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="var(--color-primary)"
      >
        {value}%
      </text>
    </svg>
  );
}

function SummaryChip({
  icon,
  value,
  label,
  color,
  bg,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        background: bg,
        borderRadius: "var(--radius-md)",
        padding: "10px 12px",
        textAlign: "center",
      }}
    >
      <div style={{ color, marginBottom: 3 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color, fontWeight: 500, opacity: 0.8 }}>
        {label}
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  label,
  description,
  color,
  bg,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  bg: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        className="card card-hover"
        style={{
          padding: "16px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            background: bg,
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
          }}
        >
          {icon}
        </div>
        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: "var(--color-text-primary)",
              marginBottom: 2,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--color-text-muted)",
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ReminderCard({
  reminder,
}: {
  reminder: (typeof MOCK_REMINDERS)[0];
}) {
  const isTaken = reminder.status === "taken";

  return (
    <div
      className="card"
      style={{
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity: isTaken ? 0.75 : 1,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: isTaken ? "var(--color-success-bg)" : "var(--color-primary-50)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {isTaken ? (
          <CheckCircle2
            size={20}
            style={{ color: "var(--color-success)" }}
          />
        ) : (
          <Clock size={20} style={{ color: "var(--color-primary)" }} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontWeight: 600,
            fontSize: 14,
            color: "var(--color-text-primary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textDecoration: isTaken ? "line-through" : "none",
          }}
        >
          {reminder.medicine}
        </p>
        <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
          {reminder.dosage} · {formatTime(reminder.time)}
        </p>
      </div>

      <span
        className={`badge ${isTaken ? "badge-success" : "badge-warning"}`}
        style={{ flexShrink: 0 }}
      >
        {isTaken ? "Taken" : "Pending"}
      </span>
    </div>
  );
}

function MedicineCard({
  medicine,
}: {
  medicine: (typeof MOCK_MEDICINES)[0];
}) {
  return (
    <Link href={`/medicines/${medicine.id}`} style={{ textDecoration: "none" }}>
      <div className="card card-hover" style={{ padding: "12px 14px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "var(--radius-md)",
              background: "var(--color-primary-50)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {medicine.icon}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontWeight: 600,
                fontSize: 14,
                color: "var(--color-text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {medicine.name}
            </p>
            <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
              {medicine.generic}
            </p>
          </div>

          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ fontSize: 10, color: "var(--color-text-muted)" }}>
              Next dose
            </p>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-primary)",
              }}
            >
              {formatTime(medicine.nextDose)}
            </p>
          </div>

          <ChevronRight
            size={16}
            style={{ color: "var(--color-text-muted)", flexShrink: 0 }}
          />
        </div>
      </div>
    </Link>
  );
}
