import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Initialize mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHJxOWt1YzQwMXp4MnFxbGZ5Z3E0OWNnIn0.4aMtEeYWx4hxIVKRrqsqWw';

interface LocationData {
  latitude: number;
  longitude: number;
  country?: string;
  city?: string;
  browser?: string;
  device_type?: string;
  count: number;
}

export const GlobalUsersMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const { data: visitorLocations, isLoading: isLoadingVisitors, isError: isVisitorError } = useQuery({
    queryKey: ['visitor-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visitor_analytics')
        .select('latitude, longitude, country, city, browser, device_type')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);
      
      if (error) throw error;
      return data as LocationData[];
    }
  });

  // Clear existing markers
  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Dark theme for better visualization
      projection: 'globe',
      zoom: 1.5,
      center: [0, 20],
      pitch: 45,
    });

    // Add navigation and fullscreen controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

    // Add atmosphere and fog effects
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(186, 210, 235)', 
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.6
      });

      // Add terrain and sky layers
      map.current?.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.terrain-rgb'
      });

      map.current?.setTerrain({
        'source': 'mapbox-dem',
        'exaggeration': 1.5
      });

      map.current?.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 90.0],
          'sky-atmosphere-sun-intensity': 15
        }
      });
    });

    // Add automatic rotation
    const secondsPerRevolution = 180;
    let lastTime = Date.now();
    const animate = () => {
      if (!map.current) return;
      
      const currentTime = Date.now();
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Rotate the globe
      map.current.rotateTo(
        ((currentTime / 1000) * 360) / secondsPerRevolution, 
        { duration: 0 }
      );
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      clearMarkers();
      map.current?.remove();
    };
  }, []);

  // Add markers when data is loaded
  useEffect(() => {
    if (!map.current || !visitorLocations) return;

    clearMarkers();

    // Create clusters for nearby points
    const points = visitorLocations.map(location => ({
      type: 'Feature',
      properties: {
        country: location.country,
        city: location.city,
        browser: location.browser,
        device_type: location.device_type
      },
      geometry: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      }
    }));

    // Add clustered points source
    map.current.addSource('visitors', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: points
      },
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });

    // Add clusters layer
    map.current.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'visitors',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',
          100,
          '#f1f075',
          750,
          '#f28cb1'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,
          100,
          30,
          750,
          40
        ]
      }
    });

    // Add individual points layer
    map.current.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'visitors',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#10B981',
        'circle-radius': 8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff'
      }
    });

    // Add click handlers for clusters
    map.current.on('click', 'clusters', (e) => {
      const features = map.current?.queryRenderedFeatures(e.point, {
        layers: ['clusters']
      });
      const clusterId = features?.[0]?.properties?.cluster_id;
      
      if (clusterId) {
        const source = map.current?.getSource('visitors') as mapboxgl.GeoJSONSource;
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || !features?.[0]?.geometry) return;

          const coordinates = (features[0].geometry as any).coordinates;
          map.current?.easeTo({
            center: coordinates,
            zoom: zoom || 1
          });
        });
      }
    });

    // Change cursor on hover
    map.current.on('mouseenter', 'clusters', () => {
      if (map.current) map.current.getCanvas().style.cursor = 'pointer';
    });
    
    map.current.on('mouseleave', 'clusters', () => {
      if (map.current) map.current.getCanvas().style.cursor = '';
    });

    // Add popups for individual points
    map.current.on('click', 'unclustered-point', (e) => {
      const coordinates = (e.features?.[0]?.geometry as any).coordinates.slice();
      const properties = e.features?.[0]?.properties;
      
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`
          <div class="p-2">
            <div class="font-bold">${properties?.city || 'Unknown City'}, ${properties?.country || 'Unknown Country'}</div>
            <div class="text-sm text-gray-600">
              <div>Browser: ${properties?.browser || 'Unknown'}</div>
              <div>Device: ${properties?.device_type || 'Unknown'}</div>
            </div>
          </div>
        `)
        .addTo(map.current);
    });

  }, [visitorLocations]);

  if (isLoadingVisitors) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Global User Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[400px]" />
        </CardContent>
      </Card>
    );
  }

  if (isVisitorError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Global User Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load location data. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global User Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={mapContainer} className="w-full h-[400px] rounded-md overflow-hidden" />
      </CardContent>
    </Card>
  );
};