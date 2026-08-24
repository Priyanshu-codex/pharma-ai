// ============================================================
// PharmaAI — Mock AI Responses for Development
// These are used when NEXT_PUBLIC_AI_MODE=mock (the default)
// Replace with real API calls when API keys are configured.
// ============================================================

import {
  Medicine,
  ScanResult,
  PrescriptionMedicine,
  ChatMessage,
  QuizQuestion,
  ClinicalCase,
  DrugMechanism,
  DrugInteraction,
  MarketInsight,
  GenericAlternative,
  PriceEntry,
} from "@/lib/types";
import { generateId, sleep } from "@/lib/utils";

// ── Mock Medicine Scan Result ─────────────────────────────
export async function mockScanMedicine(): Promise<ScanResult> {
  await sleep(2000); // Simulate processing

  const medicine: Medicine = {
    id: generateId(),
    name: "Paracetamol 500mg",
    generic_name: "Paracetamol",
    brand_name: "Crocin",
    manufacturer: "GlaxoSmithKline",
    active_ingredient: "Paracetamol (Acetaminophen)",
    strength: "500mg",
    dosage_form: "Tablet",
    description:
      "Paracetamol is an analgesic and antipyretic medicine used to relieve mild to moderate pain and reduce fever.",
    uses: [
      "Relief of mild to moderate pain (headache, toothache, backache)",
      "Reduction of fever",
      "Relief of pain associated with cold and flu",
    ],
    side_effects: [
      "Nausea (uncommon)",
      "Liver damage with overdose (serious)",
      "Allergic reactions (rare)",
    ],
    warnings: [
      "Do not exceed recommended dose",
      "Avoid alcohol while taking this medicine",
      "Consult a doctor if symptoms persist for more than 3 days",
      "Not recommended for patients with severe liver disease",
    ],
    image_url: undefined,
    data_source: "OpenFDA / Mock Data",
    last_updated: new Date().toISOString(),
    confidence: 0.92,
  };

  return { medicine, confidence: 0.92 };
}

// ── Mock Prescription Extraction ─────────────────────────
export async function mockScanPrescription(): Promise<PrescriptionMedicine[]> {
  await sleep(2500);

  return [
    {
      id: generateId(),
      name: "Amoxicillin 500mg",
      dosage: "1 capsule",
      frequency: "3 times daily",
      duration: "7 days",
      instructions: "Take with food",
      confidence: 0.88,
      is_verified: false,
    },
    {
      id: generateId(),
      name: "Ibuprofen 400mg",
      dosage: "1 tablet",
      frequency: "Twice daily",
      duration: "5 days",
      instructions: "Take after meals",
      confidence: 0.75,
      is_verified: false,
    },
    {
      id: generateId(),
      name: "Cetirizine 10mg",
      dosage: "1 tablet",
      frequency: "Once daily at bedtime",
      duration: "10 days",
      instructions: undefined,
      confidence: 0.55, // Low confidence — will be flagged
      is_verified: false,
    },
  ];
}

// ── Mock Generic Alternatives ──────────────────────────────
export async function mockGetAlternatives(
  activeIngredient: string,
  strength: string
): Promise<GenericAlternative[]> {
  await sleep(1000);

  return [
    {
      id: generateId(),
      name: "Paracetamol Tablets IP",
      manufacturer: "Cipla Ltd.",
      active_ingredient: activeIngredient || "Paracetamol",
      strength: strength || "500mg",
      dosage_form: "Tablet",
      price: 18,
      currency: "INR",
      pack_size: "15 tablets",
      data_source: "Indian Pharmacopoeia",
      last_updated: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: "Paracetamol 500mg",
      manufacturer: "Sun Pharmaceuticals",
      active_ingredient: activeIngredient || "Paracetamol",
      strength: strength || "500mg",
      dosage_form: "Tablet",
      price: 12,
      currency: "INR",
      pack_size: "10 tablets",
      data_source: "Indian Pharmacopoeia",
      last_updated: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: "Dolo 500",
      manufacturer: "Micro Labs Ltd.",
      active_ingredient: activeIngredient || "Paracetamol",
      strength: strength || "500mg",
      dosage_form: "Tablet",
      price: 30,
      currency: "INR",
      pack_size: "15 tablets",
      data_source: "Indian Pharmacopoeia",
      last_updated: new Date().toISOString(),
    },
  ];
}

