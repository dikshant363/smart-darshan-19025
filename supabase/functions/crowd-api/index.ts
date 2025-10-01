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
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const templeId = url.searchParams.get('temple_id');
    const action = url.searchParams.get('action');

    if (!templeId) {
      throw new Error('temple_id is required');
    }

    // GET - Fetch crowd data
    if (req.method === 'GET') {
      if (action === 'current') {
        // Get current crowd level
        const { data, error } = await supabase
          .from('crowd_data')
          .select('*')
          .eq('temple_id', templeId)
          .order('recorded_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        return new Response(JSON.stringify(data || { temple_id: templeId, crowd_level: 'low' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (action === 'history') {
        // Get historical crowd data
        const hours = parseInt(url.searchParams.get('hours') || '24');
        const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

        const { data, error } = await supabase
          .from('crowd_data')
          .select('*')
          .eq('temple_id', templeId)
          .gte('recorded_at', since)
          .order('recorded_at', { ascending: true });

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (action === 'predictions') {
        // Get crowd predictions
        const days = parseInt(url.searchParams.get('days') || '7');
        
        const { data, error } = await supabase
          .rpc('get_crowd_predictions', {
            p_temple_id: templeId,
            p_days_ahead: days
          });

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Default: get latest crowd data with predictions
      const [currentResult, predictionsResult] = await Promise.all([
        supabase
          .from('crowd_data')
          .select('*')
          .eq('temple_id', templeId)
          .order('recorded_at', { ascending: false })
          .limit(1)
          .single(),
        supabase.rpc('get_crowd_predictions', {
          p_temple_id: templeId,
          p_days_ahead: 7
        })
      ]);

      return new Response(JSON.stringify({
        current: currentResult.data || { temple_id: templeId, crowd_level: 'low' },
        predictions: predictionsResult.data || []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  } catch (error) {
    console.error('Crowd API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
