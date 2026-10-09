import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ItineraryComponent, WeatherCondition } from '../../types/itinerary';

// Fix Leaflet default icon issues in Vite/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface TripMapProps {
  components: ItineraryComponent[];
  weather?: WeatherCondition | null;
  highlightedComponentId?: string | null;
  onSelectComponent?: (id: string) => void;
}

export const TripMap: React.FC<TripMapProps> = ({
  components,
  weather,
  highlightedComponentId,
  onSelectComponent,
}) => {
  const [center, setCenter] = useState<[number, number]>([35.0116, 135.7681]);

  useEffect(() => {
    if (components.length > 0 && components[0].location?.lat) {
      setCenter([components[0].location.lat, components[0].location.lng]);
    }
  }, [components]);

  const validComponents = components.filter(
    (c) => c.location && typeof c.location.lat === 'number' && !isNaN(c.location.lat)
  );

  const polylineCoords: [number, number][] = validComponents.map((c) => [
    c.location.lat,
    c.location.lng,
  ]);

  return (
    <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm bg-slate-50">
      {/* Weather Overlay Pill */}
      {weather && (
        <div className="absolute top-4 right-4 z-[1000] flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200 shadow-md">
          <div className="text-xl">
            {weather.condition === 'Sunny' ? '☀️' : weather.condition === 'Rain' ? '🌧️' : '⛅'}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <span>{weather.location}</span>
              <span className="text-indigo-600 font-bold">{weather.temperatureC}°C</span>
            </div>
            <div className="text-[11px] text-slate-500">
              {weather.condition} • Wind {weather.windSpeedKmh}km/h
            </div>
          </div>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {polylineCoords.length > 1 && (
          <Polyline
            positions={polylineCoords}
            color="#1F4E79"
            weight={3}
            opacity={0.7}
            dashArray="6, 8"
          />
        )}

        {validComponents.map((comp, idx) => {
          const isDisrupted = comp.status === 'disrupted';
          const isSelected = highlightedComponentId === comp.id;

          return (
            <Marker
              key={comp.id}
              position={[comp.location.lat, comp.location.lng]}
              eventHandlers={{
                click: () => onSelectComponent?.(comp.id),
              }}
            >
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Day {comp.day} • {comp.type}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      ${comp.cost}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900 leading-snug">
                    {comp.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {comp.description}
                  </p>
                  <div className="mt-2 text-[11px] font-medium text-indigo-600 flex items-center justify-between">
                    <span>{comp.time} ({comp.duration})</span>
                    <span>★ {comp.vendorRating}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
