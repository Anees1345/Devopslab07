import { Component, AfterViewInit, ViewChild, ElementRef, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PkrCurrencyPipe } from '../../shared/pipes/pkr-currency.pipe';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [CommonModule, PkrCurrencyPipe],
  templateUrl: './evaluation.component.html',
  styleUrl: './evaluation.component.css'
})
export class EvaluationComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);

  @ViewChild('cvComparisonChart') cvComparisonCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('errorDistChart') errorDistCanvas!: ElementRef<HTMLCanvasElement>;

  readonly cvResults = [
    { model: 'Random Forest', mae: 64112, rmse: 107952, r2: 0.602, rank: 1, selected: true },
    { model: 'Extra Trees', mae: 65169, rmse: 108145, r2: 0.600, rank: 2, selected: false },
    { model: 'Gradient Boosting', mae: 65697, rmse: 116495, r2: 0.536, rank: 3, selected: false },
    { model: 'Linear Regression', mae: 295773, rmse: 406598, r2: -4.651, rank: 4, selected: false },
  ];

  readonly holdoutStats = {
    trainRecords: 28,
    testRecords: 7,
    mae: 39755,
    rmse: 53861,
    r2: 0.617
  };

  readonly holdoutSamples = [
    { actual: 182000, predicted: 180042, error: 1958, percentErr: 1.1 },
    { actual: 197000, predicted: 224302, error: 27302, percentErr: 13.9 },
    { actual: 270000, predicted: 349480, error: 79480, percentErr: 29.4 },
    { actual: 450000, predicted: 558015, error: 108015, percentErr: 24.0 },
    { actual: 258900, predicted: 240976, error: 17924, percentErr: 6.9 },
    { actual: 245000, predicted: 235477, error: 9523, percentErr: 3.9 },
    { actual: 177900, predicted: 211986, error: 34086, percentErr: 19.2 },
  ];

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initCvComparisonChart();
      this.initErrorDistChart();
    }
  }

  private initCvComparisonChart(): void {
    if (!this.cvComparisonCanvas) return;
    new Chart(this.cvComparisonCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Random Forest', 'Extra Trees', 'Gradient Boosting', 'Linear Regression'],
        datasets: [
          {
            label: 'MAE (PKR)',
            data: [64112, 65169, 65697, 295773],
            backgroundColor: '#0284c7',
            borderRadius: 4
          },
          {
            label: 'RMSE (PKR)',
            data: [107952, 108145, 116495, 406598],
            backgroundColor: '#0d9488',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: PKR ${Number(ctx.raw).toLocaleString('en-PK')}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (v) => `PKR ${(Number(v) / 1000).toFixed(0)}k`
            }
          }
        }
      }
    });
  }

  private initErrorDistChart(): void {
    if (!this.errorDistCanvas) return;
    new Chart(this.errorDistCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Test #1', 'Test #2', 'Test #3', 'Test #4', 'Test #5', 'Test #6', 'Test #7'],
        datasets: [{
          label: 'Absolute Prediction Error (PKR)',
          data: [1958, 27302, 79480, 108015, 17924, 9523, 34086],
          backgroundColor: '#38bdf8',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `Error: PKR ${Number(ctx.raw).toLocaleString('en-PK')}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (v) => `PKR ${(Number(v) / 1000).toFixed(0)}k`
            }
          }
        }
      }
    });
  }
}
