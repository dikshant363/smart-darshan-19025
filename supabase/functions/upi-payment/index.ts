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

const createPaymentSchema = z.object({
  action: z.literal('create'),
  booking_id: z.string().uuid({ message: "Invalid booking ID format" }),
  amount: z.number().positive({ message: "Amount must be positive" }).max(100000, { message: "Amount exceeds maximum limit" }),
});

const verifyPaymentSchema = z.object({
  action: z.literal('verify'),
  booking_id: z.string().uuid({ message: "Invalid booking ID format" }),
  transaction_id: z.string().min(1, { message: "Transaction ID required" }),
});

const updatePaymentSchema = z.object({
  action: z.literal('update'),
  transaction_id: z.string().min(1, { message: "Transaction ID required" }),
  status: z.enum(['pending', 'success', 'failed'], { errorMap: () => ({ message: "Invalid status" }) }),
  utr_number: z.string().optional(),
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

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { action } = body;

    // Generate UPI payment request
    if (action === 'create') {
      // Validate input
      const validationResult = createPaymentSchema.safeParse(body);
      if (!validationResult.success) {
        return new Response(JSON.stringify({ 
          error: 'Validation failed', 
          details: validationResult.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { booking_id, amount } = validationResult.data;

      // Verify booking belongs to authenticated user
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('user_id')
        .eq('id', booking_id)
        .single();

      if (bookingError || !booking) {
        return new Response(JSON.stringify({ error: 'Booking not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (booking.user_id !== user.id) {
        return new Response(JSON.stringify({ error: 'Unauthorized - booking does not belong to user' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // UPI payment string format
      const payeeAddress = Deno.env.get('UPI_MERCHANT_ID') || 'temple@upi';
      const payeeName = 'Smart Darshan';
      const transactionRef = `SD${Date.now()}`;
      
      // Generate UPI intent URL
      const upiString = `upi://pay?pa=${payeeAddress}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=Booking%20${booking_id}&tr=${transactionRef}`;

      // Store payment request in database
      const { data: payment, error: paymentError } = await supabase
        .from('payment_transactions')
        .insert({
          booking_id,
          amount,
          payment_method: 'upi',
          transaction_reference: transactionRef,
          status: 'pending',
          upi_string: upiString,
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      return new Response(JSON.stringify({
        success: true,
        transaction_reference: transactionRef,
        upi_string: upiString,
        payment_id: payment.id,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify UPI payment
    if (action === 'verify') {
      // Validate input
      const validationResult = verifyPaymentSchema.safeParse(body);
      if (!validationResult.success) {
        return new Response(JSON.stringify({ 
          error: 'Validation failed', 
          details: validationResult.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { booking_id, transaction_id } = validationResult.data;

      // Verify booking belongs to authenticated user
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('user_id')
        .eq('id', booking_id)
        .single();

      if (bookingError || !booking || booking.user_id !== user.id) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: payment, error: fetchError } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('booking_id', booking_id)
        .eq('transaction_reference', transaction_id)
        .single();

      if (fetchError) throw fetchError;

      return new Response(JSON.stringify({
        success: true,
        status: payment.status,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update payment status (webhook endpoint)
    if (action === 'update') {
      // Validate input
      const validationResult = updatePaymentSchema.safeParse(body);
      if (!validationResult.success) {
        return new Response(JSON.stringify({ 
          error: 'Validation failed', 
          details: validationResult.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { transaction_id, status, utr_number } = validationResult.data;

      // Get payment to verify booking ownership
      const { data: payment } = await supabase
        .from('payment_transactions')
        .select('booking_id')
        .eq('transaction_reference', transaction_id)
        .single();

      if (payment) {
        const { data: booking } = await supabase
          .from('bookings')
          .select('user_id')
          .eq('id', payment.booking_id)
          .single();

        if (!booking || booking.user_id !== user.id) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      const { error: updateError } = await supabase
        .from('payment_transactions')
        .update({
          status,
          utr_number,
          completed_at: status === 'success' ? new Date().toISOString() : null,
        })
        .eq('transaction_reference', transaction_id);

      if (updateError) throw updateError;

      // Update booking status if payment successful
      if (status === 'success' && payment) {
        await supabase
          .from('bookings')
          .update({ 
            status: 'confirmed',
            payment_status: 'completed'
          })
          .eq('id', payment.booking_id);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('UPI payment error:', {
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
