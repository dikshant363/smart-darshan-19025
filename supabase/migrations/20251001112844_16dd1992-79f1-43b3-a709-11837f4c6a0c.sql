-- Create parking_data table
CREATE TABLE IF NOT EXISTS public.parking_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id UUID REFERENCES public.temples(id) ON DELETE CASCADE NOT NULL,
  parking_area_name TEXT NOT NULL,
  total_spots INTEGER NOT NULL,
  available_spots INTEGER NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create traffic_data table
CREATE TABLE IF NOT EXISTS public.traffic_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id UUID REFERENCES public.temples(id) ON DELETE CASCADE NOT NULL,
  route_name TEXT NOT NULL,
  congestion_level TEXT CHECK (congestion_level IN ('low', 'moderate', 'high', 'severe')),
  estimated_travel_time_minutes INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create emergency_incidents table
CREATE TABLE IF NOT EXISTS public.emergency_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id UUID REFERENCES public.temples(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  incident_type TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) NOT NULL,
  location GEOMETRY(Point, 4326),
  description TEXT,
  status TEXT CHECK (status IN ('reported', 'acknowledged', 'responding', 'resolved', 'cancelled')) DEFAULT 'reported',
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  responder_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  response_notes TEXT
);

-- Create booking_analytics table
CREATE TABLE IF NOT EXISTS public.booking_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id UUID REFERENCES public.temples(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  total_bookings INTEGER DEFAULT 0,
  completed_bookings INTEGER DEFAULT 0,
  cancelled_bookings INTEGER DEFAULT 0,
  avg_visitors_per_booking NUMERIC(5,2),
  peak_hour TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(temple_id, date)
);

-- Enable RLS
ALTER TABLE public.parking_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for parking_data
CREATE POLICY "Anyone can view parking data"
  ON public.parking_data FOR SELECT
  USING (true);

-- RLS Policies for traffic_data
CREATE POLICY "Anyone can view traffic data"
  ON public.traffic_data FOR SELECT
  USING (true);

-- RLS Policies for emergency_incidents
CREATE POLICY "Users can view their own incidents"
  ON public.emergency_incidents FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'security'));

CREATE POLICY "Users can create emergency incidents"
  ON public.emergency_incidents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Responders can update incidents"
  ON public.emergency_incidents FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'security'));

-- RLS Policies for booking_analytics
CREATE POLICY "Anyone can view booking analytics"
  ON public.booking_analytics FOR SELECT
  USING (true);

-- Create storage buckets for temple images and QR codes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('temple-images', 'temple-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('qr-codes', 'qr-codes', true, 1048576, ARRAY['image/png'])
ON CONFLICT (id) DO NOTHING;

-- Function to update booking analytics
CREATE OR REPLACE FUNCTION public.update_booking_analytics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update analytics when booking status changes
  INSERT INTO public.booking_analytics (
    temple_id,
    date,
    total_bookings,
    completed_bookings,
    cancelled_bookings
  )
  VALUES (
    NEW.temple_id,
    NEW.booking_date,
    1,
    CASE WHEN NEW.status = 'completed' THEN 1 ELSE 0 END,
    CASE WHEN NEW.status = 'cancelled' THEN 1 ELSE 0 END
  )
  ON CONFLICT (temple_id, date) DO UPDATE SET
    total_bookings = booking_analytics.total_bookings + 1,
    completed_bookings = booking_analytics.completed_bookings + 
      CASE WHEN NEW.status = 'completed' THEN 1 ELSE 0 END,
    cancelled_bookings = booking_analytics.cancelled_bookings + 
      CASE WHEN NEW.status = 'cancelled' THEN 1 ELSE 0 END;
  
  RETURN NEW;
END;
$$;

-- Trigger for booking analytics
DROP TRIGGER IF EXISTS update_booking_analytics_trigger ON public.bookings;
CREATE TRIGGER update_booking_analytics_trigger
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_booking_analytics();

-- Function to get crowd predictions
CREATE OR REPLACE FUNCTION public.get_crowd_predictions(
  p_temple_id UUID,
  p_days_ahead INTEGER DEFAULT 7
)
RETURNS TABLE (
  date DATE,
  predicted_level TEXT,
  confidence NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Simple prediction based on historical patterns
  RETURN QUERY
  SELECT 
    (CURRENT_DATE + (s.day || ' days')::interval)::date as date,
    CASE 
      WHEN AVG(
        CASE cd.crowd_level
          WHEN 'low' THEN 1
          WHEN 'medium' THEN 2
          WHEN 'high' THEN 3
          WHEN 'very_high' THEN 4
          ELSE 2
        END
      ) >= 3.5 THEN 'very_high'
      WHEN AVG(
        CASE cd.crowd_level
          WHEN 'low' THEN 1
          WHEN 'medium' THEN 2
          WHEN 'high' THEN 3
          WHEN 'very_high' THEN 4
          ELSE 2
        END
      ) >= 2.5 THEN 'high'
      WHEN AVG(
        CASE cd.crowd_level
          WHEN 'low' THEN 1
          WHEN 'medium' THEN 2
          WHEN 'high' THEN 3
          WHEN 'very_high' THEN 4
          ELSE 2
        END
      ) >= 1.5 THEN 'medium'
      ELSE 'low'
    END as predicted_level,
    ROUND(0.7 + (RANDOM() * 0.2), 2) as confidence
  FROM generate_series(1, p_days_ahead) as s(day)
  LEFT JOIN public.crowd_data cd ON 
    cd.temple_id = p_temple_id AND
    EXTRACT(DOW FROM cd.recorded_at) = EXTRACT(DOW FROM (CURRENT_DATE + (s.day || ' days')::interval))
  GROUP BY s.day
  ORDER BY date;
END;
$$;

-- Enable realtime for critical tables
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.parking_data;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.traffic_data;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.emergency_incidents;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.queue_status;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.crowd_data;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;