"""
Pakistan Electric Bike & Scooter Price Prediction System - Flask REST API
Author: Full-Stack ML Engineer
Lab Manual: From a Trained ML Model to a Full-Stack Research Application
"""
import json
import logging
import math
import warnings
from pathlib import Path

import joblib
import pandas as pd
from flask import Flask, jsonify, request

warnings.filterwarnings("ignore")

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("ev_backend")

BASE_DIR = Path(__file__).resolve().parent

# Feature schema and specification
NUMERIC_FEATURES = {
    "range_km": {"min": 10, "max": 1000, "unit": "km", "label": "Driving Range"},
    "top_speed_kmph": {"min": 10, "max": 250, "unit": "km/h", "label": "Top Speed"},
    "motor_watts": {"min": 250, "max": 50000, "unit": "W", "label": "Motor Power"},
    "battery_capacity_ah": {"min": 5, "max": 300, "unit": "Ah", "label": "Battery Capacity"},
    "charging_time_hrs": {"min": 0.5, "max": 24.0, "unit": "Hours", "label": "Charging Time"},
    "warranty_months": {"min": 0, "max": 120, "unit": "Months", "label": "Warranty"},
    "curb_weight_kg": {"min": 20, "max": 500, "unit": "kg", "label": "Curb Weight"}
}

CATEGORICAL_FEATURES = {
    "brand": {"label": "Brand"},
    "type": {"label": "Vehicle Type"},
    "battery_type": {"label": "Battery Type"}
}

EXPECTED_FEATURES = [
    "brand",
    "type",
    "range_km",
    "top_speed_kmph",
    "motor_watts",
    "battery_type",
    "battery_capacity_ah",
    "charging_time_hrs",
    "warranty_months",
    "curb_weight_kg"
]

# Load model artifact
MODEL = None
FEATURES = EXPECTED_FEATURES
TASK = "regression"
MODEL_NAME = "Random Forest Regressor"
MODEL_LOAD_ERROR = None

try:
    bundle_path = BASE_DIR / "models" / "model_bundle.joblib"
    legacy_model_path = BASE_DIR / "models" / "ev_price_model.pkl"
    feature_col_path = BASE_DIR / "models" / "feature_columns.pkl"

    if bundle_path.exists():
        bundle = joblib.load(bundle_path)
        MODEL = bundle.get("pipeline")
        FEATURES = bundle.get("features", EXPECTED_FEATURES)
        TASK = bundle.get("task", "regression")
        MODEL_NAME = bundle.get("model_name", "Random Forest Regressor")
        logger.info("Loaded model from bundle successfully.")
    elif legacy_model_path.exists():
        MODEL = joblib.load(legacy_model_path)
        if feature_col_path.exists():
            FEATURES = joblib.load(feature_col_path)
        logger.info("Loaded model from ev_price_model.pkl successfully.")
    else:
        raise FileNotFoundError(f"Model artifact not found in {BASE_DIR / 'models'}")

    assert hasattr(MODEL, "predict"), "Loaded model must implement 'predict'"
except Exception as e:
    MODEL_LOAD_ERROR = str(e)
    logger.error("Failed to load model: %s", MODEL_LOAD_ERROR)

app = Flask(__name__)


@app.get("/health")
@app.get("/api/health")
def health():
    if MODEL is None or MODEL_LOAD_ERROR is not None:
        return jsonify(
            status="error",
            error="Model artifact failed to load",
            detail=MODEL_LOAD_ERROR
        ), 503
    return jsonify(
        status="ok",
        model=MODEL_NAME,
        task=TASK,
        features=len(FEATURES)
    ), 200


@app.get("/api/info")
def info():
    return jsonify(
        application="Pakistan Electric Bike & Scooter Price Prediction System",
        prototype=True,
        currency="PKR",
        task=TASK,
        model=MODEL_NAME,
        features=FEATURES,
        feature_count=len(FEATURES),
        numeric_specifications=NUMERIC_FEATURES,
        categorical_specifications=CATEGORICAL_FEATURES,
        disclaimer="Research/educational prototype only. Evaluation results are preliminary based on 35 dataset records."
    ), 200


@app.post("/predict")
@app.post("/api/predict")
def predict():
    if MODEL is None or MODEL_LOAD_ERROR is not None:
        return jsonify(
            error="Model unavailable",
            detail=MODEL_LOAD_ERROR or "Model not loaded"
        ), 503

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(error="Expected a valid JSON object in request body"), 400

    # Key validation
    data_keys = set(data.keys())
    expected_set = set(FEATURES)

    missing = [f for f in FEATURES if f not in data_keys]
    extra = [f for f in data_keys if f not in expected_set]

    if missing or extra:
        error_msg = []
        if missing:
            error_msg.append(f"Missing required fields: {', '.join(missing)}")
        if extra:
            error_msg.append(f"Unexpected extra fields: {', '.join(extra)}")
        return jsonify(
            error="Input schema mismatch",
            missing=missing,
            extra=extra,
            message="; ".join(error_msg)
        ), 400

    # Value validation
    validated_row = {}
    for key in FEATURES:
        val = data[key]

        # Categorical check
        if key in CATEGORICAL_FEATURES:
            if not isinstance(val, str) or not val.strip():
                return jsonify(
                    error="Validation error",
                    detail=f"Field '{key}' must be a non-empty string"
                ), 400
            validated_row[key] = str(val).strip()

        # Numeric check
        elif key in NUMERIC_FEATURES:
            if isinstance(val, bool) or val is None:
                return jsonify(
                    error="Validation error",
                    detail=f"Field '{key}' must be a finite number"
                ), 400
            try:
                numeric_val = float(val)
            except (ValueError, TypeError):
                return jsonify(
                    error="Validation error",
                    detail=f"Field '{key}' must be a valid number"
                ), 400

            if not math.isfinite(numeric_val):
                return jsonify(
                    error="Validation error",
                    detail=f"Field '{key}' must be a finite number"
                ), 400

            # Range bounds validation
            min_val = NUMERIC_FEATURES[key]["min"]
            max_val = NUMERIC_FEATURES[key]["max"]
            if numeric_val < min_val or numeric_val > max_val:
                return jsonify(
                    error="Validation error",
                    detail=f"Field '{key}' value {numeric_val} is out of allowable range [{min_val}, {max_val}]"
                ), 400

            validated_row[key] = numeric_val

    # Construct DataFrame in expected feature column order
    frame = pd.DataFrame([[validated_row[f] for f in FEATURES]], columns=FEATURES)

    try:
        raw_pred = MODEL.predict(frame)[0]
        # Convert numpy types to native Python float/int
        if hasattr(raw_pred, "item"):
            num_pred = float(raw_pred.item())
        else:
            num_pred = float(raw_pred)

        # Round to whole PKR integer
        rounded_pred = int(round(num_pred))

        response = {
            "prediction": rounded_pred,
            "currency": "PKR",
            "task": TASK,
            "model": MODEL_NAME,
            "disclaimer": "This is a model estimate, not a verified market quotation."
        }
        return jsonify(response), 200

    except (ValueError, TypeError) as exc:
        logger.warning("Prediction input error: %s", exc)
        return jsonify(error="Invalid input for model inference", detail=str(exc)), 400
    except Exception as exc:
        logger.exception("Unexpected prediction error")
        return jsonify(error="Prediction processing failed"), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
