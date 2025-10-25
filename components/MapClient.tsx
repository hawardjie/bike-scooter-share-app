'use client';

import { useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { StationWithStatus, FreeBikeStatus } from '@/types/gbfs';
import type { ParkingFacility } from '@/types/parking';

// Component to handle map events
function MapEventHandler({ onMapMove }: { onMapMove?: (center: [number, number], zoom: number) => void }) {
  useMapEvents({
    moveend: (e) => {
      if (onMapMove) {
        const map = e.target;
        const center = map.getCenter();
        const zoom = map.getZoom();
        onMapMove([center.lat, center.lng], zoom);
      }
    },
    zoomend: (e) => {
      if (onMapMove) {
        const map = e.target;
        const center = map.getCenter();
        const zoom = map.getZoom();
        onMapMove([center.lat, center.lng], zoom);
      }
    },
  });
  return null;
}

// Fix for default marker icons in React-Leaflet - only do this once
if (typeof window !== 'undefined') {
  const DefaultIcon = L.Icon.Default;
  if ((DefaultIcon.prototype as any)._getIconUrl) {
    delete (DefaultIcon.prototype as any)._getIconUrl;
    DefaultIcon.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }
}

interface MapProps {
  stations: StationWithStatus[];
  freeBikes: FreeBikeStatus[];
  parkingFacilities?: ParkingFacility[];
  center?: [number, number];
  zoom?: number;
  onMapMove?: (center: [number, number], zoom: number) => void;
}

export default function Map({ stations, freeBikes, parkingFacilities = [], center = [40.7081, -74.0060], zoom = 13, onMapMove }: MapProps) {
  // Custom parking icon
  const createParkingIcon = useMemo(() => () => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 3px solid white;
          box-shadow: 0 3px 10px rgba(147, 51, 234, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
          color: white;
        ">
          🅿️
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });
  }, []);

  // Custom icons for different vehicle types - memoize these functions
  const createBikeIcon = useMemo(() => (available: number, total: number) => {
    const ratio = total > 0 ? available / total : 0;
    const color = ratio > 0.5 ? '#22c55e' : ratio > 0.2 ? '#eab308' : '#ef4444';

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
          color: white;
        ">
          ${available}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  }, []);

  const createFreeBikeIcon = useMemo(() => (battery?: number) => {
    const color = battery && battery > 50 ? '#22c55e' : battery && battery > 20 ? '#eab308' : '#ef4444';

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEventHandler onMapMove={onMapMove} />

      {/* Station markers */}
      {stations.map((station) => {
        const total = station.availableBikes + station.availableDocks;
        return (
          <Marker
            key={station.station_id}
            position={[station.lat, station.lon]}
            icon={createBikeIcon(station.availableBikes, total)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-2">{station.name}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Bikes:</span>
                    <span className="font-semibold text-green-600">{station.availableBikes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Docks:</span>
                    <span className="font-semibold text-blue-600">{station.availableDocks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold ${station.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {station.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {station.address && (
                    <div className="mt-2 text-gray-500 text-xs">{station.address}</div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Free-floating bikes/scooters */}
      {freeBikes.map((bike) => (
        <Marker
          key={bike.bike_id}
          position={[bike.lat, bike.lon]}
          icon={createFreeBikeIcon(bike.current_fuel_percent)}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg mb-2">Free Vehicle</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-mono text-xs">{bike.bike_id}</span>
                </div>
                {bike.current_fuel_percent !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Battery:</span>
                    <span className="font-semibold">{bike.current_fuel_percent}%</span>
                  </div>
                )}
                {bike.current_range_meters !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Range:</span>
                    <span className="font-semibold">{(bike.current_range_meters / 1000).toFixed(1)} km</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-semibold ${bike.is_reserved ? 'text-yellow-600' : 'text-green-600'}`}>
                    {bike.is_reserved ? 'Reserved' : 'Available'}
                  </span>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Parking facilities */}
      {parkingFacilities.map((facility) => (
        <Marker
          key={facility.id}
          position={[facility.lat, facility.lng]}
          icon={createParkingIcon()}
        >
          <Popup>
            <div className="p-2 min-w-[250px]">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg pr-2">{facility.name}</h3>
                <span className="text-xl">🅿️</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="text-gray-600 mb-2">
                  {(facility.address || 'Address unavailable')}{facility.city ? `, ${facility.city}` : ''}{facility.state ? `, ${facility.state}` : ''}
                </div>

                {facility.distanceMiles !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance:</span>
                    <span className="font-semibold">{facility.distanceMiles.toFixed(2)} mi</span>
                  </div>
                )}

                {typeof facility.capacity === 'number' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-semibold">{facility.capacity}</span>
                  </div>
                )}
                {facility.type && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold capitalize">{facility.type}</span>
                  </div>
                )}

                <div className="mt-3 flex justify-end">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${facility.name} ${facility.address || ''} ${facility.city || ''} ${facility.state || ''}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-700 hover:underline"
                  >
                    Directions →
                  </a>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
