import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const createBookingSchema = z.object({
  temple_id: z.string().uuid({ message: "Invalid temple ID format" }),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format. Use YYYY-MM-DD" }),
  time_slot: z.string().regex(/^\d{2}:\d{2}$/, { message: "Invalid time format. Use HH:MM" }),
  visitor_count: z.number().int().min(1, { message: "At least 1 visitor required" }).max(50, { message: "Maximum 50 visitors allowed" }),
  special_requirements: z.string().max(500, { message: "Special requirements must be less than 500 characters" }).optional(),
});

const updateBookingSchema = z.object({
  id: z.string().uuid({ message: "Invalid booking ID format" }),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  time_slot: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  visitor_count: z.number().int().min(1).max(50).optional(),
  special_requirements: z.string().max(500).optional(),
});

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
        // Validate UUID format
        if (!z.string().uuid().safeParse(bookingId).success) {
          return new Response(JSON.stringify({ error: 'Invalid booking ID format' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

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
      
      // Validate input
      const validationResult = createBookingSchema.safeParse(body);
      if (!validationResult.success) {
        return new Response(JSON.stringify({ 
          error: 'Validation failed', 
          details: validationResult.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { temple_id, booking_date, time_slot, visitor_count, special_requirements } = validationResult.data;

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
        p_user_id: user.id,
        p_activity_type: 'booking_created',
        p_description: `Created booking for temple ${temple_id}`,
        p_metadata: { booking_id: data.id, temple_id }
      });

      console.log('Booking created successfully:', data.id);

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
      
      // Validate input
      const validationResult = updateBookingSchema.safeParse(body);
      if (!validationResult.success) {
        return new Response(JSON.stringify({ 
          error: 'Validation failed', 
          details: validationResult.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { id, ...updates } = validationResult.data;

      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select('*, temples(*)')
        .single();

      if (error) throw error;

      console.log('Booking updated successfully:', id);

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE - Cancel booking
    if (method === 'DELETE') {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      if (!bookingId) {
        return new Response(JSON.stringify({ error: 'Booking ID required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Validate UUID format
      if (!z.string().uuid().safeParse(bookingId).success) {
        return new Response(JSON.stringify({ error: 'Invalid booking ID format' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .eq('user_id', user.id);

      if (error) throw error;

      console.log('Booking cancelled successfully:', bookingId);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  } catch (error) {
    console.error('Booking API error:', error);
    
    // Generic error message for clients
    let userMessage = 'An error occurred processing your booking';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        userMessage = 'Authentication required';
        statusCode = 401;
      } else if (error.message.includes('duplicate')) {
        userMessage = 'A booking with this information already exists';
        statusCode = 409;
      }
    }
    
    return new Response(JSON.stringify({ error: userMessage }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
