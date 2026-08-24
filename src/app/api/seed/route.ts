import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Missing Supabase credentials in environment." }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    let targetUserId: string | null = null;

    // Resolve active auth user ID
    const { data: usersData, error: listErr } = await supabase.auth.admin.listUsers();
    if (!listErr && usersData?.users && usersData.users.length > 0) {
      targetUserId = usersData.users[0].id;
    } else {
      const { data: newUser } = await supabase.auth.admin.createUser({
        email: "priyanshu@pharmaai.app",
        password: "Password123!",
        email_confirm: true,
        user_metadata: { full_name: "Priyanshu", role: "patient" },
      });
      if (newUser?.user) targetUserId = newUser.user.id;
    }

    if (!targetUserId) {
      return NextResponse.json({ error: "Could not resolve auth user for seed" }, { status: 400 });
    }

    // 1. Profile
    const { error: profileErr } = await supabase.from("profiles").upsert(
      {
        id: targetUserId,
        full_name: "Priyanshu",
        email: "priyanshu@pharmaai.app",
        role: "patient",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    // 2. Medicines
    const sampleMedicines = [
      {
        user_id: targetUserId,
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
        user_id: targetUserId,
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
        user_id: targetUserId,
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
        reminder_enabled: true,
        icon: "💊",
      },
    ];

    const { error: medErr } = await supabase.from("medicines").upsert(sampleMedicines);

    // 3. Reminders
    const sampleReminders = [
      {
        user_id: targetUserId,
        medicine: "Metformin 500mg",
        dosage: "1 tablet with breakfast",
        time: "08:00",
        status: "taken",
        enabled: true,
      },
      {
        user_id: targetUserId,
        medicine: "Lisinopril 10mg",
        dosage: "1 tablet",
        time: "08:00",
        status: "taken",
        enabled: true,
      },
      {
        user_id: targetUserId,
        medicine: "Metformin 500mg",
        dosage: "1 tablet with dinner",
        time: "20:00",
        status: "pending",
        enabled: true,
      },
    ];

    const { error: remErr } = await supabase.from("reminders").upsert(sampleReminders);

    // 4. Adherence Logs
    const sampleAdherence = [
      { user_id: targetUserId, medicine: "Metformin 500mg", status: "taken", logged_at: new Date(Date.now() - 86400000 * 3).toISOString() },
      { user_id: targetUserId, medicine: "Lisinopril 10mg", status: "taken", logged_at: new Date(Date.now() - 86400000 * 3).toISOString() },
      { user_id: targetUserId, medicine: "Metformin 500mg", status: "taken", logged_at: new Date(Date.now() - 86400000 * 2).toISOString() },
      { user_id: targetUserId, medicine: "Lisinopril 10mg", status: "taken", logged_at: new Date(Date.now() - 86400000 * 2).toISOString() },
    ];

    const { error: adhErr } = await supabase.from("adherence_logs").insert(sampleAdherence);

    return NextResponse.json({
      success: true,
      message: "PharmaAI Database seeded successfully!",
      userId: targetUserId,
      details: {
        profileError: profileErr?.message || null,
        medicineError: medErr?.message || null,
        reminderError: remErr?.message || null,
        adherenceError: adhErr?.message || null,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to seed database";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
