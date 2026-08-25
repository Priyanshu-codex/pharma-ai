// ============================================================
// PharmaAI — Centralized Dummy Medicine Dataset
// Single source of truth for demo medicines, fallback search,
// generic alternatives, and AI assistant context.
// ============================================================

export interface CentralMedicine {
  id: string;
  name: string;
  genericName: string;
  brandName: string;
  category:
    | "Pain/Fever"
    | "Antibiotics"
    | "Allergy"
    | "Gastric/Acidity"
    | "Diabetes"
    | "Blood Pressure"
    | "Vitamins/Supplements";
  activeIngredient: string;
  strength: string;
  dosageForm: string;
  manufacturer: string;
  description: string;
  uses: string[];
  price: number;
  originalPrice: number;
  savings: number;
  savingsPercentage: number;
  availability: string;
  prescriptionRequired: boolean;
  alternatives: Array<{ name: string; manufacturer: string; price: number }>;
  sideEffects: string[];
  warnings: string[];
  storage: string;
}

export const CENTRAL_MEDICINES: CentralMedicine[] = [
  // ── Pain / Fever ──────────────────────────────────────────
  {
    id: "med_paracetamol_500",
    name: "Paracetamol 500mg",
    genericName: "Paracetamol (Acetaminophen)",
    brandName: "Crocin / Dolo 500",
    category: "Pain/Fever",
    activeIngredient: "Paracetamol",
    strength: "500mg",
    dosageForm: "Tablet",
    manufacturer: "GlaxoSmithKline / Micro Labs",
    description: "Analgesic and antipyretic medicine widely used to relieve mild-to-moderate pain and reduce body temperature in fevers.",
    uses: [
      "Fever reduction",
      "Headache and toothache relief",
      "Muscle and body ache relief",
      "Cold and flu symptom management",
    ],
    price: 18,
    originalPrice: 45,
    savings: 27,
    savingsPercentage: 60,
    availability: "Available",
    prescriptionRequired: false,
    alternatives: [
      { name: "Paracetamol Tablets IP 500mg", manufacturer: "Cipla Ltd.", price: 18 },
      { name: "Paracetamol Generic 500mg", manufacturer: "Sun Pharma", price: 12 },
      { name: "Dolo 500", manufacturer: "Micro Labs Ltd.", price: 30 },
    ],
    sideEffects: [
      "Nausea (rare at therapeutic doses)",
      "Allergic rash (rare)",
      "Liver damage with acute overdose",
    ],
    warnings: [
      "Do not exceed 4,000mg total in 24 hours.",
      "Avoid alcohol while taking paracetamol.",
      "Use with caution in chronic liver disease.",
    ],
    storage: "Store below 30°C in a dry place away from direct sunlight.",
  },
  {
    id: "med_ibuprofen_400",
    name: "Ibuprofen 400mg",
    genericName: "Ibuprofen",
    brandName: "Brufen 400",
    category: "Pain/Fever",
    activeIngredient: "Ibuprofen",
    strength: "400mg",
    dosageForm: "Tablet",
    manufacturer: "Abbott Healthcare",
    description: "Non-steroidal anti-inflammatory drug (NSAID) that reduces inflammation, relieves mild to moderate pain, and lowers fever.",
    uses: [
      "Rheumatoid arthritis and osteoarthritis pain",
      "Dental pain and postoperative pain",
      "Fever reduction",
      "Menstrual cramps (dysmenorrhea)",
    ],
    price: 24,
    originalPrice: 52,
    savings: 28,
    savingsPercentage: 54,
    availability: "Available",
    prescriptionRequired: false,
    alternatives: [
      { name: "Ibuprofen 400mg IP", manufacturer: "Cipla Ltd.", price: 20 },
      { name: "Ibuprex 400", manufacturer: "Cadila Healthcare", price: 22 },
    ],
    sideEffects: [
      "Stomach upset / heartburn",
      "Nausea and dizziness",
      "Gastric ulcers with prolonged use",
    ],
    warnings: [
      "Take after meals to reduce stomach irritation.",
      "Caution in active peptic ulcer or renal impairment.",
      "Avoid in late pregnancy.",
    ],
    storage: "Store in a cool, dry place below 25°C.",
  },
  {
    id: "med_diclofenac_50",
    name: "Diclofenac 50mg",
    genericName: "Diclofenac Sodium",
    brandName: "Voveran 50",
    category: "Pain/Fever",
    activeIngredient: "Diclofenac Sodium",
    strength: "50mg",
    dosageForm: "Gastro-resistant Tablet",
    manufacturer: "Novartis / Cipla",
    description: "Potent NSAID with strong analgesic, anti-inflammatory, and antipyretic properties for acute joint and musculoskeletal pain.",
    uses: [
      "Joint pain and inflammatory arthritis",
      "Post-traumatic and postoperative inflammation",
      "Severe acute backache and sprains",
    ],
    price: 32,
    originalPrice: 68,
    savings: 36,
    savingsPercentage: 53,
    availability: "Available",
    prescriptionRequired: true,
    alternatives: [
      { name: "Diclofenac Sodium 50mg", manufacturer: "Intas Pharma", price: 28 },
      { name: "Reactin 50", manufacturer: "Cipla Ltd.", price: 30 },
    ],
    sideEffects: [
      "Abdominal pain / dyspepsia",
      "Fluid retention / elevated BP",
      "Dizziness or headache",
    ],
    warnings: [
      "Prescription medicine only.",
      "Not advised for patients with severe heart failure or active GI bleeding.",
    ],
    storage: "Store below 30°C protected from moisture.",
  },

  // ── Antibiotics ───────────────────────────────────────────
  {
    id: "med_amoxicillin_500",
    name: "Amoxicillin 500mg",
    genericName: "Amoxicillin Trihydrate",
    brandName: "Mox 500",
    category: "Antibiotics",
    activeIngredient: "Amoxicillin",
    strength: "500mg",
    dosageForm: "Capsule",
    manufacturer: "Sun Pharma",
    description: "Broad-spectrum penicillin antibiotic effective against a wide variety of bacterial infections.",
    uses: [
      "Respiratory tract infections (bronchitis, pneumonia)",
      "ENT infections (otitis media, sinusitis, tonsillitis)",
      "Urinary tract infections",
      "Skin and soft tissue infections",
    ],
    price: 65,
    originalPrice: 120,
    savings: 55,
    savingsPercentage: 46,
    availability: "Available",
    prescriptionRequired: true,
    alternatives: [
      { name: "Amoxicillin 500mg IP", manufacturer: "Cipla Ltd.", price: 58 },
      { name: "Novamox 500", manufacturer: "Cipla Ltd.", price: 72 },
    ],
    sideEffects: [
      "Diarrhoea or loose stools",
      "Nausea and vomiting",
      "Hypersensitivity skin rash",
    ],
    warnings: [
      "Complete the full prescribed course even if symptoms improve.",
      "Do NOT use if allergic to penicillins or cephalosporins.",
    ],
    storage: "Store below 25°C in tight, light-resistant containers.",
  },
  {
    id: "med_azithromycin_500",
    name: "Azithromycin 500mg",
    genericName: "Azithromycin Dihydrate",
    brandName: "Azee 500",
    category: "Antibiotics",
    activeIngredient: "Azithromycin",
    strength: "500mg",
    dosageForm: "Tablet",
    manufacturer: "Cipla Ltd.",
    description: "Macrolide antibiotic with a long half-life, usually taken once daily for short 3-to-5 day treatment courses.",
    uses: [
      "Community-acquired pneumonia and bronchitis",
      "Strep throat and tonsillitis",
      "Uncomplicated skin infections",
      "Chlamydial urethritis / cervicitis",
    ],
    price: 95,
    originalPrice: 175,
    savings: 80,
    savingsPercentage: 46,
    availability: "Available",
    prescriptionRequired: true,
    alternatives: [
      { name: "Azithromycin 500mg", manufacturer: "Alkem Laboratories", price: 88 },
      { name: "Azithral 500", manufacturer: "Alembic Pharma", price: 102 },
    ],
    sideEffects: [
      "Abdominal cramps & diarrhoea",
      "Nausea / altered taste",
      "Transient elevation of liver enzymes",
    ],
    warnings: [
      "Take 1 hour before or 2 hours after meals for optimal absorption.",
      "Inform doctor if you have QT prolongation or cardiac arrhythmia.",
    ],
    storage: "Store in a dry place below 30°C.",
  },
  {
    id: "med_cefixime_200",
    name: "Cefixime 200mg",
    genericName: "Cefixime Trihydrate",
    brandName: "Zifi 200",
    category: "Antibiotics",
    activeIngredient: "Cefixime",
    strength: "200mg",
    dosageForm: "Tablet",
    manufacturer: "FDC Ltd.",
    description: "Third-generation oral cephalosporin antibiotic active against gram-negative and select gram-positive bacteria.",
    uses: [
      "Uncomplicated urinary tract infections",
      "Typhoid fever and enteric infections",
      "Acute exacerbation of chronic bronchitis",
    ],
    price: 110,
    originalPrice: 190,
    savings: 80,
    savingsPercentage: 42,
    availability: "Available",
    prescriptionRequired: true,
    alternatives: [
      { name: "Cefixime 200mg IP", manufacturer: "Lupin Ltd.", price: 98 },
      { name: "Taxim-O 200", manufacturer: "Alkem Labs", price: 115 },
    ],
    sideEffects: [
      "Loose stools / diarrhoea",
      "Abdominal pain",
      "Headache",
    ],
    warnings: [
      "Contraindicated in severe cephalosporin allergy.",
      "Adjust dose in severe renal failure.",
    ],
    storage: "Store in a cool dry place below 25°C.",
  },

  // ── Allergy ───────────────────────────────────────────────
  {
    id: "med_cetirizine_10",
    name: "Cetirizine 10mg",
    genericName: "Cetirizine Hydrochloride",
    brandName: "Cetzine / Zyrtec",
    category: "Allergy",
    activeIngredient: "Cetirizine",
    strength: "10mg",
    dosageForm: "Tablet",
    manufacturer: "Dr. Reddy's Laboratories",
    description: "Second-generation selective H1-antihistamine used to control symptoms of allergic rhinitis and chronic hives.",
    uses: [
      "Allergic rhinitis (hay fever, sneezing, runny nose)",
      "Itchy and watery eyes",
      "Chronic idiopathic urticaria (hives & skin itch)",
    ],
    price: 18,
    originalPrice: 42,
    savings: 24,
    savingsPercentage: 57,
    availability: "Available",
    prescriptionRequired: false,
    alternatives: [
      { name: "Cetirizine 10mg IP", manufacturer: "Cipla Ltd.", price: 15 },
      { name: "Alerid 10", manufacturer: "Cipla Ltd.", price: 20 },
    ],
    sideEffects: [
      "Mild drowsiness / tiredness in ~10% of patients",
      "Dry mouth or dry throat",
      "Headache",
    ],
    warnings: [
      "Avoid driving or machinery if experiencing sedation.",
      "Avoid concurrent alcohol consumption.",
    ],
    storage: "Store below 30°C in a dry place.",
  },
  {
    id: "med_levocetirizine_5",
    name: "Levocetirizine 5mg",
    genericName: "Levocetirizine Dihydrochloride",
    brandName: "Lecope 5",
    category: "Allergy",
    activeIngredient: "Levocetirizine",
    strength: "5mg",
    dosageForm: "Tablet",
    manufacturer: "Mankind Pharma",
    description: "Active R-enantiomer of cetirizine offering potent anti-allergic efficacy at half the molecular dose.",
    uses: [
      "Seasonal and perennial allergic rhinitis",
      "Skin allergies and eczema itching",
      "Hives and insect bite reactions",
    ],
    price: 35,
    originalPrice: 75,
    savings: 40,
    savingsPercentage: 53,
    availability: "Available",
    prescriptionRequired: false,
    alternatives: [
      { name: "Levocetirizine 5mg IP", manufacturer: "Sun Pharma", price: 30 },
      { name: "Levocet 5", manufacturer: "Glenmark Pharma", price: 38 },
    ],
    sideEffects: [
      "Somnolence / fatigue",
      "Dry mouth",
      "Nasopharyngitis",
    ],
    warnings: [
      "Usually administered in the evening.",
      "Reduce dose in renal impairment.",
    ],
    storage: "Store protected from moisture and heat below 25°C.",
  },

  // ── Gastric / Acidity ─────────────────────────────────────
  {
    id: "med_pantoprazole_40",
    name: "Pantoprazole 40mg",
    genericName: "Pantoprazole Sodium",
    brandName: "Pan 40",
    category: "Gastric/Acidity",
    activeIngredient: "Pantoprazole",
    strength: "40mg",
    dosageForm: "Gastro-resistant Tablet",
    manufacturer: "Alkem Laboratories",
    description: "Proton Pump Inhibitor (PPI) that suppresses gastric acid secretion by inhibiting the H+/K+-ATPase enzyme.",
    uses: [
      "Gastroesophageal reflux disease (GERD / heartburn)",
      "Peptic and duodenal ulcers",
      "NSAID-induced ulcer prevention",
      "Zollinger-Ellison syndrome",
    ],
    price: 48,
    originalPrice: 95,
    savings: 47,
    savingsPercentage: 49,
    availability: "Available",
    prescriptionRequired: false,
    alternatives: [
      { name: "Pantoprazole 40mg EC", manufacturer: "Torrent Pharma", price: 40 },
      { name: "Pantocid 40", manufacturer: "Sun Pharma", price: 52 },
    ],
    sideEffects: [
      "Headache or mild nausea",
      "Flatulence / constipation",
      "Vitamin B12 deficiency with multi-year long-term use",
    ],
    warnings: [
      "Best taken 30-60 minutes before morning breakfast.",
      "Swallow whole; do not crush or chew tablet.",
    ],
    storage: "Store below 30°C protected from light and moisture.",
  },
  {
    id: "med_omeprazole_20",
    name: "Omeprazole 20mg",
    genericName: "Omeprazole",
    brandName: "Omez 20",
    category: "Gastric/Acidity",
    activeIngredient: "Omeprazole",
    strength: "20mg",
    dosageForm: "Capsule",
    manufacturer: "Dr. Reddy's Laboratories",
    description: "Pioneer proton pump inhibitor that dramatically reduces stomach acid production for ulcer healing and reflux relief.",
    uses: [
      "Acid indigestion and hyperacidity",
      "Duodenal and gastric ulcer therapy",
      "Helicobacter pylori eradication regimens",
    ],
    price: 38,
    originalPrice: 82,
    savings: 44,
    savingsPercentage: 54,
    availability: "Available",
    prescriptionRequired: false,
    alternatives: [
      { name: "Omeprazole 20mg EC", manufacturer: "Cipla Ltd.", price: 32 },
      { name: "Omez-20", manufacturer: "Dr. Reddy's", price: 42 },
    ],
    sideEffects: [
      "Diarrhoea or stomach discomfort",
      "Dizziness",
      "Skin rash (uncommon)",
    ],
    warnings: [
      "Take on an empty stomach with a glass of water.",
      "Consult physician if symptoms persist beyond 14 days of self-medication.",
    ],
    storage: "Store below 25°C in a dry place.",
  },
  {
    id: "med_famotidine_20",
    name: "Famotidine 20mg",
    genericName: "Famotidine",
    brandName: "Famocid 20",
    category: "Gastric/Acidity",
    activeIngredient: "Famotidine",
    strength: "20mg",
    dosageForm: "Tablet",
    manufacturer: "Sun Pharma",
    description: "H2-receptor antagonist that rapidly decreases gastric acid and pepsin secretion for acid indigestion relief.",
    uses: [
      "Heartburn and acid indigestion",
      "Gastritis and stomach acidity",
      "Peptic ulcer maintenance therapy",
    ],
    price: 22,
    originalPrice: 48,
    savings: 26,
    savingsPercentage: 54,
    availability: "Available",
    prescriptionRequired: false,
    alternatives: [
      { name: "Famotidine 20mg", manufacturer: "Torrent Pharma", price: 18 },
    ],
    sideEffects: [
      "Headache",
      "Constipation or diarrhoea",
      "Dizziness",
    ],
    warnings: [
      "May be taken with or without food.",
      "Reduce dosage in moderate-to-severe renal insufficiency.",
    ],
    storage: "Store below 30°C in light-resistant container.",
  },

  // ── Diabetes ──────────────────────────────────────────────
  {
    id: "med_metformin_500",
    name: "Metformin 500mg",
    genericName: "Metformin Hydrochloride",
    brandName: "Glycomet 500",
    category: "Diabetes",
    activeIngredient: "Metformin",
    strength: "500mg",
    dosageForm: "Sustained Release Tablet",
    manufacturer: "USV Pvt. Ltd.",
    description: "First-line biguanide oral antidiabetic medicine that lowers blood glucose levels by decreasing hepatic glucose output and enhancing insulin sensitivity.",
    uses: [
      "Type 2 Diabetes Mellitus blood sugar control",
      "Polycystic Ovary Syndrome (PCOS) insulin resistance management",
      "Prediabetes risk reduction",
    ],
    price: 28,
    originalPrice: 62,
    savings: 34,
    savingsPercentage: 55,
    availability: "Available",
    prescriptionRequired: true,
    alternatives: [
      { name: "Metformin 500mg SR", manufacturer: "Cipla Ltd.", price: 24 },
      { name: "Obimet 500", manufacturer: "Abbott India", price: 30 },
    ],
    sideEffects: [
      "Gastrointestinal upset (nausea, diarrhoea, bloating) during early weeks",
      "Metallic taste in mouth",
      "Risk of Vitamin B12 malabsorption with long-term use",
    ],
    warnings: [
      "Take with meals to minimize stomach upset.",
      "Temporarily stop before iodinated contrast imaging.",
      "Contraindicated in severe kidney failure (eGFR < 30).",
    ],
    storage: "Store below 30°C protected from light and moisture.",
  },
  {
    id: "med_glimepiride_2",
    name: "Glimepiride 2mg",
    genericName: "Glimepiride",
    brandName: "Amaryl 2",
    category: "Diabetes",
    activeIngredient: "Glimepiride",
    strength: "2mg",
    dosageForm: "Tablet",
    manufacturer: "Sanofi India",
    description: "Second-generation sulfonylurea that stimulates pancreatic beta cells to secrete insulin, lowering blood sugar levels.",
    uses: [
      "Type 2 Diabetes Mellitus monotherapy or combination therapy",
    ],
    price: 42,
    originalPrice: 88,
    savings: 46,
    savingsPercentage: 52,
    availability: "Available",
    prescriptionRequired: true,
    alternatives: [
      { name: "Glimepiride 2mg IP", manufacturer: "Micro Labs", price: 34 },
      { name: "Glimestar 2", manufacturer: "Mankind Pharma", price: 38 },
    ],
    sideEffects: [
      "Hypoglycaemia (low blood sugar)",
      "Weight gain",
      "Mild nausea or dizziness",
    ],
    warnings: [
      "Take immediately before or during breakfast or the first main meal.",
      "Always carry glucose sweets or juice in case of hypoglycaemic symptoms.",
    ],
    storage: "Store below 25°C.",
  },

  // ── Blood Pressure ────────────────────────────────────────
  {
    id: "med_amlodipine_5",
    name: "Amlodipine 5mg",
    genericName: "Amlodipine Besylate",
    brandName: "Amlokind 5 / Stamlo",
    category: "Blood Pressure",
    activeIngredient: "Amlodipine",
    strength: "5mg",
    dosageForm: "Tablet",
    manufacturer: "Mankind Pharma / Dr. Reddy's",
    description: "Long-acting dihydropyridine calcium channel blocker that relaxes vascular smooth muscle, lowering blood pressure and reducing cardiac workload.",
    uses: [
      "Essential Hypertension (high blood pressure)",
      "Chronic stable angina pectoris",
      "Vasospastic (Prinzmetal's) angina",
    ],
    price: 22,
    originalPrice: 55,
    savings: 33,
    savingsPercentage: 60,
    availability: "Available",
    prescriptionRequired: true,
    alternatives: [
      { name: "Amlodipine 5mg IP", manufacturer: "Cipla Ltd.", price: 18 },
      { name: "Amlopin 5", manufacturer: "USV Ltd.", price: 24 },
    ],
    sideEffects: [
      "Peripheral ankle edema (swollen ankles)",
      "Flushing and warmth feeling",
      "Dizziness or palpitations",
    ],
    warnings: [
      "Do NOT discontinue abruptly without consulting your cardiologist.",
      "Avoid grapefruit juice which can increase drug levels.",
    ],
    storage: "Store below 30°C in a dry place protected from light.",
  },
  {
    id: "med_losartan_50",
    name: "Losartan 50mg",
    genericName: "Losartan Potassium",
    brandName: "Repace 50",
    category: "Blood Pressure",
    activeIngredient: "Losartan",
    strength: "50mg",
    dosageForm: "Film-coated Tablet",
    manufacturer: "Sun Pharma",
    description: "Angiotensin II Receptor Blocker (ARB) that prevents vasoconstriction and aldosterone secretion, lowering blood pressure and protecting kidneys.",
    uses: [
      "Hypertension (high blood pressure)",
      "Diabetic nephropathy in type 2 diabetes",
      "Stroke risk reduction in patients with hypertension and LVH",
    ],
    price: 52,
    originalPrice: 110,
    savings: 58,
    savingsPercentage: 53,
    availability: "Available",
    prescriptionRequired: true,
    alternatives: [
      { name: "Losartan Potassium 50mg", manufacturer: "Cipla Ltd.", price: 44 },
      { name: "Losar 50", manufacturer: "Unichem Labs", price: 54 },
    ],
    sideEffects: [
      "Dizziness or lightheadedness upon standing",
      "Hyperkalemia (elevated blood potassium)",
      "Nasal congestion",
    ],
    warnings: [
      "Contraindicated in pregnancy (fetal toxicity).",
      "Monitor serum potassium and renal function regularly.",
    ],
    storage: "Store below 25°C protected from moisture.",
  },

  // ── Vitamins / Supplements ───────────────────────────────
  {
    id: "med_vitamin_d3",
    name: "Vitamin D3 60,000 IU",
    genericName: "Cholecalciferol",
    brandName: "Calcirol / Tayo 60K",
    category: "Vitamins/Supplements",
    activeIngredient: "Cholecalciferol (Vitamin D3)",
    strength: "60000 IU",
    dosageForm: "Chewable Tablet / Capsule",
    manufacturer: "Cadila Healthcare / USV",
    description: "High-potency Vitamin D3 supplement essential for calcium absorption, bone mineralization, and immune health.",
    uses: [
      "Vitamin D deficiency treatment & prevention",
      "Osteoporosis and osteomalacia supportive care",
      "Bone and muscle health strengthening",
    ],
    price: 75,
    originalPrice: 150,
    savings: 75,
    savingsPercentage: 50,
    availability: "Available",
    prescriptionRequired: false,
    alternatives: [
      { name: "Cholecalciferol 60,000 IU", manufacturer: "Cipla Ltd.", price: 68 },
      { name: "D3-Must 60K", manufacturer: "Mankind Pharma", price: 72 },
    ],
    sideEffects: [
      "Well tolerated when taken weekly as prescribed",
      "Hypercalcemia symptoms (nausea, weakness) only with chronic massive overdose",
    ],
    warnings: [
      "Usually taken once weekly for 8-12 weeks for deficiency, then monthly.",
      "Check blood Vitamin D levels periodically.",
    ],
    storage: "Store in a cool dry place protected from direct heat and light.",
  },
  {
    id: "med_vitamin_b12",
    name: "Vitamin B12 1500mcg",
    genericName: "Methylcobalamin",
    brandName: "Nurokind OD",
    category: "Vitamins/Supplements",
    activeIngredient: "Methylcobalamin",
    strength: "1500mcg",
    dosageForm: "Tablet",
    manufacturer: "Mankind Pharma",
    description: "Active coenzyme form of Vitamin B12 essential for nerve cell myelination, red blood cell synthesis, and DNA maintenance.",
    uses: [
      "Peripheral neuropathy & nerve pain relief",
      "Megaloblastic anemia support",
      "Vitamin B12 deficiency supplementation in vegetarians/diabetics",
    ],
    price: 85,
    originalPrice: 160,
    savings: 75,
    savingsPercentage: 47,
    availability: "Available",
    prescriptionRequired: false,
    alternatives: [
      { name: "Methylcobalamin 1500mcg", manufacturer: "Sun Pharma", price: 78 },
      { name: "Methycobal 1500", manufacturer: "Eisai Pharma", price: 92 },
    ],
    sideEffects: [
      "Extremely safe; excess is renally excreted",
      "Mild itching or skin breakout (very rare)",
    ],
    warnings: [
      "Can be taken daily with water after meals.",
    ],
    storage: "Store below 25°C protected from light.",
  },
  {
    id: "med_calcium_d3",
    name: "Calcium 500mg + Vitamin D3",
    genericName: "Calcium Carbonate + Cholecalciferol",
    brandName: "Shelcal 500",
    category: "Vitamins/Supplements",
    activeIngredient: "Elemental Calcium 500mg + Vitamin D3 250 IU",
    strength: "500mg / 250 IU",
    dosageForm: "Tablet",
    manufacturer: "Torrent Pharmaceuticals",
    description: "Combination bone health supplement providing elemental calcium along with Vitamin D3 to maximize intestinal calcium absorption.",
    uses: [
      "Prevention & management of Osteoporosis",
      "Calcium deficiency during pregnancy and lactation",
      "Bone fracture recovery support",
    ],
    price: 92,
    originalPrice: 165,
    savings: 73,
    savingsPercentage: 44,
    availability: "Available",
    prescriptionRequired: false,
    alternatives: [
      { name: "Calcium + D3 Tablets", manufacturer: "Cipla Ltd.", price: 82 },
      { name: "Cipcal 500", manufacturer: "Cipla Ltd.", price: 88 },
    ],
    sideEffects: [
      "Mild constipation or gas",
      "Nausea if taken on empty stomach",
    ],
    warnings: [
      "Take after main meals for optimal absorption.",
      "Separate from iron or thyroid supplements by at least 2 hours.",
    ],
    storage: "Store below 30°C in a dry place.",
  },
];

