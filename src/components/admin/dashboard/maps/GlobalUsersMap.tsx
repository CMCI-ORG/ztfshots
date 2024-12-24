import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Temporary access token - should be moved to environment variables
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHJxOWt1YzQwMXp4MnFxbGZ5Z3E0OWNnIn0.4aMtEeYWx4hxIVKRrqsqWw';

interface LocationData {
  latitude: number;
  longitude: number;
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
        .select('latitude, longitude')
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
      style: 'mapbox://styles/mapbox/light-v11',
      projection: 'globe',
      zoom: 1.5,
      center: [0, 20],
      pitch: 45,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      })
    );

    // Add atmosphere and fog effects
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });
    });

    return () => {
      clearMarkers();
      map.current?.remove();
    };
  }, []);

  // Add markers when data is loaded
  useEffect(() => {
    if (!map.current || !visitorLocations) return;

    clearMarkers();

    visitorLocations.forEach((location) => {
      if (location.latitude && location.longitude) {
        const marker = new mapboxgl.Marker({ color: '#10B981' })
          .setLngLat([location.longitude, location.latitude])
          .addTo(map.current!);
        markersRef.current.push(marker);
      }
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