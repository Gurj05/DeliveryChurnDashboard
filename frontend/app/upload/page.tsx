"use client";

import Link from "next/link";
import { useState } from "react";
import { uploadAndPredict, type Customer } from "@/lib/api";
import { CustomerTable } from "@/components/customer-table";
import { ChurnChart } from "@/components/churn-chart";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setCustomers(null);
    try {
      const result = await uploadAndPredict(file);
      setCustomers(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-800">
          ← Back to dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-neutral-900">Upload your data</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Run your own delivery-order data through the same trained model. Processed in memory only — never stored or logged.
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="mb-3 text-sm font-medium text-neutral-700">
          Your .xlsx file needs these columns:
        </p>
        <div className="mb-4 overflow-x-auto rounded-md border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-3 py-1.5 font-medium">Date</th>
                <th className="px-3 py-1.5 font-medium">Address</th>
                <th className="px-3 py-1.5 font-medium">Amount</th>
                <th className="px-3 py-1.5 font-medium">Channel</th>
                <th className="px-3 py-1.5 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-neutral-100 text-neutral-600">
                <td className="px-3 py-1.5">2024-01-05</td>
                <td className="px-3 py-1.5">123 Main St</td>
                <td className="px-3 py-1.5">42.50</td>
                <td className="px-3 py-1.5">Mobile</td>
                <td className="px-3 py-1.5">14:30</td>
              </tr>
            </tbody>
          </table>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
          <button
            type="submit"
            disabled={!file || loading}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Upload & Predict"}
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {customers && customers.length > 0 && (
        <>
          <div className="mb-8">
            <ChurnChart customers={customers} />
          </div>
          <CustomerTable customers={customers} />
        </>
      )}
    </main>
  );
}
