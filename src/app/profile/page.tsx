"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  Bell,
  RefreshCw,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Camera,
  ArrowLeft,
} from "lucide-react";
import type { UserRole } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("pharmaai_role") as UserRole | null;
      if (storedRole === "patient" || storedRole === "student") return storedRole;
    }
    return "patient";
  });
  const [name, setName] = useState(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("pharmaai_name");
      if (storedName) return storedName;
    }
    return "Priyanshu";
  });
  const [email] = useState(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("pharmaai_email");
      if (storedEmail) return storedEmail;
    }
    return "priyanshu@example.com";
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(true);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const isMockMode =
        process.env.NEXT_PUBLIC_AI_MODE === "mock" ||
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

      if (!isMockMode) {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({
          data: { full_name: name },
        });
        if (error) throw error;
      } else {
        await new Promise((r) => setTimeout(r, 400));
      }

      localStorage.setItem("pharmaai_name", name);
      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSwitchRole() {
    const newRole: UserRole = role === "patient" ? "student" : "patient";
    setLoading(true);
    try {
      const isMockMode =
        process.env.NEXT_PUBLIC_AI_MODE === "mock" ||
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

      if (!isMockMode) {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        await supabase.auth.updateUser({
          data: { role: newRole },
        });
      }

      localStorage.setItem("pharmaai_role", newRole);
      setRole(newRole);
      setSuccessMsg(`Switched to ${newRole === "patient" ? "Patient" : "Pharmacy Student"} mode`);
      router.replace(newRole === "patient" ? "/dashboard" : "/learn");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to switch role.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    try {
      const isMockMode =
        process.env.NEXT_PUBLIC_AI_MODE === "mock" ||
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

      if (!isMockMode) {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        await supabase.auth.signOut();
      }

      localStorage.removeItem("pharmaai_auth");
      router.replace("/login");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to sign out.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[430px] md:max-w-none mx-auto pb-6">
      {/* Mobile Header */}
      <div
        className="md:hidden"
        style={{
          background: "var(--color-bg)",
          padding: "16px 20px 14px",
          borderBottom: "1px solid var(--color-border-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <div className="flex items-center gap-3">
          <Link href={role === "patient" ? "/dashboard" : "/learn"} className="text-[var(--color-text-secondary)]">
            <ArrowLeft size={20} />
          </Link>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--color-text-primary)" }}>
            My Profile
          </h1>
        </div>
        <span className="badge badge-primary">
          {role === "patient" ? "🏥 Patient" : "🎓 Student"}
        </span>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-6 py-6 border-b border-[var(--color-border-light)] bg-white mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
            Account & Profile Settings
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Manage your PharmaAI account details, active mode, and notification preferences
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="btn-ghost text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      <div className="px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Avatar & Summary Card */}
          <div className="md:col-span-1 space-y-4">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6 text-center">
              <div className="relative inline-block mb-3">
                <div
                  className="avatar mx-auto shadow-md"
                  style={{
                    width: 72,
                    height: 72,
                    fontSize: 26,
                    fontWeight: 700,
                    background: role === "patient" ? "var(--color-primary)" : "#7c3aed",
                    color: "white",
                  }}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
                <button
                  className="absolute bottom-0 right-0 p-1.5 bg-white border border-slate-200 rounded-full shadow-sm text-slate-600 hover:text-slate-900"
                  title="Change picture"
                  onClick={() => alert("Avatar photo upload is available in live Supabase storage mode.")}
                >
                  <Camera size={14} />
                </button>
              </div>

              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">{name}</h2>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{email}</p>

              <div className="mt-4 pt-4 border-t border-[var(--color-border-light)] flex justify-center">
                <span
                  className="badge"
                  style={{
                    background: role === "patient" ? "var(--color-primary-50)" : "#f5f3ff",
                    color: role === "patient" ? "var(--color-primary)" : "#7c3aed",
                    border: role === "patient" ? "1px solid var(--color-primary-200)" : "1px solid #ddd6fe",
                    padding: "6px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {role === "patient" ? "🏥 Patient Mode" : "🎓 Student Mode"}
                </span>
              </div>
            </motion.div>

            {/* Quick Mode Switcher */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-4">
              <div className="flex items-center gap-3 mb-2">
                <RefreshCw size={18} className="text-[var(--color-primary)]" />
                <p className="text-sm font-bold text-[var(--color-text-primary)]">Active Mode</p>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">
                Switch between Patient medicine management and Pharmacy Student learning features.
              </p>
              <button
                onClick={handleSwitchRole}
                disabled={loading}
                className="btn-secondary w-full justify-center text-xs"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : `Switch to ${role === "patient" ? "Student Mode" : "Patient Mode"}`}
              </button>
            </motion.div>
          </div>

          {/* Details & Form Card */}
          <div className="md:col-span-2 space-y-4">
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-center gap-2 text-red-800 text-xs font-semibold">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
                {errorMsg}
              </div>
            )}

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-[var(--color-border-light)]">
                <div>
                  <h3 className="text-base font-bold text-[var(--color-text-primary)]">Personal Details</h3>
                  <p className="text-xs text-[var(--color-text-muted)]">Your account information</p>
                </div>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="btn-ghost text-xs font-semibold">
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="input-base"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="input-base bg-slate-50 cursor-not-allowed opacity-80"
                      value={email}
                      disabled
                    />
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Email cannot be changed directly.</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
                      {loading ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} className="btn-ghost">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <User size={18} className="text-slate-400" />
                    <div>
                      <p className="text-[11px] text-[var(--color-text-muted)] font-medium">Full Name</p>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">{name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Mail size={18} className="text-slate-400" />
                    <div>
                      <p className="text-[11px] text-[var(--color-text-muted)] font-medium">Email Address</p>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">{email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Shield size={18} className="text-slate-400" />
                    <div>
                      <p className="text-[11px] text-[var(--color-text-muted)] font-medium">Security & Role</p>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)] capitalize">{role} Account</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Notification Preferences */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
              <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-1">App Preferences</h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">Manage medication reminders & alerts</p>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-[var(--color-primary)]" />
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-text-primary)]">Push Notifications</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">Medication reminders & dose alerts</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="w-4 h-4 accent-[var(--color-primary)] cursor-pointer"
                />
              </div>
            </motion.div>

            {/* Mobile Sign Out button */}
            <div className="md:hidden">
              <button
                onClick={handleLogout}
                disabled={loading}
                className="btn-ghost w-full justify-center text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
