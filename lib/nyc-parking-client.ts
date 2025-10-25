import type { ParkingData, ParkingFacility, ParkingSource } from '@/types/parking';

/**
 * NYC Open Data & Data.gov Parking Client
 *
 * Data Sources:
 * 1. NYC Off-Street Parking (7cgt-uhhz) - Off-street parking facilities in NYC
 *    Uses SODA 2.x API with geospatial filtering to reduce data transfer
 *
 * All datasets are public and require no API keys
 *
 * Note: The dataset is ~13.8MB, so we use server-side geospatial filtering
 * with SODA 2.x $where clause to fetch only nearby facilities
 */

const NYC_OPEN_DATA_BASE = 'https://data.cityofnewyork.us/resource';

// Real NYC Open Data dataset IDs
const NYC_DATASETS = {
  // Off-Street Parking dataset - https://data.cityofnewyork.us/resource/7cgt-uhhz
  // This dataset contains NYC parking facilities with location data
  PARKING_LOTS: '7cgt-uhhz',
};

// Helper: Haversine distance in miles
function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 3958.8; // miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper: Calculate centroid of a polygon
function calculateCentroid(coordinates: number[][]): { lat: number; lng: number } {
  let sumLat = 0;
  let sumLng = 0;
  const count = coordinates.length;

  for (const [lng, lat] of coordinates) {
    sumLng += lng;
    sumLat += lat;
  }

  return {
    lat: sumLat / count,
    lng: sumLng / count,
  };
}

// Helper: Reverse geocode coordinates to get address using Nominatim (OpenStreetMap)
async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    // Use Nominatim (OpenStreetMap) reverse geocoding - free and no API key required
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'BikeScooterShareApp/1.0', // Required by Nominatim
        },
        cache: 'force-cache', // Cache aggressively since addresses don't change
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Build address from components
    const address = data.address;
    if (!address) return null;

    // Construct street address
    const parts: string[] = [];
    if (address.house_number) parts.push(address.house_number);
    if (address.road) parts.push(address.road);

    return parts.length > 0 ? parts.join(' ') : null;
  } catch (error) {
    console.error('[NYC Parking] Reverse geocoding error:', error);
    return null;
  }
}

// Helper: Extract coordinates from NYC Open Data geolocation field
function extractCoords(row: any): { lat: number; lng: number } | null {
  try {
    // Try the_geom field (GeoJSON)
    if (row.the_geom?.coordinates) {
      const geom = row.the_geom;

      // Handle Point geometry
      if (geom.type === 'Point') {
        return {
          lng: Number(geom.coordinates[0]),
          lat: Number(geom.coordinates[1]),
        };
      }

      // Handle MultiPolygon geometry (parking lot boundaries)
      // Structure: MultiPolygon -> [polygon][ring][point]
      if (geom.type === 'MultiPolygon' && geom.coordinates.length > 0) {
        const firstPolygon = geom.coordinates[0]; // First polygon
        if (firstPolygon && firstPolygon.length > 0) {
          const outerRing = firstPolygon[0]; // Outer ring
          if (outerRing && outerRing.length > 0) {
            // Calculate centroid of the outer ring
            return calculateCentroid(outerRing);
          }
        }
      }

      // Handle Polygon geometry
      if (geom.type === 'Polygon' && geom.coordinates.length > 0) {
        const outerRing = geom.coordinates[0]; // Outer ring
        if (outerRing && outerRing.length > 0) {
          return calculateCentroid(outerRing);
        }
      }
    }

    // Try latitude/longitude fields
    if (row.latitude && row.longitude) {
      return {
        lat: Number(row.latitude),
        lng: Number(row.longitude),
      };
    }

    // Try lat/lon fields
    if (row.lat && row.lon) {
      return {
        lat: Number(row.lat),
        lng: Number(row.lon),
      };
    }

    return null;
  } catch (error) {
    console.error('[NYC Parking] Error extracting coordinates:', error, row.the_geom?.type);
    return null;
  }
}

