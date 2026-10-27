import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PredictionService } from '../../core/services/prediction.service';
import { FEATURES, Feature, VALID_EXAMPLE_INPUT } from '../../feature-schema';
import { EvPredictionPayload, PredictionResponse } from '../../core/models/prediction.model';
import { PkrCurrencyPipe } from '../../shared/pipes/pkr-currency.pipe';

@Component({
  selector: 'app-prediction',
  standalone: true,
  imports: [CommonModule, FormsModule, PkrCurrencyPipe],
  templateUrl: './prediction.component.html',
  styleUrl: './prediction.component.css'
})
export class PredictionComponent implements OnInit {
  private api = inject(PredictionService);

  readonly allFields = FEATURES;
  readonly isStatic = this.api.isStaticDeployment();

  // Grouped fields
  readonly vehicleFields = FEATURES.filter(f => f.group === 'vehicle');
  readonly performanceFields = FEATURES.filter(f => f.group === 'performance');
  readonly batteryFields = FEATURES.filter(f => f.group === 'battery');
  readonly additionalFields = FEATURES.filter(f => f.group === 'additional');

  formValues: Record<string, any> = {};
  loading = false;
  errorMessage = '';
  validationErrors: Record<string, string> = {};
  result: PredictionResponse | null = null;
  submittedPayload: EvPredictionPayload | null = null;
  backendOnline = true;

  ngOnInit(): void {
    this.resetForm();
    this.checkBackendStatus();
  }

  checkBackendStatus(): void {
    if (!this.isStatic) {
      this.api.checkHealth().subscribe({
        next: (resp) => {
          this.backendOnline = resp.status === 'ok';
        },
        error: () => {
          this.backendOnline = false;
        }
      });
    }
  }

  loadExample(): void {
    this.errorMessage = '';
    this.validationErrors = {};
    for (const [key, val] of Object.entries(VALID_EXAMPLE_INPUT)) {
      this.formValues[key] = val;
    }
  }

  resetForm(): void {
    this.errorMessage = '';
    this.validationErrors = {};
    for (const field of this.allFields) {
      this.formValues[field.name] = field.defaultValue ?? null;
    }
  }

  clearResults(): void {
    this.result = null;
    this.submittedPayload = null;
    this.errorMessage = '';
    this.validationErrors = {};
  }

  validate(): boolean {
    this.validationErrors = {};
    let isValid = true;

    for (const field of this.allFields) {
      const val = this.formValues[field.name];

      // Check required
      if (val === null || val === undefined || val === '') {
        this.validationErrors[field.name] = `${field.label} is required.`;
        isValid = false;
        continue;
      }

      // Check numeric
      if (field.kind === 'number') {
        const num = Number(val);
        if (isNaN(num) || !isFinite(num)) {
          this.validationErrors[field.name] = `${field.label} must be a valid number.`;
          isValid = false;
        } else if (field.min !== undefined && num < field.min) {
          this.validationErrors[field.name] = `${field.label} cannot be less than ${field.min} ${field.unit || ''}.`;
          isValid = false;
        } else if (field.max !== undefined && num > field.max) {
          this.validationErrors[field.name] = `${field.label} cannot exceed ${field.max} ${field.unit || ''}.`;
          isValid = false;
        }
      } else if (field.kind === 'category') {
        if (typeof val !== 'string' || !val.trim()) {
          this.validationErrors[field.name] = `Please select a valid ${field.label}.`;
          isValid = false;
        }
      }
    }

    return isValid;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.result = null;

    if (this.isStatic) {
      this.errorMessage = 'Static GitHub Pages demonstration: Live prediction requires the Python Flask backend running locally on http://127.0.0.1:5000.';
      return;
    }

    if (!this.validate()) {
      this.errorMessage = 'Please fix the highlighted input validation errors below.';
      return;
    }

    const payload: EvPredictionPayload = {
      brand: String(this.formValues['brand']),
      type: String(this.formValues['type']),
      range_km: Number(this.formValues['range_km']),
      top_speed_kmph: Number(this.formValues['top_speed_kmph']),
      motor_watts: Number(this.formValues['motor_watts']),
      battery_type: String(this.formValues['battery_type']),
      battery_capacity_ah: Number(this.formValues['battery_capacity_ah']),
      charging_time_hrs: Number(this.formValues['charging_time_hrs']),
      warranty_months: Number(this.formValues['warranty_months']),
      curb_weight_kg: Number(this.formValues['curb_weight_kg'])
    };

    this.loading = true;
    this.submittedPayload = { ...payload };

    this.api.predict(payload).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
        this.backendOnline = true;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 0 || err.status === 504 || err.status === 502) {
          this.backendOnline = false;
          this.errorMessage = 'Cannot reach the Flask backend at http://127.0.0.1:5000. Ensure Flask is running in Terminal 1.';
        } else if (err.error?.message) {
          this.errorMessage = `API Error: ${err.error.message}`;
        } else if (err.error?.detail) {
          this.errorMessage = `Validation Error: ${err.error.detail}`;
        } else {
          this.errorMessage = `Prediction failed (${err.status || 'Network Error'}): Check Flask terminal output.`;
        }
      }
    });
  }
}
