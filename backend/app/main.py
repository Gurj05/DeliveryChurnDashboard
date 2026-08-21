import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import customers, predict, summary, upload

app = FastAPI(
    title="Delivery Churn Dashboard API",
    description="Serves a churn-prediction model trained on delivery order data.",
)

allowed_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customers.router)
app.include_router(summary.router)
app.include_router(predict.router)
app.include_router(upload.router)


@app.get("/")
def root():
    return {"status": "ok", "docs": "/docs"}
