import { Bus, Route, Stop } from './types';

// Coordinates loosely spaced for mock visualization
export const CAMPUS_CENTER = { lat: 6.946, lng: 3.917 }; // Generic center

export const MOCK_STOPS: Stop[] = [
  { id: 's1', name: 'Ago Mini Campus', latitude: 6.946, longitude: 3.917 },
  { id: 's2', name: 'Mariam', latitude: 6.947, longitude: 3.918 },
  { id: 's3', name: 'Itamerin', latitude: 6.948, longitude: 3.916 },
  { id: 's4', name: 'Pepsi', latitude: 6.945, longitude: 3.915 },
  { id: 's5', name: 'Chips', latitude: 6.944, longitude: 3.917 },
  { id: 's6', name: 'Konigba', latitude: 6.945, longitude: 3.919 },
];

export const MOCK_ROUTES: Route[] = [
  {
    id: 'r1',
    name: 'Main Campus Loop',
    color: '#38bdf8', // Sleek Primary
    stops: [MOCK_STOPS[0], MOCK_STOPS[1], MOCK_STOPS[2], MOCK_STOPS[0]],
  },
  {
    id: 'r2',
    name: 'Outer Campus Express',
    color: '#10b981', // Emerald
    stops: [MOCK_STOPS[0], MOCK_STOPS[3], MOCK_STOPS[4], MOCK_STOPS[5], MOCK_STOPS[0]],
  },
];

export const MOCK_BUSES: Bus[] = [
  {
    id: 'b1',
    routeId: 'r1',
    name: 'Bus 101',
    latitude: 6.9465,
    longitude: 3.9175,
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
    latitude: 6.9445,
    longitude: 3.916,
    capacity: 50,
    currentOccupancy: 12,
    status: 'active',
    lastUpdated: new Date().toISOString(),
    heading: 180,
  },
];
