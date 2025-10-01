import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authHeader = req.headers.get('Authorization')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const url = new URL(req.url);
    const bookingId = url.searchParams.get('booking_id');
    const templeId = url.searchParams.get('temple_id');

    // GET - Fetch queue status
    if (req.method === 'GET') {
      const { data: { user } } = await supabase.auth.getUser();

      if (bookingId) {
        // Get specific booking's queue status
        const { data, error } = await supabase
          .from('queue_status')
          .select('*, bookings(*, temples(*))')
          .eq('booking_id', bookingId)
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (user && !templeId) {
        // Get all queue statuses for user's active bookings
        const { data, error } = await supabase
          .from('queue_status')
          .select('*, bookings!inner(*, temples(*))')
          .eq('bookings.user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (templeId) {
        // Get current queue overview for a temple
        const { data, error } = await supabase
          .from('queue_status')
          .select('*')
          .eq('temple_id', templeId)
          .eq('status', 'active')
          .order('current_position', { ascending: true });

        if (error) throw error;

        // Calculate average wait time
        const avgWaitTime = data.length > 0
          ? Math.round(data.reduce((sum, q) => sum + q.estimated_wait_minutes, 0) / data.length)
          : 0;

        return new Response(JSON.stringify({
          temple_id: templeId,
          total_in_queue: data.length,
          average_wait_minutes: avgWaitTime,
          queue_entries: data,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      throw new Error('Missing required parameters');
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  } catch (error) {
    console.error('Queue API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
