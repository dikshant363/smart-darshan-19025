import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Error mapping helper
const mapError = (error: Error): { message: string; code: number } => {
  const errorMessage = error.message.toLowerCase();
  
  if (errorMessage.includes('unauthorized') || errorMessage.includes('auth')) {
    return { message: 'Authentication required', code: 401 };
  }
  if (errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
    return { message: 'This record already exists', code: 409 };
  }
  if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
    return { message: 'Resource not found', code: 404 };
  }
  if (errorMessage.includes('foreign key') || errorMessage.includes('reference')) {
    return { message: 'Invalid reference', code: 400 };
  }
  if (errorMessage.includes('permission') || errorMessage.includes('policy')) {
    return { message: 'Permission denied', code: 403 };
  }
  
  return { message: 'An error occurred. Please try again', code: 500 };
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
        p_description: `Created booking for temple`,
        p_metadata: { booking_id: data.id }
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

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  } catch (error) {
    console.error('Booking API error:', {
      error: error,
      stack: (error as Error).stack,
      timestamp: new Date().toISOString()
    });
    
    const { message, code } = mapError(error as Error);
    
    return new Response(JSON.stringify({ error: message }), {
      status: code,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
