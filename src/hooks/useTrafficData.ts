import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TrafficData {
  id: string;
  temple_id: string;
  route_name: string;
  congestion_level: string | null;
  estimated_travel_time_minutes: number | null;
  last_updated: string;
  created_at: string;
}

export function useTrafficData(templeId: string | null) {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (templeId) {
      loadTrafficData();
    }
  }, [templeId]);

  const loadTrafficData = async () => {
    if (!templeId) return;

    try {
      const { data, error } = await supabase
        .from('traffic_data')
        .select('*')
        .eq('temple_id', templeId)
        .order('last_updated', { ascending: false });

      if (error) throw error;
      setTrafficData(data || []);
    } catch (error) {
      console.error('Failed to load traffic data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    trafficData,
    loading,
    refreshTrafficData: loadTrafficData,
  };
}
