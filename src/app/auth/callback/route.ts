import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getCanonicalOrigin } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const origin = getCanonicalOrigin(request);

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Role-based redirect after OAuth
      let role = data.user.user_metadata?.role;

      if (!role) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();

          if (profile?.role) {
            role = profile.role;
          }
        } catch (profileErr) {
          console.warn("[Auth Callback] Profile lookup note:", profileErr);
        }
      }

      if (role === "student" || role === "pharmacy_student") {
        return NextResponse.redirect(`${origin}/learn`);
      } else if (role === "patient") {
        return NextResponse.redirect(`${origin}/dashboard`);
      } else {
        // No mode selected yet — route to Select Mode
        return NextResponse.redirect(`${origin}/role`);
      }
    }
  }

  // Auth failed — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
