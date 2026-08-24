"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  SkipForward,
  Plus,
  AlarmClock,
  Loader2,
} from "lucide-react";
import { formatTime } from "@/lib/utils";

type ReminderStatus = "pending" | "taken" | "skipped" | "snoozed";

interface Reminder {
  id: string;
  medicine: string;
  dosage: string;
  time: string;
  status: ReminderStatus;
  enabled: boolean;
}

const INITIAL_REMINDERS: Reminder[] = [
  {
    id: "r1",
    medicine: "Metformin 500mg",
    dosage: "1 tablet with breakfast",
    time: "08:00",
    status: "taken",
    enabled: true,
  },
  {
    id: "r2",
    medicine: "Lisinopril 10mg",
    dosage: "1 tablet",
    time: "08:00",
    status: "pending",
    enabled: true,
  },
  {
    id: "r3",
    medicine: "Metformin 500mg",
    dosage: "1 tablet with dinner",
    time: "20:00",
    status: "pending",
    enabled: true,
  },
  {
    id: "r4",
    medicine: "Atorvastatin 20mg",
    dosage: "1 tablet at bedtime",
    time: "21:00",
    status: "pending",
    enabled: true,
  },
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: ReminderStatus) {
    setLoadingId(id);
    await new Promise((r) => setTimeout(r, 400));
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    setLoadingId(null);
  }

  const taken = reminders.filter((r) => r.status === "taken").length;
  const pending = reminders.filter((r) => r.status === "pending").length;
  const skipped = reminders.filter((r) => r.status === "skipped").length;

  const timeGroups: Record<string, Reminder[]> = {};
  reminders.forEach((r) => {
    if (!timeGroups[r.time]) timeGroups[r.time] = [];
    timeGroups[r.time].push(r);
  });

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--color-text-primary)" }}>
              Today&apos;s Schedule
            </h1>
            <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
          <button
            className="btn-secondary"
            style={{ padding: "8px 14px", gap: 6, fontSize: 13 }}
          >
            <Plus size={15} />
            Add
          </button>
        </div>
      </div>

      <div style={{ padding: "16px" }}>
        {/* Daily Summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
          style={{
            padding: 14,
            marginBottom: 16,
            display: "flex",
            gap: 0,
            overflow: "hidden",
          }}
        >
          {[
            { icon: <CheckCircle2 size={18} />, label: "Taken", value: taken, color: "var(--color-success)", bg: "var(--color-success-bg)" },
            { icon: <Clock size={18} />, label: "Pending", value: pending, color: "var(--color-warning)", bg: "var(--color-warning-bg)" },
            { icon: <SkipForward size={18} />, label: "Skipped", value: skipped, color: "var(--color-error)", bg: "var(--color-error-bg)" },
          ].map((item, i) => (
            <div
              key={item.label}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "10px 0",
                borderRight: i < 2 ? "1px solid var(--color-border-light)" : "none",
              }}
            >
              <div style={{ color: item.color, marginBottom: 4 }}>{item.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.value}</div>
              <div style={{ fontSize: 11, color: "var(--color-text-muted)", fontWeight: 500 }}>{item.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Reminders by time group */}
        {Object.keys(timeGroups)
          .sort()
          .map((time) => (
            <div key={time} style={{ marginBottom: 16 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--color-text-secondary)",
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <AlarmClock size={14} />
                {formatTime(time)}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {timeGroups[time].map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    isLoading={loadingId === reminder.id}
                    onTaken={() => updateStatus(reminder.id, "taken")}
                    onSkipped={() => updateStatus(reminder.id, "skipped")}
                    onSnoozed={() => updateStatus(reminder.id, "snoozed")}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function ReminderCard({
  reminder,
  isLoading,
  onTaken,
  onSkipped,
  onSnoozed,
}: {
  reminder: Reminder;
  isLoading: boolean;
  onTaken: () => void;
  onSkipped: () => void;
  onSnoozed: () => void;
}) {
  const statusConfig: Record<ReminderStatus, { label: string; badgeClass: string; icon: React.ReactNode }> = {
    taken: { label: "Taken", badgeClass: "badge-success", icon: <CheckCircle2 size={14} /> },
    pending: { label: "Pending", badgeClass: "badge-warning", icon: <Clock size={14} /> },
    skipped: { label: "Skipped", badgeClass: "badge-error", icon: <SkipForward size={14} /> },
    snoozed: { label: "Snoozed", badgeClass: "badge-muted", icon: <AlarmClock size={14} /> },
  };

  const config = statusConfig[reminder.status];
  const isDone = reminder.status === "taken" || reminder.status === "skipped";

  return (
    <motion.div
      layout
      className="card"
      style={{
        padding: "14px",
        opacity: isDone ? 0.75 : 1,
        transition: "opacity 0.3s",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        {/* Status icon */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background:
              reminder.status === "taken"
                ? "var(--color-success-bg)"
                : "var(--color-primary-50)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 20 }}>💊</span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <p
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "var(--color-text-primary)",
                textDecoration: reminder.status === "taken" ? "line-through" : "none",
                flex: 1,
              }}
            >
              {reminder.medicine}
            </p>
            <span className={`badge ${config.badgeClass}`} style={{ marginLeft: 8, flexShrink: 0 }}>
              {config.label}
            </span>
          </div>

          <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
            {reminder.dosage}
          </p>
        </div>
      </div>

      {/* Action buttons — only show for pending/snoozed */}
      {(reminder.status === "pending" || reminder.status === "snoozed") && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: "1px solid var(--color-border-light)",
            display: "flex",
            gap: 8,
          }}
        >
          <button
            className="btn-primary"
            style={{ flex: 1, justifyContent: "center", padding: "9px 12px", fontSize: 13 }}
            onClick={onTaken}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <>
                <CheckCircle2 size={15} />
                Taken
              </>
            )}
          </button>
          <button
            className="btn-ghost"
            style={{ flex: 1, justifyContent: "center", padding: "9px 12px", fontSize: 13 }}
            onClick={onSnoozed}
            disabled={isLoading}
          >
            <AlarmClock size={15} />
            Snooze
          </button>
          <button
            className="btn-ghost"
            style={{ flex: 1, justifyContent: "center", padding: "9px 12px", fontSize: 13, color: "var(--color-error)", borderColor: "var(--color-error)" }}
            onClick={onSkipped}
            disabled={isLoading}
          >
            <SkipForward size={15} />
            Skip
          </button>
        </div>
      )}
    </motion.div>
  );
}
