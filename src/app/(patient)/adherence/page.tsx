"use client";

import { useState } from "react";
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

type Period = "daily" | "weekly" | "monthly";

function generateMockData(days: number) {
  return getLastNDays(days).map((date) => {
    const total = Math.floor(Math.random() * 2) + 3; // 3–4
    const taken = Math.floor(Math.random() * (total + 1));
    const skipped = total - taken;
    return {
      date,
      label: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      shortLabel: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      taken,
      skipped,
      total,
      adherence: Math.round((taken / total) * 100),
    };
  });
}

const DAILY_DATA = generateMockData(7);
const WEEKLY_DATA = (() => {
  const weeks = [];
  for (let i = 3; i >= 0; i--) {
    const weekTotal = Math.floor(Math.random() * 10) + 20;
    const weekTaken = Math.floor(weekTotal * (0.6 + Math.random() * 0.35));
    weeks.push({
      label: `Week ${4 - i}`,
      taken: weekTaken,
      skipped: weekTotal - weekTaken,
      total: weekTotal,
      adherence: Math.round((weekTaken / weekTotal) * 100),
    });
  }
  return weeks;
})();
const MONTHLY_DATA = (() => {
  return ["Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((month) => {
    const total = Math.floor(Math.random() * 30) + 60;
    const taken = Math.floor(total * (0.6 + Math.random() * 0.35));
    return {
      label: month,
      taken,
      skipped: total - taken,
      total,
      adherence: Math.round((taken / total) * 100),
    };
  });
})();

export default function AdherencePage() {
  const [period, setPeriod] = useState<Period>("weekly");

  const data =
    period === "daily" ? DAILY_DATA : period === "weekly" ? WEEKLY_DATA : MONTHLY_DATA;

  const totalTaken = data.reduce((sum, d) => sum + d.taken, 0);
  const totalSkipped = data.reduce((sum, d) => sum + d.skipped, 0);
  const totalDoses = data.reduce((sum, d) => sum + d.total, 0);
  const avgAdherence = Math.round((totalTaken / totalDoses) * 100);

  return (
    <div style={{ maxWidth: 430, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          background: "var(--color-bg)",
          padding: "16px 20px 14px",
          borderBottom: "1px solid var(--color-border-light)",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--color-text-primary)" }}>
          Adherence
        </h1>
        <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
          Track your medication consistency
        </p>
      </div>

      <div style={{ padding: "16px" }}>
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
          {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
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
        </motion.div>

        {/* Line Chart - Adherence % Trend */}
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

        {/* Individual medicine breakdown */}
        <div className="card" style={{ padding: 14 }}>
          <p className="section-title" style={{ marginBottom: 12 }}>
            By Medicine
          </p>
          {[
            { name: "Metformin 500mg", taken: 12, total: 14, adherence: 86 },
            { name: "Lisinopril 10mg", taken: 6, total: 7, adherence: 86 },
            { name: "Atorvastatin 20mg", taken: 5, total: 7, adherence: 71 },
          ].map((med) => (
            <div key={med.name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: "var(--color-text-primary)", fontWeight: 500 }}>
                  {med.name}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: med.adherence >= 80 ? "var(--color-success)" : "var(--color-warning)",
                  }}
                >
                  {med.adherence}%
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
              <p style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 3 }}>
                {med.taken} of {med.total} doses taken
              </p>
            </div>
          ))}
        </div>
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
