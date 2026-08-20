import Link from "next/link";
import { PredictForm } from "@/components/predict-form";

export default function PredictPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-800">
          ← Back to dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-neutral-900">Try the model</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Enter a hypothetical customer profile and get a live prediction from the trained pipeline.
        </p>
      </div>
      <PredictForm />
    </main>
  );
}
