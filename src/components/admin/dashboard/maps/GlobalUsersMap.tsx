import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { LocationData } from './types/MapTypes';
import { atmosphereConfig, clusterPaintConfig, pointPaintConfig } from './utils/mapStyles';
import { createVisitorFeatures, setupMapControls, createPopupContent } from './utils/mapUtils';

// Initialize mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHJxOWt1YzQwMXp4MnFxbGZ5Z3E0OWNnIn0.4aMtEeYWx4hxIVKRrqsqWw';

export const GlobalUsersMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

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

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: 'globe',
      zoom: 1.5,
      center: [0, 20],
      pitch: 45,
    });

    const mapInstance = map.current;

    // Add atmosphere and fog effects
    mapInstance.on('load', () => {
      if (!mapInstance) return;

      mapInstance.setFog(atmosphereConfig);

      // Add terrain and sky layers
      mapInstance.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.terrain-rgb'
      });

      mapInstance.setTerrain({
        'source': 'mapbox-dem',
        'exaggeration': 1.5
      });

      mapInstance.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 90.0],
          'sky-atmosphere-sun-intensity': 15
        }
      });

      // Add visitor data if available
      if (visitorLocations) {
        addVisitorData(mapInstance, visitorLocations);
      }
    });

    setupMapControls(mapInstance);

    // Add automatic rotation
    const secondsPerRevolution = 180;
    let lastTime = Date.now();
    const animate = () => {
      if (!mapInstance) return;
      
      const currentTime = Date.now();
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      mapInstance.rotateTo(
        ((currentTime / 1000) * 360) / secondsPerRevolution, 
        { duration: 0 }
      );
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      mapInstance?.remove();
    };
  }, []);

  // Add markers when data is loaded
  useEffect(() => {
    if (!map.current || !visitorLocations) return;

    const mapInstance = map.current;

    // Only add data if the map is loaded
    if (mapInstance.loaded()) {
      addVisitorData(mapInstance, visitorLocations);
    }
  }, [visitorLocations]);

  const addVisitorData = (mapInstance: mapboxgl.Map, locations: LocationData[]) => {
    // Create features for clustering
    const features = createVisitorFeatures(locations);

    // Remove existing sources if they exist
    if (mapInstance.getSource('visitors')) {
      mapInstance.removeLayer('clusters');
      mapInstance.removeLayer('unclustered-point');
      mapInstance.removeSource('visitors');
    }

    // Add clustered points source
    mapInstance.addSource('visitors', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: features
      },
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });

    // Add clusters layer
    mapInstance.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'visitors',
      filter: ['has', 'point_count'],
      paint: clusterPaintConfig
    });

    // Add individual points layer
    mapInstance.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'visitors',
      filter: ['!', ['has', 'point_count']],
      paint: pointPaintConfig
    });

    // Add click handlers for clusters
    mapInstance.on('click', 'clusters', (e) => {
      const features = mapInstance.queryRenderedFeatures(e.point, {
        layers: ['clusters']
      });
      const clusterId = features[0]?.properties?.cluster_id;
      
      if (clusterId) {
        const source = mapInstance.getSource('visitors') as mapboxgl.GeoJSONSource;
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || !features[0]?.geometry) return;

          const coordinates = (features[0].geometry as any).coordinates;
          mapInstance.easeTo({
            center: coordinates,
            zoom: zoom || 1
          });
        });
      }
    });

    // Change cursor on hover
    mapInstance.on('mouseenter', 'clusters', () => {
      mapInstance.getCanvas().style.cursor = 'pointer';
    });
    
    mapInstance.on('mouseleave', 'clusters', () => {
      mapInstance.getCanvas().style.cursor = '';
    });

    // Add popups for individual points
    mapInstance.on('click', 'unclustered-point', (e) => {
      const coordinates = (e.features?.[0]?.geometry as any).coordinates.slice();
      const properties = e.features?.[0]?.properties;
      
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(createPopupContent(properties))
        .addTo(mapInstance);
    });
  };

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