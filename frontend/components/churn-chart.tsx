"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Customer } from "@/lib/api";

export function ChurnChart({ customers }: { customers: Customer[] }) {
  const buckets = [
    { label: "0-25%", min: 0, max: 0.25 },
    { label: "25-50%", min: 0.25, max: 0.5 },
    { label: "50-75%", min: 0.5, max: 0.75 },
    { label: "75-100%", min: 0.75, max: 1.01 },
  ];

  const data = buckets.map((b) => ({
    label: b.label,
    count: customers.filter((c) => c.churn_probability >= b.min && c.churn_probability < b.max).length,
  }));

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-neutral-900">Churn risk distribution</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="count" fill="#dc2626" radius={[4, 4, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
