const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Customer = {
  customer_id: string;
  is_synthetic: boolean;
  total_orders: number;
  avg_order_amount: number;
  avg_order_time: number;
  days_since_last_order: number;
  churn_probability: number;
  churn_prediction: number;
};

export type Summary = {
  total_customers: number;
  at_risk_count: number;
  at_risk_percent: number;
  avg_order_amount: number;
};

export type PredictRequest = {
  total_orders: number;
  avg_order_amount: number;
  days_since_last_order: number;
  avg_order_time_hour: number;
  primary_channel: string;
};

export type PredictResponse = {
  churn_probability: number;
  churn_prediction: number;
};

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`${path} failed: ${res.status}`);
  }
  return res.json();
}

export const getCustomers = () => fetchJson<Customer[]>("/api/customers");
export const getSummary = () => fetchJson<Summary>("/api/summary");
export const predictChurn = (request: PredictRequest) =>
  fetchJson<PredictResponse>("/api/predict", {
    method: "POST",
    body: JSON.stringify(request),
  });
