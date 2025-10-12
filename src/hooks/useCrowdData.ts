import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCrowdRealtime } from './useRealtime';

interface CrowdData {
  id: string;
  temple_id: string;
  crowd_level: string;
  crowd_count: number;
  capacity_percentage: number | null;
  recorded_at: string;
}

interface CrowdPrediction {
  date: string;
  predicted_level: string;
  confidence: number;
}

export function useCrowdData(templeId: string | null) {
  const [currentCrowd, setCurrentCrowd] = useState<CrowdData | null>(null);
  const [predictions, setPredictions] = useState<CrowdPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (templeId) {
      loadCrowdData();
    }
  }, [templeId]);

  // Real-time updates
  useCrowdRealtime(templeId || '', (data) => {
    setCurrentCrowd(data);
  });

  const loadCrowdData = async () => {
    if (!templeId) return;

    try {
      const [currentResult, predictionsResult] = await Promise.all([
        (supabase as any)
          .from('crowd_data')
          .select('*')
          .eq('temple_id', templeId)
          .order('recorded_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        (supabase as any).rpc('get_crowd_predictions', {
          p_temple_id: templeId,
          p_days_ahead: 7
        })
      ]);

      if (currentResult.data) {
        setCurrentCrowd(currentResult.data);
      }

      if (predictionsResult.data) {
        setPredictions(predictionsResult.data);
      }
    } catch (error) {
      console.error('Failed to load crowd data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    currentCrowd,
    predictions,
    loading,
    refreshCrowdData: loadCrowdData,
  };
}
