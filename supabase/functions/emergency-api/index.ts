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

const createIncidentSchema = z.object({
  temple_id: z.string().uuid({ message: "Invalid temple ID format" }).optional(),
  incident_type: z.enum(['medical', 'fire', 'security', 'crowd_control', 'other'], { 
    errorMap: () => ({ message: "Invalid incident type" })
  }),
  severity: z.enum(['low', 'medium', 'high', 'critical'], { 
    errorMap: () => ({ message: "Invalid severity level" })
  }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(1000, { message: "Description must be less than 1000 characters" }),
  location_lat: z.number().min(-90).max(90).optional(),
  location_lng: z.number().min(-180).max(180).optional(),
});

const updateIncidentSchema = z.object({
  id: z.string().uuid({ message: "Invalid incident ID format" }),
  status: z.enum(['reported', 'responding', 'resolved'], { 
    errorMap: () => ({ message: "Invalid status" })
  }),
  response_notes: z.string().max(1000).optional(),
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const method = req.method;
    const url = new URL(req.url);
    const incidentId = url.searchParams.get('id');

    // GET - Fetch emergency incidents
    if (method === 'GET') {
      if (incidentId) {
        // Validate UUID format
        if (!z.string().uuid().safeParse(incidentId).success) {
          return new Response(JSON.stringify({ error: 'Invalid incident ID format' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

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
        .eq('user_id', user.id);

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
      
      // Validate input
      const validationResult = createIncidentSchema.safeParse(body);
      if (!validationResult.success) {
        return new Response(JSON.stringify({ 
          error: 'Validation failed', 
          details: validationResult.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { 
        temple_id, 
        incident_type, 
        severity, 
        description, 
        location_lat,
        location_lng
      } = validationResult.data;

      const { data, error } = await supabase
        .from('emergency_incidents')
        .insert({
          user_id: user.id,
          temple_id,
          incident_type,
          priority: severity,
          description,
          location_lat,
          location_lng,
          status: 'reported',
        })
        .select('*, temples(*)')
        .single();

      if (error) throw error;

      // Log activity
      await supabase.rpc('log_user_activity', {
        p_user_id: user.id,
        p_activity_type: 'emergency_reported',
        p_description: `Reported ${severity} ${incident_type} incident`,
        p_metadata: { 
          incident_id: data.id, 
          incident_type,
          severity 
        }
      });

      // Create notifications for admins and security using the new function
      const { data: responders } = await supabase
        .from('user_roles')
        .select('user_id')
        .in('role', ['admin', 'security']);

      if (responders && responders.length > 0) {
        for (const responder of responders) {
          await supabase.rpc('create_notification', {
            p_user_id: responder.user_id,
            p_type: 'emergency',
            p_title: `${severity.toUpperCase()}: ${incident_type}`,
            p_message: description || 'Emergency incident reported',
            p_priority: severity === 'critical' ? 'high' : 'medium',
            p_data: { incident_id: data.id }
          });
        }
      }

      console.log('Emergency incident created:', data.id);

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      });
    }

    // PUT - Update incident (responders only)
    if (method === 'PUT') {
      const body = await req.json();
      
      // Validate input
      const validationResult = updateIncidentSchema.safeParse(body);
      if (!validationResult.success) {
        return new Response(JSON.stringify({ 
          error: 'Validation failed', 
          details: validationResult.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { id, status, response_notes } = validationResult.data;

      // Check if user is responder
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const isResponder = roles?.some(r => ['admin', 'security'].includes(r.role));
      if (!isResponder) {
        return new Response(JSON.stringify({ error: 'Responder role required' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const updateData: any = { status };
      if (response_notes) updateData.response_notes = response_notes;
      if (status === 'resolved') updateData.resolved_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('emergency_incidents')
        .update(updateData)
        .eq('id', id)
        .select('*, temples(*)')
        .single();

      if (error) throw error;

      console.log('Emergency incident updated:', id);

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  } catch (error) {
    console.error('Emergency API error:', {
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
