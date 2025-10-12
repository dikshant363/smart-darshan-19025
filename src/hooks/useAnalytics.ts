import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BookingAnalytics {
  id: string;
  temple_id: string;
  date: string;
  total_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  avg_visitors_per_booking: number | null;
  peak_hour: string | null;
}

export function useAnalytics(templeId: string | null, dateRange?: { start: string; end: string }) {
  const [analytics, setAnalytics] = useState<BookingAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (templeId) {
      loadAnalytics();
    }
  }, [templeId, dateRange]);

  const loadAnalytics = async () => {
    if (!templeId) return;

    try {
      let query = (supabase as any)
        .from('booking_analytics')
        .select('*')
        .eq('temple_id', templeId);

      if (dateRange) {
        query = query
          .gte('date', dateRange.start)
          .lte('date', dateRange.end);
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) throw error;
      setAnalytics(data || []);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalBookings = analytics.reduce((sum, a) => sum + a.total_bookings, 0);
  const totalCompleted = analytics.reduce((sum, a) => sum + a.completed_bookings, 0);
  const totalCancelled = analytics.reduce((sum, a) => sum + a.cancelled_bookings, 0);
  const completionRate = totalBookings > 0 ? (totalCompleted / totalBookings) * 100 : 0;

  return {
    analytics,
    loading,
    totalBookings,
    totalCompleted,
    totalCancelled,
    completionRate,
    refreshAnalytics: loadAnalytics,
  };
}