export class NYCParkingClient {
  /**
   * Fetch NYC Parking Lots dataset with geospatial filtering
   * Dataset: Real-time tracking availability - Off-street parking lots in NYC
   * Uses SODA 2.x $where clause for server-side filtering to reduce data size
   */
  async fetchNYCParkingLots(lat?: number, lng?: number, radiusMiles?: number): Promise<ParkingFacility[]> {
    try {
      // Build URL with optional geospatial filtering
      let url = `${NYC_OPEN_DATA_BASE}/${NYC_DATASETS.PARKING_LOTS}.json?$limit=1000`;

      // Add geospatial filter if coordinates provided
      // SODA 2.x uses within_circle for geospatial queries
      // Format: within_circle(location_column, latitude, longitude, radius_in_meters)
      if (lat !== undefined && lng !== undefined && radiusMiles !== undefined) {
        const radiusMeters = radiusMiles * 1609.34; // Convert miles to meters
        // Use geospatial function with the_geom field
        const whereClause = `within_circle(the_geom, ${lat}, ${lng}, ${radiusMeters})`;
        url += `&$where=${encodeURIComponent(whereClause)}`;
        console.log(`[NYC Parking] Using geospatial filter: ${radiusMiles} miles from (${lat}, ${lng})`);
      }

      console.log('[NYC Parking] Fetching parking lots from NYC Open Data...');
      console.log('[NYC Parking] URL:', url);

      const res = await fetch(url, {
        // Use cache: 'no-store' to avoid Next.js 2MB cache limit (dataset is 13.8MB)
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        console.error(`[NYC Parking] Failed to fetch parking lots: ${res.status}`);
        return [];
      }

      const data = await res.json();
      console.log(`[NYC Parking] Received ${data.length} parking lot records`);

      const facilities = (data as any[]).map((row, idx) => {
        const coords = extractCoords(row);
        if (!coords) return null;

        // This dataset has minimal metadata, just geometry
        // Available fields: source_id, feat_code, sub_code, status, shape_area, shape_leng

        // Estimate capacity based on area (rough estimate: 1 space per 300 sq ft)
        const areaNum = Number(row.shape_area);
        const estimatedCapacity = areaNum && !isNaN(areaNum) ? Math.floor(areaNum / 300) : undefined;

        // Create unique ID by combining source_id with index (source_id has duplicates)
        const uniqueId = `nyc-${row.source_id || 'unknown'}-${idx}`;

        return {
          id: uniqueId,
          name: 'Parking Lot',
          city: 'New York',
          state: 'NY',
          lat: coords.lat,
          lng: coords.lng,
          type: 'lot' as const,
          capacity: estimatedCapacity && estimatedCapacity > 0 ? estimatedCapacity : undefined,
          operator: 'NYC',
          source: 'nyc_open_data' as const,
          sourceId: String(row.source_id),
        } as ParkingFacility;
      }).filter((f): f is ParkingFacility =>
        f !== null && Number.isFinite(f.lat) && Number.isFinite(f.lng)
      );

      console.log(`[NYC Parking] Parsed ${facilities.length} valid parking facilities`);
      return facilities;
    } catch (error) {
      console.error('[NYC Parking] Error fetching parking lots:', error);
      return [];
    }
  }

  /**
   * Check if coordinates are approximately in NYC area
   */
  private isInNYCArea(lat: number, lng: number): boolean {
    // NYC bounding box (approximate)
    // Latitude: 40.4774 to 40.9176 (covers all 5 boroughs)
    // Longitude: -74.2591 to -73.7004
    return lat >= 40.4 && lat <= 41.0 && lng >= -74.3 && lng <= -73.7;
  }

  /**
   * Get parking data near a location
   * Aggregates data from multiple NYC Open Data sources
   */
  async getParkingData(lat: number, lng: number, distanceMiles: number = 1.0): Promise<ParkingData> {
    const allFacilities: ParkingFacility[] = [];
    const sourcesUsed: ParkingSource[] = [];

    // Check if location is in NYC area
    const inNYC = this.isInNYCArea(lat, lng);
    if (!inNYC) {
      console.warn(`[NYC Parking] Location (${lat}, ${lng}) is outside NYC area. NYC parking data only covers New York City.`);
      console.warn(`[NYC Parking] NYC is approximately at (40.7128, -74.006). Your location is at (${lat.toFixed(4)}, ${lng.toFixed(4)})`);

      return {
        facilities: [],
        lastUpdated: Date.now(),
        sourcesUsed: [],
        fallbackNote: `Location is outside New York City area. This dataset only covers NYC parking facilities. NYC is located at approximately 40.71°N, 74.01°W. Your current map location (${lat.toFixed(2)}°N, ${Math.abs(lng).toFixed(2)}°W) is outside the coverage area. Please move the map to New York City to see parking data.`,
      };
    }

    try {
      // Use 2x radius for server-side filtering to ensure we get results
      // Then refine client-side for exact distance
      const serverSearchRadius = Math.max(distanceMiles * 2, 2); // At least 2 miles server-side

      // Fetch from NYC Parking Lots dataset with geospatial filtering
      const parkingLots = await this.fetchNYCParkingLots(lat, lng, serverSearchRadius);
      console.log(`[NYC Parking] Received ${parkingLots.length} parking lot records from server`);

      if (parkingLots.length > 0) {
        allFacilities.push(...parkingLots);
        sourcesUsed.push('nyc_open_data');
      }
    } catch (error) {
      console.error('[NYC Parking] Error in getParkingData:', error);

      // Fallback: try without geospatial filter if it fails
      try {
        console.log('[NYC Parking] Retrying without geospatial filter (may be slow)...');
        const parkingLots = await this.fetchNYCParkingLots();
        console.log(`[NYC Parking] Fallback: Received ${parkingLots.length} parking lot records`);

        if (parkingLots.length > 0) {
          allFacilities.push(...parkingLots);
          sourcesUsed.push('nyc_open_data');
        }
      } catch (fallbackError) {
        console.error('[NYC Parking] Fallback also failed:', fallbackError);
      }
    }

    // Calculate distance for all facilities
    const facilitiesWithDistance = allFacilities.map((f) => ({
      ...f,
      distanceMiles: haversineMiles(lat, lng, f.lat, f.lng),
    }));

    // Sort by distance first
    facilitiesWithDistance.sort((a, b) => (a.distanceMiles ?? Infinity) - (b.distanceMiles ?? Infinity));

    // Filter by requested distance and limit to 50
    const facilitiesWithin = facilitiesWithDistance
      .filter((f) => (f.distanceMiles ?? Infinity) <= distanceMiles)
      .slice(0, 50);

    console.log(`[NYC Parking] Found ${facilitiesWithin.length} facilities within ${distanceMiles} miles`);

    // Phase 1: Return facilities immediately without geocoding (for fast map display)
    if (facilitiesWithin.length === 0 && facilitiesWithDistance.length > 0) {
      const closest = facilitiesWithDistance[0];
      console.log(`[NYC Parking] Note: Closest facility is ${closest.distanceMiles?.toFixed(2)} miles away at ${closest.name}`);
    }

    return {
      facilities: facilitiesWithin,
      lastUpdated: Date.now(),
      sourcesUsed,
      fallbackNote: facilitiesWithin.length === 0
        ? 'No parking facilities found nearby. This data covers NYC area. Try moving the map to New York City or increasing the search radius.'
        : undefined,
    };
  }

  /**
   * Phase 2: Get addresses for specific facilities
   * This is called separately to populate location cards without blocking map display
   */
  async getAddressesForFacilities(facilityIds: string[], facilities: ParkingFacility[]): Promise<Map<string, string>> {
    console.log(`[NYC Parking] Fetching addresses for ${facilityIds.length} facilities...`);
    const addressMap = new Map<string, string>();

    // Limit to first 20 to avoid long delays
    const idsToGeocode = facilityIds.slice(0, 20);

    // Process in parallel with Promise.allSettled to handle failures gracefully
    const geocodeResults = await Promise.allSettled(
      idsToGeocode.map(async (id) => {
        const facility = facilities.find(f => f.id === id);
        if (!facility) return { id, address: null };

        try {
          const address = await reverseGeocode(facility.lat, facility.lng);
          return { id, address };
        } catch (error) {
          console.error('[NYC Parking] Geocoding failed for facility:', id);
          return { id, address: null };
        }
      })
    );

    // Build address map
    geocodeResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.address) {
        addressMap.set(result.value.id, result.value.address);
      }
    });

    console.log(`[NYC Parking] Successfully geocoded ${addressMap.size} addresses`);
    return addressMap;
  }
}

let singleton: NYCParkingClient | null = null;
export function getNYCParkingClient(): NYCParkingClient {
  if (!singleton) singleton = new NYCParkingClient();
  return singleton;
}


