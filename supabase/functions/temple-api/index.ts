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
    const templeId = url.searchParams.get('id');
    const action = url.searchParams.get('action');

    // GET - Fetch temples
    if (req.method === 'GET') {
      if (templeId) {
        // Get single temple with additional data
        const [templeResult, crowdResult, parkingResult] = await Promise.all([
          supabase
            .from('temples')
            .select('*')
            .eq('id', templeId)
            .single(),
          supabase
            .from('crowd_data')
            .select('*')
            .eq('temple_id', templeId)
            .order('recorded_at', { ascending: false })
            .limit(1)
            .single(),
          supabase
            .from('parking_data')
            .select('*')
            .eq('temple_id', templeId)
            .order('last_updated', { ascending: false })
        ]);

        if (templeResult.error) throw templeResult.error;

        return new Response(JSON.stringify({
          ...templeResult.data,
          current_crowd: crowdResult.data || null,
          parking: parkingResult.data || []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get all active temples
      const { data, error } = await supabase
        .from('temples')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      // Get current crowd levels for all temples
      const templeIds = data.map(t => t.id);
      const { data: crowdData } = await supabase
        .from('crowd_data')
        .select('temple_id, crowd_level, crowd_count, capacity_percentage')
        .in('temple_id', templeIds)
        .order('recorded_at', { ascending: false });

      // Map crowd data to temples
      const templesWithCrowd = data.map(temple => ({
        ...temple,
        current_crowd: crowdData?.find(c => c.temple_id === temple.id) || null
      }));

      return new Response(JSON.stringify(templesWithCrowd), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  } catch (error) {
    console.error('Temple API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
