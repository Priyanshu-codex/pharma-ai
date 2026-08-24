"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, AlertTriangle } from "lucide-react";
import { MedDisclaimer } from "@/components/shared/MedDisclaimer";

const COMMON_DRUGS = [
  {
    name: "Metformin 500mg",
    class: "Biguanide / Antidiabetic",
    effects: [
      { name: "Nausea & Abdominal Discomfort", frequency: "Very Common (>10%)", severity: "Mild to Moderate", note: "Take with meals to minimize gastrointestinal upset" },
      { name: "Diarrhea", frequency: "Very Common (>10%)", severity: "Mild", note: "Usually transient during initial weeks of therapy" },
      { name: "Vitamin B12 Deficiency", frequency: "Common (1-10%)", severity: "Moderate", note: "Long-term use may impair B12 absorption; periodic monitoring recommended" },
      { name: "Lactic Acidosis", frequency: "Very Rare (<0.01%)", severity: "Severe / Medical Emergency", note: "High risk in renal impairment or acute hypoxia" },
    ],
    warnings: ["Contraindicated in severe renal impairment (eGFR <30 mL/min)", "Withhold prior to iodinated contrast procedures"],
  },
  {
    name: "Atorvastatin 20mg",
    class: "HMG-CoA Reductase Inhibitor",
    effects: [
      { name: "Myalgia (Muscle Pain)", frequency: "Common (1-10%)", severity: "Mild to Moderate", note: "Report unexplained muscle tenderness or weakness immediately" },
      { name: "Elevated Liver Enzymes (ALT/AST)", frequency: "Uncommon (0.1-1%)", severity: "Moderate", note: "Monitor liver function tests baseline and clinically as indicated" },
      { name: "Rhabdomyolysis", frequency: "Very Rare (<0.01%)", severity: "Severe", note: "Characterized by dark urine and severe muscle weakness" },
    ],
    warnings: ["Avoid large quantities of grapefruit juice", "Contraindicated during pregnancy and active liver disease"],
  },
  {
    name: "Lisinopril 10mg",
    class: "ACE Inhibitor",
    effects: [
      { name: "Persistent Dry Cough", frequency: "Common (1-10%)", severity: "Mild", note: "Bradykinin-mediated; does not respond to cough suppressants" },
      { name: "Hyperkalemia", frequency: "Common (1-10%)", severity: "Moderate", note: "Monitor serum potassium levels regularly" },
      { name: "Angioedema", frequency: "Rare (<0.1%)", severity: "Severe", note: "Immediate medical intervention required for airway swelling" },
    ],
    warnings: ["Black Box Warning: Fetal toxicity in 2nd and 3rd trimesters", "Avoid potassium supplements without medical advice"],
  },
];

export default function SideEffectsPage() {
  const [selectedDrug, setSelectedDrug] = useState(COMMON_DRUGS[0]);
  const [search, setSearch] = useState("");

  const filteredDrugs = COMMON_DRUGS.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-[430px] md:max-w-none mx-auto pb-6">
      {/* Mobile Header */}
      <div
        className="md:hidden"
        style={{
          background: "var(--color-bg)",
          padding: "16px 20px 14px",
          borderBottom: "1px solid var(--color-border-light)",
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--color-text-primary)" }}>
          Side Effects Explorer
        </h1>
        <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
          Adverse reactions, precautions & black box warnings
        </p>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block px-6 py-6 border-b border-[var(--color-border-light)] bg-white mb-6">
        <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
          Drug Side Effects & Safety Profiles ⚠️
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Explore adverse drug reactions, incidence frequencies, and clinical monitoring recommendations
        </p>
      </div>

      <div className="px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Drug Selection Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="search"
                className="input-base pl-9"
                placeholder="Search medication..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              {filteredDrugs.map((drug) => (
                <button
                  key={drug.name}
                  onClick={() => setSelectedDrug(drug)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedDrug.name === drug.name
                      ? "bg-[var(--color-primary-50)] border-[var(--color-primary-light)] text-[var(--color-primary)] font-bold shadow-sm"
                      : "bg-white border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-slate-300"
                  }`}
                >
                  <p className="text-sm font-semibold">{drug.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{drug.class}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-2 space-y-4">
            <motion.div key={selectedDrug.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
              <div className="flex justify-between items-start mb-4 pb-3 border-b border-[var(--color-border-light)]">
                <div>
                  <h2 className="text-xl font-extrabold text-[var(--color-text-primary)]">{selectedDrug.name}</h2>
                  <p className="text-xs font-semibold text-[var(--color-primary)] mt-1">{selectedDrug.class}</p>
                </div>
                <span className="badge badge-error">⚠️ Safety Profile</span>
              </div>

              {/* Warnings */}
              {selectedDrug.warnings.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 mb-5 space-y-1.5">
                  <p className="text-xs font-extrabold text-red-800 flex items-center gap-1.5">
                    <AlertTriangle size={15} /> CLINICAL PRECAUTIONS & WARNINGS
                  </p>
                  {selectedDrug.warnings.map((w, idx) => (
                    <p key={idx} className="text-xs text-red-700 font-medium pl-5">• {w}</p>
                  ))}
                </div>
              )}

              {/* Side Effects List */}
              <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
                Adverse Reaction Profiles
              </p>
              <div className="space-y-3">
                {selectedDrug.effects.map((effect, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">{effect.name}</p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          effect.severity.includes("Severe")
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : effect.severity.includes("Moderate")
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {effect.severity}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mb-1.5">Incidence: {effect.frequency}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] bg-white p-2 rounded-lg border border-slate-100">
                      💡 <strong>Clinical Guidance:</strong> {effect.note}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <MedDisclaimer variant="full" />
          </div>
        </div>
      </div>
    </div>
  );
}
