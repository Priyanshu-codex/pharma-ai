import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // Purge user records from all user-owned database tables
    await supabase.from("medicines").delete().eq("user_id", userId);
    await supabase.from("reminders").delete().eq("user_id", userId);
    await supabase.from("adherence_logs").delete().eq("user_id", userId);
    await supabase.from("fcm_tokens").delete().eq("user_id", userId);
    await supabase.from("prescriptions").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("id", userId);

    // Sign out user session
    await supabase.auth.signOut();

    return NextResponse.json({ success: true, message: "Account and data deleted successfully." });
  } catch (error: unknown) {
    console.error("Account Deletion API Error:", error);
    return NextResponse.json(
      { error: "Failed to delete account. Please try again." },
      { status: 500 }
    );
  }
}
