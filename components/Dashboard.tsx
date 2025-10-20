'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import type { OperatorData, StationWithStatus, StationStatus } from '@/types/gbfs';
import StatsOverview from './StatsOverview';
import StationCard from './StationCard';
import OperatorSelector from './OperatorSelector';
import LoadingSpinner from './LoadingSpinner';
import MapWrapper from './MapWrapper';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

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

  // Filter stations by search query
  const filteredStations = useMemo(() => {
    if (!processedData) return [];
    if (!searchQuery) return processedData.stations;

    const query = searchQuery.toLowerCase();
    return processedData.stations.filter(
      (station) =>
        station.name.toLowerCase().includes(query) ||
        station.address?.toLowerCase().includes(query)
    );
  }, [processedData, searchQuery]);

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

  // Calculate map center
  const mapCenter = useMemo((): [number, number] => {
    if (!processedData || processedData.stations.length === 0) {
      return [40.7128, -74.006]; // Default to NYC
    }

    const station = selectedStation
      ? processedData.stations.find((s) => s.station_id === selectedStation)
      : null;

    if (station) {
      return [station.lat, station.lon];
    }

    // Calculate center from all stations
    const avgLat =
      processedData.stations.reduce((sum, s) => sum + s.lat, 0) /
      processedData.stations.length;
    const avgLon =
      processedData.stations.reduce((sum, s) => sum + s.lon, 0) /
      processedData.stations.length;

    return [avgLat, avgLon];
  }, [processedData, selectedStation]);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                🚲 Bike & Scooter Sharing
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Real-time tracking availability from various operators
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Live Data
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Operator Selector */}
        <div className="mb-6">
          <OperatorSelector
            selectedOperator={selectedOperator}
            onOperatorChange={setSelectedOperator}
          />
        </div>

        {/* Current Operators */}
        {processedData && processedData.operators.length > 0 && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Showing data from:
            </h3>
            <div className="flex flex-wrap gap-2">
              {processedData.operators.map((op: any, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full text-sm font-medium"
                >
                  {op.name} ({op.location})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="mb-8">
          <StatsOverview {...stats} />
        </div>

        {/* Map and Stations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="h-[600px]">
              <MapWrapper
                stations={filteredStations}
                freeBikes={processedData?.freeBikes || []}
                center={mapCenter}
                zoom={selectedStation ? 15 : 12}
              />
            </div>
          </div>

          {/* Station List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Stations
                </h2>
                <input
                  type="text"
                  placeholder="Search stations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="overflow-y-auto max-h-[520px] p-4 space-y-3">
                {filteredStations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No stations found
                  </div>
                ) : (
                  filteredStations.slice(0, 50).map((station) => (
                    <StationCard
                      key={station.station_id}
                      station={station}
                      onClick={() => setSelectedStation(station.station_id)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
