import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface PerformanceMetrics {
  pageLoadTime: number;
  timeToFirstByte: number;
  timeToInteractive: number;
  componentRenderTime?: number;
  [key: string]: number | undefined; // Add index signature
}

export const trackPerformance = async (metrics: PerformanceMetrics) => {
  try {
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_type: 'performance',
        metadata: metrics as unknown as Json
      });

    if (error) {
      console.error('Error tracking performance:', error);
    }
  } catch (error) {
    console.error('Error in performance tracking:', error);
  }
};

export const measureComponentPerformance = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    trackPerformance({
      pageLoadTime: 0,
      timeToFirstByte: 0,
      timeToInteractive: 0,
      componentRenderTime: renderTime
    });
    
    console.log(`${componentName} render time:`, renderTime);
  };
};