// ── Mock Price Comparison ─────────────────────────────────
export async function mockGetPrices(medicineName: string): Promise<PriceEntry[]> {
  await sleep(800);

  return [
    {
      id: generateId(),
      medicine_name: medicineName || "Paracetamol 500mg",
      brand: "Crocin",
      price: 45,
      currency: "INR",
      pack_size: "15 tablets",
      retailer: "Apollo Pharmacy",
      source: "Apollo Pharmacy (mock)",
      last_updated: new Date().toISOString(),
    },
    {
      id: generateId(),
      medicine_name: medicineName || "Paracetamol 500mg",
      brand: "Dolo 500",
      price: 30,
      currency: "INR",
      pack_size: "15 tablets",
      retailer: "1mg",
      source: "1mg (mock)",
      last_updated: new Date().toISOString(),
    },
    {
      id: generateId(),
      medicine_name: medicineName || "Paracetamol 500mg",
      brand: "Calpol",
      price: 38,
      currency: "INR",
      pack_size: "12 tablets",
      retailer: "PharmEasy",
      source: "PharmEasy (mock)",
      last_updated: new Date().toISOString(),
    },
  ];
}

// ── Mock Drug Interactions ────────────────────────────────
export async function mockGetInteractions(
  drugA: string,
  drugB: string
): Promise<DrugInteraction[]> {
  await sleep(1000);

  return [
    {
      id: generateId(),
      drug_a: drugA || "Warfarin",
      drug_b: drugB || "Aspirin",
      severity: "major",
      description:
        "Concurrent use of warfarin and aspirin significantly increases the risk of bleeding. The antiplatelet effect of aspirin combined with the anticoagulant effect of warfarin may result in serious and potentially fatal haemorrhage.",
      mechanism:
        "Additive anticoagulant/antiplatelet effects. Aspirin also displaces warfarin from protein binding sites.",
      clinical_significance:
        "This combination requires careful monitoring and is generally avoided unless the benefits clearly outweigh the risks.",
      management:
        "If concurrent use is necessary, monitor closely for signs of bleeding. Consider using lower doses and check INR frequently.",
      data_source: "Mock Drug Interaction Database",
    },
  ];
}

// ── Mock Drug Mechanism ────────────────────────────────────
export async function mockGetMechanism(drugName: string): Promise<DrugMechanism> {
  await sleep(800);

  return {
    id: generateId(),
    drug_name: drugName || "Metformin",
    drug_class: "Biguanide",
    therapeutic_use: "Type 2 Diabetes Mellitus",
    mechanism: "Inhibition of hepatic gluconeogenesis; improvement of insulin sensitivity",
    how_it_works:
      "Metformin works primarily by decreasing hepatic glucose production (gluconeogenesis). It activates AMP-activated protein kinase (AMPK), which reduces the expression of gluconeogenic enzymes. Additionally, it improves peripheral insulin sensitivity, reducing glucose uptake resistance in muscle cells. Unlike sulfonylureas, metformin does not stimulate insulin secretion and therefore does not cause hypoglycaemia.",
    key_points: [
      "Does not cause hypoglycaemia when used as monotherapy",
      "First-line pharmacological treatment for type 2 diabetes",
      "Associated with modest weight loss",
      "Reduces cardiovascular mortality in obese diabetic patients",
      "Contraindicated in severe renal impairment (eGFR < 30)",
    ],
    pharmacokinetics: {
      absorption: "Incomplete (50–60%), not affected by food",
      distribution: "Low protein binding; distributes to gut wall, liver, kidneys",
      metabolism: "Not hepatically metabolised",
      excretion: "Renally eliminated unchanged; half-life ~6.5 hours",
    },
  };
}

