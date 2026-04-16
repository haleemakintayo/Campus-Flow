import { Bus, Route } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bus as BusIcon, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BusListProps {
  buses: Bus[];
  routes: Route[];
  onSelectBus?: (bus: Bus) => void;
}

export default function BusList({ buses, routes, onSelectBus }: BusListProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {buses.map((bus) => {
          const route = routes.find((r) => r.id === bus.routeId);
          const occupancyPercent = (bus.currentOccupancy / bus.capacity) * 100;
          const occupancyRate = bus.currentOccupancy / bus.capacity;

          return (
            <div 
              key={bus.id} 
              className="sleek-card cursor-pointer hover:bg-white/10 transition-colors group"
              onClick={() => onSelectBus?.(bus)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <BusIcon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm group-hover:text-primary transition-colors">
                      {bus.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: route?.color || '#ccc' }} />
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{route?.name}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={occupancyRate > 0.8 ? 'destructive' : 'secondary'} className="text-[10px] font-bold">
                  {Math.round(occupancyPercent)}% LOAD
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase">
                  <div className="flex items-center gap-1">
                    <Users size={10} />
                    <span>{bus.currentOccupancy}/{bus.capacity} Seats</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    <span>{new Date(bus.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ 
                      width: `${occupancyPercent}%`,
                      backgroundColor: occupancyRate > 0.8 ? 'var(--destructive)' : 'var(--primary)'
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
