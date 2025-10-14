import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock, QrCode, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Booking {
  id: string;
  booking_date: string;
  time_slot: string;
  visitor_count: number;
  status: string;
  payment_status: string;
  payment_amount: number;
  temple_id: string;
  qr_code: string | null;
  special_requirements: string | null;
  created_at: string;
}

interface Temple {
  id: string;
  name: string;
  city: string;
}

const BookingHistory = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [temples, setTemples] = useState<Record<string, Temple>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user?.id)
        .order('booking_date', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Fetch temples
      const { data: templesData, error: templesError } = await supabase
        .from('temples')
        .select('id, name, city');

      if (templesError) throw templesError;

      // Create temples map
      const templesMap = templesData.reduce((acc, temple) => {
        acc[temple.id] = temple;
        return acc;
      }, {} as Record<string, Temple>);

      setBookings(bookingsData || []);
      setTemples(templesMap);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading booking history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-primary">Booking History</h1>
          <p className="text-muted-foreground mt-1">View all your darshan bookings</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
        </Badge>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven't made any darshan bookings yet.
            </p>
            <Button onClick={() => window.location.href = '/booking'}>
              Book Darshan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => {
            const temple = temples[booking.temple_id];
            return (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        {temple?.name || 'Temple'}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {temple?.city || 'Loading...'}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      <Badge className={getPaymentStatusColor(booking.payment_status)}>
                        {booking.payment_status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Booking Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">
                          {format(new Date(booking.booking_date), 'PPP')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time Slot</p>
                        <p className="font-medium">{booking.time_slot}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Visitors</p>
                        <p className="font-medium">{booking.visitor_count} people</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-medium">₹{booking.payment_amount || 0}</p>
                      </div>
                    </div>
                  </div>

                  {/* Special Requirements */}
                  {booking.special_requirements && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm font-medium mb-1">Special Requirements</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.special_requirements}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {booking.qr_code && booking.status === 'confirmed' && (
                      <Button variant="outline" size="sm" className="gap-2">
                        <QrCode className="h-4 w-4" />
                        View QR Code
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>

                  {/* Booking ID */}
                  <p className="text-xs text-muted-foreground">
                    Booking ID: {booking.id.substring(0, 8)}...
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
