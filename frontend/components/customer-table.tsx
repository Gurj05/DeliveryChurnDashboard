"use client";

import { useMemo, useState } from "react";
import type { Customer } from "@/lib/api";

function formatHour(seconds: number) {
  const hours = seconds / 3600;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  const period = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour}:${m.toString().padStart(2, "0")} ${period}`;
}

function riskBadge(probability: number) {
  if (probability >= 0.5) return "bg-red-100 text-red-700";
  if (probability >= 0.25) return "bg-amber-100 text-amber-700";
  return "bg-green-100 text-green-700";
}

export function CustomerTable({ customers }: { customers: Customer[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => c.customer_id.toLowerCase().includes(q));
  }, [customers, search]);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-200 p-4">
        <h2 className="text-lg font-semibold text-neutral-900">Customers by churn risk</h2>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer..."
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-neutral-500"
        />
      </div>
      <div className="max-h-[520px] overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-2 font-medium">Customer</th>
              <th className="px-4 py-2 font-medium">Total orders</th>
              <th className="px-4 py-2 font-medium">Avg order</th>
              <th className="px-4 py-2 font-medium">Typical order time</th>
              <th className="px-4 py-2 font-medium">Days since last order</th>
              <th className="px-4 py-2 font-medium">Churn risk</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.customer_id} className="border-t border-neutral-100">
                <td className="px-4 py-2 text-neutral-900">
                  {c.customer_id}
                  {c.is_synthetic && (
                    <span className="ml-2 rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500">
                      simulated
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-neutral-600">{c.total_orders}</td>
                <td className="px-4 py-2 text-neutral-600">${c.avg_order_amount.toFixed(2)}</td>
                <td className="px-4 py-2 text-neutral-600">{formatHour(c.avg_order_time)}</td>
                <td className="px-4 py-2 text-neutral-600">{c.days_since_last_order}</td>
                <td className="px-4 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${riskBadge(c.churn_probability)}`}>
                    {(c.churn_probability * 100).toFixed(0)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
