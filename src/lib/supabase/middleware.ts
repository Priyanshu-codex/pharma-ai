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

  // Skip auth checks if Supabase credentials are missing or unconfigured placeholder
  const isMockMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project") ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isMockMode) {
    return supabaseResponse;
  }

  // Refresh session if expired — IMPORTANT: do not remove this line.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected & Auth route definitions
  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/splash") ||
    pathname === "/";

  const isRoleRoute =
    pathname.startsWith("/role") ||
    pathname.startsWith("/select-mode");

  const isProtectedRoute =
    isRoleRoute ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
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

  // 1. Unauthenticated user trying to access ANY protected route -> redirect to /login
  if (!user && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Authenticated user visiting auth routes -> redirect to appropriate screen
  if (user && isAuthRoute && pathname !== "/") {
    const role = user.user_metadata?.role;
    const redirectUrl = request.nextUrl.clone();

    if (role === "pharmacy_student" || role === "student") {
      redirectUrl.pathname = "/learn";
    } else if (role === "patient") {
      redirectUrl.pathname = "/dashboard";
    } else {
      // Authenticated but no mode selected yet
      redirectUrl.pathname = "/role";
    }
    return NextResponse.redirect(redirectUrl);
  }

  // 3. Authenticated user without role trying to access protected feature (not /role or /select-mode)
  if (user && isProtectedRoute && !isRoleRoute) {
    const role = user.user_metadata?.role;
    if (!role) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/role";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}
