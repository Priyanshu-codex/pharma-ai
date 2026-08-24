// ============================================================
// PharmaAI — Core Types & Interfaces
// ============================================================

export type UserRole = "patient" | "student";

// ── Auth Types ────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

// ── Medicine Types ────────────────────────────────────────
export interface Medicine {
  id: string;
  name: string;
  generic_name: string;
  brand_name?: string;
  manufacturer?: string;
  active_ingredient: string;
  strength: string;
  dosage_form: string; // tablet, capsule, syrup, etc.
  description?: string;
  uses?: string[];
  side_effects?: string[];
  warnings?: string[];
  image_url?: string;
  data_source?: string;
  last_updated?: string;
  confidence?: number; // OCR confidence 0–1
}

export interface UserMedicine {
  id: string;
  user_id: string;
  medicine_id: string;
  medicine: Medicine;
  dosage: string;
  frequency: string; // e.g. "twice daily"
  duration?: string;
  notes?: string;
  reminder_enabled: boolean;
  added_at: string;
  next_dose?: string;
}

// ── Scan Types ────────────────────────────────────────────
export type ScanStatus =
  | "idle"
  | "capturing"
  | "scanning"
  | "processing"
  | "success"
  | "low_confidence"
  | "error";

export interface ScanResult {
  medicine?: Medicine;
  confidence: number;
  raw_text?: string;
  error?: string;
}

// ── Prescription Types ───────────────────────────────────
export interface PrescriptionMedicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  confidence: number; // per-field OCR confidence
  is_verified: boolean;
}

export interface Prescription {
  id: string;
  user_id: string;
  image_url?: string;
  doctor_name?: string;
  date?: string;
  medicines: PrescriptionMedicine[];
  raw_text?: string;
  status: "pending_review" | "confirmed" | "scheduled";
  created_at: string;
}

// ── Reminder Types ────────────────────────────────────────
export type ReminderStatus = "pending" | "taken" | "skipped" | "snoozed";

export interface Reminder {
  id: string;
  user_id: string;
  user_medicine_id: string;
  medicine_name: string;
  dosage: string;
  scheduled_time: string; // ISO datetime
  status: ReminderStatus;
  snoozed_until?: string;
  notes?: string;
  enabled: boolean;
}

export interface ReminderSchedule {
  id: string;
  user_medicine_id: string;
  times: string[]; // e.g. ["08:00", "20:00"]
  days: number[]; // 0–6, where 0 = Sunday
  enabled: boolean;
}

// ── Adherence Types ──────────────────────────────────────
export interface DoseRecord {
  id: string;
  reminder_id: string;
  medicine_name: string;
  scheduled_time: string;
  recorded_time?: string;
  status: ReminderStatus;
}

export interface AdherenceStats {
  period: "daily" | "weekly" | "monthly";
  total_doses: number;
  taken_doses: number;
  skipped_doses: number;
  adherence_percentage: number;
  streak_days: number;
}

export interface AdherencePoint {
  date: string;
  adherence: number; // 0–100
  taken: number;
  skipped: number;
  total: number;
}

// ── Alternative Medicine Types ───────────────────────────
export interface GenericAlternative {
  id: string;
  name: string;
  manufacturer: string;
  active_ingredient: string;
  strength: string;
  dosage_form: string;
  price?: number;
  currency?: string;
  pack_size?: string;
  data_source: string;
  last_updated?: string;
}

// ── Price Types ───────────────────────────────────────────
export interface PriceEntry {
  id: string;
  medicine_name: string;
  brand: string;
  price: number;
  currency: string;
  pack_size: string;
  retailer?: string;
  source: string;
  last_updated: string;
}

// ── Drug Interaction Types ────────────────────────────────
export type InteractionSeverity = "minor" | "moderate" | "major" | "contraindicated";

export interface DrugInteraction {
  id: string;
  drug_a: string;
  drug_b: string;
  severity: InteractionSeverity;
  description: string;
  mechanism?: string;
  clinical_significance: string;
  management?: string;
  data_source: string;
}

// ── Student Types ─────────────────────────────────────────
export interface DrugMechanism {
  id: string;
  drug_name: string;
  drug_class: string;
  therapeutic_use: string;
  mechanism: string;
  how_it_works: string;
  key_points: string[];
  pharmacokinetics?: {
    absorption?: string;
    distribution?: string;
    metabolism?: string;
    excretion?: string;
  };
}

export interface SideEffect {
  name: string;
  frequency: "very_common" | "common" | "uncommon" | "rare" | "very_rare";
  severity: "mild" | "moderate" | "severe";
  description?: string;
}

// ── Clinical Case Types ───────────────────────────────────
export interface ClinicalCase {
  id: string;
  case_number: number;
  title: string;
  scenario: string;
  patient_info: {
    age: number;
    gender: string;
    weight?: number;
    allergies?: string[];
    current_medications?: string[];
    chief_complaint: string;
  };
  question: string;
  options: { id: string; text: string }[];
  correct_option_id: string;
  explanation: string;
  learning_points: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
}

// ── Quiz Types ─────────────────────────────────────────────
export interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correct_option_id: string;
  explanation: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
  answers: Record<string, string>; // question_id → selected_option_id
  score: number;
  total: number;
  time_taken_seconds: number;
  completed_at: string;
}

// ── AI Chat Types ─────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: string[];
}

export interface ConversationContext {
  mode: UserRole;
  messages: ChatMessage[];
}

// ── Market Insight Types ──────────────────────────────────
export interface MarketInsight {
  id: string;
  title: string;
  summary: string;
  category: string;
  data_points?: { label: string; value: string | number }[];
  source: string;
  published_date: string;
}

// ── Notification Types ────────────────────────────────────
export interface NotificationPreferences {
  enabled: boolean;
  reminder_notifications: boolean;
  adherence_summary: boolean;
  educational_tips: boolean;
  fcm_token?: string;
}

// ── API Response Types ────────────────────────────────────
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ── Form Types ────────────────────────────────────────────
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  agree_terms: boolean;
}

export interface ReminderFormData {
  medicine_id: string;
  dosage: string;
  times: string[];
  days: number[];
  start_date: string;
  end_date?: string;
}
