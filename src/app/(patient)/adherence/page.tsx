"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { getLastNDays, adherenceLabel } from "@/lib/utils";
import { Pill, TrendingUp } from "lucide-react";

type Period = "daily" | "weekly" | "monthly";

interface ChartPoint {
  label: string;
  shortLabel?: string;
  taken: number;
  skipped: number;
  total: number;
  adherence: number;
}

interface MedAdherence {
  name: string;
  taken: number;
  total: number;
  adherence: number;
}

function buildDailyData(
  reminders: Array<{ time: string; status: string; medicine: string; created_at?: string }>
): ChartPoint[] {
  const days = getLastNDays(7);
  const today = new Date().toISOString().slice(0, 10);

  return days.map((date) => {
    const isToday = date === today;
    if (isToday) {
      const taken = reminders.filter((r) => r.status === "taken").length;
      const skipped = reminders.filter((r) => r.status === "skipped").length;
      const total = reminders.length;
      return {
        label: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        shortLabel: "Today",
        taken,
        skipped,
        total: Math.max(total, 0),
        adherence: total > 0 ? Math.round((taken / total) * 100) : 0,
      };
    }
    return {
      label: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      shortLabel: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      taken: 0,
      skipped: 0,
      total: 0,
      adherence: 0,
    };
  });
}

