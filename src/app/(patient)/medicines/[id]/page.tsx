"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Building,
  Shield,
  FileText,
  Loader2,
} from "lucide-react";
import { MedDisclaimer } from "@/components/shared/MedDisclaimer";
import type { DBMedicine } from "@/lib/supabase/data-service";

export default function MedicineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const medicineId = resolvedParams.id;

  const [medicine, setMedicine] = useState<DBMedicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    import("@/lib/supabase/data-service").then(({ fetchMedicineById }) => {
      fetchMedicineById(medicineId).then((med) => {
        setMedicine(med);
        setLoading(false);
      });
    });
  }, [medicineId]);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const { deleteMedicineFromDB } = await import("@/lib/supabase/data-service");
      await deleteMedicineFromDB(medicineId);
      router.push("/medicines");
    } catch (err) {
      console.error("Failed to delete medicine:", err);
      setIsDeleting(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 size={36} className="animate-spin text-[var(--color-primary)] mb-4" />
        <p className="text-sm text-[var(--color-text-muted)]">Loading medicine details…</p>
      </div>
    );
  }

  // Not found
  if (!medicine) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-amber-600">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Medicine Not Found</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-sm">
          The requested medicine record could not be found or may have been removed from your active list.
        </p>
        <Link href="/medicines" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to My Medicines
        </Link>
      </div>
    );
  }

  // Derived display fields
  const uses: string[] = medicine.dosage_instructions
    ? [`Primary use: ${medicine.dosage_instructions}`]
    : ["Refer to your prescription for specific therapeutic uses."];

  const sideEffects: string[] = [
    "Consult your doctor or pharmacist for a complete list of potential side effects.",
  ];

  const precautions: string[] = [
    "Follow dosage instructions as prescribed by your doctor.",
    "Do not stop or change your dose without medical advice.",
    "Keep out of reach of children.",
  ];

  return (
    <div className="w-full max-w-3xl mx-auto pb-12 px-4 md:px-6 pt-4">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between mb-6 border-b border-[var(--color-border-light)] pb-4">
        <Link
          href="/medicines"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
        >
          <ArrowLeft size={18} />
          Back to My Medicines
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Medicine"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Main Medicine Banner Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-50)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0 text-3xl font-bold">
              {medicine.icon || "💊"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">{medicine.name}</h1>
              <p className="text-sm text-[var(--color-text-secondary)] font-medium">
                {medicine.generic_name || medicine.name}
                {medicine.brand_name && medicine.brand_name !== medicine.name && (
                  <> · <span className="text-[var(--color-text-muted)]">{medicine.brand_name}</span></>
                )}
              </p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {medicine.dosage_form && <span className="badge badge-muted">{medicine.dosage_form}</span>}
                {medicine.strength && <span className="badge badge-muted">{medicine.strength}</span>}
                {medicine.frequency && <span className="badge badge-primary">{medicine.frequency}</span>}
              </div>
            </div>
          </div>

          {medicine.next_dose && (
            <div className="bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border-light)] flex flex-col gap-1 min-w-[180px]">
              <span className="text-xs text-[var(--color-text-muted)] font-medium">Next Scheduled Dose</span>
              <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-lg">
                <Clock size={18} />
                {medicine.next_dose}
              </div>
              <span className="text-[11px] text-[var(--color-text-secondary)]">
                {medicine.reminder_enabled ? "🔔 Reminders Active" : "🔕 Reminders Muted"}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Prescription & Dosage Info */}
        <div className="card p-5">
          <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <FileText size={18} className="text-[var(--color-primary)]" />
            Dosage & Schedule
          </h3>
          <div className="space-y-3 text-sm">
            {medicine.dosage_instructions && (
              <div>
                <span className="text-xs text-[var(--color-text-muted)] block mb-1">Instructions</span>
                <p className="font-semibold text-[var(--color-text-primary)]">{medicine.dosage_instructions}</p>
              </div>
            )}
            {medicine.active_ingredient && (
              <div>
                <span className="text-xs text-[var(--color-text-muted)] block mb-1">Active Ingredient</span>
                <p className="font-semibold text-[var(--color-text-primary)]">{medicine.active_ingredient}</p>
              </div>
            )}
            {medicine.manufacturer && (
              <div>
                <span className="text-xs text-[var(--color-text-muted)] block mb-1">Manufacturer</span>
                <p className="font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
                  <Building size={14} className="text-[var(--color-text-muted)]" />
                  {medicine.manufacturer}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Primary Uses */}
        <div className="card p-5">
          <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            Therapeutic Uses
          </h3>
          <ul className="space-y-2">
            {uses.map((use, i) => (
              <li key={i} className="text-sm text-[var(--color-text-primary)] flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>{use}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Safety & Side Effects Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Side Effects */}
        <div className="card p-5">
          <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            Common Side Effects
          </h3>
          <ul className="space-y-2">
            {sideEffects.map((se, i) => (
              <li key={i} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <span>{se}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-[var(--color-text-muted)] mt-3">
            Ask your pharmacist or doctor for a full list of side effects specific to this medicine.
          </p>
        </div>

        {/* Precautions */}
        <div className="card p-5">
          <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <Shield size={18} className="text-blue-600" />
            Precautions & Warnings
          </h3>
          <ul className="space-y-2">
            {precautions.map((p, i) => (
              <li key={i} className="text-xs text-[var(--color-text-secondary)] leading-relaxed flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Added date */}
      {medicine.created_at && (
        <div className="card p-5 mb-6 bg-blue-50/50 border-blue-100">
          <h4 className="text-sm font-bold text-blue-900 mb-1">💡 Tracking since</h4>
          <p className="text-xs text-blue-800">
            Added on {new Date(medicine.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      )}

      <MedDisclaimer />

      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">Remove Medicine?</h3>
            <p className="text-xs text-[var(--color-text-secondary)] mb-6">
              Are you sure you want to remove <strong>{medicine.name}</strong> from your active medication list?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="btn-secondary flex-1"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-primary flex-1 bg-red-600 hover:bg-red-700 border-none text-white"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Removing…
                  </>
                ) : (
                  "Remove"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
