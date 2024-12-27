import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkCircuitBreaker(serviceName: string): Promise<boolean> {
  const { data: breaker, error } = await supabase
    .from('circuit_breakers')
    .select('*')
    .eq('service_name', serviceName)
    .single();

  if (error) {
    console.error('Error checking circuit breaker:', error);
    return false;
  }

  if (breaker.state === 'open') {
    const resetTime = new Date(breaker.last_failure_at);
    resetTime.setMinutes(resetTime.getMinutes() + 5); // 5-minute reset timeout
    
    if (new Date() > resetTime) {
      // Reset circuit breaker to half-open state
      await supabase
        .from('circuit_breakers')
        .update({ 
          state: 'half-open',
          failure_count: 0 
        })
        .eq('service_name', serviceName);
      
      return true;
    }
    return false;
  }

  return true;
}

async function processQueue() {
  // Get pending notifications
  const { data: notifications, error } = await supabase
    .from('notification_queue')
    .select('*')
    .eq('status', 'pending')
    .lte('next_attempt_at', new Date().toISOString())
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(10);

  if (error) {
    console.error('Error fetching notifications:', error);
    return;
  }

  if (!notifications?.length) {
    console.log('No pending notifications to process');
    return;
  }

  console.log(`Processing ${notifications.length} notifications`);

  for (const notification of notifications) {
    try {
      const serviceName = notification.payload.service || 'email_service';
      
      // Check circuit breaker state
      if (!await checkCircuitBreaker(serviceName)) {
        console.log(`Circuit breaker is open for ${serviceName}, skipping notification ${notification.id}`);
        continue;
      }

      // Process notification based on type
      const result = await processNotification(notification);
      
      if (result.success) {
        await supabase
          .from('notification_queue')
          .update({ 
            status: 'completed',
            processed_at: new Date().toISOString()
          })
          .eq('id', notification.id);

        // Record success metrics
        await supabase.from('notification_metrics')
          .upsert({
            date: new Date().toISOString().split('T')[0],
            successful_delivery: 1
          }, {
            count: 'successful_delivery'
          });

      } else {
        const nextAttempt = new Date();
        nextAttempt.setMinutes(nextAttempt.getMinutes() + Math.pow(2, notification.attempts)); // Exponential backoff

        await supabase
          .from('notification_queue')
          .update({ 
            attempts: notification.attempts + 1,
            next_attempt_at: nextAttempt.toISOString(),
            error_message: result.error,
            status: notification.attempts + 1 >= notification.max_attempts ? 'failed' : 'pending'
          })
          .eq('id', notification.id);

        // Update circuit breaker
        const { data: breaker } = await supabase
          .from('circuit_breakers')
          .select('*')
          .eq('service_name', serviceName)
          .single();

        if (breaker && breaker.failure_count + 1 >= breaker.failure_threshold) {
          await supabase
            .from('circuit_breakers')
            .update({ 
              state: 'open',
              failure_count: 0,
              last_failure_at: new Date().toISOString()
            })
            .eq('service_name', serviceName);

          // Create admin notification
          await supabase.from('admin_notifications').insert({
            type: 'circuit_breaker',
            severity: 'critical',
            message: `Circuit breaker opened for ${serviceName} due to repeated failures`,
            metadata: { 
              service: serviceName,
              last_error: result.error
            }
          });
        } else {
          await supabase
            .from('circuit_breakers')
            .update({ 
              failure_count: breaker.failure_count + 1
            })
            .eq('service_name', serviceName);
        }
      }
    } catch (error) {
      console.error(`Error processing notification ${notification.id}:`, error);
    }
  }
}

async function processNotification(notification: any) {
  // Implementation depends on notification type
  // This is a placeholder that should be replaced with actual implementation
  try {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    await processQueue();
    
    return new Response(
      JSON.stringify({ message: 'Queue processed successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in process-notification-queue function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});