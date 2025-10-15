-- Add 'guest' role to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'guest';

-- Ensure booking_analytics trigger function has proper configuration
CREATE OR REPLACE FUNCTION public.update_booking_analytics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_date DATE;
  v_temple_id UUID;
BEGIN
  -- Determine which date and temple to update
  IF (TG_OP = 'DELETE') THEN
    v_date := OLD.booking_date;
    v_temple_id := OLD.temple_id;
  ELSE
    v_date := NEW.booking_date;
    v_temple_id := NEW.temple_id;
  END IF;

  -- Calculate analytics for the day
  INSERT INTO public.booking_analytics (
    date, 
    temple_id, 
    total_bookings, 
    completed_bookings,
    cancelled_bookings,
    avg_visitors_per_booking,
    peak_hour
  )
  SELECT 
    v_date,
    v_temple_id,
    COUNT(*) as total_bookings,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_bookings,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_bookings,
    AVG(visitor_count) as avg_visitors_per_booking,
    MODE() WITHIN GROUP (ORDER BY time_slot) as peak_hour
  FROM public.bookings
  WHERE booking_date = v_date AND temple_id = v_temple_id
  ON CONFLICT (date, temple_id) 
  DO UPDATE SET
    total_bookings = EXCLUDED.total_bookings,
    completed_bookings = EXCLUDED.completed_bookings,
    cancelled_bookings = EXCLUDED.cancelled_bookings,
    avg_visitors_per_booking = EXCLUDED.avg_visitors_per_booking,
    peak_hour = EXCLUDED.peak_hour,
    created_at = now();

  RETURN NULL;
END;
$$;