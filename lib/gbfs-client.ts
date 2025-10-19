import type {
  GBFSResponse,
  GBFSFeeds,
  SystemInformation,
  Station,
  StationStatus,
  FreeBikeStatus,
  VehicleType,
  OperatorData,
} from '@/types/gbfs';

export class GBFSClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetchGBFS<T>(url: string): Promise<GBFSResponse<T> | null> {
    try {
      const response = await fetch(url, {
        next: { revalidate: 30 }, // Cache for 30 seconds
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'BikeScooterShareApp/1.0',
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error instanceof Error ? error.message : error);
      return null;
    }
  }

  async getFeeds(): Promise<GBFSResponse<GBFSFeeds> | null> {
    return this.fetchGBFS<GBFSFeeds>(this.baseUrl);
  }

  async getSystemInformation(feedUrl: string): Promise<GBFSResponse<SystemInformation> | null> {
    return this.fetchGBFS<SystemInformation>(feedUrl);
  }

  async getStations(feedUrl: string): Promise<GBFSResponse<{ stations: Station[] }> | null> {
    return this.fetchGBFS<{ stations: Station[] }>(feedUrl);
  }

  async getStationStatus(feedUrl: string): Promise<GBFSResponse<{ stations: StationStatus[] }> | null> {
    return this.fetchGBFS<{ stations: StationStatus[] }>(feedUrl);
  }

  async getFreeBikeStatus(feedUrl: string): Promise<GBFSResponse<{ bikes: FreeBikeStatus[] }> | null> {
    return this.fetchGBFS<{ bikes: FreeBikeStatus[] }>(feedUrl);
  }

  async getVehicleTypes(feedUrl: string): Promise<GBFSResponse<{ vehicle_types: VehicleType[] }> | null> {
    return this.fetchGBFS<{ vehicle_types: VehicleType[] }>(feedUrl);
  }

  async getAllData(): Promise<OperatorData | null> {
    try {
      // Get the feed list
      const feedsResponse = await this.getFeeds();

      if (!feedsResponse) {
        console.error('[GBFS Client] Failed to fetch feeds');
        return null;
      }

      // GBFS v2.3 uses language-specific feeds (en, fr, es, etc.)
      // Try to get English feeds first, fallback to first available language
      let feeds: any[] | undefined;

      if (feedsResponse.data) {
        // Try English first
        if (feedsResponse.data.en?.feeds) {
          feeds = feedsResponse.data.en.feeds;
        }
        // Fallback to first available language
        else {
          const languages = Object.keys(feedsResponse.data);
          for (const lang of languages) {
            if (feedsResponse.data[lang]?.feeds) {
              feeds = feedsResponse.data[lang].feeds;
              break;
            }
          }
        }
      }

      if (!feeds || !Array.isArray(feeds)) {
        console.error('[GBFS Client] Invalid feeds response structure');
        return null;
      }

      const feedMap = new Map(feeds.map(f => [f.name, f.url]));

      // Fetch all data in parallel
      const [systemInfo, stationsData, statusData, freeBikesData, vehicleTypesData] = await Promise.all([
        feedMap.has('system_information')
          ? this.getSystemInformation(feedMap.get('system_information')!)
          : null,
        feedMap.has('station_information')
          ? this.getStations(feedMap.get('station_information')!)
          : null,
        feedMap.has('station_status')
          ? this.getStationStatus(feedMap.get('station_status')!)
          : null,
        feedMap.has('free_bike_status')
          ? this.getFreeBikeStatus(feedMap.get('free_bike_status')!)
          : null,
        feedMap.has('vehicle_types')
          ? this.getVehicleTypes(feedMap.get('vehicle_types')!)
          : null,
      ]);

      return {
        systemId: systemInfo?.data.system_id || 'unknown',
        name: systemInfo?.data.name || 'Unknown System',
        operator: systemInfo?.data.operator,
        stations: stationsData?.data.stations || [],
        stationStatuses: statusData?.data.stations || [],
        freeBikes: freeBikesData?.data.bikes || [],
        vehicleTypes: vehicleTypesData?.data.vehicle_types || [],
        lastUpdated: Date.now(),
      };
    } catch (error) {
      console.error('Error fetching all GBFS data:', error);
      return null;
    }
  }
}
