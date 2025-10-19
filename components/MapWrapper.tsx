'use client';

import { useEffect, useState, useRef } from 'react';
import type { StationWithStatus, FreeBikeStatus } from '@/types/gbfs';

interface MapWrapperProps {
  stations: StationWithStatus[];
  freeBikes: FreeBikeStatus[];
  center?: [number, number];
  zoom?: number;
}

export default function MapWrapper({ stations, freeBikes, center, zoom }: MapWrapperProps) {
  const [Map, setMap] = useState<any>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    // Prevent double mounting in React Strict Mode
    if (hasMounted.current) return;
    hasMounted.current = true;

    // Only import and set the map component on the client side
    import('./MapClient').then((mod) => {
      setMap(() => mod.default);
    });
  }, []);

  if (!Map) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return <Map key="stable-map" stations={stations} freeBikes={freeBikes} center={center} zoom={zoom} />;
}
