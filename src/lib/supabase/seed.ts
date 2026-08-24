import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load environment variables natively from .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf8");
  envConfig.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join("=").trim();
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("🌱 Starting PharmaAI Supabase Database Seed...");

  // 1. Create or verify Demo User Profile
  const demoUserId = "00000000-0000-0000-0000-000000000001";
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .upsert(
      {
        id: demoUserId,
        full_name: "Priyanshu",
        email: "priyanshu@pharmaai.app",
        role: "patient",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (profileErr) {
    console.warn("Profile seed warning (RLS/Auth dependent):", profileErr.message);
  } else {
    console.log("✅ Seeded User Profile:", profile?.full_name);
  }

  // 2. Seed Medicines
  const sampleMedicines = [
    {
      user_id: demoUserId,
      name: "Metformin 500mg",
      generic_name: "Metformin Hydrochloride",
      brand_name: "Glucophage",
      manufacturer: "Sun Pharma",
      active_ingredient: "Metformin HCl 500mg",
      strength: "500mg",
      dosage_form: "Tablet",
      dosage_instructions: "1 tablet twice daily with meals",
      frequency: "Twice daily",
      next_dose: "20:00",
      reminder_enabled: true,
      icon: "💊",
    },
    {
      user_id: demoUserId,
      name: "Lisinopril 10mg",
      generic_name: "Lisinopril",
      brand_name: "Zestril",
      manufacturer: "Cipla Ltd",
      active_ingredient: "Lisinopril 10mg",
      strength: "10mg",
      dosage_form: "Tablet",
      dosage_instructions: "1 tablet once daily in morning",
      frequency: "Once daily",
      next_dose: "08:00",
      reminder_enabled: true,
      icon: "💊",
    },
    {
      user_id: demoUserId,
      name: "Atorvastatin 20mg",
      generic_name: "Atorvastatin Calcium",
      brand_name: "Lipitor",
      manufacturer: "Ranbaxy",
      active_ingredient: "Atorvastatin 20mg",
      strength: "20mg",
      dosage_form: "Tablet",
      dosage_instructions: "1 tablet once daily at bedtime",
      frequency: "Once daily at bedtime",
      next_dose: "21:00",
      reminder_enabled: false,
      icon: "💊",
    },
    {
      user_id: demoUserId,
      name: "Paracetamol 650mg",
      generic_name: "Acetaminophen",
      brand_name: "Dolo 650",
      manufacturer: "Micro Labs",
      active_ingredient: "Paracetamol 650mg",
      strength: "650mg",
      dosage_form: "Tablet",
      dosage_instructions: "1 tablet as needed for fever/pain",
      frequency: "As needed",
      next_dose: "14:00",
      reminder_enabled: true,
      icon: "💊",
    },
  ];

  const { data: meds, error: medErr } = await supabase
    .from("medicines")
    .upsert(sampleMedicines)
    .select();

  if (medErr) {
    console.warn("Medicines seed warning:", medErr.message);
  } else {
    console.log(`✅ Seeded ${meds?.length || sampleMedicines.length} Medicines into Supabase.`);
  }

  // 3. Seed Reminders
  const sampleReminders = [
    {
      user_id: demoUserId,
      medicine: "Metformin 500mg",
      dosage: "1 tablet with breakfast",
      time: "08:00",
      status: "taken",
      enabled: true,
    },
    {
      user_id: demoUserId,
      medicine: "Lisinopril 10mg",
      dosage: "1 tablet",
      time: "08:00",
      status: "pending",
      enabled: true,
    },
    {
      user_id: demoUserId,
      medicine: "Metformin 500mg",
      dosage: "1 tablet with dinner",
      time: "20:00",
      status: "pending",
      enabled: true,
    },
    {
      user_id: demoUserId,
      medicine: "Atorvastatin 20mg",
      dosage: "1 tablet at bedtime",
      time: "21:00",
      status: "pending",
      enabled: true,
    },
  ];

  const { data: rems, error: remErr } = await supabase
    .from("reminders")
    .upsert(sampleReminders)
    .select();

  if (remErr) {
    console.warn("Reminders seed warning:", remErr.message);
  } else {
    console.log(`✅ Seeded ${rems?.length || sampleReminders.length} Reminders into Supabase.`);
  }

  // 4. Seed Adherence Logs
  const sampleAdherence = [
    { user_id: demoUserId, medicine: "Metformin 500mg", status: "taken", logged_at: new Date(Date.now() - 86400000 * 3).toISOString() },
    { user_id: demoUserId, medicine: "Lisinopril 10mg", status: "taken", logged_at: new Date(Date.now() - 86400000 * 3).toISOString() },
    { user_id: demoUserId, medicine: "Metformin 500mg", status: "taken", logged_at: new Date(Date.now() - 86400000 * 2).toISOString() },
    { user_id: demoUserId, medicine: "Lisinopril 10mg", status: "taken", logged_at: new Date(Date.now() - 86400000 * 2).toISOString() },
    { user_id: demoUserId, medicine: "Metformin 500mg", status: "taken", logged_at: new Date(Date.now() - 86400000).toISOString() },
    { user_id: demoUserId, medicine: "Lisinopril 10mg", status: "skipped", logged_at: new Date(Date.now() - 86400000).toISOString() },
  ];

  const { error: adhErr } = await supabase.from("adherence_logs").insert(sampleAdherence);

  if (adhErr) {
    console.warn("Adherence logs seed warning:", adhErr.message);
  } else {
    console.log(`✅ Seeded ${sampleAdherence.length} Adherence Logs into Supabase.`);
  }

  console.log("🎉 Supabase Database Seeding Completed Successfully!");
}

seed().catch(console.error);
