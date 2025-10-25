'use client';

import type { ParkingFacility } from '@/types/parking';

interface ParkingCardProps {
  facility: ParkingFacility;
  onClick?: () => void;
}

export default function ParkingCard({ facility, onClick }: ParkingCardProps) {

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`}>★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half">⯨</span>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="opacity-30">★</span>);
    }
    return stars;
  };

  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg shadow-md p-4 hover:shadow-lg transition-all cursor-pointer border-2 border-purple-200 dark:border-purple-700 relative overflow-hidden"
    >
      {/* Parking Badge */}
      <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
        <span>🅿️</span>
        <span>Parking</span>
      </div>

      <div className="mb-3 pr-20">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
          {facility.name}
        </h3>
      </div>

      {facility.address && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {facility.address}{facility.city ? `, ${facility.city}` : ''}{facility.state ? `, ${facility.state}` : ''} {facility.zip || ''}
        </p>
      )}

      {/* Rating */}
      {/* Ratings not available for generic datasets */}

      {/* Distance */}
      {facility.distanceMiles !== undefined && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          📍 {facility.distanceMiles.toFixed(2)} miles away
        </div>
      )}

      {/* Basic metadata */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 p-3 rounded-lg">
          <div className="text-sm font-semibold">
            Type
          </div>
          <div className="text-sm mt-1 capitalize">{facility.type || 'Unknown'}</div>
        </div>
        {typeof facility.capacity === 'number' && (
          <div className="bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 p-3 rounded-lg">
            <div className="text-sm font-semibold">
              Capacity
            </div>
            <div className="text-sm mt-1">{facility.capacity}</div>
          </div>
        )}
      </div>

      {/* Hours/Rates if available */}
      {(facility.hours || facility.rates) && (
        <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
          {facility.hours && (<div>Hours: {facility.hours}</div>)}
          {facility.rates && (<div>Rates: {facility.rates}</div>)}
        </div>
      )}

      {/* Actions */}
      <div className="mt-3 flex items-center justify-between">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${facility.name} ${facility.address || ''} ${facility.city || ''} ${facility.state || ''}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-purple-700 dark:text-purple-300 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Directions →
        </a>
      </div>
    </div>
  );
}
