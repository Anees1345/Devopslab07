# Pakistan Electric Bike & Scooter Price Prediction System

[![Full-stack CI](https://github.com/YOUR_USERNAME/EV-Price-Prediction/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/EV-Price-Prediction/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Angular](https://img.shields.io/badge/Angular-22.2-dd0031.svg)](https://angular.dev/)
[![Python](https://img.shields.io/badge/Python-3.12-3776ab.svg)](https://www.python.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.9-f7931e.svg)](https://scikit-learn.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1-black.svg)](https://flask.palletsprojects.com/)

> **Academic Research Prototype Notice:**
> This system is an educational research and software engineering demonstration fitted on 35 verified electric two-wheeler models in Pakistan. The predictions and cross-validation statistics represent preliminary research findings and serve as an educational prototype, not certified market quotations.

---

## 1. Project Overview

The **Pakistan Electric Bike & Scooter Price Prediction System** is a full-stack machine learning application designed to estimate consumer retail prices of electric two-wheelers in Pakistani Rupees (PKR) based on 10 physical, electrical, and commercial specifications.

The application combines:
- A responsive, standalone-component frontend built with **Angular 22** and **Chart.js**.
- A high-performance RESTful inference backend built with **Python 3.12** and **Flask**.
- A fitted, serialized **Random Forest Regressor** pipeline from **scikit-learn** and **joblib**.
- Automated continuous integration and static site delivery through **GitHub Actions** and **GitHub Pages**.

---

## 2. Research Problem & Dataset

### Problem Statement
Pakistan's electric mobility market is experiencing rapid expansion due to rising fuel costs and urban emission targets. However, pricing is opaque across diverse domestic assemblers and varied battery technologies (Lithium-Ion, LiFePO4, Graphene, Lead Acid). This project models the pricing structure using machine-learning regression.

### Dataset Overview (`Pakistan_EV_Bikes_2026.csv`)
- **Total Records:** 35 verified production models
- **Total Original Columns:** 12
- **Target Variable ($y$):** `price_pkr` (continuous numeric in Pakistani Rupees)
- **Missing Values:** 0
- **Duplicate Rows:** 0
- **Target Min:** PKR 123,000 (TailG Zippy)
- **Target Median:** PKR 270,000 (Crown RoshniX)
- **Target Max:** PKR 900,000 (Honda Benly e)

### Feature Schema (10 Input Features)
The commercial `model` column was excluded from training features to avoid ID-like memorization. The exact 10 input features used by the pipeline are:

| Feature Name | JSON Key | Data Type | Units / Values | Description |
|---|---|---|---|---|
| Brand | `brand` | Categorical | Vlektra, Yadea, Evee, Metro, MS Jaguar, Jolta, Okla, Crown, Honda, etc. | EV manufacturer brand |
| Vehicle Type | `type` | Categorical | Motorcycle, Scooter, Sport Scooter, Sport Bike | Vehicle body formatting |
| Driving Range | `range_km` | Numeric | km (10 – 500) | Single-charge travel range |
| Top Speed | `top_speed_kmph` | Numeric | km/h (10 – 200) | Maximum rated speed |
| Motor Power | `motor_watts` | Numeric | Watts (250 – 20,000) | Continuous motor output |
| Battery Chemistry | `battery_type` | Categorical | Lithium-Ion, LiFePO4, Graphene, Graphene TTFAR, Lead Acid | Chemical composition |
| Battery Capacity | `battery_capacity_ah` | Numeric | Ah (5 – 150) | Rated battery capacity |
| Charging Time | `charging_time_hrs` | Numeric | Hours (0.5 – 24.0) | Full recharge duration |
| Warranty Period | `warranty_months` | Numeric | Months (0 – 120) | Manufacturer warranty |
| Curb Weight | `curb_weight_kg` | Numeric | kg (20 – 300) | Total weight with battery |

---

## 3. Machine Learning Methodology & Metrics

### Preprocessing Pipeline
- **Numerical Features (7):** Handled via `SimpleImputer(strategy="median")`.
- **Categorical Features (3):** Handled via `SimpleImputer(strategy="most_frequent")` followed by `OneHotEncoder(handle_unknown="ignore")`.
- Assembled through scikit-learn's `ColumnTransformer` and serialized with `joblib`.

### Candidate Algorithm Comparison (5-Fold Cross-Validation)

| Algorithm | CV MAE (PKR) ↓ | CV RMSE (PKR) ↓ | CV $R^2$ ↑ | Selection Decision |
|---|---:|---:|---:|---|
| **Random Forest Regressor** | **64,112** | **107,952** | **0.602** | **Selected (#1)** |
| Extra Trees Regressor | 65,169 | 108,145 | 0.600 | Runner-up |
| Gradient Boosting Regressor | 65,697 | 116,495 | 0.536 | Alternate |
| Linear Regression | 295,773 | 406,598 | -4.651 | Overfitted / Collinear |

*Hyperparameters for Selected Random Forest:* `n_estimators=300`, `min_samples_leaf=2`, `random_state=42`, `n_jobs=-1`.

### Holdout Evaluation (80% Train, 20% Unseen Test)
- **Training Records:** 28
- **Holdout Test Records:** 7
- **Holdout MAE:** PKR 39,755
- **Holdout RMSE:** PKR 53,861
- **Holdout $R^2$ Score:** 0.617

### Top Feature Importances (MDI)
1. `motor_watts` (36.5%)
2. `curb_weight_kg` (28.0%)
3. `battery_capacity_ah` (8.4%)
4. `range_km` (7.1%)
5. `charging_time_hrs` (7.1%)
6. `top_speed_kmph` (4.2%)
7. `battery_type_Lithium-Ion` (4.2%)
8. `warranty_months` (2.2%)

---

## 4. System Architecture

### Local Full-Stack Development Cycle

```text
User Web Browser (http://localhost:4200)
      |
      | HTTP POST /api/predict (JSON)
      v
Angular Development Proxy (frontend/proxy.conf.json)
      |
      | Forwards to http://127.0.0.1:5000/predict
      v
Flask REST API (backend/app.py)
      |
      +---> Schema & Bounds Validation
      |
      +---> Fitted ColumnTransformer Preprocessing
      |
      +---> RandomForestRegressor Pipeline Inference
      |
      v
JSON Response: {"prediction": 558243, "currency": "PKR", ...}
      |
      v
Angular Interactive Result Card (Formatted "PKR 558,243")
```

### GitHub CI/CD & GitHub Pages Architecture

```text
Local Git Repository (Root)
      |
      | git push origin main
      v
GitHub Actions CI (.github/workflows/ci.yml)
      |
      +---> Backend Job (Python 3.12, pip cache, pytest backend/tests)
      |
      +---> Frontend Job (Node 24, npm ci, ng test, ng build)
      |
GitHub Pages Deployment (.github/workflows/pages.yml)
      |
      +---> Builds Static Angular SPA with base-href /<repo-name>/
      |
      v
Public GitHub Pages Website (Static Demonstration Mode)
```

---

## 5. Project Directory Structure

```text
EV-Price-Prediction/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Full-stack CI (pytest + Angular build)
│       └── pages.yml              # GitHub Pages automated publishing
├── backend/
│   ├── app.py                     # Flask REST API server
│   ├── make_payload.py            # Generates test_payload.json from sample CSV
│   ├── requirements.txt           # Pinned backend dependencies
│   ├── test_api.py                # Requests-based live API integration test
│   ├── test_payload.json          # Validated 10-feature sample record
│   ├── test_pipeline.py           # Direct pipeline inference smoke test
│   ├── models/
│   │   ├── dataset_summary.json   # Training provenance & evaluation metrics
│   │   ├── ev_price_model.pkl     # Fitted scikit-learn pipeline artifact
│   │   ├── feature_columns.pkl    # Serialized 10-feature column list
│   │   └── model_bundle.joblib    # Unified model bundle artifact
│   └── tests/
│       ├── test_api.py            # 10 positive & negative API pytest cases
│       └── test_structure.py      # Project structure verification test
├── data/
│   ├── dataset_summary.json       # Dataset metadata
│   ├── feature_importance.csv     # Extracted MDI feature weights
│   ├── model_comparison_cv.csv    # Cross-validation benchmark data
│   ├── Pakistan_EV_Bikes_2026.csv # 35-row raw EV dataset
│   ├── sample_inputs.csv          # Single-row non-sensitive input sample
│   └── test_predictions.csv       # 7 holdout sample actual vs predicted
├── docs/
│   ├── feature_importance.png     # Feature importance plot
│   ├── holdout_actual_vs_predicted.png # Holdout scatter plot
│   ├── model_comparison.png       # 4-algorithm comparison plot
│   └── price_distribution.png     # Price histogram plot
├── frontend/
│   ├── angular.json               # Angular CLI configuration & build budgets
│   ├── package.json               # Frontend dependencies & build scripts
│   ├── package-lock.json          # Dependency lockfile
│   ├── proxy.conf.json            # Development proxy (/api -> 127.0.0.1:5000)
│   ├── tsconfig.json              # TypeScript root configuration
│   ├── public/
│   │   ├── data/                  # Public research datasets
│   │   └── images/                # Static chart figures
│   └── src/
│       ├── index.html             # Shell HTML
│       ├── main.ts                # Application bootstrap
│       ├── styles.css             # Global design system & theme
│       └── app/
│           ├── app.ts             # Shell standalone component
│           ├── app.html           # Navbar, router outlet & footer
│           ├── app.css            # Navigation and layout styling
│           ├── app.routes.ts      # 5 routed application pages
│           ├── app.config.ts      # Router & HttpClient providers
│           ├── app.spec.ts        # Unit tests (Vitest)
│           ├── feature-schema.ts  # 10-feature definitions & validation bounds
│           ├── core/
│           │   ├── models/        # TypeScript interfaces
│           │   └── services/      # PredictionService & HttpClient
│           ├── pages/
│           │   ├── dashboard/     # Page 1: Overview KPIs & Chart.js plots
│           │   ├── prediction/    # Page 2: 10-field input form & result card
│           │   ├── evaluation/    # Page 3: CV benchmarks & holdout error
│           │   ├── dataset/       # Page 4: Data dictionary & 35-row table
│           │   └── about/         # Page 5: Architecture & methodology
│           └── shared/
│               └── pipes/         # PkrCurrencyPipe (PKR formatting)
├── .gitignore                     # Git exclusion rules
├── LICENSE                        # MIT License
└── README.md                      # Complete system documentation
```

---

## 6. Local Setup and Execution Instructions

### Prerequisites
1. **Python 3.12** installed with pip.
2. **Node.js LTS (v24)** and **npm**.
3. **Git for Windows**.

### Step 1: Open Terminal 1 (Flask Backend)
From the project root:
```powershell
# Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Upgrade pip and install dependencies
python -m pip install --upgrade pip
python -m pip install -r backend\requirements.txt

# Start Flask on http://127.0.0.1:5000
python backend\app.py
```
*Leave Terminal 1 running.*

Verify health endpoint in your browser:
`http://127.0.0.1:5000/health`

### Step 2: Open Terminal 2 (Angular Frontend)
In a second terminal:
```powershell
cd frontend
npm ci
ng serve --open --proxy-config proxy.conf.json
```
*Leave Terminal 2 running.* The application will launch at:
`http://localhost:4200`

### Step 3: Open Terminal 3 (Testing & Operations)
From project root:
```powershell
# Run backend pytest suite
.\.venv\Scripts\python.exe -m pytest backend\tests -v

# Run direct requests-based integration test
.\.venv\Scripts\python.exe backend\test_api.py

# Run frontend unit tests
cd frontend
npm test -- --watch=false

# Run Angular production build
npm run build
```

---

## 7. Flask REST API Documentation

### 1. `GET /health`
Returns system health and model availability.
- **Status:** `200 OK`
```json
{
  "features": 10,
  "model": "Random Forest Regressor",
  "status": "ok",
  "task": "regression"
}
```

### 2. `GET /api/info`
Provides model metadata and specification limits without exposing weights.
- **Status:** `200 OK`

### 3. `POST /predict`
Accepts 10 vehicle specifications and returns estimated PKR price.

#### Example Request Payload:
```json
{
  "brand": "Vlektra",
  "type": "Motorcycle",
  "range_km": 150,
  "top_speed_kmph": 105,
  "motor_watts": 4000,
  "battery_type": "Lithium-Ion",
  "battery_capacity_ah": 40,
  "charging_time_hrs": 3.5,
  "warranty_months": 36,
  "curb_weight_kg": 110
}
```

#### Example Response:
```json
{
  "currency": "PKR",
  "disclaimer": "This is a model estimate, not a verified market quotation.",
  "model": "Random Forest Regressor",
  "prediction": 558243,
  "task": "regression"
}
```

---

## 8. Git & GitHub Publishing Instructions

To publish your local project to a new GitHub repository:

```powershell
# 1. Initialize root repository
git init
git branch -M main

# 2. Stage verified files and inspect
git status --short
git add .
git commit -m "feat: complete Pakistan EV price prediction system"

# 3. Connect to your empty GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/EV-Price-Prediction.git

# 4. Push main branch
git push -u origin main
```

### GitHub Pages Configuration
1. Open your repository on GitHub: `Settings` → `Pages`.
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Push to `main` triggers `.github/workflows/pages.yml`.
4. Your site will be published at: `https://<YOUR_USERNAME>.github.io/EV-Price-Prediction/`

---

## 9. Verification Checklist

- [x] Fitted Random Forest pipeline loads directly via `joblib`.
- [x] All 10 required features are enforced in both Flask and Angular.
- [x] Flask `/health` and `/predict` endpoints return 200 on valid inputs.
- [x] Comprehensive pytest test suite (11/11 tests pass).
- [x] Angular 22 frontend built with standalone components and routing.
- [x] 5 complete pages: Dashboard, Prediction, Evaluation, Dataset, About.
- [x] Interactive Chart.js visualizations for all research metrics.
- [x] Form input validation, positive bounds, loading states, and example loading.
- [x] Angular unit tests pass (5/5 tests pass).
- [x] Angular production build succeeds without errors.
- [x] Development proxy configured (`proxy.conf.json`).
- [x] GitHub Actions CI workflow configured (`ci.yml`).
- [x] GitHub Pages static deployment workflow configured (`pages.yml`).
- [x] Static demo mode clearly disclosed when hosted on GitHub Pages.
