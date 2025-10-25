'use client';

import { useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import type { OperatorData, StationWithStatus, StationStatus } from '@/types/gbfs';
import type { ParkingData as GenericParkingData, ParkingFacility } from '@/types/parking';
import StationCard from './StationCard';
import ParkingCard from './ParkingCard';
import LoadingSpinner from './LoadingSpinner';
import MapWrapper from './MapWrapper';
import FilterSidebar, { type FilterOptions } from './FilterSidebar';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const [selectedOperator, setSelectedOperator] = useState<string | null>('citibike-nyc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [parkingEnabled] = useState(
    process.env.NEXT_PUBLIC_ENABLE_PARKING !== 'false'
  );

  // NYC/Data.gov has no time-based pricing; time controls removed

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    showBikeStations: false,
    showFreeBikes: false,
    showParkingSpots: false,
    showActiveOnly: false,
  });

  // Track current map viewport for parking queries
  const [mapViewport, setMapViewport] = useState<{ center: [number, number]; zoom: number } | null>(null);

  // Fetch data with auto-refresh every 30 seconds
  const { data, error, isLoading } = useSWR(
    selectedOperator
      ? `/api/gbfs?operator=${selectedOperator}`
      : '/api/gbfs',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  // Calculate map center for parking API
  const mapCenter = useMemo((): [number, number] => {
    // Default to Lower Manhattan, NYC (Financial District/City Hall area)
    const MANHATTAN_CENTER: [number, number] = [40.7081, -74.0060];

    // If a specific station is selected, center on that station
    if (selectedStation && data?.operators) {
      const station = data.operators
        .flatMap((op: any) => op.data?.stations || [])
        .find((s: any) => s.station_id === selectedStation);

      if (station) {
        return [station.lat, station.lon];
      }
    }

    // If a specific operator is selected, calculate center from that operator's stations
    if (selectedOperator && data?.data) {
      const operatorData: OperatorData = data.data;
      const stations = operatorData.stations || [];

      if (stations.length > 0) {
        const avgLat = stations.reduce((sum: number, s: any) => sum + s.lat, 0) / stations.length;
        const avgLon = stations.reduce((sum: number, s: any) => sum + s.lon, 0) / stations.length;
        return [avgLat, avgLon];
      }
    }

    // Otherwise, always default to Manhattan (don't calculate average of all operators)
    return MANHATTAN_CENTER;
  }, [data, selectedStation, selectedOperator]);

  // Use map viewport center if available, otherwise use calculated mapCenter
  const parkingQueryCenter = mapViewport?.center || mapCenter;

  // Phase 1: Fetch parking data based on current map viewport (fast, for map icons)
  const { data: parkingData, error: parkingError } = useSWR<GenericParkingData>(
    parkingEnabled && filters.showParkingSpots
      ? `/api/parking?lat=${parkingQueryCenter[0]}&lng=${parkingQueryCenter[1]}&distance=1`
      : null,
    fetcher,
    {
      refreshInterval: 300000, // Refresh every 5 minutes (less frequent than GBFS)
      revalidateOnFocus: false,
      shouldRetryOnError: false, // Don't retry on rate limit errors
      dedupingInterval: 10000, // Avoid duplicate requests within 10 seconds
    }
  );

  // Phase 2: Store addresses separately
  const [parkingAddresses, setParkingAddresses] = useState<Record<string, string>>({});
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Phase 2: Fetch addresses for parking facilities (for location cards)
  useEffect(() => {
    async function fetchAddresses() {
      if (!parkingData || !parkingData.facilities || parkingData.facilities.length === 0) {
        return;
      }

      // Only fetch for the first 20 facilities (what we display in cards)
      const facilitiesToGeocode = parkingData.facilities.slice(0, 20);
      const facilityIds = facilitiesToGeocode.map(f => f.id);

      setLoadingAddresses(true);
      try {
        const response = await fetch('/api/parking/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            facilityIds,
            facilities: facilitiesToGeocode,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setParkingAddresses(data.addresses || {});
        }
      } catch (error) {
        console.error('[Dashboard] Error fetching parking addresses:', error);
      } finally {
        setLoadingAddresses(false);
      }
    }

    fetchAddresses();
  }, [parkingData]);

  // Callback when map moves - update parking query
  const handleMapMove = (center: [number, number], zoom: number) => {
    setMapViewport({ center, zoom });
  };

  // Process and combine station data
  const processedData = useMemo(() => {
    if (!data) return null;

    let allStations: StationWithStatus[] = [];
    let allFreeBikes: any[] = [];
    let operators: any[] = [];

    if (selectedOperator && data.data) {
      // Single operator data
      const operatorData: OperatorData = data.data;
      operators = [{ name: data.operator.name, location: data.operator.location }];

      const statusMap = new Map(
        operatorData.stationStatuses.map((s) => [s.station_id, s])
      );

      allStations = operatorData.stations.map((station) => {
        const status = statusMap.get(station.station_id);
        return {
          ...station,
          status,
          availableBikes: status?.num_bikes_available || 0,
          availableDocks: status?.num_docks_available || 0,
          isActive: status?.is_renting && status?.is_returning ? true : false,
        };
      });

      allFreeBikes = operatorData.freeBikes.filter(bike => !bike.is_disabled);
    } else if (data.operators) {
      // Multiple operators
      operators = data.operators.map((op: any) => ({
        name: op.operator.name,
        location: op.operator.location,
      }));

      data.operators.forEach((op: any) => {
        if (!op.data) return;

        const statusMap = new Map<string, StationStatus>(
          op.data.stationStatuses.map((s: any) => [s.station_id, s])
        );

        const stations = op.data.stations.map((station: any) => {
          const status = statusMap.get(station.station_id);
          return {
            ...station,
            status,
            availableBikes: status?.num_bikes_available || 0,
            availableDocks: status?.num_docks_available || 0,
            isActive: status?.is_renting && status?.is_returning ? true : false,
          };
        });

        allStations.push(...stations);
        allFreeBikes.push(...op.data.freeBikes.filter((bike: any) => !bike.is_disabled));
      });
    }

    return {
      stations: allStations,
      freeBikes: allFreeBikes,
      operators,
    };
  }, [data, selectedOperator]);

  // Process parking data - facilities (merge with addresses from phase 2)
  const parkingFacilities = useMemo((): ParkingFacility[] => {
    if (!parkingData || !parkingData.facilities) return [];

    // Merge addresses from phase 2 into facilities
    return parkingData.facilities.map(facility => {
      const address = parkingAddresses[facility.id];
      if (address) {
        return { ...facility, address };
      }
      return facility;
    });
  }, [parkingData, parkingAddresses]);

  // Filter stations, free bikes, and parking by search query and user preferences
  const filteredStations = useMemo(() => {
    if (!processedData) return [];

    let stations = processedData.stations;

    // Apply filter preferences
    if (!filters.showBikeStations) return [];
    if (filters.showActiveOnly) {
      stations = stations.filter((s) => s.isActive);
    }

    // Apply search query
    if (!searchQuery) return stations;

    const query = searchQuery.toLowerCase();
    return stations.filter(
      (station) =>
        station.name.toLowerCase().includes(query) ||
        station.address?.toLowerCase().includes(query)
    );
  }, [processedData, searchQuery, filters.showBikeStations, filters.showActiveOnly]);

  const filteredFreeBikes = useMemo(() => {
    if (!processedData || !filters.showFreeBikes) return [];
    return processedData.freeBikes;
  }, [processedData, filters.showFreeBikes]);

  const filteredParking = useMemo(() => {
    if (!parkingFacilities || !filters.showParkingSpots) return [];
    if (!searchQuery) return parkingFacilities;

    const query = searchQuery.toLowerCase();
    return parkingFacilities.filter(
      (facility) =>
        facility.name.toLowerCase().includes(query) ||
        (facility.address || '').toLowerCase().includes(query) ||
        (facility.city || '').toLowerCase().includes(query)
    );
  }, [parkingFacilities, searchQuery, filters.showParkingSpots]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!processedData) {
      return {
        totalStations: 0,
        totalBikes: 0,
        totalDocks: 0,
        activeStations: 0,
        freeBikes: 0,
      };
    }

    return {
      totalStations: processedData.stations.length,
      totalBikes: processedData.stations.reduce((sum, s) => sum + s.availableBikes, 0),
      totalDocks: processedData.stations.reduce((sum, s) => sum + s.availableDocks, 0),
      activeStations: processedData.stations.filter((s) => s.isActive).length,
      freeBikes: processedData.freeBikes.length,
    };
  }, [processedData]);


  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Failed to fetch bike share data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <FilterSidebar
        filters={filters}
        onFiltersChange={setFilters}
        parkingEnabled={parkingEnabled}
        parkingAvailable={parkingFacilities.length}
        stats={stats}
        operators={processedData?.operators}
        selectedOperator={selectedOperator}
        onOperatorChange={setSelectedOperator}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2" style={{ color: 'rgb(52, 211, 153)' }}>
                      <img src="/images/logo.png" alt="Sharing.Guru Logo" className="h-8 lg:h-10 w-auto" />
                      Sharing.Guru
                    </h1>
                  </div>
                  {/* Search Box - Desktop (hidden on mobile) */}
                  <input
                    type="text"
                    placeholder="Search locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="hidden md:block flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm mt-1"
                  />
                </div>
                {/* Search Box - Mobile (shown below title on narrow screens) */}
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="md:hidden w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm mt-2"
                />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                  Live Data
                </span>
              </div>
            </div>
            {/* NYC/Data.gov parking has no time-based pricing; controls removed */}
          </div>
        </header>

      {/* Global Error Notifications */}
      {parkingError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-red-600 dark:text-red-400 text-xl">❌</span>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 dark:text-red-200">
                  Parking Data Error
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Unable to load parking information. The app will continue to show bike and scooter data.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info note */}
      {!parkingError && parkingData?.fallbackNote && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-700 dark:text-blue-300 text-xl">ℹ️</span>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                  Parking Info
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  {parkingData.fallbackNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-auto">
          {/* Map */}
          <div className="mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="h-[600px]">
                <MapWrapper
                  stations={filters.showBikeStations ? filteredStations : []}
                  freeBikes={filteredFreeBikes}
                  parkingFacilities={filteredParking}
                  center={mapCenter}
                  zoom={selectedStation ? 15 : 12}
                  onMapMove={handleMapMove}
                />
              </div>
            </div>
          </div>

          {/* Station and Parking List - Only show if there are results */}
          {((filters.showBikeStations && filteredStations.length > 0) ||
            (filters.showParkingSpots && filteredParking.length > 0)) && (
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Locations
                  </h2>

                  {/* No rate limit warnings for NYC/Data.gov */}

                  {/* Info: No parking data in area */}
                  {parkingEnabled && filters.showParkingSpots &&
                   parkingData && parkingData.facilities?.length === 0 &&
                   !parkingData.error && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 text-lg">ℹ️</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                            No Parking Data Available
                          </p>
                          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                            No parking locations found in this area.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {/* Bike/Scooter Stations */}
                    {filters.showBikeStations && filteredStations.length > 0 && (
                      <>
                        <div className="col-span-full flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                          <span>🚲</span>
                          <span>Bike & Scooter Stations ({filteredStations.length})</span>
                        </div>
                        {filteredStations.slice(0, 20).map((station) => (
                          <StationCard
                            key={station.station_id}
                            station={station}
                            onClick={() => setSelectedStation(station.station_id)}
                          />
                        ))}
                      </>
                    )}

                    {/* Parking Facilities */}
                    {filters.showParkingSpots && filteredParking.length > 0 && (
                      <>
                        <div className="col-span-full flex items-center gap-2 text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2 mt-4">
                          <span>🅿️</span>
                          <span>Parking Facilities ({filteredParking.length})</span>
                        </div>
                        {filteredParking.slice(0, 20).map((facility) => (
                          <ParkingCard
                            key={facility.id}
                            facility={facility}
                            onClick={() => {
                              // Could add selection logic here
                            }}
                          />
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
