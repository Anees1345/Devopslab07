import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EvPredictionPayload, PredictionResponse, HealthResponse, ModelInfoResponse } from '../models/prediction.model';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private http = inject(HttpClient);

  // Check if running on GitHub Pages or other static host
  isStaticDeployment(): boolean {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    return hostname !== 'localhost' && hostname !== '127.0.0.1';
  }

  // POST /api/predict (proxied to Flask /predict in dev)
  predict(payload: EvPredictionPayload): Observable<PredictionResponse> {
    if (this.isStaticDeployment()) {
      return of({
        prediction: 0,
        currency: 'PKR',
        task: 'regression',
        model: 'Random Forest Regressor',
        disclaimer: 'Static GitHub Pages deployment notice: Live predictions require the Flask backend server running locally.'
      });
    }
    return this.http.post<PredictionResponse>('/api/predict', payload);
  }

  // GET /api/health (proxied to Flask /health in dev)
  checkHealth(): Observable<HealthResponse> {
    if (this.isStaticDeployment()) {
      return of({
        status: 'static-demo',
        model: 'Random Forest Regressor (Static Mode)',
        task: 'regression',
        features: 10
      });
    }
    return this.http.get<HealthResponse>('/api/health');
  }

  // GET /api/info
  getInfo(): Observable<ModelInfoResponse> {
    return this.http.get<ModelInfoResponse>('/api/info');
  }

  // Load dataset summary from public assets
  getDatasetSummary(): Observable<any> {
    return this.http.get<any>('data/dataset_summary.json');
  }
}
