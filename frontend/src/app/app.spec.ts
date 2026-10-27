import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { PkrCurrencyPipe } from './shared/pipes/pkr-currency.pipe';
import { PredictionService } from './core/services/prediction.service';
import { VALID_EXAMPLE_INPUT, FEATURES } from './feature-schema';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        PredictionService
      ]
    }).compileComponents();
  });

  it('should create the application component', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the brand title in navbar', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-title')?.textContent).toContain('Pakistan EV Price Predictor');
  });

  it('should format numbers with PkrCurrencyPipe correctly', () => {
    const pipe = new PkrCurrencyPipe();
    expect(pipe.transform(558243)).toContain('PKR 558,243');
    expect(pipe.transform(0)).toBe('PKR 0');
    expect(pipe.transform(null)).toBe('PKR 0');
  });

  it('should contain all 10 required features in the feature schema', () => {
    expect(FEATURES.length).toBe(10);
    const names = FEATURES.map(f => f.name);
    expect(names).toContain('brand');
    expect(names).toContain('type');
    expect(names).toContain('range_km');
    expect(names).toContain('top_speed_kmph');
    expect(names).toContain('motor_watts');
    expect(names).toContain('battery_type');
    expect(names).toContain('battery_capacity_ah');
    expect(names).toContain('charging_time_hrs');
    expect(names).toContain('warranty_months');
    expect(names).toContain('curb_weight_kg');
  });

  it('should validate example input values', () => {
    expect(VALID_EXAMPLE_INPUT['brand']).toBe('Vlektra');
    expect(VALID_EXAMPLE_INPUT['type']).toBe('Motorcycle');
    expect(VALID_EXAMPLE_INPUT['range_km']).toBe(150);
    expect(VALID_EXAMPLE_INPUT['top_speed_kmph']).toBe(105);
    expect(VALID_EXAMPLE_INPUT['motor_watts']).toBe(4000);
  });
});
