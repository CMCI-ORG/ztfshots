import { Feature, Point } from 'geojson';

export interface LocationData {
  latitude: number;
  longitude: number;
  country?: string;
  city?: string;
  browser?: string;
  device_type?: string;
}

export interface VisitorProperties {
  country?: string;
  city?: string;
  browser?: string;
  device_type?: string;
}

export type VisitorFeature = Feature<Point, VisitorProperties>;