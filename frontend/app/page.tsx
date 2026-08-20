import Link from "next/link";
import { KpiCard } from "@/components/kpi-card";
import { CustomerTable } from "@/components/customer-table";
import { ChurnChart } from "@/components/churn-chart";
import { getCustomers, getSummary } from "@/lib/api";

export default async function DashboardPage() {
  const [customers, summary] = await Promise.all([getCustomers(), getSummary()]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Delivery Churn Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Live churn predictions served from a trained scikit-learn pipeline.
          </p>
        </div>
        <Link
          href="/predict"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Try the model →
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <KpiCard label="Total customers" value={summary.total_customers.toString()} />
        <KpiCard label="At-risk customers" value={summary.at_risk_count.toString()} tone="danger" />
        <KpiCard label="At-risk %" value={`${summary.at_risk_percent}%`} tone="danger" />
        <KpiCard label="Avg order value" value={`$${summary.avg_order_amount.toFixed(2)}`} />
      </div>

      <div className="mb-8">
        <ChurnChart customers={customers} />
      </div>

      <CustomerTable customers={customers} />
    </main>
  );
}
