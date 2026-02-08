export enum GrowthPhase {
  GERMINATION = "Germinazione",
  VEGETATIVE = "Vegetativa",
  FLOWERING = "Fioritura",
  DRYING = "Secca",
  CURING = "Concia"
}

export enum ActivityType {
  WATERING = "Irrigazione",
  DEFOLIATION = "Defogliazione",
  TOPPING = "Topping",
  LST = "LST",
  FERTILIZATION = "Fertilizzazione",
  OTHER = "Altro"
}

export interface Product {
  id: string;
  name: string;
  type: string;
  npk: string;
  brand: string;
  stockLevel?: number;
}

export interface ProductUsage {
  productId: string;
  mlPerLiter: number;
}

export interface Activity {
  id: string;
  plantId: string;
  type: ActivityType;
  date: string;
  waterLiters?: number;
  drainLiters?: number;
  ecIn?: number;
  ecOut?: number;
  phIn?: number;
  phOut?: number;
  notes: string;
  products: ProductUsage[];
}

export interface Plant {
  id: string;
  name: string;
  strain: string;
  startDate: string;
  photoUrl: string;
  currentPhase: GrowthPhase;
}

export type AppData = {
  plants: Plant[];
  activities: Activity[];
  products: Product[];
}