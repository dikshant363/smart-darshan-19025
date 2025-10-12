import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueueRealtime } from './useRealtime';

interface QueueStatus {
  id: string;
  booking_id: string;
  temple_id: string;
  current_position: number;
  total_in_queue: number;
  estimated_wait_minutes: number;
  status: string;
  last_updated: string;
}

export function useQueueStatus(bookingId: string | null) {
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      loadQueueStatus();
    }
  }, [bookingId]);

  // Real-time updates
  useQueueRealtime(bookingId || '', (data) => {
    setQueueStatus(data);
  });

  const loadQueueStatus = async () => {
    if (!bookingId) return;

    try {
      const { data, error } = await (supabase as any)
        .from('queue_status')
        .select('*')
        .eq('booking_id', bookingId)
        .maybeSingle();

      if (error) throw error;
      setQueueStatus(data);
    } catch (error) {
      console.error('Failed to load queue status:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    queueStatus,
    loading,
    refreshQueueStatus: loadQueueStatus,
  };
}
