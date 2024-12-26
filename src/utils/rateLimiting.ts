import { supabase } from "@/integrations/supabase/client";

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Maximum requests per window

export const checkRateLimit = async (endpoint: string) => {
  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const { ip } = await ipResponse.json();

    const { data: limits, error: fetchError } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('ip_address', ip)
      .eq('endpoint', endpoint)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking rate limit:', fetchError);
      return true; // Allow request on error
    }

    const now = new Date();
    const windowStart = limits?.window_start ? new Date(limits.window_start) : now;
    const isNewWindow = !limits || (now.getTime() - windowStart.getTime()) > WINDOW_SIZE;

    if (isNewWindow) {
      // Start new window
      const { error } = await supabase
        .from('rate_limits')
        .upsert({
          ip_address: ip,
          endpoint,
          request_count: 1,
          window_start: now.toISOString()
        });

      if (error) console.error('Error updating rate limit:', error);
      return true;
    }

    if (limits.request_count >= MAX_REQUESTS) {
      return false; // Rate limit exceeded
    }

    // Increment request count
    const { error } = await supabase
      .from('rate_limits')
      .update({ request_count: (limits.request_count || 0) + 1 })
      .eq('ip_address', ip)
      .eq('endpoint', endpoint);

    if (error) console.error('Error updating rate limit:', error);
    return true;
  } catch (error) {
    console.error('Error in rate limiting:', error);
    return true; // Allow request on error
  }
};