import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PredictionService } from '../../core/services/prediction.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  private api = inject(PredictionService);
  readonly isStatic = this.api.isStaticDeployment();

  readonly techStack = [
    {
      layer: 'Frontend Framework',
      tech: 'Angular 22',
      details: 'TypeScript, Standalone Components, Reactive & FormsModule, Angular Router, provideHttpClient, RxJS'
    },
    {
      layer: 'Data Visualization',
      tech: 'Chart.js 4',
      details: 'Responsive HTML5 Canvas rendering for histograms, scatter plots, feature importances, and model comparisons'
    },
    {
      layer: 'Backend API',
      tech: 'Python 3.12 & Flask 3',
      details: 'RESTful micro-service with input validation, schema enforcement, JSON response serialization, and logging'
    },
    {
      layer: 'Machine Learning',
      tech: 'scikit-learn 1.9 & joblib',
      details: 'ColumnTransformer preprocessing, OneHotEncoder, SimpleImputer, and fitted RandomForestRegressor pipeline'
    },
    {
      layer: 'Continuous Integration',
      tech: 'GitHub Actions',
      details: 'Automated Python unit/integration tests with pytest, Node 24 environment, Angular production builds'
    },
    {
      layer: 'Hosting & Deployment',
      tech: 'GitHub Pages & Local Proxy',
      details: 'Angular development proxy for local full-stack development; static SPA artifact distribution via GitHub Pages'
    }
  ];
}
