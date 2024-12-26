import mapboxgl from 'mapbox-gl';
import { LocationData, VisitorFeature } from '../types/MapTypes';

export const createVisitorFeatures = (locations: LocationData[]): VisitorFeature[] => {
  return locations.map(location => ({
    type: 'Feature' as const,
    properties: {
      country: location.country,
      city: location.city,
      browser: location.browser,
      device_type: location.device_type
    },
    geometry: {
      type: 'Point' as const,
      coordinates: [location.longitude, location.latitude]
    }
  }));
};

export const setupMapControls = (map: mapboxgl.Map) => {
  map.addControl(new mapboxgl.NavigationControl(), 'top-right');
  map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
  map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
};

export const createPopupContent = (properties: any) => {
  return `
    <div class="p-2">
      <div class="font-bold">${properties?.city || 'Unknown City'}, ${properties?.country || 'Unknown Country'}</div>
      <div class="text-sm text-gray-600">
        <div>Browser: ${properties?.browser || 'Unknown'}</div>
        <div>Device: ${properties?.device_type || 'Unknown'}</div>
      </div>
    </div>
  `;
};