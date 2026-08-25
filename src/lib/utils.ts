import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS class names, resolving conflicts intelligently.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string into a friendly display.
 */
export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
}

/**
 * Format time string (HH:MM) to 12-hour format.
 */
export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

/**
 * Format a Date to a time string like "8:30 AM".
 */
export function formatDateToTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Get a greeting based on the current hour.
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * Calculate adherence percentage.
 */
export function calcAdherence(taken: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((taken / total) * 100);
}

/**
 * Get a color class based on adherence percentage.
 */
export function adherenceColor(percentage: number): string {
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 60) return "text-amber-500";
  return "text-red-500";
}

/**
 * Get adherence label.
 */
export function adherenceLabel(percentage: number): string {
  if (percentage >= 80) return "Excellent";
  if (percentage >= 60) return "Good";
  if (percentage >= 40) return "Fair";
  return "Needs Improvement";
}

/**
 * Truncate text to a maximum length.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

/**
 * Capitalize first letter of a string.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Format a number as Indian Rupee currency.
 */
export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get confidence badge props based on confidence score.
 */
export function getConfidenceInfo(confidence: number): {
  label: string;
  variant: "success" | "warning" | "error";
  description: string;
} {
  if (confidence >= 0.85) {
    return {
      label: "High Confidence",
      variant: "success",
      description: "OCR result is highly accurate.",
    };
  }
  if (confidence >= 0.6) {
    return {
      label: "Medium Confidence",
      variant: "warning",
      description: "Please verify the extracted information.",
    };
  }
  return {
    label: "Low Confidence",
    variant: "error",
    description: "Results may be inaccurate. Manual review required.",
  };
}

/**
 * Generate initials from a full name.
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Sleep for a given number of milliseconds (for mock delays).
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a random ID (for mock data).
 */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Check if we are in mock AI mode.
 */
export function isAIMockMode(): boolean {
  return process.env.NEXT_PUBLIC_AI_MODE !== "live";
}

/**
 * Get severity badge variant for drug interactions.
 */
export function interactionSeverityVariant(
  severity: string
): "error" | "warning" | "muted" {
  switch (severity) {
    case "contraindicated":
    case "major":
      return "error";
    case "moderate":
      return "warning";
    default:
      return "muted";
  }
}

/**
 * Day names utility.
 */
export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Get today's ISO date string.
 */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Get last N days as ISO date strings.
 */
export function getLastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

/**
 * Safely resolves the public origin URL for OAuth redirects across local dev, mobile, and production deployments.
 *
 * Priority:
 *  1. Client-side localhost → keep as-is (localhost:3000 is registered in Supabase)
 *  2. Client-side LAN IP (e.g. 192.168.x.x) → use NEXT_PUBLIC_SITE_URL so mobile OAuth
 *     redirects to the registered production URL instead of an unreachable LAN address
 *  3. NEXT_PUBLIC_SITE_URL → explicit canonical URL (production / Vercel)
 *  4. NEXT_PUBLIC_VERCEL_URL → Vercel auto-detected deployment URL
 *  5. Server-side request headers (x-forwarded-host)
 *  6. window.location.origin (last client-side fallback)
 *  7. http://localhost:3000 (hardcoded dev fallback)
 */
export function getCanonicalOrigin(request?: Request): string {
  // ── Client-side ──────────────────────────────────────────────────────────
  if (typeof window !== "undefined" && window.location?.origin) {
    const hostname = window.location.hostname;

    // 1. Localhost: always use as-is — it's registered in Supabase redirect URLs
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return window.location.origin.replace(/\/$/, "");
    }

    // 2. LAN / private-network IP (e.g. 192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    //    These are unreachable from Google's servers and not registered in Supabase.
    //    Fall back to the configured production site URL so mobile OAuth works.
    const isPrivateIp =
      /^192\.168\./.test(hostname) ||
      /^10\./.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(hostname);

    if (isPrivateIp) {
      if (process.env.NEXT_PUBLIC_SITE_URL) {
        let siteUrl = process.env.NEXT_PUBLIC_SITE_URL.trim();
        if (!siteUrl.startsWith("http")) siteUrl = `https://${siteUrl}`;
        return siteUrl.replace(/\/$/, "");
      }
      if (process.env.NEXT_PUBLIC_VERCEL_URL) {
        let vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL.trim();
        if (!vercelUrl.startsWith("http")) vercelUrl = `https://${vercelUrl}`;
        return vercelUrl.replace(/\/$/, "");
      }
    }
  }

  // ── Server-side or production ──────────────────────────────────────────
  // 3. Explicit site URL from environment (highest server-side priority)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    let siteUrl = process.env.NEXT_PUBLIC_SITE_URL.trim();
    if (!siteUrl.startsWith("http")) siteUrl = `https://${siteUrl}`;
    return siteUrl.replace(/\/$/, "");
  }

  // 4. Vercel deployment URL
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    let vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL.trim();
    if (!vercelUrl.startsWith("http")) vercelUrl = `https://${vercelUrl}`;
    return vercelUrl.replace(/\/$/, "");
  }

  // 5. Server-side request headers inspection (Proxy/Forwarded headers)
  if (request) {
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") || "https";

    if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
      return `${proto}://${host}`.replace(/\/$/, "");
    }

    try {
      const { origin } = new URL(request.url);
      if (origin && !origin.includes("localhost") && !origin.includes("127.0.0.1")) {
        return origin.replace(/\/$/, "");
      }
    } catch {}
  }

  // 6. Client-side window.location.origin (non-LAN, non-localhost production fallback)
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/$/, "");
  }

  // 7. Local default fallback
  return "http://localhost:3000";
}

/**
 * Get full OAuth redirect URL for callback route.
 */
export function getAuthRedirectUrl(path: string = "/auth/callback", request?: Request): string {
  const origin = getCanonicalOrigin(request);
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${cleanPath}`;
}

