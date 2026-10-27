"""
Smoke test to verify project structure and critical files exist.
Matches Stage 13.2 of the ML Full Stack Lab Manual.
"""
from pathlib import Path


def test_source_files_exist():
    root = Path(__file__).resolve().parents[2]
    assert (root / "backend" / "app.py").exists(), "backend/app.py must exist"
    assert (root / "backend" / "requirements.txt").exists(), "backend/requirements.txt must exist"
    assert (root / "README.md").exists(), "README.md must exist"
    assert (root / "data" / "Pakistan_EV_Bikes_2026.csv").exists(), "Dataset must exist"
    assert (root / "data" / "sample_inputs.csv").exists(), "sample_inputs.csv must exist"
