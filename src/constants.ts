import { Bus, Route, Stop } from './types';

export const CAMPUS_CENTER = { lat: 51.505, lng: -0.09 }; // Placeholder

export const MOCK_STOPS: Stop[] = [
  { id: 's1', name: 'Main Gate', latitude: 51.505, longitude: -0.09 },
  { id: 's2', name: 'Science Building', latitude: 51.506, longitude: -0.085 },
  { id: 's3', name: 'Student Union', latitude: 51.507, longitude: -0.095 },
  { id: 's4', name: 'Library', latitude: 51.504, longitude: -0.092 },
  { id: 's5', name: 'Sports Complex', latitude: 51.503, longitude: -0.088 },
];

export const MOCK_ROUTES: Route[] = [
  {
    id: 'r1',
    name: 'North Loop',
    color: '#3b82f6',
    stops: [MOCK_STOPS[0], MOCK_STOPS[1], MOCK_STOPS[2]],
  },
  {
    id: 'r2',
    name: 'South Loop',
    color: '#10b981',
    stops: [MOCK_STOPS[0], MOCK_STOPS[3], MOCK_STOPS[4]],
  },
];

export const MOCK_BUSES: Bus[] = [
  {
    id: 'b1',
    routeId: 'r1',
    name: 'Bus 101',
    latitude: 51.5055,
    longitude: -0.088,
    capacity: 50,
    currentOccupancy: 35,
    status: 'active',
    lastUpdated: new Date().toISOString(),
    heading: 45,
  },
  {
    id: 'b2',
    routeId: 'r2',
    name: 'Bus 202',
    latitude: 51.5045,
    longitude: -0.091,
    capacity: 50,
    currentOccupancy: 12,
    status: 'active',
    lastUpdated: new Date().toISOString(),
    heading: 180,
  },
];
