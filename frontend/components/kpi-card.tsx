export function KpiCard({ label, value, tone }: { label: string; value: string; tone?: "danger" | "default" }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className={`mt-1 text-3xl font-semibold ${tone === "danger" ? "text-red-600" : "text-neutral-900"}`}>
        {value}
      </p>
    </div>
  );
}
