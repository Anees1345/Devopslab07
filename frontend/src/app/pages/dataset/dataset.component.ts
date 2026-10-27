import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PkrCurrencyPipe } from '../../shared/pipes/pkr-currency.pipe';
import { DatasetItem } from '../../core/models/prediction.model';

@Component({
  selector: 'app-dataset',
  standalone: true,
  imports: [CommonModule, FormsModule, PkrCurrencyPipe],
  templateUrl: './dataset.component.html',
  styleUrl: './dataset.component.css'
})
export class DatasetComponent implements OnInit {
  searchQuery = '';
  selectedType = 'ALL';

  readonly dictionary = [
    { col: 'brand', type: 'Categorical', unit: '—', role: 'Feature (Input)', desc: 'Electric vehicle manufacturer brand name.' },
    { col: 'model', type: 'Categorical', unit: '—', role: 'Excluded', desc: 'Specific commercial model name. Excluded to eliminate ID-like memorization (35/35 unique).' },
    { col: 'type', type: 'Categorical', unit: '—', role: 'Feature (Input)', desc: 'Body format: Motorcycle, Scooter, Sport Scooter, or Sport Bike.' },
    { col: 'price_pkr', type: 'Numeric', unit: 'PKR', role: 'Target (y)', desc: 'Official market listed price in Pakistani Rupees.' },
    { col: 'range_km', type: 'Numeric', unit: 'km', role: 'Feature (Input)', desc: 'Single-charge driving range under normal conditions.' },
    { col: 'top_speed_kmph', type: 'Numeric', unit: 'km/h', role: 'Feature (Input)', desc: 'Maximum rated speed in kilometres per hour.' },
    { col: 'motor_watts', type: 'Numeric', unit: 'Watts', role: 'Feature (Input)', desc: 'Rated motor output power.' },
    { col: 'battery_type', type: 'Categorical', unit: '—', role: 'Feature (Input)', desc: 'Battery chemical technology (Lithium-Ion, LiFePO4, Graphene, etc.).' },
    { col: 'battery_capacity_ah', type: 'Numeric', unit: 'Ah', role: 'Feature (Input)', desc: 'Electric storage capacity in Ampere-hours.' },
    { col: 'charging_time_hrs', type: 'Numeric', unit: 'Hours', role: 'Feature (Input)', desc: 'Standard 0-100% full recharge duration.' },
    { col: 'warranty_months', type: 'Numeric', unit: 'Months', role: 'Feature (Input)', desc: 'Manufacturer warranty coverage period.' },
    { col: 'curb_weight_kg', type: 'Numeric', unit: 'kg', role: 'Feature (Input)', desc: 'Total vehicle weight including battery.' },
  ];

  readonly summaryStats = [
    { metric: 'Price (PKR)', min: '123,000', median: '270,000', mean: '313,977', max: '900,000' },
    { metric: 'Range (km)', min: '60', median: '90', mean: '110.1', max: '300' },
    { metric: 'Top Speed (km/h)', min: '45', median: '60', mean: '68.7', max: '120' },
    { metric: 'Motor Power (W)', min: '1,000', median: '1,500', mean: '2,205', max: '5,000' },
    { metric: 'Battery (Ah)', min: '20', median: '32', mean: '34.7', max: '60' },
    { metric: 'Charging (hrs)', min: '2.0', median: '4.0', mean: '4.8', max: '8.0' },
    { metric: 'Warranty (mo)', min: '6', median: '24', mean: '28.1', max: '60' },
    { metric: 'Weight (kg)', min: '70', median: '92', mean: '95.6', max: '130' },
  ];

