import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, sitemap.xml
     * - Public assets (icons, manifest, sw.js)
     */
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|offline.html|robots.txt|sitemap.xml).*)",
  ],
};
