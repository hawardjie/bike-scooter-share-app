// GBFS Type Definitions
// Based on GBFS v3.0 specification

export interface GBFSResponse<T> {
  last_updated: number;
  ttl: number;
  version: string;
  data: T;
}

export interface GBFSFeed {
  name: string;
  url: string;
}

export interface GBFSFeeds {
  feeds: GBFSFeed[];
}

export interface SystemInformation {
  system_id: string;
  language: string;
  name: string;
  short_name?: string;
  operator?: string;
  url?: string;
  purchase_url?: string;
  start_date?: string;
  phone_number?: string;
  email?: string;
  timezone: string;
  license_url?: string;
}

export interface Station {
  station_id: string;
  name: string;
  short_name?: string;
  lat: number;
  lon: number;
  address?: string;
  cross_street?: string;
  region_id?: string;
  post_code?: string;
  rental_methods?: string[];
  is_virtual_station?: boolean;
  station_area?: {
    type: string;
    coordinates: number[][][];
  };
  capacity?: number;
  vehicle_capacity?: {
    [key: string]: number;
  };
}

export interface StationStatus {
  station_id: string;
  num_bikes_available: number;
  num_bikes_disabled?: number;
  num_docks_available?: number;
  num_docks_disabled?: number;
  is_installed: boolean;
  is_renting: boolean;
  is_returning: boolean;
  last_reported: number;
  vehicle_types_available?: VehicleTypeAvailability[];
  vehicle_docks_available?: VehicleDockAvailability[];
}

export interface VehicleTypeAvailability {
  vehicle_type_id: string;
  count: number;
}

export interface VehicleDockAvailability {
  vehicle_type_ids: string[];
  count: number;
}

export interface VehicleType {
  vehicle_type_id: string;
  form_factor: 'bicycle' | 'cargo_bicycle' | 'car' | 'moped' | 'scooter' | 'scooter_standing' | 'scooter_seated' | 'other';
  propulsion_type: 'human' | 'electric_assist' | 'electric' | 'combustion' | 'combustion_diesel' | 'hybrid' | 'plug_in_hybrid' | 'hydrogen_fuel_cell';
  max_range_meters?: number;
  name?: string;
  vehicle_accessories?: string[];
  default_reserve_time?: number;
  return_constraint?: 'free_floating' | 'roundtrip_station' | 'any_station' | 'hybrid';
  vehicle_image?: string;
  default_pricing_plan_id?: string;
  pricing_plan_ids?: string[];
}

export interface FreeBikeStatus {
  bike_id: string;
  lat: number;
  lon: number;
  is_reserved: boolean;
  is_disabled: boolean;
  rental_uris?: {
    android?: string;
    ios?: string;
    web?: string;
  };
  vehicle_type_id?: string;
  last_reported?: number;
  current_range_meters?: number;
  current_fuel_percent?: number;
  station_id?: string;
  home_station_id?: string;
  pricing_plan_id?: string;
  vehicle_equipment?: string[];
  available_until?: number;
}

export interface SystemRegion {
  region_id: string;
  name: string;
}

// Combined data for our app
export interface OperatorData {
  systemId: string;
  name: string;
  operator?: string;
  stations: Station[];
  stationStatuses: StationStatus[];
  freeBikes: FreeBikeStatus[];
  vehicleTypes: VehicleType[];
  lastUpdated: number;
}

export interface StationWithStatus extends Station {
  status?: StationStatus;
  availableBikes: number;
  availableDocks: number;
  isActive: boolean;
}
