import { useState } from 'react';
import { Route, Stop } from '../types';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Navigation, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RouteSearchProps {
  routes: Route[];
  onSelectRoute: (routeId: string | null) => void;
}

export default function RouteSearch({ routes, onSelectRoute }: RouteSearchProps) {
  const [search, setSearch] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const filteredRoutes = routes.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.stops.some(s => s.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleRouteClick = (routeId: string) => {
    const newId = selectedRoute === routeId ? null : routeId;
    setSelectedRoute(newId);
    onSelectRoute(newId);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search destination or route..." 
          className="pl-10 h-11 bg-white/5 border-border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="grid gap-2">
          {filteredRoutes.map((route) => (
            <div 
              key={route.id}
              className={`sleek-card cursor-pointer transition-all hover:bg-white/10 ${
                selectedRoute === route.id ? 'ring-1 ring-primary bg-white/10' : ''
              }`}
              onClick={() => handleRouteClick(route.id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-lg"
                    style={{ backgroundColor: route.color }}
                  >
                    <Navigation size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{route.name}</h4>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      {route.stops.length} STOPS • 15 MIN LOOP
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="flex gap-1 items-center text-[10px] font-bold border-primary/30 text-primary uppercase">
                  Active
                </Badge>
              </div>

              {selectedRoute === route.id && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-3 animate-in fade-in slide-in-from-top-2">
                  <span className="sleek-label">Route Timeline</span>
                  <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                    {route.stops.map((stop, idx) => (
                      <div key={stop.id} className="flex items-start gap-3 relative z-10">
                        <div 
                          className="w-4 h-4 rounded-full border-2 border-background mt-1"
                          style={{ backgroundColor: route.color }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium">{stop.name}</span>
                            <span className="text-[10px] text-muted-foreground font-bold">
                              {idx * 4 + 2} MIN
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-2 bg-primary text-primary-foreground py-2 rounded-md text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity uppercase tracking-widest">
                    <Navigation className="w-4 h-4" />
                    Start Navigation
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