// ── Mock AI Chat Response ──────────────────────────────────
export async function mockChatResponse(
  messages: ChatMessage[],
  mode: "patient" | "student"
): Promise<string> {
  await sleep(1500);

  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() ?? "";

  if (mode === "patient") {
    if (lastMessage.includes("paracetamol") || lastMessage.includes("fever")) {
      return "Paracetamol (also known as Acetaminophen) is commonly used to relieve mild to moderate pain and reduce fever. The typical adult dose is 500mg to 1g every 4–6 hours, with a maximum of 4g per day.\n\n⚠️ **Important**: Always follow the dosage on the packaging or as prescribed by your doctor. Exceeding the maximum daily dose can cause serious liver damage.\n\n*This information is for educational purposes only. Consult your pharmacist or doctor for personalised medical advice.*";
    }
    if (lastMessage.includes("interaction") || lastMessage.includes("together")) {
      return "Drug interactions can affect how your medications work or increase the risk of side effects. It's very important to tell your doctor and pharmacist about all medicines you are taking, including supplements and over-the-counter drugs.\n\nYou can use PharmaAI's Drug Interaction Checker to check specific medicine combinations.\n\n*Always consult your pharmacist or doctor before starting, stopping, or combining medications.*";
    }
    return "I'm PharmaAI Assistant, here to help you understand your medicines and manage your health journey. I can answer questions about medications, help you understand prescriptions, and provide general pharmaceutical information.\n\n⚠️ I cannot diagnose conditions or replace professional medical advice. Please consult your doctor or pharmacist for personalised guidance.";
  }

  // Student mode
  if (lastMessage.includes("mechanism") || lastMessage.includes("how does")) {
    return "Understanding drug mechanisms is fundamental to pharmacology. Drugs work by interacting with specific biological targets — typically receptors, enzymes, ion channels, or transporters.\n\n**Key concepts:**\n- **Agonists** activate receptors to produce a response\n- **Antagonists** block receptors to prevent a response\n- **Enzyme inhibitors** block enzymatic activity\n- **Ion channel modulators** affect ion flow across membranes\n\nWould you like me to explain the mechanism for a specific drug class?";
  }
  return "Welcome to PharmaAI Study Assistant! I'm here to help you with:\n\n📚 Drug mechanisms and pharmacology\n⚕️ Clinical pharmacology and case studies\n🧪 Drug interactions and side effects\n📊 Pharmaceutical market knowledge\n\nWhat topic would you like to explore today?";
}

