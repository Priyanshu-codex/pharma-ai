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
import { findMedicineByNameOrIngredient } from "@/lib/data/medicines";

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

  const brandPrice = 45; // Brand reference price (e.g. Crocin ₹45)

  return [
    {
      id: generateId(),
      name: "Paracetamol Tablets IP",
      manufacturer: "Cipla Ltd.",
      active_ingredient: activeIngredient || "Paracetamol",
      strength: strength || "500mg",
      dosage_form: "Tablet",
      price: 18,
      original_price: brandPrice,
      savings: brandPrice - 18,
      savings_percentage: Math.round(((brandPrice - 18) / brandPrice) * 100),
      currency: "INR",
      pack_size: "15 tablets",
      availability: "Available",
      data_source: "Indian Pharmacopoeia",
      last_updated: new Date().toISOString(),
      retailers: [
        { name: "Apollo Pharmacy", price: 18 },
        { name: "1mg", price: 16 },
        { name: "PharmEasy", price: 17 },
      ],
    },
    {
      id: generateId(),
      name: "Paracetamol 500mg",
      manufacturer: "Sun Pharmaceuticals",
      active_ingredient: activeIngredient || "Paracetamol",
      strength: strength || "500mg",
      dosage_form: "Tablet",
      price: 12,
      original_price: brandPrice,
      savings: brandPrice - 12,
      savings_percentage: Math.round(((brandPrice - 12) / brandPrice) * 100),
      currency: "INR",
      pack_size: "10 tablets",
      availability: "Available",
      data_source: "Indian Pharmacopoeia",
      last_updated: new Date().toISOString(),
      retailers: [
        { name: "Apollo Pharmacy", price: 13 },
        { name: "1mg", price: 12 },
        { name: "Netmeds", price: 14 },
      ],
    },
    {
      id: generateId(),
      name: "Dolo 500",
      manufacturer: "Micro Labs Ltd.",
      active_ingredient: activeIngredient || "Paracetamol",
      strength: strength || "500mg",
      dosage_form: "Tablet",
      price: 30,
      original_price: brandPrice,
      savings: brandPrice - 30,
      savings_percentage: Math.round(((brandPrice - 30) / brandPrice) * 100),
      currency: "INR",
      pack_size: "15 tablets",
      availability: "Available",
      data_source: "Indian Pharmacopoeia",
      last_updated: new Date().toISOString(),
      retailers: [
        { name: "1mg", price: 30 },
        { name: "MedPlusMart", price: 29 },
      ],
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

// ── Mock AI Chat Response Engine ───────────────────────────
export async function mockChatResponse(
  messages: ChatMessage[],
  mode: "patient" | "student"
): Promise<string> {
  await sleep(800);

  const lastMessage = messages[messages.length - 1]?.content?.trim() ?? "";
  const query = lastMessage.toLowerCase();

  // Extract previous context for multi-turn follow up queries
  const fullConversationText = messages.map((m) => m.content).join(" ").toLowerCase();

  // ── Centralized Dataset Match Engine ──────────────────────
  const matchedMed = findMedicineByNameOrIngredient(query) || findMedicineByNameOrIngredient(fullConversationText);
  if (matchedMed) {
    if (query.includes("side effect") || query.includes("precaution") || query.includes("warning")) {
      return `### ${matchedMed.name} — Side Effects & Safety

**Category:** ${matchedMed.category} · **Active Ingredient:** ${matchedMed.activeIngredient}

#### ⚠️ Common Side Effects:
${matchedMed.sideEffects.map((s) => `- ${s}`).join("\n")}

#### 🛡️ Precautions & Warnings:
${matchedMed.warnings.map((w) => `- ${w}`).join("\n")}
- **Storage:** ${matchedMed.storage}

*[Source: PharmaAI Demo Database]*

> **Medical Disclaimer:** Educational information only. Always consult a healthcare professional for personalized medical advice.`;
    }

    if (query.includes("alternative") || query.includes("generic") || query.includes("price") || query.includes("save")) {
      return `### ${matchedMed.name} — Generic Alternatives & Pricing

**Brand:** ${matchedMed.brandName} · **Manufacturer:** ${matchedMed.manufacturer}
**Active Ingredient:** ${matchedMed.activeIngredient} (${matchedMed.strength})

#### 💰 Demo Pricing & Savings:
- **Generic Price:** ₹${matchedMed.price} per pack
- **Estimated Brand Price:** ₹${matchedMed.originalPrice}
- **Potential Savings:** Save ₹${matchedMed.savings} (${matchedMed.savingsPercentage}% lower cost)
- **Availability:** ${matchedMed.availability}

#### 💊 Available Generic Alternatives:
${matchedMed.alternatives.map((a) => `- **${a.name}** by ${a.manufacturer} — ₹${a.price}`).join("\n")}

*Tip: You can compare full generic alternative details directly on the [Generic Alternatives](/alternatives) page.*

*[Source: PharmaAI Demo Database]*`;
    }

    return `### ${matchedMed.name} (${matchedMed.brandName})

**Category:** ${matchedMed.category}
**Active Ingredient:** ${matchedMed.activeIngredient} · **Strength:** ${matchedMed.strength} (${matchedMed.dosageForm})
**Manufacturer:** ${matchedMed.manufacturer}

#### 📋 Primary Uses:
${matchedMed.uses.map((u) => `- ${u}`).join("\n")}

#### ⚠️ Common Side Effects:
${matchedMed.sideEffects.map((s) => `- ${s}`).join("\n")}

#### 🛡️ Warnings & Storage:
${matchedMed.warnings.map((w) => `- ${w}`).join("\n")}
- **Storage:** ${matchedMed.storage}

#### 💰 Demo Price & Generic Alternatives:
- **Price:** ₹${matchedMed.price} *(Save up to ${matchedMed.savingsPercentage}% vs brand)*
*[Source: PharmaAI Demo Database]*`;
  }

  // ── General Knowledge & Coding & Multilingual Fallback Handler ──
  if (query.includes("france") || query.includes("capital")) {
    return "The capital of France is **Paris**.";
  }

  if (query.includes("reverse a string") || query.includes("javascript")) {
    return "### JavaScript Function to Reverse a String\n\n```javascript\nfunction reverseString(str) {\n  return str.split('').reverse().join('');\n}\n\n// Example usage:\nconsole.log(reverseString(\"PharmaAI\")); // Output: \"IAPamrahP\"\n```";
  }

  if (query.includes("photosynthesis")) {
    return "### Photosynthesis Overview\n\nPhotosynthesis is the biological process by which green plants, algae, and certain bacteria convert light energy into chemical energy stored as glucose ($C_6H_{12}O_6$), releasing oxygen ($O_2$) as a byproduct.\n\n**Chemical Equation:**\n$$6CO_2 + 6H_2O + \\text{light} \\rightarrow C_6H_{12}O_6 + 6O_2$$";
  }

  if (query.includes("kya hai") || query.includes("side effects kya")) {
    return `### PharmaAI Assistant (Hindi / Hinglish Response)

Aapne puchha: **"${lastMessage}"**

**Jaankari:**
Medication ya kisi bhi general topic ki sahi jaankari lena mahatvapurna hai. Cetirizine ya Paracetamol jaise medicines allergy aur bukhar ke liye istemal hoti hain. Safe use ke liye hamesha doctor ya pharmacist se consult karein.`;
  }

  // ── Patient Mode Specific Drug & Health Intent ──
  if (mode === "patient") {
    if (query.includes("paracetamol") || query.includes("crocin") || query.includes("calpol") || query.includes("fever")) {
      return "### Paracetamol (Acetaminophen)\n\n**Common Uses:**\n- Relief of mild to moderate pain (headache, muscle ache, toothache)\n- Reducing fever and feverish symptoms\n\n**Standard Adult Dosage:**\n- 500mg to 1000mg every 4 to 6 hours as needed\n- **Maximum Daily Limit:** 4000mg (4g) within 24 hours\n\n⚠️ **Important Precautions:**\n- Do not take with other medications containing paracetamol to prevent accidental overdose.\n- Avoid heavy alcohol consumption while taking paracetamol as it increases liver toxicity risk.\n\n*Always consult your doctor or pharmacist for personalized dosage instructions.*";
    }

    if (query.includes("metformin")) {
      return "### Metformin\n\n**Therapeutic Category:** Antidiabetic (Biguanide)\n\n**Uses:**\n- First-line medication for managing Type 2 Diabetes Mellitus\n- Helps improve insulin sensitivity and decrease hepatic glucose production\n\n**Common Side Effects:**\n- Nausea, bloating, and abdominal discomfort\n- Mild diarrhea (usually resolves within a few weeks)\n- Long-term use may impair Vitamin B12 absorption\n\n💡 **Tip:** Taking metformin with or immediately after meals significantly reduces stomach upset.\n\n*Consult your physician before modifying your medication schedule.*";
    }

    if (query.includes("ibuprofen") || query.includes("advil") || query.includes("pain killer")) {
      return "### Ibuprofen (NSAID)\n\n**Category:** Non-Steroidal Anti-Inflammatory Drug\n\n**Uses:** Relief of inflammation, joint pain, toothache, and fever.\n\n**Common Side Effects:** Stomach upset, heartburn, mild nausea.\n\n**Caution:** Take with food or milk to protect stomach lining. Avoid taking on an empty stomach.";
    }

    return `### Answer regarding "${lastMessage}"

Here is the information regarding your query: **${lastMessage}**.

If your question is about a specific medicine, drug interaction, side effect, or general topic, please specify the details so I can assist you accurately!`;
  }

  // ── Student Mode Pharmacology Intent ──
  if (query.includes("mechanism") || query.includes("ace inhibitor") || query.includes("how does")) {
    return `### Mechanism of Action: ACE Inhibitors & Pharmacology\n\n**Drug Class:** Angiotensin-Converting Enzyme (ACE) Inhibitors (e.g., Lisinopril, Enalapril, Ramipril)\n\n**Primary Mechanism:**\n- Competitively inhibit ACE, preventing the conversion of Angiotensin I to the potent vasoconstrictor **Angiotensin II**.\n- Reduces circulating Angiotensin II levels → causes vascular smooth muscle relaxation and decreased systemic vascular resistance (SVR).\n- Inhibits the breakdown of **bradykinin** (a potent vasodilator), contributing to additional antihypertensive effect (and the characteristic dry cough side effect).\n\n**Key Pharmacokinetics:**\n- Most ACE inhibitors are prodrugs (e.g., Enalapril → Enalaprilat) converted in the liver.\n- Primarily eliminated renally; dosage adjustments required in renal failure (eGFR < 30 mL/min).\n\n**Clinical Case Pearl:** Monitor serum potassium and creatinine within 1–2 weeks of initiation (risk of hyperkalaemia and reduced GFR).`;
  }

  return `### AI Response: "${lastMessage}"

Regarding **${lastMessage}**:

This query involves fundamental concepts. Feel free to ask specific follow-up questions regarding mechanism of action, side effects, or general knowledge!`;
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
