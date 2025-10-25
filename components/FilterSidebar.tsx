'use client';

import { useState, useEffect } from 'react';

interface FilterOptions {
  showBikeStations: boolean;
  showFreeBikes: boolean;
  showParkingSpots: boolean;
  showActiveOnly: boolean;
}

interface Operator {
  id: string;
  name: string;
  location: string;
}

interface FilterSidebarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  parkingEnabled: boolean;
  parkingAvailable: number;
  stats: {
    totalStations: number;
    totalBikes: number;
    totalDocks: number;
    activeStations: number;
    freeBikes: number;
  };
  operators?: Array<{ name: string; location: string }>;
  selectedOperator: string | null;
  onOperatorChange: (operatorId: string | null) => void;
}

export default function FilterSidebar({
  filters,
  onFiltersChange,
  parkingEnabled,
  parkingAvailable,
  stats,
  operators,
  selectedOperator,
  onOperatorChange,
}: FilterSidebarProps) {
  // Start collapsed on mobile, expanded on desktop
  const [isExpanded, setIsExpanded] = useState(false);
  const [availableOperators, setAvailableOperators] = useState<Operator[]>([]);
  const [loadingOperators, setLoadingOperators] = useState(true);

  // Auto-expand on desktop on initial load
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    };

    // Set initial state
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchOperators() {
      try {
        const response = await fetch('/api/gbfs/operators');
        const data = await response.json();
        setAvailableOperators(data.operators);
      } catch (error) {
        console.error('Error fetching operators:', error);
      } finally {
        setLoadingOperators(false);
      }
    }

    fetchOperators();
  }, []);

  const handleToggle = (key: keyof FilterOptions) => {
    onFiltersChange({
      ...filters,
      [key]: !filters[key],
    });
  };

  return (
    <>
      {/* Mobile Toggle Button - Only show when collapsed */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="lg:hidden fixed top-20 left-4 z-50 bg-blue-600 hover:bg-blue-700 p-3 rounded-lg shadow-lg border border-blue-700"
          aria-label="Open filters"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white dark:bg-gray-800
          border-r border-gray-200 dark:border-gray-700 z-50
          transition-all duration-300 ease-in-out shadow-xl lg:shadow-none
          overflow-y-auto
          ${isExpanded ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-80 lg:w-80
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            Filters
          </h2>
          <button
            onClick={() => setIsExpanded(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close filters"
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-4">
          <div className="space-y-6">
            {/* Parking Section */}
            {parkingEnabled && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="text-lg">🅿️</span>
                  Car Parking
                </h3>
                <div className="space-y-3 ml-7">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.showParkingSpots}
                      onChange={() => handleToggle('showParkingSpots')}
                      className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      Show Parking Locations
                    </span>
                  </label>

                  {filters.showParkingSpots && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-8">
                      {parkingAvailable
                        ? `Showing ${parkingAvailable} parking location${parkingAvailable !== 1 ? 's' : ''}`
                        : 'Searching for parking locations...'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700"></div>

            {/* Bike & Scooter Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span className="text-lg">🚲</span>
                Bike & Scooter Sharing
              </h3>

              {/* Operator Selector */}
              <div className="mb-4 ml-7">
                {loadingOperators ? (
                  <div className="animate-pulse">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="operator-select-sidebar"
                      className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5"
                    >
                      Select Operator
                    </label>
                    <select
                      id="operator-select-sidebar"
                      value={selectedOperator || ''}
                      onChange={(e) => onOperatorChange(e.target.value || null)}
                      className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {availableOperators.map((operator) => (
                        <option key={operator.id} value={operator.id}>
                          {operator.name} - {operator.location}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Select an operator to view detailed data
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3 ml-7">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.showBikeStations}
                    onChange={() => handleToggle('showBikeStations')}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Show Stations
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.showFreeBikes}
                    onChange={() => handleToggle('showFreeBikes')}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Show Free Bikes/Scooters
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.showActiveOnly}
                    onChange={() => handleToggle('showActiveOnly')}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Active Stations Only
                  </span>
                </label>
              </div>
            </div>

            {/* Stats Section - Only show if bike/scooter data is displayed */}
            {(filters.showBikeStations || filters.showFreeBikes || filters.showActiveOnly) && (
              <>
                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700"></div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <span className="text-lg">📊</span>
                    Bike & Scooter Statistics
                  </h3>

                  {/* Showing data from */}
                  {operators && operators.length > 0 && (
                    <div className="mb-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Showing data from:
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {operators.map((op: any, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full text-xs font-medium"
                          >
                            {op.name} ({op.location})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {/* Total Stations */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🚉</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">Total Stations</span>
                        </div>
                        <span className="text-lg font-bold text-purple-700 dark:text-purple-300">{stats.totalStations.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Active Stations */}
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">✅</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">Active Stations</span>
                        </div>
                        <span className="text-lg font-bold text-green-700 dark:text-green-300">{stats.activeStations.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Available Bikes */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🚲</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">Available Bikes</span>
                        </div>
                        <span className="text-lg font-bold text-blue-700 dark:text-blue-300">{stats.totalBikes.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Available Docks */}
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🅿️</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">Available Docks</span>
                        </div>
                        <span className="text-lg font-bold text-orange-700 dark:text-orange-300">{stats.totalDocks.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Free Vehicles */}
                    <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-3 border border-pink-200 dark:border-pink-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🛴</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">Free Vehicles</span>
                        </div>
                        <span className="text-lg font-bold text-pink-700 dark:text-pink-300">{stats.freeBikes.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Parking info note */}
            {parkingEnabled && filters.showParkingSpots && parkingAvailable === 0 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  ℹ️ Parking facilities are sourced from NYC Open Data/Data.gov. Try zooming or moving the map.
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isExpanded && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
}

export type { FilterOptions };
