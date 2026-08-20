from fastapi import APIRouter, HTTPException

from app.ml.features import CHANNEL_COLUMNS
from app.ml.inference import predict_one
from app.schemas import PredictRequest, PredictResponse

router = APIRouter(prefix="/api/predict", tags=["predict"])


@router.post("", response_model=PredictResponse)
def predict(request: PredictRequest):
    if request.primary_channel not in CHANNEL_COLUMNS:
        raise HTTPException(
            status_code=422,
            detail=f"primary_channel must be one of: {', '.join(CHANNEL_COLUMNS)}",
        )

    features = {
        "total_orders": request.total_orders,
        "avg_order_amount": request.avg_order_amount,
        "days_since_last_order": request.days_since_last_order,
        "avg_order_time": request.avg_order_time_hour * 3600,
        request.primary_channel: request.total_orders,
    }

    probability = predict_one(features)
    return PredictResponse(churn_probability=probability, churn_prediction=int(probability >= 0.5))
