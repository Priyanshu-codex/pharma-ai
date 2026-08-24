import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Missing Supabase credentials" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const demoUserId = "00000000-0000-0000-0000-000000000001";

    // 1. Profile
    const { error: profileErr } = await supabase.from("profiles").upsert({
      id: demoUserId,
      full_name: "Priyanshu",
      email: "priyanshu@pharmaai.app",
      role: "patient",
      updated_at: new Date().toISOString(),
    });

    // 2. Medicines
    const sampleMedicines = [
      {
        user_id: demoUserId,
        name: "Metformin 500mg",
        generic_name: "Metformin Hydrochloride",
        brand_name: "Glucophage",
        manufacturer: "Sun Pharma",
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
        strength: "10mg",
        dosage_form: "Tablet",
        dosage_instructions: "1 tablet once daily",
        frequency: "Once daily",
        next_dose: "08:00",
        reminder_enabled: true,
        icon: "💊",
      },
    ];

    const { error: medErr } = await supabase.from("medicines").upsert(sampleMedicines);

    // 3. Reminders
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
    ];

    const { error: remErr } = await supabase.from("reminders").upsert(sampleReminders);

    return NextResponse.json({
      success: true,
      message: "Database seed attempted",
      details: {
        profileError: profileErr?.message || null,
        medicineError: medErr?.message || null,
        reminderError: remErr?.message || null,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to seed database";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
