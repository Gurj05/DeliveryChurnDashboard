from fastapi import APIRouter

from app.ml.inference import get_customers
from app.schemas import SummaryOut

router = APIRouter(prefix="/api/summary", tags=["summary"])


@router.get("", response_model=SummaryOut)
def summary():
    customers = get_customers()
    total = len(customers)
    at_risk = sum(1 for c in customers if c["churn_prediction"] == 1)
    avg_amount = sum(c["avg_order_amount"] for c in customers) / total if total else 0

    return SummaryOut(
        total_customers=total,
        at_risk_count=at_risk,
        at_risk_percent=round(100 * at_risk / total, 1) if total else 0,
        avg_order_amount=round(avg_amount, 2),
    )
