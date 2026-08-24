import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Supabase middleware — refreshes the session on every request.
 * Required by @supabase/ssr to keep sessions alive.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // If in mock mode (no real Supabase keys configured), skip hard redirect blocking
  const isMockMode =
    process.env.NEXT_PUBLIC_AI_MODE === "mock" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

  if (isMockMode) {
    return supabaseResponse;
  }

  // Refresh session if expired — IMPORTANT: do not remove this line.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes — redirect to login if not authenticated
  const { pathname } = request.nextUrl;
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/splash") ||
    pathname.startsWith("/role") ||
    pathname === "/";

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/scan") ||
    pathname.startsWith("/medicines") ||
    pathname.startsWith("/alternatives") ||
    pathname.startsWith("/prices") ||
    pathname.startsWith("/reminders") ||
    pathname.startsWith("/adherence") ||
    pathname.startsWith("/assistant") ||
    pathname.startsWith("/learn") ||
    pathname.startsWith("/mechanisms") ||
    pathname.startsWith("/side-effects") ||
    pathname.startsWith("/interactions") ||
    pathname.startsWith("/cases") ||
    pathname.startsWith("/market") ||
    pathname.startsWith("/quizzes");

  if (!user && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthRoute && pathname !== "/" && pathname !== "/role") {
    // Read user role from user_metadata if present
    const role = user.user_metadata?.role || "patient";
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = role === "pharmacy_student" || role === "student" ? "/learn" : "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