// ── Mock Quiz Questions ───────────────────────────────────
export async function mockGenerateQuiz(
  topic: string,
  difficulty: string,
  count = 5
): Promise<QuizQuestion[]> {
  await sleep(1200);

  const questions: QuizQuestion[] = [
    {
      id: generateId(),
      question: "Which enzyme does Metformin primarily activate to reduce hepatic gluconeogenesis?",
      options: [
        { id: "a", text: "Protein Kinase C (PKC)" },
        { id: "b", text: "AMP-activated Protein Kinase (AMPK)" },
        { id: "c", text: "Phosphodiesterase (PDE)" },
        { id: "d", text: "Cyclooxygenase (COX)" },
      ],
      correct_option_id: "b",
      explanation:
        "Metformin activates AMPK (AMP-activated Protein Kinase), which leads to reduced expression of gluconeogenic enzymes in the liver, thereby decreasing hepatic glucose production.",
      topic: topic || "Pharmacology",
      difficulty: (difficulty as "easy" | "medium" | "hard") || "medium",
    },
    {
      id: generateId(),
      question: "Which of the following is NOT a mechanism of action of beta-blockers?",
      options: [
        { id: "a", text: "Decreased heart rate" },
        { id: "b", text: "Reduced cardiac output" },
        { id: "c", text: "Vasodilation via alpha-1 blockade" },
        { id: "d", text: "Inhibition of renin release" },
      ],
      correct_option_id: "c",
      explanation:
        "Beta-blockers primarily reduce heart rate and cardiac output, and inhibit renin release. Vasodilation via alpha-1 blockade is a mechanism of alpha-blockers, not standard beta-blockers (though labetalol has both alpha and beta blocking properties).",
      topic: topic || "Pharmacology",
      difficulty: (difficulty as "easy" | "medium" | "hard") || "medium",
    },
    {
      id: generateId(),
      question: "What is the primary mechanism by which ACE inhibitors reduce blood pressure?",
      options: [
        { id: "a", text: "Blocking calcium channels in vascular smooth muscle" },
        { id: "b", text: "Preventing conversion of Angiotensin I to Angiotensin II" },
        { id: "c", text: "Directly relaxing vascular smooth muscle" },
        { id: "d", text: "Blocking aldosterone receptors in the kidney" },
      ],
      correct_option_id: "b",
      explanation:
        "ACE (Angiotensin-Converting Enzyme) inhibitors work by blocking the enzyme responsible for converting Angiotensin I to Angiotensin II. Since Angiotensin II is a potent vasoconstrictor, its inhibition leads to vasodilation and reduced blood pressure.",
      topic: topic || "Pharmacology",
      difficulty: (difficulty as "easy" | "medium" | "hard") || "medium",
    },
    {
      id: generateId(),
      question: "A patient taking warfarin starts on aspirin for cardiac prophylaxis. What is the main concern?",
      options: [
        { id: "a", text: "Reduced anticoagulant effect of warfarin" },
        { id: "b", text: "Increased risk of bleeding" },
        { id: "c", text: "Increased warfarin metabolism" },
        { id: "d", text: "Reduced platelet production" },
      ],
      correct_option_id: "b",
      explanation:
        "Both warfarin (anticoagulant) and aspirin (antiplatelet) affect haemostasis through different mechanisms. Their combination significantly increases the risk of serious and potentially fatal bleeding. Close monitoring is essential if this combination is used.",
      topic: topic || "Drug Interactions",
      difficulty: (difficulty as "easy" | "medium" | "hard") || "medium",
    },
    {
      id: generateId(),
      question: "Which drug class is first-line for treating Helicobacter pylori infection?",
      options: [
        { id: "a", text: "H2 receptor antagonists alone" },
        { id: "b", text: "Proton pump inhibitors (PPIs) as part of triple therapy" },
        { id: "c", text: "Antacids combined with bismuth" },
        { id: "d", text: "Sucralfate monotherapy" },
      ],
      correct_option_id: "b",
      explanation:
        "The standard treatment for H. pylori is triple therapy: a Proton Pump Inhibitor (PPI) + two antibiotics (typically Clarithromycin + Amoxicillin or Metronidazole) for 7–14 days. PPIs reduce gastric acid, creating a more favourable environment for antibiotic activity.",
      topic: topic || "Pharmacology",
      difficulty: (difficulty as "easy" | "medium" | "hard") || "medium",
    },
  ];

  return questions.slice(0, count);
}

