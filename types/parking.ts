// Generic Parking Types for NYC Open Data / Data.gov sources

export type ParkingSource = 'nyc_open_data' | 'data_gov' | 'other';

export interface ParkingFacility {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  lat: number;
  lng: number;
  distanceMiles?: number;
  type?: 'garage' | 'lot' | 'meter' | 'park_and_ride' | 'unknown';
  capacity?: number;
  operator?: string;
  hours?: string;
  rates?: string; // free-form text if provided by dataset
  source?: ParkingSource;
  sourceId?: string; // original dataset identifier
}

export interface ParkingData {
  facilities: ParkingFacility[];
  lastUpdated: number;
  error?: string;
  fallbackNote?: string;
  sourcesUsed?: ParkingSource[];
}