  // All 35 verified records
  readonly dataset: DatasetItem[] = [
    { brand: 'Vlektra', model: 'Retro 1969', type: 'Motorcycle', price_pkr: 619000, range_km: 150, top_speed_kmph: 105, motor_watts: 4000, battery_type: 'Lithium-Ion', battery_capacity_ah: 40, charging_time_hrs: 3.5, warranty_months: 36, curb_weight_kg: 110 },
    { brand: 'Vlektra', model: 'Bolt', type: 'Motorcycle', price_pkr: 549000, range_km: 100, top_speed_kmph: 90, motor_watts: 3000, battery_type: 'Lithium-Ion', battery_capacity_ah: 36, charging_time_hrs: 4.0, warranty_months: 36, curb_weight_kg: 105 },
    { brand: 'Vlektra', model: 'Velocity 180 SE', type: 'Motorcycle', price_pkr: 384000, range_km: 180, top_speed_kmph: 85, motor_watts: 2000, battery_type: 'LiFePO4', battery_capacity_ah: 36, charging_time_hrs: 3.5, warranty_months: 36, curb_weight_kg: 108 },
    { brand: 'Vlektra', model: 'Retro', type: 'Motorcycle', price_pkr: 339000, range_km: 80, top_speed_kmph: 60, motor_watts: 1500, battery_type: 'LiFePO4', battery_capacity_ah: 30, charging_time_hrs: 2.5, warranty_months: 36, curb_weight_kg: 95 },
    { brand: 'Yadea', model: 'Velax H', type: 'Scooter', price_pkr: 439000, range_km: 80, top_speed_kmph: 65, motor_watts: 2000, battery_type: 'LiFePO4', battery_capacity_ah: 36, charging_time_hrs: 4.0, warranty_months: 36, curb_weight_kg: 102 },
    { brand: 'Yadea', model: 'T5', type: 'Scooter', price_pkr: 248500, range_km: 90, top_speed_kmph: 50, motor_watts: 1200, battery_type: 'Graphene TTFAR', battery_capacity_ah: 28, charging_time_hrs: 7.0, warranty_months: 24, curb_weight_kg: 98 },
    { brand: 'Evee', model: 'C1 Air', type: 'Scooter', price_pkr: 308000, range_km: 80, top_speed_kmph: 60, motor_watts: 2000, battery_type: 'Lithium-Ion', battery_capacity_ah: 30, charging_time_hrs: 5.0, warranty_months: 24, curb_weight_kg: 88 },
    { brand: 'Evee', model: 'S1 Pro', type: 'Scooter', price_pkr: 272000, range_km: 90, top_speed_kmph: 60, motor_watts: 2000, battery_type: 'Graphene', battery_capacity_ah: 38, charging_time_hrs: 5.0, warranty_months: 24, curb_weight_kg: 92 },
    { brand: 'Evee', model: 'Gen-Z', type: 'Scooter', price_pkr: 185000, range_km: 75, top_speed_kmph: 55, motor_watts: 1200, battery_type: 'Graphene', battery_capacity_ah: 32, charging_time_hrs: 6.0, warranty_months: 24, curb_weight_kg: 85 },
    { brand: 'Evee', model: 'Nisa', type: 'Scooter', price_pkr: 162000, range_km: 60, top_speed_kmph: 45, motor_watts: 1000, battery_type: 'Graphene', battery_capacity_ah: 20, charging_time_hrs: 7.0, warranty_months: 12, curb_weight_kg: 78 },
    { brand: 'Metro', model: 'Miku Super', type: 'Sport Scooter', price_pkr: 545000, range_km: 120, top_speed_kmph: 85, motor_watts: 3000, battery_type: 'Lithium-Ion', battery_capacity_ah: 40, charging_time_hrs: 4.0, warranty_months: 24, curb_weight_kg: 105 },
    { brand: 'Metro', model: 'E8S Pro', type: 'Scooter', price_pkr: 330000, range_km: 125, top_speed_kmph: 70, motor_watts: 2000, battery_type: 'Graphene TTFAR', battery_capacity_ah: 38, charging_time_hrs: 5.0, warranty_months: 24, curb_weight_kg: 95 },
    { brand: 'Metro', model: 'T9 Pro', type: 'Scooter', price_pkr: 262000, range_km: 105, top_speed_kmph: 50, motor_watts: 1200, battery_type: 'Graphene TTFAR', battery_capacity_ah: 32, charging_time_hrs: 5.0, warranty_months: 24, curb_weight_kg: 90 },
    { brand: 'Metro', model: 'Thrill', type: 'Scooter', price_pkr: 197000, range_km: 80, top_speed_kmph: 50, motor_watts: 1200, battery_type: 'Graphene', battery_capacity_ah: 26, charging_time_hrs: 6.0, warranty_months: 18, curb_weight_kg: 88 },
    { brand: 'MS Jaguar', model: 'E-125', type: 'Motorcycle', price_pkr: 349900, range_km: 150, top_speed_kmph: 80, motor_watts: 2500, battery_type: 'LiFePO4', battery_capacity_ah: 40, charging_time_hrs: 2.5, warranty_months: 60, curb_weight_kg: 98 },
    { brand: 'MS Jaguar', model: 'E-70 Supreme', type: 'Motorcycle', price_pkr: 258900, range_km: 100, top_speed_kmph: 70, motor_watts: 1500, battery_type: 'LiFePO4', battery_capacity_ah: 30, charging_time_hrs: 2.0, warranty_months: 60, curb_weight_kg: 82 },
    { brand: 'MS Jaguar', model: 'M1', type: 'Scooter', price_pkr: 198000, range_km: 100, top_speed_kmph: 60, motor_watts: 1500, battery_type: 'LiFePO4', battery_capacity_ah: 30, charging_time_hrs: 3.0, warranty_months: 36, curb_weight_kg: 80 },
    { brand: 'MS Jaguar', model: 'Miso', type: 'Scooter', price_pkr: 153000, range_km: 60, top_speed_kmph: 45, motor_watts: 1000, battery_type: 'Graphene', battery_capacity_ah: 20, charging_time_hrs: 6.0, warranty_months: 12, curb_weight_kg: 70 },
    { brand: 'Jolta Electric', model: 'JE-100L', type: 'Motorcycle', price_pkr: 239900, range_km: 100, top_speed_kmph: 60, motor_watts: 1500, battery_type: 'Graphene', battery_capacity_ah: 32, charging_time_hrs: 3.0, warranty_months: 20, curb_weight_kg: 90 },
    { brand: 'Jolta Electric', model: 'Storm Pro', type: 'Scooter', price_pkr: 177900, range_km: 80, top_speed_kmph: 55, motor_watts: 1200, battery_type: 'Graphene', battery_capacity_ah: 24, charging_time_hrs: 7.0, warranty_months: 20, curb_weight_kg: 85 },
    { brand: 'Jolta Electric', model: 'JE-70-L', type: 'Motorcycle', price_pkr: 225900, range_km: 80, top_speed_kmph: 55, motor_watts: 1000, battery_type: 'Graphene', battery_capacity_ah: 28, charging_time_hrs: 4.0, warranty_months: 20, curb_weight_kg: 88 },
    { brand: 'Okla', model: 'Ovega EV', type: 'Scooter', price_pkr: 450000, range_km: 215, top_speed_kmph: 120, motor_watts: 4000, battery_type: 'Lithium-Ion', battery_capacity_ah: 50, charging_time_hrs: 4.0, warranty_months: 36, curb_weight_kg: 115 },
    { brand: 'Okla', model: 'Omax', type: 'Scooter', price_pkr: 699000, range_km: 150, top_speed_kmph: 110, motor_watts: 3500, battery_type: 'Lithium-Ion', battery_capacity_ah: 45, charging_time_hrs: 5.0, warranty_months: 24, curb_weight_kg: 112 },
    { brand: 'Crown', model: 'Raftaar', type: 'Scooter', price_pkr: 299000, range_km: 110, top_speed_kmph: 90, motor_watts: 4000, battery_type: 'LiFePO4', battery_capacity_ah: 40, charging_time_hrs: 5.0, warranty_months: 36, curb_weight_kg: 100 },
    { brand: 'Crown', model: 'RoshniX', type: 'Scooter', price_pkr: 270000, range_km: 120, top_speed_kmph: 60, motor_watts: 2200, battery_type: 'LiFePO4', battery_capacity_ah: 40, charging_time_hrs: 5.0, warranty_months: 24, curb_weight_kg: 99 },
    { brand: 'Honda', model: 'Benly e', type: 'Scooter', price_pkr: 900000, range_km: 100, top_speed_kmph: 45, motor_watts: 2800, battery_type: 'Lithium-Ion', battery_capacity_ah: 40, charging_time_hrs: 6.0, warranty_months: 12, curb_weight_kg: 125 },
    { brand: 'Eveon', model: 'Pronto Plus', type: 'Scooter', price_pkr: 182000, range_km: 75, top_speed_kmph: 55, motor_watts: 1200, battery_type: 'Graphene', battery_capacity_ah: 26, charging_time_hrs: 6.0, warranty_months: 18, curb_weight_kg: 85 },
    { brand: 'Eveon', model: 'Leopard Pro', type: 'Scooter', price_pkr: 282000, range_km: 100, top_speed_kmph: 70, motor_watts: 2000, battery_type: 'Lithium-Ion', battery_capacity_ah: 32, charging_time_hrs: 4.0, warranty_months: 24, curb_weight_kg: 92 },
    { brand: 'TailG', model: 'Zippy', type: 'Scooter', price_pkr: 123000, range_km: 65, top_speed_kmph: 45, motor_watts: 1000, battery_type: 'Graphene', battery_capacity_ah: 20, charging_time_hrs: 7.0, warranty_months: 12, curb_weight_kg: 75 },
    { brand: 'Superstar', model: 'Icon', type: 'Scooter', price_pkr: 245000, range_km: 90, top_speed_kmph: 55, motor_watts: 1500, battery_type: 'Graphene', battery_capacity_ah: 30, charging_time_hrs: 6.0, warranty_months: 24, curb_weight_kg: 88 },
    { brand: 'Neon', model: 'M3', type: 'Sport Bike', price_pkr: 128000, range_km: 65, top_speed_kmph: 85, motor_watts: 2000, battery_type: 'Lead Acid', battery_capacity_ah: 28, charging_time_hrs: 8.0, warranty_months: 6, curb_weight_kg: 120 },
    { brand: 'Road Prince', model: 'E-Go', type: 'Motorcycle', price_pkr: 220000, range_km: 90, top_speed_kmph: 70, motor_watts: 1500, battery_type: 'Lithium-Ion', battery_capacity_ah: 24, charging_time_hrs: 6.0, warranty_months: 24, curb_weight_kg: 92 },
    { brand: 'Benza', model: 'Model X', type: 'Scooter', price_pkr: 165000, range_km: 70, top_speed_kmph: 50, motor_watts: 1200, battery_type: 'Graphene', battery_capacity_ah: 26, charging_time_hrs: 6.0, warranty_months: 12, curb_weight_kg: 86 },
    { brand: 'E-Turbo', model: 'Warrior', type: 'Motorcycle', price_pkr: 450000, range_km: 300, top_speed_kmph: 120, motor_watts: 5000, battery_type: 'Lithium-Ion', battery_capacity_ah: 60, charging_time_hrs: 4.0, warranty_months: 24, curb_weight_kg: 130 },
    { brand: 'E-Turbo', model: 'EVO', type: 'Motorcycle', price_pkr: 410000, range_km: 300, top_speed_kmph: 100, motor_watts: 4000, battery_type: 'Lithium-Ion', battery_capacity_ah: 55, charging_time_hrs: 4.0, warranty_months: 24, curb_weight_kg: 125 },
  ];

  get filteredDataset(): DatasetItem[] {
    return this.dataset.filter(item => {
      const matchesType = this.selectedType === 'ALL' || item.type === this.selectedType;
      const q = this.searchQuery.toLowerCase();
      const matchesQuery = !q ||
        item.brand.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.battery_type.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }

  ngOnInit(): void {}
}
