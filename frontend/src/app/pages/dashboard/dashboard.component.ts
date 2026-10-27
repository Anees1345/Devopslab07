import { Component, AfterViewInit, ViewChild, ElementRef, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PkrCurrencyPipe } from '../../shared/pipes/pkr-currency.pipe';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, PkrCurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);

  @ViewChild('typePriceChart') typePriceCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('modelComparisonChart') modelCompCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('featureImpChart') featureImpCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('actualVsPredChart') actualVsPredCanvas!: ElementRef<HTMLCanvasElement>;

  readonly stats = {
    totalRecords: 35,
    totalColumns: 12,
    targetVariable: 'price_pkr',
    selectedAlgorithm: 'Random Forest Regressor',
    cvMaePkr: 64112,
    cvR2: 0.602,
    holdoutMaePkr: 39755,
    holdoutR2: 0.617,
    medianPricePkr: 270000,
    minPricePkr: 123000,
    maxPricePkr: 900000
  };

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initTypePriceChart();
      this.initModelComparisonChart();
      this.initFeatureImpChart();
      this.initActualVsPredChart();
    }
  }

  private initTypePriceChart(): void {
    if (!this.typePriceCanvas) return;
    new Chart(this.typePriceCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Sport Scooter', 'Motorcycle', 'Scooter', 'Sport Bike'],
        datasets: [{
          label: 'Average Price (PKR)',
          data: [545000, 375757, 289196, 128000],
          backgroundColor: ['#0284c7', '#0d9488', '#38bdf8', '#94a3b8'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `Avg Price: PKR ${Number(ctx.raw).toLocaleString('en-PK')}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (val) => `PKR ${(Number(val) / 1000).toFixed(0)}k`
            }
          }
        }
      }
    });
  }

  private initModelComparisonChart(): void {
    if (!this.modelCompCanvas) return;
    new Chart(this.modelCompCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Random Forest', 'Extra Trees', 'Gradient Boosting', 'Linear Regression'],
        datasets: [{
          label: '5-Fold CV MAE (PKR - Lower is better)',
          data: [64112, 65169, 65697, 295773],
          backgroundColor: ['#10b981', '#0ea5e9', '#f59e0b', '#ef4444'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `CV MAE: PKR ${Number(ctx.raw).toLocaleString('en-PK')}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (val) => `PKR ${(Number(val) / 1000).toFixed(0)}k`
            }
          }
        }
      }
    });
  }

  private initFeatureImpChart(): void {
    if (!this.featureImpCanvas) return;
    new Chart(this.featureImpCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: [
          'Motor Power (W)',
          'Curb Weight (kg)',
          'Battery Capacity (Ah)',
          'Range (km)',
          'Charging Time (hrs)',
          'Top Speed (km/h)',
          'Lithium-Ion Battery',
          'Warranty (months)'
        ],
        datasets: [{
          label: 'Relative Importance Weight',
          data: [0.365, 0.280, 0.084, 0.071, 0.071, 0.042, 0.042, 0.022],
          backgroundColor: '#0284c7',
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `Importance: ${(Number(ctx.raw) * 100).toFixed(1)}%`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 0.40,
            ticks: {
              callback: (val) => `${(Number(val) * 100).toFixed(0)}%`
            }
          }
        }
      }
    });
  }

  private initActualVsPredChart(): void {
    if (!this.actualVsPredCanvas) return;
    new Chart(this.actualVsPredCanvas.nativeElement, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Holdout Test Predictions (7 Samples)',
            data: [
              { x: 182000, y: 180042 },
              { x: 197000, y: 224302 },
              { x: 270000, y: 349480 },
              { x: 450000, y: 558015 },
              { x: 258900, y: 240976 },
              { x: 245000, y: 235477 },
              { x: 177900, y: 211986 }
            ],
            backgroundColor: '#0284c7',
            borderColor: '#0b1e36',
            pointRadius: 6,
            pointHoverRadius: 8
          },
          {
            type: 'line',
            label: 'Perfect Fit (Identity Line)',
            data: [
              { x: 150000, y: 150000 },
              { x: 600000, y: 600000 }
            ],
            borderColor: '#94a3b8',
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx: any) => `Actual: PKR ${ctx.raw.x.toLocaleString()} | Pred: PKR ${ctx.raw.y.toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Actual Market Price (PKR)' },
            ticks: { callback: (v) => `${Number(v) / 1000}k` }
          },
          y: {
            title: { display: true, text: 'Predicted Model Price (PKR)' },
            ticks: { callback: (v) => `${Number(v) / 1000}k` }
          }
        }
      }
    });
  }
}
