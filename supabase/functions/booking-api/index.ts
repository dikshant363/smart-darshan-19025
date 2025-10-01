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
    const method = req.method;
    const bookingId = url.searchParams.get('id');

    // GET - Fetch bookings
    if (method === 'GET') {
      if (bookingId) {
        const { data, error } = await supabase
          .from('bookings')
          .select('*, temples(*)')
          .eq('id', bookingId)
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Fetch all bookings for the user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      const { data, error } = await supabase
        .from('bookings')
        .select('*, temples(*)')
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST - Create booking
    if (method === 'POST') {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      const body = await req.json();
      const { temple_id, booking_date, time_slot, visitor_count, special_requirements } = body;

      // Generate QR code data (simple UUID for now)
      const qr_code = crypto.randomUUID();

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          temple_id,
          booking_date,
          time_slot,
          visitor_count,
          special_requirements,
          qr_code,
          status: 'confirmed',
        })
        .select('*, temples(*)')
        .single();

      if (error) throw error;

      // Log activity
      await supabase.rpc('log_user_activity', {
        p_activity_type: 'booking_created',
        p_activity_data: { booking_id: data.id, temple_id }
      });

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      });
    }

    // PUT - Update booking
    if (method === 'PUT') {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      const body = await req.json();
      const { id, ...updates } = body;

      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select('*, temples(*)')
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE - Cancel booking
    if (method === 'DELETE') {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      if (!bookingId) throw new Error('Booking ID required');

      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .eq('user_id', user.id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  } catch (error) {
    console.error('Booking API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
