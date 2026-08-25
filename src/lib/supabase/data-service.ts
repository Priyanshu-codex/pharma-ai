import { createClient } from "./client";

// ── Supabase Configuration Check ─────────────────────────────
export function isSupabaseConfigured(): boolean {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("your-project") &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

export interface DBProfile {
  id: string;
  full_name: string;
  email: string;
  role?: "patient" | "student" | "pharmacy_student" | null;
  avatar_url?: string;
}

export interface DBMedicine {
  id: string;
  user_id: string;
  name: string;
  generic_name: string;
  brand_name?: string;
  manufacturer?: string;
  active_ingredient?: string;
  strength?: string;
  dosage_form?: string;
  dosage_instructions?: string;
  frequency?: string;
  next_dose?: string;
  reminder_enabled?: boolean;
  icon?: string;
  created_at?: string;
}

export interface DBReminder {
  id: string;
  user_id: string;
  medicine_id?: string;
  medicine: string;
  dosage: string;
  time: string;
  status: "pending" | "taken" | "skipped" | "snoozed";
  enabled: boolean;
  created_at?: string;
}

export interface DBAdherenceLog {
  id?: string;
  user_id: string;
  reminder_id?: string;
  medicine: string;
  status: "taken" | "skipped" | "snoozed";
  logged_at?: string;
}

// ── Profile Operations ────────────────────────────────────────

export async function fetchUserProfile(): Promise<DBProfile | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      return data as DBProfile;
    }
  } catch (err) {
    console.warn("[DataService] Profile fetch fallback:", err);
  }

  // Fallback from auth metadata / localStorage (does not assume default mode if unselected)
  const fallbackRole = (localStorage.getItem("pharmaai_role") as DBProfile["role"]) || user.user_metadata?.role || undefined;
  const fallbackName = localStorage.getItem("pharmaai_name") || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  return {
    id: user.id,
    full_name: fallbackName,
    email: user.email || "",
    role: fallbackRole,
  };
}

export async function updateUserProfile(updates: Partial<DBProfile>): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  try {
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...updates, updated_at: new Date().toISOString() });

    if (error) console.warn("[DataService] Supabase profile upsert note:", error.message);
  } catch (err) {
    console.warn("[DataService] Profile update error:", err);
  }

  // Always sync local storage for high availability
  if (updates.full_name) localStorage.setItem("pharmaai_name", updates.full_name);
  if (updates.role) localStorage.setItem("pharmaai_role", updates.role);
  return true;
}

// ── Medicine Operations ───────────────────────────────────────

import { CENTRAL_MEDICINES } from "@/lib/data/medicines";

const DEFAULT_DEMO_DB_MEDICINES: DBMedicine[] = CENTRAL_MEDICINES.map((m, idx) => ({
  id: m.id,
  user_id: "demo_user",
  name: m.name,
  generic_name: m.genericName,
  brand_name: m.brandName,
  manufacturer: m.manufacturer,
  active_ingredient: m.activeIngredient,
  strength: m.strength,
  dosage_form: m.dosageForm,
  dosage_instructions: `Take 1 ${m.dosageForm.toLowerCase()} as advised. ${m.uses[0] || m.description}`,
  frequency: idx % 2 === 0 ? "Twice daily" : "Once daily",
  next_dose: idx % 2 === 0 ? "09:00 AM" : "08:00 PM",
  reminder_enabled: true,
  icon: "💊",
  created_at: new Date(Date.now() - idx * 86400000).toISOString(),
}));

export async function fetchMedicineById(id: string): Promise<DBMedicine | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    try {
      const { data, error } = await supabase
        .from("medicines")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (!error && data) return data as DBMedicine;
    } catch (err) {
      console.warn("[DataService] fetchMedicineById DB error:", err);
    }
  }

  // Fallback: check localStorage cache
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("pharmaai_medicines");
    if (stored) {
      try {
        const all: DBMedicine[] = JSON.parse(stored);
        const found = all.find((m) => m.id === id);
        if (found) return found;
      } catch {}
    }
  }

  // Fallback: check central medicine dataset
  const central = CENTRAL_MEDICINES.find((m) => m.id === id || m.name.toLowerCase() === id.toLowerCase());
  if (central) {
    return {
      id: central.id,
      user_id: "demo_user",
      name: central.name,
      generic_name: central.genericName,
      brand_name: central.brandName,
      manufacturer: central.manufacturer,
      active_ingredient: central.activeIngredient,
      strength: central.strength,
      dosage_form: central.dosageForm,
      dosage_instructions: `Primary use: ${central.uses[0] || central.description}`,
      frequency: "Once daily",
      next_dose: "09:00 AM",
      reminder_enabled: true,
      icon: "💊",
      created_at: new Date().toISOString(),
    };
  }

  return null;
}

export async function fetchUserMedicines(): Promise<DBMedicine[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    try {
      const { data, error } = await supabase
        .from("medicines")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as DBMedicine[];
      }
    } catch (err) {
      console.warn("[DataService] Medicines DB fetch error:", err);
    }
  }

  // Check local storage
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("pharmaai_medicines");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {}
    }
  }

  // Default demo dataset fallback
  return DEFAULT_DEMO_DB_MEDICINES;
}

