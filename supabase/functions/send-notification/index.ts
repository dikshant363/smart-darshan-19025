import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  user_id: string;
  title: string;
  message: string;
  type: 'booking' | 'crowd_alert' | 'emergency' | 'traffic' | 'general';
  priority: 'low' | 'medium' | 'high';
  data?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id, title, message, type, priority, data } = await req.json() as NotificationRequest;

    console.log('Creating notification:', { user_id, title, type, priority });

    // Store notification in database
    const { data: notification, error: dbError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id,
        title,
        message,
        type,
        priority,
        data,
        read: false,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    console.log('Notification created:', notification);

    // TODO: Integrate with push notification service (Firebase, OneSignal, etc.)
    // For now, we're just storing in database for in-app notifications

    return new Response(
      JSON.stringify({ success: true, notification }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-notification function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
