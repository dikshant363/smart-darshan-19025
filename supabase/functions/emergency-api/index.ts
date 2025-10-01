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

    const method = req.method;
    const url = new URL(req.url);
    const incidentId = url.searchParams.get('id');

    // GET - Fetch emergency incidents
    if (method === 'GET') {
      if (incidentId) {
        const { data, error } = await supabase
          .from('emergency_incidents')
          .select('*, temples(*)')
          .eq('id', incidentId)
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Fetch user's incidents or all if admin/security
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('is_active', true);

      const isResponder = roles?.some(r => ['admin', 'security'].includes(r.role));

      let query = supabase
        .from('emergency_incidents')
        .select('*, temples(*)');

      if (!isResponder) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query
        .order('reported_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST - Create emergency incident
    if (method === 'POST') {
      const body = await req.json();
      const { 
        temple_id, 
        incident_type, 
        severity, 
        description, 
        location 
      } = body;

      const { data, error } = await supabase
        .from('emergency_incidents')
        .insert({
          user_id: user.id,
          temple_id,
          incident_type,
          severity,
          description,
          location,
          status: 'reported',
        })
        .select('*, temples(*)')
        .single();

      if (error) throw error;

      // Log activity
      await supabase.rpc('log_user_activity', {
        p_activity_type: 'emergency_reported',
        p_activity_data: { 
          incident_id: data.id, 
          incident_type,
          severity 
        }
      });

      // Create notification for admins and security
      const { data: responders } = await supabase
        .from('user_roles')
        .select('user_id')
        .in('role', ['admin', 'security'])
        .eq('is_active', true);

      if (responders) {
        const notifications = responders.map(r => ({
          user_id: r.user_id,
          type: 'emergency',
          title: `${severity.toUpperCase()}: ${incident_type}`,
          message: description || 'Emergency incident reported',
          data: { incident_id: data.id }
        }));

        await supabase.from('notifications').insert(notifications);
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      });
    }

    // PUT - Update incident (responders only)
    if (method === 'PUT') {
      const body = await req.json();
      const { id, status, response_notes } = body;

      // Check if user is responder
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('is_active', true);

      const isResponder = roles?.some(r => ['admin', 'security'].includes(r.role));
      if (!isResponder) throw new Error('Unauthorized - responder role required');

      const updateData: any = { status };
      if (response_notes) updateData.response_notes = response_notes;
      if (status === 'resolved') updateData.resolved_at = new Date().toISOString();
      if (status === 'responding') updateData.responder_id = user.id;

      const { data, error } = await supabase
        .from('emergency_incidents')
        .update(updateData)
        .eq('id', id)
        .select('*, temples(*)')
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  } catch (error) {
    console.error('Emergency API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
