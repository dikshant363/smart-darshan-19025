import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const notificationSchema = z.object({
  user_id: z.string().uuid({ message: "Invalid user ID format" }),
  title: z.string().min(1, { message: "Title is required" }).max(200, { message: "Title must be less than 200 characters" }),
  message: z.string().min(1, { message: "Message is required" }).max(1000, { message: "Message must be less than 1000 characters" }),
  type: z.enum(['booking', 'crowd_alert', 'emergency', 'traffic', 'general'], {
    errorMap: () => ({ message: "Invalid notification type" })
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: "Invalid priority level" })
  }).default('medium'),
  data: z.record(z.any()).optional(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();

    // Validate input
    const validationResult = notificationSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(JSON.stringify({ 
        error: 'Validation failed', 
        details: validationResult.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { user_id, title, message, type, priority, data } = validationResult.data;

    console.log('Creating notification:', { user_id, title, type, priority });

    // Use the SECURITY DEFINER function to create notification
    const { data: notificationId, error: dbError } = await supabaseClient
      .rpc('create_notification', {
        p_user_id: user_id,
        p_type: type,
        p_title: title,
        p_message: message,
        p_priority: priority,
        p_data: data || null
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    console.log('Notification created:', notificationId);

    // TODO: Integrate with push notification service (Firebase, OneSignal, etc.)
    // For now, we're just storing in database for in-app notifications

    return new Response(
      JSON.stringify({ success: true, notification_id: notificationId }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-notification function:', error);
    
    // Generic error message for clients
    const userMessage = 'An error occurred sending the notification';
    
    return new Response(
      JSON.stringify({ error: userMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
