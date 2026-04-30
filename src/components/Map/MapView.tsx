import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import L from 'leaflet';
import { Cabane, FilterType } from '../../types/cabane';
import { getCabaneIcon } from './markers';
import CabanePopup from './CabanePopup';
import MapFilters from './MapFilters';
import { UserLocation } from '../../hooks/useGeolocation';

// Fix Leaflet default icons en mode Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapViewProps {
  cabanes: Cabane[];
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  userLocation: UserLocation | null;
  onMapClick: (lat: number, lng: number) => void;
  onReport: (id: string) => void;
  flyToTarget: [number, number] | null;
}

// Sous-composant pour voler vers une cible
function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 15, { duration: 1.2 });
  }, [target, map]);
  return null;
}

// Sous-composant pour capter les clics sur la carte
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  const map = useMap();
  useEffect(() => {
    const handler = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };
    map.on('click', handler);
    return () => { map.off('click', handler); };
  }, [map, onMapClick]);
  return null;
}

// Marqueur de position utilisateur
const userIcon = L.divIcon({
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 0 3px rgba(59,130,246,0.35);"></div>`,
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export default function MapView({
  cabanes,
  filter,
  onFilterChange,
  userLocation,
  onMapClick,
  onReport,
  flyToTarget,
}: MapViewProps) {
  const filtered = filter === 'tous' ? cabanes : cabanes.filter((c) => c.type === filter);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[46.8, 2.3]}
        zoom={6}
        className="w-full h-full"
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />

        <ZoomControl position="bottomright" />
        <FlyTo target={flyToTarget} />
        <MapClickHandler onMapClick={onMapClick} />

        {/* Marqueurs des cabanes */}
        {filtered.map((cabane) => (
          <Marker
            key={cabane.id}
            position={[cabane.latitude, cabane.longitude]}
            icon={getCabaneIcon(cabane.type)}
          >
            <Popup
              className="cabane-popup"
              maxWidth={280}
              minWidth={260}
            >
              <CabanePopup cabane={cabane} onReport={onReport} />
            </Popup>
          </Marker>
        ))}

        {/* Position utilisateur */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
          />
        )}
      </MapContainer>

      {/* Filtres flottants */}
      <MapFilters active={filter} onChange={onFilterChange} />
    </div>
  );
}
