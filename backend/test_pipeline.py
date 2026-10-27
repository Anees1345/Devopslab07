"""
Test direct inference using the fitted pipeline without Flask.
Matches Stage 5.4 of the ML Full Stack Lab Manual.
"""
from pathlib import Path
import json
import warnings
import joblib
import pandas as pd

warnings.filterwarnings("ignore")

ROOT = Path(__file__).resolve().parent.parent

bundle_path = ROOT / "backend" / "models" / "model_bundle.joblib"
if bundle_path.exists():
    bundle = joblib.load(bundle_path)
    model = bundle["pipeline"]
    features = bundle["features"]
else:
    model = joblib.load(ROOT / "backend" / "models" / "ev_price_model.pkl")
    features = joblib.load(ROOT / "backend" / "models" / "feature_columns.pkl")

with (ROOT / "backend" / "test_payload.json").open(encoding="utf-8") as f:
    payload = json.load(f)

assert set(features) == set(payload), "Payload keys must match features"
frame = pd.DataFrame([[payload[f] for f in features]], columns=features)
prediction = model.predict(frame).tolist()
print("Prediction (PKR):", [round(p) for p in prediction])
if hasattr(model, "predict_proba"):
    print("Probabilities:", model.predict_proba(frame).tolist())
print("PASS: local inference")
