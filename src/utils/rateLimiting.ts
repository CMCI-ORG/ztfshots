import { supabase } from "@/integrations/supabase/client";

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Maximum requests per window

export const checkRateLimit = async (endpoint: string) => {
  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const ip = ipData.ip;

    const now = new Date();
    const windowStart = new Date(now.getTime() - WINDOW_SIZE);

    // Count requests in the current window
    const { count } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'api_request')
      .gte('created_at', windowStart.toISOString())
      .match({ 
        'metadata': {
          ip_address: ip,
          endpoint: endpoint
        }
      });

    if (count && count >= MAX_REQUESTS) {
      return false; // Rate limit exceeded
    }

    // Log this request
    const { error: insertError } = await supabase
      .from('analytics_events')
      .insert({
        event_type: 'api_request',
        metadata: {
          ip_address: ip,
          endpoint: endpoint,
          timestamp: now.toISOString()
        }
      });

    if (insertError) {
      console.error('Error logging rate limit event:', insertError);
    }

    return true;
  } catch (error) {
    console.error('Error in rate limiting:', error);
    return true; // Allow request on error
  }
};