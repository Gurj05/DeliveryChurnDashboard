from pydantic import BaseModel, Field


class CustomerOut(BaseModel):
    customer_id: str
    is_synthetic: bool
    total_orders: int
    avg_order_amount: float
    avg_order_time: float
    days_since_last_order: int
    churn_probability: float
    churn_prediction: int


class SummaryOut(BaseModel):
    total_customers: int
    at_risk_count: int
    at_risk_percent: float
    avg_order_amount: float


class PredictRequest(BaseModel):
    total_orders: int = Field(ge=0)
    avg_order_amount: float = Field(ge=0)
    days_since_last_order: int = Field(ge=0)
    avg_order_time_hour: float = Field(ge=0, le=24, description="Average order time of day, in hours (e.g. 14.5 = 2:30pm)")
    primary_channel: str = Field(description="One of: Call Center, Mobile, Point of Sale, Web")


class PredictResponse(BaseModel):
    churn_probability: float
    churn_prediction: int
