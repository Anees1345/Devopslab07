export interface EvPredictionPayload {
  brand: string;
  type: string;
  range_km: number;
  top_speed_kmph: number;
  motor_watts: number;
  battery_type: string;
  battery_capacity_ah: number;
  charging_time_hrs: number;
  warranty_months: number;
  curb_weight_kg: number;
  [key: string]: string | number;
}

export interface PredictionResponse {
  prediction: number;
  currency: string;
  task: string;
  model: string;
  disclaimer: string;
  error?: string;
  detail?: string;
}

export interface HealthResponse {
  status: string;
  model: string;
  task: string;
  features: number;
  error?: string;
}

export interface ModelInfoResponse {
  application: string;
  prototype: boolean;
  currency: string;
  task: string;
  model: string;
  features: string[];
  feature_count: number;
  disclaimer: string;
}

export interface DatasetItem {
  brand: string;
  model: string;
  type: string;
  price_pkr: number;
  range_km: number;
  top_speed_kmph: number;
  motor_watts: number;
  battery_type: string;
  battery_capacity_ah: number;
  charging_time_hrs: number;
  warranty_months: number;
  curb_weight_kg: number;
}
