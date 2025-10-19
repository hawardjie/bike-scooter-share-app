'use client';

import type { StationWithStatus } from '@/types/gbfs';

interface StationCardProps {
  station: StationWithStatus;
  onClick?: () => void;
}

export default function StationCard({ station, onClick }: StationCardProps) {
  const total = station.availableBikes + station.availableDocks;
  const availability = total > 0 ? (station.availableBikes / total) * 100 : 0;

  const getAvailabilityColor = (percent: number) => {
    if (percent > 50) return 'text-green-600 bg-green-50';
    if (percent > 20) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
          {station.name}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            station.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {station.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {station.address && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">
          {station.address}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className={`p-3 rounded-lg ${getAvailabilityColor(availability)}`}>
          <div className="text-2xl font-bold">{station.availableBikes}</div>
          <div className="text-xs mt-1">Bikes Available</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-3 rounded-lg">
          <div className="text-2xl font-bold">{station.availableDocks}</div>
          <div className="text-xs mt-1">Docks Available</div>
        </div>
      </div>

      {station.capacity && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Capacity</span>
            <span>{station.capacity} total</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(total / station.capacity) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