// ── Search Helper Functions ───────────────────────────────

export function getAllMedicines(): CentralMedicine[] {
  return CENTRAL_MEDICINES;
}

export function searchMedicines(query: string): CentralMedicine[] {
  if (!query || !query.trim()) return CENTRAL_MEDICINES;
  const q = query.toLowerCase().trim();

  return CENTRAL_MEDICINES.filter((m) => {
    return (
      m.name.toLowerCase().includes(q) ||
      m.genericName.toLowerCase().includes(q) ||
      m.brandName.toLowerCase().includes(q) ||
      m.activeIngredient.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.uses.some((u) => u.toLowerCase().includes(q))
    );
  });
}

export function findMedicineByNameOrIngredient(term: string): CentralMedicine | undefined {
  if (!term || !term.trim()) return undefined;
  const q = term.toLowerCase().trim();

  // 1. Exact or starts-with match
  const exact = CENTRAL_MEDICINES.find(
    (m) =>
      m.name.toLowerCase() === q ||
      m.genericName.toLowerCase() === q ||
      m.brandName.toLowerCase().includes(q) ||
      m.activeIngredient.toLowerCase() === q
  );
  if (exact) return exact;

  // 2. Partial match
  return CENTRAL_MEDICINES.find(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.genericName.toLowerCase().includes(q) ||
      m.brandName.toLowerCase().includes(q) ||
      m.activeIngredient.toLowerCase().includes(q)
  );
}
