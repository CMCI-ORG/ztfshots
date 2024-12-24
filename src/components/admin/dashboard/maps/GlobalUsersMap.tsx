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

const GlobalUsersMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const { data: visitorLocations, isLoading: isLoadingVisitors, isError: isVisitorError } = useQuery({
    queryKey: ['visitor-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visitor_analytics')
        .select('latitude, longitude')
        .not('latitude', 'is', null);
      
      if (error) throw error;
      return data as LocationData[];
    }
  });

  const { data: subscriberLocations, isLoading: isLoadingSubscribers, isError: isSubscriberError } = useQuery({
    queryKey: ['subscriber-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriber_locations')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

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
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !visitorLocations || !subscriberLocations) return;

    // Add visitor markers
    visitorLocations.forEach((location) => {
      if (location.latitude && location.longitude) {
        new mapboxgl.Marker({ color: '#10B981' })
          .setLngLat([location.longitude, location.latitude])
          .addTo(map.current!);
      }
    });

    // Add subscriber markers
    subscriberLocations.forEach((location) => {
      if (location.country) {
        // Here you would need to geocode the country name to coordinates
        // For now, we'll skip this step as it requires additional setup
      }
    });
  }, [visitorLocations, subscriberLocations]);

  if (isLoadingVisitors || isLoadingSubscribers) {
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

  if (isVisitorError || isSubscriberError) {
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

export default GlobalUsersMap;