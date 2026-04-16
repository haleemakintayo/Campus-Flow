export interface Bus {
  id: string;
  routeId: string;
  name: string;
  latitude: number;
  longitude: number;
  capacity: number;
  currentOccupancy: number;
  status: 'active' | 'maintenance' | 'idle';
  lastUpdated: string;
  heading: number;
}

export interface Route {
  id: string;
  name: string;
  color: string;
  stops: Stop[];
}

export interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface ETA {
  busId: string;
  stopId: string;
  estimatedMinutes: number;
}

export interface CrowdData {
  timestamp: string;
  occupancy: number;
  routeId: string;
}
