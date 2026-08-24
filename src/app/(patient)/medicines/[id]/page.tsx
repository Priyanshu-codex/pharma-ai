"use client";

import { use, useState } from "react";
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
} from "lucide-react";
import { MedDisclaimer } from "@/components/shared/MedDisclaimer";

// Centralized Medicine Inventory Database
export const MEDICINE_DATABASE: Record<
  string,
  {
    id: string;
    name: string;
    generic_name: string;
    brand_name: string;
    manufacturer: string;
    active_ingredient: string;
    strength: string;
    dosage_form: string;
    dosage_instructions: string;
    frequency: string;
    next_dose: string;
    reminder_enabled: boolean;
    uses: string[];
    side_effects: string[];
    precautions: string[];
    missed_dose_advice: string;
    storage_advice: string;
  }
> = {
  m1: {
    id: "m1",
    name: "Metformin 500mg",
    generic_name: "Metformin Hydrochloride",
    brand_name: "Glucophage / Glycomet",
    manufacturer: "Sun Pharma",
    active_ingredient: "Metformin Hydrochloride 500mg",
    strength: "500 mg",
    dosage_form: "Oral Tablet",
    dosage_instructions: "Take 1 tablet twice daily with meals",
    frequency: "Twice daily",
    next_dose: "20:00",
    reminder_enabled: true,
    uses: [
      "Type 2 Diabetes Mellitus Management",
      "Improving Peripheral Insulin Sensitivity",
      "Decreasing Hepatic Glucose Production",
    ],
    side_effects: [
      "Nausea & Abdominal Discomfort",
      "Mild Transient Diarrhea",
      "Long-term Vitamin B12 Reduction",
    ],
    precautions: [
      "Take with meals to minimize gastrointestinal upset",
      "Avoid excessive alcohol consumption to prevent lactic acidosis",
      "Periodic monitoring of renal function and B12 levels is recommended",
    ],
    missed_dose_advice:
      "Take the missed dose as soon as you remember with food. If it is almost time for your next dose, skip the missed dose and resume your regular schedule. Do not double doses.",
    storage_advice: "Store below 30°C in a dry place away from direct sunlight.",
  },
  m2: {
    id: "m2",
    name: "Lisinopril 10mg",
    generic_name: "Lisinopril",
    brand_name: "Zestril / Prinivil",
    manufacturer: "Cipla Ltd",
    active_ingredient: "Lisinopril Dihydrate 10mg",
    strength: "10 mg",
    dosage_form: "Oral Tablet",
    dosage_instructions: "Take 1 tablet daily in the morning",
    frequency: "Once daily",
    next_dose: "08:00",
    reminder_enabled: true,
    uses: [
      "Hypertension (High Blood Pressure)",
      "Heart Failure Management",
      "Post-Myocardial Infarction Recovery",
    ],
    side_effects: [
      "Persistent Dry Cough",
      "Dizziness upon standing",
      "Hyperkalemia (Elevated Potassium)",
    ],
    precautions: [
      "Monitor blood pressure regularly during initial treatment",
      "Periodic blood tests for serum potassium and renal function",
      "Do not use potassium supplements without consulting your physician",
    ],
    missed_dose_advice:
      "Take it as soon as you remember. If it is within 4 hours of your next scheduled dose, skip the missed dose. Never take two doses at once.",
    storage_advice: "Store at room temperature (15–30°C) protected from moisture.",
  },
  m3: {
    id: "m3",
    name: "Atorvastatin 20mg",
    generic_name: "Atorvastatin Calcium",
    brand_name: "Lipitor / Atorva",
    manufacturer: "Ranbaxy / Sun Pharma",
    active_ingredient: "Atorvastatin Calcium 20mg",
    strength: "20 mg",
    dosage_form: "Film-Coated Tablet",
    dosage_instructions: "Take 1 tablet once daily at bedtime",
    frequency: "Once daily at bedtime",
    next_dose: "21:00",
    reminder_enabled: false,
    uses: [
      "Hypercholesterolemia (High Cholesterol)",
      "Reduction of Cardiovascular Risk",
      "Prevention of Atherosclerotic Heart Disease",
    ],
    side_effects: [
      "Mild Muscle Pain (Myalgia)",
      "Elevated Liver Enzymes (rare)",
      "Mild Digestive Upset",
    ],
    precautions: [
      "Avoid consuming grapefruit or grapefruit juice in large quantities",
      "Report unexplained muscle pain, tenderness, or weakness immediately",
      "Periodic lipid profile and liver function tests recommended",
    ],
    missed_dose_advice:
      "If you miss a dose, take it if it is more than 12 hours before your next dose. Otherwise, skip it and continue your usual bedtime routine.",
    storage_advice: "Keep in original container at room temperature away from heat.",
  },
};

export default function MedicineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const medicineId = resolvedParams.id;

  const [medicine] = useState(() => MEDICINE_DATABASE[medicineId] || null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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

  function handleDelete() {
    setIsDeleting(true);
    setTimeout(() => {
      delete MEDICINE_DATABASE[medicineId];
      router.push("/medicines");
    }, 400);
  }

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
              💊
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">{medicine.name}</h1>
              <p className="text-sm text-[var(--color-text-secondary)] font-medium">
                {medicine.generic_name} · <span className="text-[var(--color-text-muted)]">{medicine.brand_name}</span>
              </p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="badge badge-muted">{medicine.dosage_form}</span>
                <span className="badge badge-muted">{medicine.strength}</span>
                <span className="badge badge-primary">{medicine.frequency}</span>
              </div>
            </div>
          </div>

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
            <div>
              <span className="text-xs text-[var(--color-text-muted)] block mb-1">Instructions</span>
              <p className="font-semibold text-[var(--color-text-primary)]">{medicine.dosage_instructions}</p>
            </div>
            <div>
              <span className="text-xs text-[var(--color-text-muted)] block mb-1">Manufacturer</span>
              <p className="font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
                <Building size={14} className="text-[var(--color-text-muted)]" />
                {medicine.manufacturer}
              </p>
            </div>
            <div>
              <span className="text-xs text-[var(--color-text-muted)] block mb-1">Storage Recommendation</span>
              <p className="text-[var(--color-text-secondary)] text-xs">{medicine.storage_advice}</p>
            </div>
          </div>
        </div>

        {/* Primary Uses */}
        <div className="card p-5">
          <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            Therapeutic Uses
          </h3>
          <ul className="space-y-2">
            {medicine.uses.map((use, i) => (
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
            {medicine.side_effects.map((se, i) => (
              <li key={i} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <span>{se}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Precautions */}
        <div className="card p-5">
          <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <Shield size={18} className="text-blue-600" />
            Precautions & Warnings
          </h3>
          <ul className="space-y-2">
            {medicine.precautions.map((p, i) => (
              <li key={i} className="text-xs text-[var(--color-text-secondary)] leading-relaxed flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Missed Dose Advice */}
      <div className="card p-5 mb-6 bg-blue-50/50 border-blue-100">
        <h4 className="text-sm font-bold text-blue-900 mb-2">💡 What to do if you miss a dose</h4>
        <p className="text-xs text-blue-800 leading-relaxed">{medicine.missed_dose_advice}</p>
      </div>

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
                {isDeleting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
