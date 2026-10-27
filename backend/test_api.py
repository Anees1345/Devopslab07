"""
Direct API test using Requests.
Matches Stage 7.4 of the ML Full Stack Lab Manual.
Run when Flask is running on http://127.0.0.1:5000
"""
from pathlib import Path
import json
import requests

BASE = Path(__file__).resolve().parent
payload = json.loads((BASE / "test_payload.json").read_text(encoding="utf-8"))

with requests.Session() as session:
    session.trust_env = False  # avoids inherited proxy for localhost
    print("Testing GET /health...")
    health_resp = session.get("http://127.0.0.1:5000/health", timeout=10)
    print("Health Status:", health_resp.status_code, health_resp.text)
    health_resp.raise_for_status()

    print("Testing POST /predict...")
    response = session.post("http://127.0.0.1:5000/predict", json=payload, timeout=60)
    print("HTTP Status:", response.status_code)
    print("Response:", response.text)
    response.raise_for_status()

print("PASS: API request")
