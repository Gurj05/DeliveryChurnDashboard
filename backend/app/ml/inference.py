import json
from functools import lru_cache
from pathlib import Path

import joblib
import pandas as pd

from app.ml.features import FEATURE_COLUMNS

ARTIFACTS_DIR = Path(__file__).resolve().parent.parent.parent / "artifacts"


@lru_cache
def get_pipeline():
    return joblib.load(ARTIFACTS_DIR / "churn_pipeline.pkl")


@lru_cache
def get_customers() -> list[dict]:
    with open(ARTIFACTS_DIR / "customers.json") as f:
        return json.load(f)


def predict_one(features: dict) -> float:
    row = pd.DataFrame([{col: features.get(col, 0) for col in FEATURE_COLUMNS}])
    return float(get_pipeline().predict_proba(row)[0, 1])
