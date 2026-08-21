from io import BytesIO

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.ml.etl import engineer_customers, load_orders_dataframe
from app.ml.features import FEATURE_COLUMNS
from app.ml.inference import get_pipeline
from app.schemas import CustomerOut

router = APIRouter(prefix="/api/upload", tags=["upload"])

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


@router.post("", response_model=list[CustomerOut])
async def upload_and_predict(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="Please upload an .xlsx file.")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large (max 5MB).")

    try:
        df = load_orders_dataframe(BytesIO(contents))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception:
        raise HTTPException(status_code=400, detail="Couldn't read that file. Make sure it's a valid .xlsx workbook.")

    if df.empty:
        raise HTTPException(status_code=422, detail="No valid rows found — check that the Date column parses correctly.")

    reference_date = df["Date"].max()
    customers_df = engineer_customers(df, reference_date, anonymize=False)

    pipeline = get_pipeline()
    X = customers_df[FEATURE_COLUMNS]
    customers_df["churn_probability"] = pipeline.predict_proba(X)[:, 1]
    customers_df["churn_prediction"] = (customers_df["churn_probability"] >= 0.5).astype(int)

    return customers_df.sort_values("churn_probability", ascending=False).to_dict(orient="records")
