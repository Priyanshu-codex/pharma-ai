"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  SkipForward,
  Plus,
  AlarmClock,
  Loader2,
  Trash2,
  Bell,
} from "lucide-react";
import { formatTime } from "@/lib/utils";
import { NoRemindersEmpty } from "@/components/shared/EmptyState";

type ReminderStatus = "pending" | "taken" | "skipped" | "snoozed";

interface Reminder {
  id: string;
  medicine: string;
  dosage: string;
  time: string;
  status: ReminderStatus;
  enabled: boolean;
}

function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSnoozeModal, setShowSnoozeModal] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const remindersRef = useRef<Reminder[]>([]);

  // Form states for Add Reminder modal
  const [newMedName, setNewMedName] = useState("");
  const [newDosage, setNewDosage] = useState("");
  const [newTime, setNewTime] = useState("09:00");

  // Fetch reminders on mount
  useEffect(() => {
    import("@/lib/supabase/data-service").then(({ fetchUserReminders }) => {
      fetchUserReminders().then((data) => {
        if (data) {
          const formatted = data.map((r) => ({
            id: r.id,
            medicine: r.medicine,
            dosage: r.dosage,
            time: r.time,
            status: r.status,
            enabled: r.enabled,
          }));
          setReminders(formatted);
          remindersRef.current = formatted;
        }
      });
    });
  }, []);

  // Keep ref in sync with state (avoids stale closure in interval)
  useEffect(() => {
    remindersRef.current = reminders;
  }, [reminders]);

  // Request Notification permission & setup interval check for due reminders
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    if (Notification.permission === "default") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          import("@/lib/firebase/config").then(({ requestFCMToken }) => requestFCMToken());
        }
      });
    }

    // Use a single persistent interval via ref — reads from remindersRef to avoid stale closure
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const now = new Date();
      const currentHoursMin = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      remindersRef.current.forEach((r) => {
        if (r.enabled && r.status === "pending" && r.time === currentHoursMin) {
          if (Notification.permission === "granted") {
            new Notification(`💊 PharmaAI Reminder: ${r.medicine}`, {
              body: `Time for your dose: ${r.dosage}. Tap to open schedule.`,
              icon: "/icon.svg",
            });
          }
        }
      });
    }, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  async function sendTestNotification() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Browser notifications are not supported in this environment.");
      return;
    }

    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      import("@/lib/firebase/config").then(({ requestFCMToken }) => requestFCMToken());
      new Notification("💊 PharmaAI Medication Alert", {
        body: "Notifications are active! You will receive scheduled dose alerts on mobile & web.",
        icon: "/icons/icon-192x192.png",
      });
    } else {
      alert("Notification permission was denied. Please enable notifications in your browser settings.");
    }
  }

  async function updateStatus(id: string, status: ReminderStatus, medicineName?: string) {
    setLoadingId(id);
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    const { updateReminderStatusInDB } = await import("@/lib/supabase/data-service");
    await updateReminderStatusInDB(id, status, medicineName);
    setLoadingId(null);
  }

  async function handleAddReminder(e: React.FormEvent) {
    e.preventDefault();
    if (!newMedName.trim() || !newDosage.trim()) return;

    const payload = {
      medicine: newMedName.trim(),
      dosage: newDosage.trim(),
      time: newTime,
      status: "pending" as const,
      enabled: true,
    };

    const { saveReminderToDB } = await import("@/lib/supabase/data-service");
    const created = await saveReminderToDB(payload);

    setReminders((prev) => [...prev, created]);
    setNewMedName("");
    setNewDosage("");
    setNewTime("09:00");
    setShowAddModal(false);
  }

  async function handleConfirmDelete() {
    if (!deleteConfirmId) return;
    const targetId = deleteConfirmId;
    setReminders((prev) => prev.filter((r) => r.id !== targetId));
    setDeleteConfirmId(null);
    const { deleteReminderFromDB } = await import("@/lib/supabase/data-service");
    await deleteReminderFromDB(targetId);
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
    <div className="w-full max-w-[430px] md:max-w-none mx-auto pb-6">
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
          <div className="flex items-center gap-2">
            <button
              onClick={sendTestNotification}
              className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] rounded-lg transition-colors border border-[var(--color-border-light)]"
              title="Test Push Notification"
            >
              <Bell size={16} />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-secondary"
              style={{ padding: "8px 14px", gap: 6, fontSize: 13 }}
            >
              <Plus size={15} />
              Add
            </button>
          </div>
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
        {reminders.length === 0 ? (
          <NoRemindersEmpty onAction={() => setShowAddModal(true)} />
        ) : (
          Object.keys(timeGroups)
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
                      onTaken={() => updateStatus(reminder.id, "taken", reminder.medicine)}
                      onSkipped={() => updateStatus(reminder.id, "skipped", reminder.medicine)}
                      onSnoozed={() => setShowSnoozeModal(reminder.id)}
                      onDelete={() => setDeleteConfirmId(reminder.id)}
                    />
                  ))}
                </div>
              </div>
            ))
        )}
      </div>

      {/* ── 1. ADD REMINDER MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Add Medication Reminder</h3>
            <form onSubmit={handleAddReminder} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Medicine Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paracetamol 500mg"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Dosage & Instructions</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1 tablet after meals"
                  value={newDosage}
                  onChange={(e) => setNewDosage(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Scheduled Time</label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 justify-center">
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 2. SNOOZE SELECTION MODAL ── */}
      {showSnoozeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlarmClock size={24} />
            </div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-1">Snooze Reminder</h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">Choose how long to snooze this dose</p>

            <div className="space-y-2 mb-4">
              {[15, 30, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={async () => {
                    const reminder = reminders.find((r) => r.id === showSnoozeModal);
                    if (reminder) {
                      const newTime = addMinutesToTime(reminder.time, mins);
                      setReminders((prev) =>
                        prev.map((r) =>
                          r.id === showSnoozeModal
                            ? { ...r, status: "snoozed", time: newTime }
                            : r
                        )
                      );
                      const { snoozeReminderInDB } = await import("@/lib/supabase/data-service");
                      await snoozeReminderInDB(showSnoozeModal!, newTime);
                    }
                    setShowSnoozeModal(null);
                  }}
                  className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
                >
                  Snooze for {mins} minutes
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowSnoozeModal(null)}
              className="btn-ghost w-full justify-center text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── 3. DELETE CONFIRMATION MODAL ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center">
            <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-2">Delete Reminder?</h3>
            <p className="text-xs text-[var(--color-text-secondary)] mb-6">
              Are you sure you want to delete this medication schedule?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-secondary flex-1 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn-primary flex-1 justify-center bg-red-600 hover:bg-red-700 border-none text-white text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReminderCard({
  reminder,
  isLoading,
  onTaken,
  onSkipped,
  onSnoozed,
  onDelete,
}: {
  reminder: Reminder;
  isLoading: boolean;
  onTaken: () => void;
  onSkipped: () => void;
  onSnoozed: () => void;
  onDelete: () => void;
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
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
              <span className={`badge ${config.badgeClass}`}>{config.label}</span>
              <button
                onClick={onDelete}
                className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                title="Delete reminder"
              >
                <Trash2 size={14} />
              </button>
            </div>
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
