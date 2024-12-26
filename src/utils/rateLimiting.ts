import { supabase } from "@/integrations/supabase/client";

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Maximum requests per window

export const checkRateLimit = async (endpoint: string) => {
  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const ip = ipData.ip;

    const { data: limits, error } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('ip_address', ip)
      .eq('endpoint', endpoint)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking rate limit:', error);
      return true; // Allow request on error
    }

    const now = new Date();
    const windowStart = limits?.window_start ? new Date(limits.window_start) : now;
    const isNewWindow = !limits || (now.getTime() - windowStart.getTime()) > WINDOW_SIZE;

    if (isNewWindow) {
      // Start new window
      const { error: upsertError } = await supabase
        .from('rate_limits')
        .upsert({
          ip_address: ip,
          endpoint,
          request_count: 1,
          window_start: now.toISOString()
        });

      if (upsertError) {
        console.error('Error updating rate limit:', upsertError);
      }
      return true;
    }

    if (limits && limits.request_count >= MAX_REQUESTS) {
      return false; // Rate limit exceeded
    }

    // Increment request count
    const { error: updateError } = await supabase
      .from('rate_limits')
      .update({ 
        request_count: ((limits?.request_count || 0) + 1),
        window_start: windowStart.toISOString()
      })
      .eq('ip_address', ip)
      .eq('endpoint', endpoint);

    if (updateError) {
      console.error('Error updating rate limit:', updateError);
    }
    return true;
  } catch (error) {
    console.error('Error in rate limiting:', error);
    return true; // Allow request on error
  }
};