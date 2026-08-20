from fastapi import APIRouter, HTTPException

from app.ml.inference import get_customers
from app.schemas import CustomerOut

router = APIRouter(prefix="/api/customers", tags=["customers"])


@router.get("", response_model=list[CustomerOut])
def list_customers():
    return get_customers()


@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer(customer_id: str):
    for customer in get_customers():
        if customer["customer_id"] == customer_id:
            return customer
    raise HTTPException(status_code=404, detail="Customer not found")