export default function AdherencePage() {
  const [period, setPeriod] = useState<Period>("daily");
  const [dailyData, setDailyData] = useState<ChartPoint[]>([]);
  const [medAdherence, setMedAdherence] = useState<MedAdherence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/lib/supabase/data-service").then(({ fetchUserReminders, fetchUserMedicines }) => {
      Promise.all([fetchUserReminders(), fetchUserMedicines()]).then(([rems, meds]) => {
        // Build daily chart data from real reminders
        setDailyData(buildDailyData(rems));

        // Build per-medicine adherence breakdown
        const medMap: Record<string, { taken: number; total: number }> = {};
        rems.forEach((r) => {
          if (!medMap[r.medicine]) medMap[r.medicine] = { taken: 0, total: 0 };
          medMap[r.medicine].total += 1;
          if (r.status === "taken") medMap[r.medicine].taken += 1;
        });

        // Merge with medicines list for full names
        const breakdown: MedAdherence[] = Object.entries(medMap).map(([name, stats]) => ({
          name,
          taken: stats.taken,
          total: stats.total,
          adherence: stats.total > 0 ? Math.round((stats.taken / stats.total) * 100) : 0,
        }));

        // Also add medicines with no reminders yet (total = 0)
        meds.forEach((m) => {
          if (!medMap[m.name]) {
            breakdown.push({ name: m.name, taken: 0, total: 0, adherence: 0 });
          }
        });

        setMedAdherence(breakdown);
        setLoading(false);
      });
    });
  }, []);

  // For weekly/monthly, we aggregate from daily data
  const weeklyData: ChartPoint[] = (() => {
    const taken = dailyData.reduce((s, d) => s + d.taken, 0);
    const skipped = dailyData.reduce((s, d) => s + d.skipped, 0);
    const total = dailyData.reduce((s, d) => s + d.total, 0);
    return [
      { label: "This Week", taken, skipped, total, adherence: total > 0 ? Math.round((taken / total) * 100) : 0 },
    ];
  })();

  const data: ChartPoint[] =
    period === "daily" ? dailyData : period === "weekly" ? weeklyData : dailyData;

  const totalTaken = data.reduce((sum, d) => sum + d.taken, 0);
  const totalSkipped = data.reduce((sum, d) => sum + d.skipped, 0);
  const totalDoses = data.reduce((sum, d) => sum + d.total, 0);
  const avgAdherence = totalDoses > 0 ? Math.round((totalTaken / totalDoses) * 100) : 0;

  return (
    <div className="w-full max-w-[430px] md:max-w-none mx-auto pb-6">
      {/* Header */}
      <div
        className="bg-[var(--color-bg)] border-b border-[var(--color-border-light)]"
        style={{ padding: "16px 20px 14px" }}
      >
        <h1 className="text-xl md:text-2xl font-extrabold text-[var(--color-text-primary)]">
          Adherence
        </h1>
        <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
          Track your medication consistency
        </p>
      </div>

      <div className="px-4 md:px-6 mt-4">
        {/* Period Selector */}
        <div
          style={{
            display: "flex",
            background: "var(--color-surface-alt)",
            borderRadius: "var(--radius-full)",
            padding: 3,
            marginBottom: 16,
          }}
          role="tablist"
          aria-label="Adherence period"
        >
          {(["daily", "weekly"] as Period[]).map((p) => (
            <button
              key={p}
              role="tab"
              aria-selected={period === p}
              onClick={() => setPeriod(p)}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: "var(--radius-full)",
                border: "none",
                background: period === p ? "white" : "transparent",
                fontWeight: period === p ? 700 : 500,
                fontSize: 13,
                color:
                  period === p
                    ? "var(--color-primary)"
                    : "var(--color-text-secondary)",
                cursor: "pointer",
                boxShadow: period === p ? "var(--shadow-sm)" : "none",
                transition: "all 0.2s ease",
                textTransform: "capitalize",
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ color: "var(--color-text-muted)" }}>Loading adherence data…</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <motion.div
              key={period}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}
            >
              <StatCard
                label="Adherence"
                value={`${avgAdherence}%`}
                sub={adherenceLabel(avgAdherence)}
                color="var(--color-primary)"
                bg="var(--color-primary-50)"
              />
              <StatCard
                label="Taken"
                value={String(totalTaken)}
                sub="doses"
                color="var(--color-success)"
                bg="var(--color-success-bg)"
              />
              <StatCard
                label="Skipped"
                value={String(totalSkipped)}
                sub="doses"
                color="var(--color-error)"
                bg="var(--color-error-bg)"
              />
            </motion.div>

            {/* Bar Chart */}
            <motion.div
              key={`chart-${period}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="card"
              style={{ padding: "16px 8px 8px", marginBottom: 14 }}
            >
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--color-text-secondary)",
                  marginLeft: 8,
                  marginBottom: 12,
                }}
              >
                Doses Overview
              </p>
              {totalDoses === 0 ? (
                <div style={{ textAlign: "center", padding: "30px 20px" }}>
                  <TrendingUp size={32} style={{ color: "var(--color-text-muted)", margin: "0 auto 10px", opacity: 0.4 }} />
                  <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                    No dose data yet — add reminders to see your chart
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={data} barSize={14} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" vertical={false} />
                    <XAxis
                      dataKey={period === "daily" ? "shortLabel" : "label"}
                      tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                      width={24}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid var(--color-border)",
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="taken" name="Taken" fill="var(--color-primary)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="skipped" name="Skipped" fill="#fca5a5" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.div>

            {/* Line Chart — Adherence Trend */}
            {totalDoses > 0 && (
              <motion.div
                key={`line-${period}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="card"
                style={{ padding: "16px 8px 8px", marginBottom: 14 }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--color-text-secondary)",
                    marginLeft: 8,
                    marginBottom: 12,
                  }}
                >
                  Adherence Trend (%)
                </p>
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" vertical={false} />
                    <XAxis
                      dataKey={period === "daily" ? "shortLabel" : "label"}
                      tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                      width={30}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }}
                      formatter={(value) => [`${value}%`, "Adherence"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="adherence"
                      stroke="var(--color-primary)"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "var(--color-primary)", strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* Per-Medicine Breakdown */}
            <div className="card" style={{ padding: 14 }}>
              <p className="section-title" style={{ marginBottom: 12 }}>
                By Medicine
              </p>
              {medAdherence.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 16px" }}>
                  <Pill size={28} style={{ color: "var(--color-text-muted)", margin: "0 auto 10px", opacity: 0.4 }} />
                  <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                    No medicines tracked yet
                  </p>
                </div>
              ) : (
                medAdherence.map((med) => (
                  <div key={med.name} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 13, color: "var(--color-text-primary)", fontWeight: 500 }}>
                        {med.name}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: med.adherence >= 80 ? "var(--color-success)" : med.total === 0 ? "var(--color-text-muted)" : "var(--color-warning)",
                        }}
                      >
                        {med.total === 0 ? "No data" : `${med.adherence}%`}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        background: "var(--color-border-light)",
                        borderRadius: "var(--radius-full)",
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${med.adherence}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{
                          height: "100%",
                          background:
                            med.adherence >= 80
                              ? "var(--color-success)"
                              : "var(--color-warning)",
                          borderRadius: "var(--radius-full)",
                        }}
                      />
                    </div>
                    {med.total > 0 && (
                      <p style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 3 }}>
                        {med.taken} of {med.total} doses taken
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
  bg,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
}) {
  return (
    <div
      className="card"
      style={{
        padding: "12px 10px",
        textAlign: "center",
        background: bg,
        border: "none",
      }}
    >
      <p style={{ fontSize: 11, color, fontWeight: 600, marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ fontSize: 20, fontWeight: 800, color }}>{value}</p>
      <p style={{ fontSize: 10, color, opacity: 0.75 }}>{sub}</p>
    </div>
  );
}
