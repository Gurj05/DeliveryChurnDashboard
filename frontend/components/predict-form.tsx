"use client";

import { useState } from "react";
import { predictChurn, type PredictResponse } from "@/lib/api";

const CHANNELS = ["Call Center", "Mobile", "Point of Sale", "Web"];

export function PredictForm() {
  const [totalOrders, setTotalOrders] = useState(50);
  const [avgOrderAmount, setAvgOrderAmount] = useState(45);
  const [daysSinceLastOrder, setDaysSinceLastOrder] = useState(30);
  const [avgOrderTimeHour, setAvgOrderTimeHour] = useState(13);
  const [primaryChannel, setPrimaryChannel] = useState(CHANNELS[0]);

  const [result, setResult] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await predictChurn({
        total_orders: totalOrders,
        avg_order_amount: avgOrderAmount,
        days_since_last_order: daysSinceLastOrder,
        avg_order_time_hour: avgOrderTimeHour,
        primary_channel: primaryChannel,
      });
      setResult(response);
    } catch {
      setError("Couldn't reach the prediction API. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <Field label="Total orders">
            <input
              type="number"
              min={0}
              value={totalOrders}
              onChange={(e) => setTotalOrders(Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Average order amount ($)">
            <input
              type="number"
              min={0}
              step="0.01"
              value={avgOrderAmount}
              onChange={(e) => setAvgOrderAmount(Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Days since last order">
            <input
              type="number"
              min={0}
              value={daysSinceLastOrder}
              onChange={(e) => setDaysSinceLastOrder(Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Typical order time (24h)">
            <input
              type="number"
              min={0}
              max={24}
              step="0.5"
              value={avgOrderTimeHour}
              onChange={(e) => setAvgOrderTimeHour(Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Primary ordering channel">
            <select
              value={primaryChannel}
              onChange={(e) => setPrimaryChannel(e.target.value)}
              className="input"
            >
              {CHANNELS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? "Predicting..." : "Predict churn risk"}
        </button>
      </form>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Prediction</h2>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!result && !error && (
          <p className="text-sm text-neutral-500">Fill in the form and submit to see a live prediction.</p>
        )}
        {result && (
          <div>
            <p className="text-sm text-neutral-500">Churn probability</p>
            <p
              className={`mt-1 text-5xl font-bold ${
                result.churn_probability >= 0.5 ? "text-red-600" : "text-green-600"
              }`}
            >
              {(result.churn_probability * 100).toFixed(1)}%
            </p>
            <p className="mt-3 text-sm text-neutral-600">
              {result.churn_prediction === 1
                ? "This profile is predicted to churn."
                : "This profile is predicted to stay active."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-neutral-700">{label}</span>
      {children}
    </label>
  );
}
