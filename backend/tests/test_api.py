"""
Automated unit and integration tests for Flask backend.
Covers positive and negative cases per the master specification and Lab Manual Stage 7.6.
"""
import json
from pathlib import Path
import sys
import pytest

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from app import app, FEATURES

PAYLOAD = json.loads((ROOT / "backend" / "test_payload.json").read_text(encoding="utf-8"))


@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_health_success(client):
    """1. /health returns HTTP 200 with model info when model is available."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "ok"
    assert data["features"] == len(FEATURES)
    assert "model" in data
    assert data["task"] == "regression"


def test_api_info_endpoint(client):
    """Verify /api/info returns metadata and feature schema."""
    response = client.get("/api/info")
    assert response.status_code == 200
    data = response.get_json()
    assert data["task"] == "regression"
    assert "features" in data
    assert len(data["features"]) == 10
    assert "numeric_specifications" in data


def test_predict_valid_payload(client):
    """2. Valid prediction returns HTTP 200 and a finite integer price in PKR."""
    response = client.post("/predict", json=PAYLOAD)
    assert response.status_code == 200, response.get_json()
    data = response.get_json()
    assert "prediction" in data
    assert isinstance(data["prediction"], (int, float))
    assert data["prediction"] > 0
    assert data["currency"] == "PKR"
    assert data["task"] == "regression"
    assert data["model"] == "Random Forest Regressor"
    assert "disclaimer" in data


def test_predict_missing_feature(client):
    """3. Missing feature returns HTTP 400."""
    incomplete = dict(PAYLOAD)
    incomplete.pop("range_km")
    response = client.post("/predict", json=incomplete)
    assert response.status_code == 400
    data = response.get_json()
    assert "missing" in data
    assert "range_km" in data["missing"]


def test_predict_extra_feature(client):
    """4. Extra unforeseen fields return HTTP 400."""
    extra = dict(PAYLOAD)
    extra["color"] = "Metallic Blue"
    response = client.post("/predict", json=extra)
    assert response.status_code == 400
    data = response.get_json()
    assert "extra" in data
    assert "color" in data["extra"]


def test_predict_invalid_json(client):
    """5. Non-JSON body returns HTTP 400."""
    response = client.post("/predict", data="invalid-non-json-string", content_type="application/json")
    assert response.status_code == 400


def test_predict_out_of_range_number(client):
    """6. Out-of-bounds numeric value returns HTTP 400."""
    invalid_num = dict(PAYLOAD)
    invalid_num["range_km"] = -50  # negative range
    response = client.post("/predict", json=invalid_num)
    assert response.status_code == 400
    assert "Validation error" in response.get_json()["error"]


def test_predict_non_numeric_for_number_field(client):
    """6b. Non-numeric value for numeric field returns HTTP 400."""
    invalid_num = dict(PAYLOAD)
    invalid_num["motor_watts"] = "high-power"
    response = client.post("/predict", json=invalid_num)
    assert response.status_code == 400


def test_predict_empty_categorical(client):
    """7. Empty categorical string returns HTTP 400."""
    invalid_cat = dict(PAYLOAD)
    invalid_cat["brand"] = "   "
    response = client.post("/predict", json=invalid_cat)
    assert response.status_code == 400


def test_predict_json_serializable(client):
    """9. Verify response is standard JSON serializable without numpy types."""
    response = client.post("/predict", json=PAYLOAD)
    data = response.get_json()
    # json.dumps must not raise TypeError for int64 or float32
    serialized = json.dumps(data)
    assert serialized is not None
