import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PredictionComponent } from './pages/prediction/prediction.component';
import { EvaluationComponent } from './pages/evaluation/evaluation.component';
import { DatasetComponent } from './pages/dataset/dataset.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard | Pakistan EV Price Predictor' },
  { path: 'predict', component: PredictionComponent, title: 'Price Prediction | Pakistan EV Price Predictor' },
  { path: 'evaluation', component: EvaluationComponent, title: 'Model Evaluation | Pakistan EV Price Predictor' },
  { path: 'dataset', component: DatasetComponent, title: 'Dataset Info | Pakistan EV Price Predictor' },
  { path: 'about', component: AboutComponent, title: 'About Project | Pakistan EV Price Predictor' },
  { path: '**', redirectTo: 'dashboard' }
];
