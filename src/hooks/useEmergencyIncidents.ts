import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEmergencyRealtime } from './useRealtime';

interface EmergencyIncident {
  id: string;
  temple_id: string | null;
  user_id: string | null;
  incident_type: string;
  severity: string;
  description: string | null;
  status: string;
  reported_at: string;
  resolved_at: string | null;
  responder_id: string | null;
  response_notes: string | null;
  location: unknown;
  temples?: any;
}

export function useEmergencyIncidents() {
  const [incidents, setIncidents] = useState<EmergencyIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadIncidents();
    }
  }, [user]);

  // Real-time updates for new incidents
  useEmergencyRealtime((newIncident) => {
    setIncidents(prev => [newIncident, ...prev]);
    
    // Show toast for new emergency
    if (newIncident.user_id !== user?.id) {
      toast({
        title: `${newIncident.severity.toUpperCase()} Emergency`,
        description: newIncident.incident_type,
        variant: 'destructive',
      });
    }
  });

  const loadIncidents = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_incidents')
        .select('*, temples(*)')
        .order('reported_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setIncidents(data || []);
    } catch (error) {
      console.error('Failed to load emergency incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const reportIncident = async (incidentData: {
    temple_id: string;
    incident_type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description?: string;
    location?: { latitude: number; longitude: number };
  }) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const insertData: any = {
        user_id: user.id,
        temple_id: incidentData.temple_id,
        incident_type: incidentData.incident_type,
        severity: incidentData.severity,
        description: incidentData.description,
        status: 'reported',
      };

      if (incidentData.location) {
        insertData.location = `POINT(${incidentData.location.longitude} ${incidentData.location.latitude})`;
      }

      const { data, error } = await supabase
        .from('emergency_incidents')
        .insert(insertData)
        .select('*, temples(*)')
        .single();

      if (error) throw error;

      toast({
        title: 'Emergency Reported',
        description: 'Authorities have been notified',
      });

      await supabase.rpc('log_user_activity', {
        p_activity_type: 'emergency_reported',
        p_activity_data: { 
          incident_id: data.id, 
          incident_type: incidentData.incident_type,
          severity: incidentData.severity 
        }
      });

      await loadIncidents();
      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to report incident',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    incidents,
    loading,
    reportIncident,
    refreshIncidents: loadIncidents,
  };
}
