"""
Shared ETL: turns a raw orders workbook (Date/Address/Amount/Channel/Time columns) into
per-customer engineered features. Used both by train_model.py (against the bundled demo
dataset) and by the /api/upload endpoint (against whatever workbook a user submits).
"""

import numpy as np
import pandas as pd

from app.ml.features import CHANNEL_COLUMNS

REQUIRED_COLUMNS = {"Date", "Address", "Amount", "Channel", "Time"}


def time_to_seconds(t) -> float:
    if pd.isnull(t):
        return np.nan
    if isinstance(t, str):
        parts = t.split(":")
        h, m = int(parts[0]), int(parts[1])
        s = int(parts[2]) if len(parts) > 2 else 0
        return h * 3600 + m * 60 + s
    return t.hour * 3600 + t.minute * 60 + getattr(t, "second", 0)


def load_orders_dataframe(source) -> pd.DataFrame:
    """
    Reads every sheet of an Excel workbook (path or file-like object), concatenates them,
    and validates it has the columns this app's feature engineering depends on.
    """
    sheets = pd.read_excel(source, sheet_name=None)
    df = pd.concat(sheets.values(), ignore_index=True)

    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise ValueError(
            f"Missing required column(s): {', '.join(sorted(missing))}. "
            f"Expected columns: {', '.join(sorted(REQUIRED_COLUMNS))}."
        )

    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    df = df.dropna(subset=["Date"])
    df["time_in_seconds"] = df["Time"].apply(time_to_seconds)
    return df


def engineer_customers(df: pd.DataFrame, reference_date: pd.Timestamp, anonymize: bool = False) -> pd.DataFrame:
    """
    Groups orders by Address into one feature row per customer. When `anonymize` is True
    (training, where these rows end up public in the repo's committed customers.json) each
    customer is relabeled "Customer A/B/C..."; otherwise the customer's own Address value
    is kept as their identifier, which is what an uploader wants to see back.
    """
    rows = []
    for i, (address, group) in enumerate(sorted(df.groupby("Address"))):
        channel_counts = group["Channel"].value_counts()
        row = {
            "customer_id": f"Customer {chr(65 + i)}" if anonymize else str(address),
            "is_synthetic": False,
            "total_orders": len(group),
            "avg_order_amount": group["Amount"].mean(),
            "avg_order_time": group["time_in_seconds"].mean(),
            "days_since_last_order": (reference_date - group["Date"].max()).days,
        }
        for channel in CHANNEL_COLUMNS:
            row[channel] = int(channel_counts.get(channel, 0))
        rows.append(row)
    return pd.DataFrame(rows)