// ── Mock Clinical Cases ────────────────────────────────────
export async function mockGetClinicalCases(): Promise<ClinicalCase[]> {
  return [
    {
      id: generateId(),
      case_number: 1,
      title: "Antibiotic Selection in Penicillin Allergy",
      scenario:
        "A 45-year-old male presents with community-acquired pneumonia. He reports a documented allergy to penicillin (rash). His sputum culture confirms Streptococcus pneumoniae.",
      patient_info: {
        age: 45,
        gender: "Male",
        weight: 72,
        allergies: ["Penicillin — rash"],
        current_medications: ["Lisinopril 10mg daily"],
        chief_complaint: "Productive cough, fever 38.5°C, dyspnoea for 3 days",
      },
      question: "Which antibiotic regimen would be most appropriate for this patient?",
      options: [
        { id: "a", text: "Amoxicillin-clavulanate 875mg twice daily" },
        { id: "b", text: "Azithromycin 500mg daily for 5 days" },
        { id: "c", text: "Doxycycline 100mg twice daily" },
        { id: "d", text: "Ceftriaxone 1g daily" },
      ],
      correct_option_id: "b",
      explanation:
        "Azithromycin (a macrolide) is the appropriate choice here. Amoxicillin-clavulanate and ceftriaxone are beta-lactams, and there is a cross-reactivity risk (particularly with cephalosporins) in patients with penicillin allergy. Macrolides (azithromycin, clarithromycin) are the preferred alternative for community-acquired pneumonia in penicillin-allergic patients with mild-to-moderate disease.",
      learning_points: [
        "Penicillin allergy does not automatically rule out all beta-lactams, but caution is required",
        "Macrolides are a preferred alternative for penicillin-allergic patients with CAP",
        "Cross-reactivity between penicillins and cephalosporins is ~1–2%",
        "Always document the exact nature of the allergic reaction",
      ],
      difficulty: "intermediate",
      category: "Infectious Disease",
    },
    {
      id: generateId(),
      case_number: 2,
      title: "Diabetes Management in Renal Impairment",
      scenario:
        "A 62-year-old female with Type 2 Diabetes is admitted for HbA1c optimisation. Her eGFR is 28 mL/min/1.73m². She is currently on Metformin 1g twice daily.",
      patient_info: {
        age: 62,
        gender: "Female",
        weight: 68,
        allergies: [],
        current_medications: ["Metformin 1g twice daily", "Amlodipine 5mg daily"],
        chief_complaint: "Routine diabetes review — poorly controlled HbA1c 9.2%",
      },
      question: "What is the most appropriate change to her diabetes management?",
      options: [
        { id: "a", text: "Continue metformin but increase dose to 2g twice daily" },
        { id: "b", text: "Discontinue metformin; consider a DPP-4 inhibitor with dose adjustment for renal function" },
        { id: "c", text: "Switch to a sulfonylurea (glibenclamide)" },
        { id: "d", text: "Add insulin without changing metformin" },
      ],
      correct_option_id: "b",
      explanation:
        "Metformin is contraindicated when eGFR falls below 30 mL/min/1.73m² (and should be used with caution between 30–45). This patient's eGFR of 28 necessitates stopping metformin due to risk of lactic acidosis. Long-acting sulfonylureas like glibenclamide are also risky in renal impairment due to hypoglycaemia risk. DPP-4 inhibitors (e.g., sitagliptin, saxagliptin) with appropriate renal dose adjustment are preferred alternatives.",
      learning_points: [
        "Metformin is contraindicated when eGFR < 30 mL/min/1.73m²",
        "Renal function should be regularly monitored in diabetic patients",
        "DPP-4 inhibitors generally have better renal safety profiles",
        "Glibenclamide carries high hypoglycaemia risk in renal impairment",
      ],
      difficulty: "advanced",
      category: "Diabetes & Endocrinology",
    },
  ];
}

// ── Mock Market Insights ──────────────────────────────────
export async function mockGetMarketInsights(): Promise<MarketInsight[]> {
  return [
    {
      id: generateId(),
      title: "Indian Pharmaceutical Market Growth 2024",
      summary:
        "The Indian pharmaceutical market reached USD 50 billion in 2024, growing at approximately 10% annually. India is the world's largest provider of generic medicines globally, supplying over 50% of global vaccine demand.",
      category: "Market Overview",
      data_points: [
        { label: "Market Size", value: "USD 50 Billion" },
        { label: "Annual Growth Rate", value: "~10%" },
        { label: "Generic Drug Share", value: "~80%" },
        { label: "Export Value", value: "USD 25 Billion" },
      ],
      source: "Indian Pharmaceutical Alliance (Mock Data)",
      published_date: new Date().toISOString(),
    },
    {
      id: generateId(),
      title: "Top Therapeutic Segments by Revenue",
      summary:
        "Anti-infectives, cardiovascular, and central nervous system (CNS) drugs lead the Indian pharmaceutical market by therapeutic segment. The chronic disease segment is growing rapidly due to increasing lifestyle diseases.",
      category: "Therapeutic Segments",
      data_points: [
        { label: "Anti-infectives", value: "18%" },
        { label: "Cardiovascular", value: "14%" },
        { label: "Gastroenterology", value: "11%" },
        { label: "CNS & Neurology", value: "10%" },
        { label: "Diabetes", value: "9%" },
      ],
      source: "IQVIA / Mock Data",
      published_date: new Date().toISOString(),
    },
    {
      id: generateId(),
      title: "Generic vs. Brand Medicine: Price Comparison",
      summary:
        "Generic medicines can cost 30–90% less than branded equivalents while containing the same active ingredients, strength, and dosage form. Government initiatives like Jan Aushadhi Kendras have expanded access to affordable generics.",
      category: "Pricing",
      data_points: [
        { label: "Average Generic Savings", value: "40–70%" },
        { label: "Jan Aushadhi Stores", value: "10,000+" },
        { label: "PMBI Product Count", value: "1800+" },
      ],
      source: "PMBI / Mock Data",
      published_date: new Date().toISOString(),
    },
  ];
}
