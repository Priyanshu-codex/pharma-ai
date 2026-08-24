"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  ChevronRight,
  Bell,
  BellOff,
  Clock,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { formatTime } from "@/lib/utils";
import { NoMedicinesEmpty } from "@/components/shared/EmptyState";
import { useRouter } from "next/navigation";

interface MedicineItem {
  id: string;
  name: string;
  generic: string;
  dosage: string;
  frequency: string;
  nextDose: string;
  reminderEnabled: boolean;
  icon: string;
  manufacturer: string;
}

export default function MedicinesPage() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    import("@/lib/supabase/data-service").then(({ fetchUserMedicines }) => {
      fetchUserMedicines().then((data) => {
        if (data) {
          setMedicines(
            data.map((m) => ({
              id: m.id,
              name: m.name,
              generic: m.generic_name || m.name,
              dosage: m.strength || m.dosage_instructions || "1 dose",
              frequency: m.frequency || "Daily",
              nextDose: m.next_dose || "08:00",
              reminderEnabled: m.reminder_enabled ?? true,
              icon: m.icon || "💊",
              manufacturer: m.manufacturer || "Generic",
            }))
          );
        }
      });
    });
  }, []);

  const filtered = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.generic.toLowerCase().includes(search.toLowerCase())
  );

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  async function toggleReminder(id: string) {
    const med = medicines.find((m) => m.id === id);
    if (!med) return;
    const newStatus = !med.reminderEnabled;
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, reminderEnabled: newStatus } : m))
    );
    const { updateMedicineReminderInDB } = await import("@/lib/supabase/data-service");
    await updateMedicineReminderInDB(id, newStatus);
  }

  async function removeMedicine(id: string) {
    const med = medicines.find((m) => m.id === id);
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    setActiveMenu(null);
    const { deleteMedicineFromDB } = await import("@/lib/supabase/data-service");
    await deleteMedicineFromDB(id);
    setToastMsg(`Removed ${med?.name || "medicine"}`);
    setTimeout(() => setToastMsg(null), 3000);
  }

  return (
    <div className="w-full max-w-[430px] md:max-w-none mx-auto pb-6">
      {/* ── Mobile Header (Hidden on Desktop) ──────────────────── */}
      {toastMsg && (
        <div className="mx-4 mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="text-emerald-600 font-bold ml-2">✕</button>
        </div>
      )}
      <div
        className="md:hidden"
        style={{
          background: "var(--color-bg)",
          padding: "16px 20px 12px",
          borderBottom: "1px solid var(--color-border-light)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "var(--color-text-primary)",
              }}
            >
              My Medicines
            </h1>
            <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
              {medicines.length} medicine{medicines.length !== 1 ? "s" : ""} tracked
            </p>
          </div>
          <Link href="/scan" className="btn-primary" style={{ padding: "9px 14px", gap: 6 }}>
            <Plus size={16} />
            Add
          </Link>
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 13,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            type="search"
            className="input-base"
            style={{ paddingLeft: 38 }}
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search medicines"
          />
        </div>
      </div>

      {/* ── Desktop Page Header ─────────────────────────────── */}
      <div className="hidden md:flex items-center justify-between px-6 py-6 border-b border-[var(--color-border-light)] bg-white mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
            My Medicines ({medicines.length})
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Manage your active medications, dosage schedules, and reminders
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
            />
            <input
              type="search"
              className="input-base pl-9"
              placeholder="Search medicines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search medicines"
            />
          </div>
          <Link href="/scan" className="btn-primary">
            <Plus size={18} />
            Add Medicine
          </Link>
        </div>
      </div>

      <div className="px-4 md:px-6">
        {medicines.length === 0 ? (
          <NoMedicinesEmpty onAction={() => router.push("/scan")} />
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "var(--color-text-muted)",
            }}
          >
            <Search size={32} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
            <p>No medicines matching &quot;{search}&quot;</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((med, i) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <MedicineListCard
                  medicine={med}
                  isMenuOpen={activeMenu === med.id}
                  onMenuToggle={() =>
                    setActiveMenu(activeMenu === med.id ? null : med.id)
                  }
                  onToggleReminder={() => toggleReminder(med.id)}
                  onRemove={() => removeMedicine(med.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {activeMenu && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 20 }}
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
}

function MedicineListCard({
  medicine,
  isMenuOpen,
  onMenuToggle,
  onToggleReminder,
  onRemove,
}: {
  medicine: MedicineItem;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onToggleReminder: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="card card-hover" style={{ padding: "14px", position: "relative" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {/* Icon */}
        <Link href={`/medicines/${medicine.id}`} style={{ textDecoration: "none" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "var(--radius-md)",
              background: "var(--color-primary-50)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              flexShrink: 0,
              cursor: "pointer",
            }}
          >
            {medicine.icon}
          </div>
        </Link>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ flex: 1 }}>
              <Link
                href={`/medicines/${medicine.id}`}
                style={{ textDecoration: "none" }}
              >
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: "var(--color-text-primary)",
                    marginBottom: 1,
                  }}
                >
                  {medicine.name}
                </p>
              </Link>
              <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                {medicine.generic} · {medicine.manufacturer}
              </p>
            </div>

            {/* Menu button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMenuToggle();
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-text-muted)",
                cursor: "pointer",
                padding: "2px 4px",
                flexShrink: 0,
              }}
              aria-label="More options"
            >
              <MoreVertical size={18} />
            </button>
          </div>

          {/* Dosage row */}
          <Link href={`/medicines/${medicine.id}`} style={{ textDecoration: "none" }}>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                cursor: "pointer",
              }}
            >
              <span className="badge badge-muted">{medicine.dosage}</span>
              <span className="badge badge-muted">{medicine.frequency}</span>
            </div>
          </Link>

          {/* Next dose + reminder */}
          <div
            style={{
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: "var(--color-primary)",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <Clock size={13} />
              Next: {formatTime(medicine.nextDose)}
            </div>

            <button
              onClick={onToggleReminder}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "none",
                border: "none",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                color: medicine.reminderEnabled
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
              }}
              aria-label={
                medicine.reminderEnabled ? "Disable reminder" : "Enable reminder"
              }
            >
              {medicine.reminderEnabled ? (
                <Bell size={14} />
              ) : (
                <BellOff size={14} />
              )}
              {medicine.reminderEnabled ? "Reminder on" : "Reminder off"}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "absolute",
            top: 44,
            right: 14,
            background: "white",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
            zIndex: 30,
            overflow: "hidden",
            minWidth: 160,
          }}
          role="menu"
        >
          <Link
            href={`/medicines/${medicine.id}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 14px",
              fontSize: 13,
              color: "var(--color-text-secondary)",
              borderBottom: "1px solid var(--color-border-light)",
            }}
            role="menuitem"
          >
            <ChevronRight size={14} />
            View Details
          </Link>
          <button
            onClick={onToggleReminder}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 14px",
              fontSize: 13,
              color: "var(--color-text-secondary)",
              background: "none",
              border: "none",
              borderBottom: "1px solid var(--color-border-light)",
              width: "100%",
              cursor: "pointer",
            }}
            role="menuitem"
          >
            {medicine.reminderEnabled ? <BellOff size={14} /> : <Bell size={14} />}
            {medicine.reminderEnabled ? "Disable Reminder" : "Enable Reminder"}
          </button>
          <button
            onClick={onRemove}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 14px",
              fontSize: 13,
              color: "var(--color-error)",
              background: "none",
              border: "none",
              width: "100%",
              cursor: "pointer",
            }}
            role="menuitem"
          >
            <Trash2 size={14} />
            Remove Medicine
          </button>
        </motion.div>
      )}
    </div>
  );
}
