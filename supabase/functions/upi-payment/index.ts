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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { action, booking_id, amount, upi_id, transaction_id } = await req.json();

    // Generate UPI payment request
    if (action === 'create') {
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

      console.log('UPI payment request created:', transactionRef);

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
      const { data: payment, error: fetchError } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('booking_id', booking_id)
        .eq('transaction_reference', transaction_id)
        .single();

      if (fetchError) throw fetchError;

      // In production, verify with UPI Gateway API
      // For now, manual verification
      return new Response(JSON.stringify({
        success: true,
        status: payment.status,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update payment status (webhook endpoint)
    if (action === 'update') {
      const { status, utr_number } = await req.json();

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
      if (status === 'success') {
        await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', booking_id);

        console.log('Payment confirmed for booking:', booking_id);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Invalid action', { status: 400, headers: corsHeaders });

  } catch (error) {
    console.error('UPI payment error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
