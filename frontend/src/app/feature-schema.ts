export type FeatureGroup = 'vehicle' | 'performance' | 'battery' | 'additional';

export interface Feature {
  name: string;
  label: string;
  kind: 'number' | 'category';
  group: FeatureGroup;
  groupLabel: string;
  required: boolean;
  unit?: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: string | number;
  description?: string;
}

export const FEATURES: Feature[] = [
  // 1. Vehicle Details
  {
    name: 'brand',
    label: 'Brand / Manufacturer',
    kind: 'category',
    group: 'vehicle',
    groupLabel: 'Vehicle Details',
    required: true,
    defaultValue: 'Vlektra',
    options: [
      'Vlektra',
      'Yadea',
      'Evee',
      'Metro',
      'MS Jaguar',
      'Jolta Electric',
      'Okla',
      'Crown',
      'Honda',
      'Eveon',
      'TailG',
      'Superstar',
      'Neon',
      'Road Prince',
      'Benza',
      'E-Turbo',
      'Other'
    ],
    description: 'Electric two-wheeler manufacturer brand.'
  },
  {
    name: 'type',
    label: 'Vehicle Type',
    kind: 'category',
    group: 'vehicle',
    groupLabel: 'Vehicle Details',
    required: true,
    defaultValue: 'Motorcycle',
    options: ['Motorcycle', 'Scooter', 'Sport Scooter', 'Sport Bike'],
    description: 'Body styling category (e.g. commuter scooter or motorcycle).'
  },

  // 2. Performance Specifications
  {
    name: 'range_km',
    label: 'Driving Range',
    kind: 'number',
    group: 'performance',
    groupLabel: 'Performance Specifications',
    required: true,
    unit: 'km',
    min: 10,
    max: 500,
    step: 5,
    defaultValue: 150,
    description: 'Maximum travel distance per full battery charge.'
  },
  {
    name: 'top_speed_kmph',
    label: 'Top Speed',
    kind: 'number',
    group: 'performance',
    groupLabel: 'Performance Specifications',
    required: true,
    unit: 'km/h',
    min: 10,
    max: 200,
    step: 5,
    defaultValue: 105,
    description: 'Maximum manufacturer rated speed in kilometres per hour.'
  },
  {
    name: 'motor_watts',
    label: 'Motor Power',
    kind: 'number',
    group: 'performance',
    groupLabel: 'Performance Specifications',
    required: true,
    unit: 'Watts (W)',
    min: 250,
    max: 20000,
    step: 100,
    defaultValue: 4000,
    description: 'Continuous rated power of electric hub or mid-drive motor.'
  },

  // 3. Battery Specifications
  {
    name: 'battery_type',
    label: 'Battery Chemistry',
    kind: 'category',
    group: 'battery',
    groupLabel: 'Battery Specifications',
    required: true,
    defaultValue: 'Lithium-Ion',
    options: ['Lithium-Ion', 'LiFePO4', 'Graphene', 'Graphene TTFAR', 'Lead Acid'],
    description: 'Chemical composition of energy storage cells.'
  },
  {
    name: 'battery_capacity_ah',
    label: 'Battery Capacity',
    kind: 'number',
    group: 'battery',
    groupLabel: 'Battery Specifications',
    required: true,
    unit: 'Ampere-hours (Ah)',
    min: 5,
    max: 150,
    step: 1,
    defaultValue: 40,
    description: 'Rated energy charge capacity in ampere-hours.'
  },
  {
    name: 'charging_time_hrs',
    label: 'Charging Time',
    kind: 'number',
    group: 'battery',
    groupLabel: 'Battery Specifications',
    required: true,
    unit: 'Hours',
    min: 0.5,
    max: 20,
    step: 0.5,
    defaultValue: 3.5,
    description: 'Time required to recharge battery from 0% to 100%.'
  },

  // 4. Additional Specifications
  {
    name: 'warranty_months',
    label: 'Warranty Period',
    kind: 'number',
    group: 'additional',
    groupLabel: 'Additional Specifications',
    required: true,
    unit: 'Months',
    min: 0,
    max: 120,
    step: 6,
    defaultValue: 36,
    description: 'Manufacturer warranty coverage duration in months.'
  },
  {
    name: 'curb_weight_kg',
    label: 'Curb Weight',
    kind: 'number',
    group: 'additional',
    groupLabel: 'Additional Specifications',
    required: true,
    unit: 'Kilograms (kg)',
    min: 30,
    max: 300,
    step: 1,
    defaultValue: 110,
    description: 'Total weight of vehicle including battery and fluids.'
  }
];

export const VALID_EXAMPLE_INPUT: Record<string, string | number> = {
  brand: 'Vlektra',
  type: 'Motorcycle',
  range_km: 150,
  top_speed_kmph: 105,
  motor_watts: 4000,
  battery_type: 'Lithium-Ion',
  battery_capacity_ah: 40,
  charging_time_hrs: 3.5,
  warranty_months: 36,
  curb_weight_kg: 110
};
