import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bus, Route } from '../types';
import { useEffect } from 'react';
import { Bus as BusIcon, MapPin } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix for default marker icons in Leaflet with Vite
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  center: { lat: number; lng: number };
  buses: Bus[];
  routes: Route[];
  selectedRouteId?: string | null;
}

const createBusIcon = (color: string, heading: number) => {
  const html = renderToStaticMarkup(
    <div className="relative flex items-center justify-center">
      <div className="absolute w-10 h-10 bg-primary/20 rounded-full animate-ping"></div>
      <div 
        className="w-8 h-8 bg-primary border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-background transition-all duration-300" 
        style={{ 
          transform: `rotate(${heading}deg)`,
          boxShadow: '0 0 15px rgba(56,189,248,0.8)',
          backgroundColor: color === '#38bdf8' ? 'var(--primary)' : color
        }}
      >
        <BusIcon size={16} fill="currentColor" stroke="white" strokeWidth={2} />
      </div>
    </div>
  );
  return L.divIcon({
    html,
    className: 'custom-bus-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const createStopIcon = (color: string) => {
  const html = renderToStaticMarkup(
    <div className="relative flex items-center justify-center">
      <div 
        className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
        style={{ backgroundColor: color }}
      />
    </div>
  );
  return L.divIcon({
    html,
    className: 'custom-stop-icon',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

function ChangeView({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng]);
  }, [center, map]);
  return null;
}

export default function Map({ center, buses, routes, selectedRouteId }: MapProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <ChangeView center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {routes.map((route) => {
        const isSelected = selectedRouteId === route.id;
        const opacity = selectedRouteId ? (isSelected ? 1 : 0.2) : 0.6;
        
        return (
          <div key={route.id}>
            <Polyline
              positions={route.stops.map((s) => [s.latitude, s.longitude])}
              color={route.color}
              weight={isSelected ? 6 : 4}
              opacity={opacity}
            />
            {route.stops.map((stop) => (
              <Marker
                key={stop.id}
                position={[stop.latitude, stop.longitude]}
                icon={createStopIcon(route.color)}
                opacity={opacity}
              >
                <Popup>
                  <div className="font-semibold">{stop.name}</div>
                  <div className="text-xs text-muted-foreground">Route: {route.name}</div>
                </Popup>
              </Marker>
            ))}
          </div>
        );
      })}

      {buses.map((bus) => {
        const route = routes.find((r) => r.id === bus.routeId);
        const color = route?.color || '#000';
        const isSelected = selectedRouteId === bus.routeId;
        const opacity = selectedRouteId ? (isSelected ? 1 : 0.3) : 1;

        return (
          <Marker
            key={bus.id}
            position={[bus.latitude, bus.longitude]}
            icon={createBusIcon(color, bus.heading)}
            opacity={opacity}
          >
            <Popup className="sleek-popup">
              <div className="p-2 space-y-2 min-w-[180px]">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-base">{bus.name}</div>
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  Route: {route?.name}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                    <span>Occupancy</span>
                    <span>{Math.round((bus.currentOccupancy / bus.capacity) * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500" 
                      style={{ 
                        width: `${(bus.currentOccupancy / bus.capacity) * 100}%`,
                        backgroundColor: (bus.currentOccupancy / bus.capacity) > 0.8 ? 'var(--destructive)' : 'var(--primary)'
                      }}
                    />
                  </div>
                </div>
                <div className="text-[9px] text-muted-foreground pt-1 border-t border-white/5">
                  Last updated: {new Date(bus.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
