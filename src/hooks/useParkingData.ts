import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useParkingRealtime } from './useRealtime';

interface ParkingData {
  id: string;
  temple_id: string;
  parking_area_name: string;
  total_spots: number;
  available_spots: number;
  last_updated: string;
}

export function useParkingData(templeId: string | null) {
  const [parkingData, setParkingData] = useState<ParkingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (templeId) {
      loadParkingData();
    }
  }, [templeId]);

  // Real-time updates
  useParkingRealtime(templeId || '', (data) => {
    setParkingData(prev => {
      const index = prev.findIndex(p => p.id === data.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = data;
        return updated;
      }
      return [...prev, data];
    });
  });

  const loadParkingData = async () => {
    if (!templeId) return;

    try {
      const { data, error } = await supabase
        .from('parking_data')
        .select('*')
        .eq('temple_id', templeId)
        .order('parking_area_name');

      if (error) throw error;
      setParkingData(data || []);
    } catch (error) {
      console.error('Failed to load parking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalAvailable = parkingData.reduce((sum, p) => sum + p.available_spots, 0);
  const totalSpots = parkingData.reduce((sum, p) => sum + p.total_spots, 0);
  const occupancyRate = totalSpots > 0 ? ((totalSpots - totalAvailable) / totalSpots) * 100 : 0;

  return {
    parkingData,
    loading,
    totalAvailable,
    totalSpots,
    occupancyRate,
    refreshParkingData: loadParkingData,
  };
}
