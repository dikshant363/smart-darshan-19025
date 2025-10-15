import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Booking {
  id: string;
  temple_id: string;
  booking_date: string;
  time_slot: string;
  visitor_count: number;
  status: string;
  qr_code: string | null;
  special_requirements: string[] | null;
  temples?: any;
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('bookings')
        .select('*, temples(*)')
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load bookings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: {
    temple_id: string;
    booking_date: string;
    time_slot: string;
    visitor_count: number;
    special_requirements?: string[];
  }) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const qr_code = crypto.randomUUID();

      const { data, error } = await (supabase as any)
        .from('bookings')
        .insert({
          user_id: user.id,
          temple_id: bookingData.temple_id,
          booking_date: bookingData.booking_date,
          time_slot: bookingData.time_slot,
          visitor_count: bookingData.visitor_count,
          special_requirements: bookingData.special_requirements || [],
          qr_code,
          status: 'confirmed',
        })
        .select('*, temples(*)')
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Booking created successfully',
      });

      await loadBookings();
      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create booking',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const cancelBooking = async (bookingId: string, reason?: string) => {
    try {
      const { error } = await (supabase as any)
        .from('bookings')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason,
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Booking cancelled',
      });

      await loadBookings();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to cancel booking',
        variant: 'destructive',
      });
    }
  };

  return {
    bookings,
    loading,
    createBooking,
    cancelBooking,
    refreshBookings: loadBookings,
  };
}