export async function addMedicineToDB(medicine: Omit<DBMedicine, "id" | "user_id">): Promise<DBMedicine> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    try {
      const { data, error } = await supabase
        .from("medicines")
        .insert([{ ...medicine, user_id: user.id }])
        .select()
        .single();

      if (!error && data) {
        return data as DBMedicine;
      }
    } catch (err) {
      console.warn("[DataService] Add medicine DB error:", err);
    }
  }

  // Local storage fallback (no authenticated user)
  const newMed: DBMedicine = {
    id: `med_${Date.now()}`,
    user_id: user?.id || "local",
    ...medicine,
    created_at: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    const current = await fetchUserMedicines();
    const updated = [newMed, ...current];
    localStorage.setItem("pharmaai_medicines", JSON.stringify(updated));
  }
  return newMed;
}

export async function deleteMedicineFromDB(medicineId: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    try {
      await supabase.from("medicines").delete().eq("id", medicineId).eq("user_id", user.id);
    } catch (err) {
      console.warn("[DataService] Delete medicine DB error:", err);
    }
  }

  const current = await fetchUserMedicines();
  const filtered = current.filter((m) => m.id !== medicineId);
  localStorage.setItem("pharmaai_medicines", JSON.stringify(filtered));
  return true;
}

// ── Reminder Operations ───────────────────────────────────────

export async function fetchUserReminders(): Promise<DBReminder[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    try {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .order("time", { ascending: true });

      if (!error && data) {
        return data as DBReminder[];
      }
    } catch (err) {
      console.warn("[DataService] Reminders DB fetch error:", err);
    }
  }

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("pharmaai_reminders");
    if (stored) {
      try { return JSON.parse(stored); } catch {}
    }
  }

  return [];
}

export async function saveReminderToDB(reminder: Omit<DBReminder, "id" | "user_id">): Promise<DBReminder> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || "demo_user";

  const newReminder: DBReminder = {
    id: `rem_${Date.now()}`,
    user_id: userId,
    ...reminder,
    created_at: new Date().toISOString(),
  };

  if (user) {
    try {
      const { data, error } = await supabase
        .from("reminders")
        .insert([{ ...reminder, user_id: user.id }])
        .select()
        .single();

      if (!error && data) return data as DBReminder;
    } catch (err) {
      console.warn("[DataService] Add reminder DB error:", err);
    }
  }

  const current = await fetchUserReminders();
  const updated = [...current, newReminder];
  localStorage.setItem("pharmaai_reminders", JSON.stringify(updated));
  return newReminder;
}

export async function updateReminderStatusInDB(
  reminderId: string,
  status: DBReminder["status"],
  medicineName?: string
): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    try {
      await supabase
        .from("reminders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", reminderId)
        .eq("user_id", user.id);

      // Log adherence event with actual medicine name
      if (status === "taken" || status === "skipped" || status === "snoozed") {
        // Look up medicine name from local state if not provided
        const allReminders = await fetchUserReminders();
        const reminder = allReminders.find((r) => r.id === reminderId);
        const loggedMedicine = medicineName || reminder?.medicine || "Unknown Medicine";

        await supabase.from("adherence_logs").insert([
          {
            user_id: user.id,
            reminder_id: reminderId,
            medicine: loggedMedicine,
            status,
            logged_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.warn("[DataService] Update reminder status error:", err);
    }
  }

  const current = await fetchUserReminders();
  const updated = current.map((r) => (r.id === reminderId ? { ...r, status } : r));
  localStorage.setItem("pharmaai_reminders", JSON.stringify(updated));
  return true;
}

export async function snoozeReminderInDB(
  reminderId: string,
  newTime: string
): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    try {
      await supabase
        .from("reminders")
        .update({ status: "snoozed", time: newTime, updated_at: new Date().toISOString() })
        .eq("id", reminderId)
        .eq("user_id", user.id);
    } catch (err) {
      console.warn("[DataService] Snooze reminder error:", err);
    }
  }

  const current = await fetchUserReminders();
  const updated = current.map((r) =>
    r.id === reminderId ? { ...r, status: "snoozed" as const, time: newTime } : r
  );
  localStorage.setItem("pharmaai_reminders", JSON.stringify(updated));
  return true;
}

export async function updateMedicineReminderInDB(
  medicineId: string,
  reminderEnabled: boolean
): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    try {
      await supabase
        .from("medicines")
        .update({ reminder_enabled: reminderEnabled, updated_at: new Date().toISOString() })
        .eq("id", medicineId)
        .eq("user_id", user.id);
    } catch (err) {
      console.warn("[DataService] Update medicine reminder error:", err);
    }
  }

  // Update local storage
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("pharmaai_medicines");
    if (stored) {
      try {
        const all = JSON.parse(stored);
        const updated = all.map((m: DBMedicine) =>
          m.id === medicineId ? { ...m, reminder_enabled: reminderEnabled } : m
        );
        localStorage.setItem("pharmaai_medicines", JSON.stringify(updated));
      } catch {}
    }
  }
  return true;
}

export async function deleteReminderFromDB(reminderId: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    try {
      await supabase.from("reminders").delete().eq("id", reminderId).eq("user_id", user.id);
    } catch (err) {
      console.warn("[DataService] Delete reminder DB error:", err);
    }
  }

  const current = await fetchUserReminders();
  const filtered = current.filter((r) => r.id !== reminderId);
  localStorage.setItem("pharmaai_reminders", JSON.stringify(filtered));
  return true;
}

// ── FCM Token Storage ─────────────────────────────────────────

export async function saveFCMTokenToDB(token: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !token) return false;

  try {
    const { error } = await supabase.from("fcm_tokens").upsert(
      {
        user_id: user.id,
        token,
        device_info: typeof navigator !== "undefined" ? navigator.userAgent : "web",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "token" }
    );
    if (!error) console.log("[DataService] FCM token saved to Supabase.");
    return !error;
  } catch (err) {
    console.warn("[DataService] FCM token DB save warning:", err);
    return false;
  }
}
