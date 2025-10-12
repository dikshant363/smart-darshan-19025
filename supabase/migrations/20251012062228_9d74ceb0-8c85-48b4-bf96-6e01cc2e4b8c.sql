-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  phone_number TEXT,
  language_preference TEXT DEFAULT 'en',
  accessibility_needs TEXT[],
  notification_preferences JSONB DEFAULT '{"booking": true, "crowd_alert": true, "emergency": true, "traffic": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'temple_staff');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  temple_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role, temple_id)
);

-- Create temples table
CREATE TABLE public.temples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  opening_time TIME NOT NULL DEFAULT '06:00',
  closing_time TIME NOT NULL DEFAULT '21:00',
  capacity INTEGER NOT NULL DEFAULT 5000,
  current_crowd_level TEXT,
  image_urls TEXT[],
  facilities TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  temple_id UUID REFERENCES public.temples(id) ON DELETE CASCADE NOT NULL,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  visitor_count INTEGER NOT NULL DEFAULT 1,
  status TEXT DEFAULT 'confirmed',
  qr_code TEXT,
  special_requirements TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_amount DECIMAL(10,2),
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create crowd_data table
CREATE TABLE public.crowd_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id UUID REFERENCES public.temples(id) ON DELETE CASCADE NOT NULL,
  crowd_level TEXT NOT NULL,
  crowd_count INTEGER NOT NULL,
  capacity_percentage DECIMAL(5,2),
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create queue_status table
CREATE TABLE public.queue_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  temple_id UUID REFERENCES public.temples(id) ON DELETE CASCADE NOT NULL,
  current_position INTEGER NOT NULL,
  total_in_queue INTEGER NOT NULL,
  estimated_wait_minutes INTEGER NOT NULL,
  status TEXT DEFAULT 'waiting',
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Create parking_data table
CREATE TABLE public.parking_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id UUID REFERENCES public.temples(id) ON DELETE CASCADE NOT NULL,
  parking_area_name TEXT NOT NULL,
  total_spots INTEGER NOT NULL,
  available_spots INTEGER NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Create traffic_data table
CREATE TABLE public.traffic_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id UUID REFERENCES public.temples(id) ON DELETE CASCADE NOT NULL,
  route_name TEXT NOT NULL,
  congestion_level TEXT,
  estimated_travel_time_minutes INTEGER,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create emergency_incidents table
CREATE TABLE public.emergency_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  temple_id UUID REFERENCES public.temples(id) ON DELETE CASCADE,
  incident_type TEXT NOT NULL,
  description TEXT,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  status TEXT DEFAULT 'reported',
  priority TEXT DEFAULT 'medium',
  reported_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Create user_emergency_contacts table
CREATE TABLE public.user_emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create booking_analytics table
CREATE TABLE public.booking_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id UUID REFERENCES public.temples(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  total_bookings INTEGER DEFAULT 0,
  completed_bookings INTEGER DEFAULT 0,
  cancelled_bookings INTEGER DEFAULT 0,
  avg_visitors_per_booking DECIMAL(5,2),
  peak_hour TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_activity_logs table
CREATE TABLE public.user_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crowd_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for temples (public read)
CREATE POLICY "Anyone can view active temples"
  ON public.temples FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage temples"
  ON public.temples FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for bookings
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for crowd_data (public read)
CREATE POLICY "Anyone can view crowd data"
  ON public.crowd_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage crowd data"
  ON public.crowd_data FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for queue_status
CREATE POLICY "Users can view their own queue status"
  ON public.queue_status FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = queue_status.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage queue status"
  ON public.queue_status FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for parking_data (public read)
CREATE POLICY "Anyone can view parking data"
  ON public.parking_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage parking data"
  ON public.parking_data FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for traffic_data (public read)
CREATE POLICY "Anyone can view traffic data"
  ON public.traffic_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage traffic data"
  ON public.traffic_data FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for emergency_incidents
CREATE POLICY "Users can view their own incidents"
  ON public.emergency_incidents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create emergency incidents"
  ON public.emergency_incidents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all incidents"
  ON public.emergency_incidents FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all incidents"
  ON public.emergency_incidents FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for user_emergency_contacts
CREATE POLICY "Users can manage their own emergency contacts"
  ON public.user_emergency_contacts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS policies for booking_analytics (admin only)
CREATE POLICY "Admins can view analytics"
  ON public.booking_analytics FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage analytics"
  ON public.booking_analytics FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for user_activity_logs
CREATE POLICY "Users can view their own activity"
  ON public.user_activity_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity"
  ON public.user_activity_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_temples_updated_at
  BEFORE UPDATE ON public.temples
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, phone_number, language_preference)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone, ''),
    COALESCE(NEW.raw_user_meta_data->>'language_preference', 'en')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role, temple_id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_description TEXT,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.user_activity_logs (user_id, activity_type, description, metadata)
  VALUES (p_user_id, p_activity_type, p_description, p_metadata)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to get crowd predictions
CREATE OR REPLACE FUNCTION public.get_crowd_predictions(
  p_temple_id UUID,
  p_days_ahead INTEGER DEFAULT 7
)
RETURNS TABLE (
  date DATE,
  predicted_level TEXT,
  confidence DECIMAL
) AS $$
BEGIN
  -- Simplified prediction based on historical patterns
  RETURN QUERY
  SELECT 
    CURRENT_DATE + i AS date,
    CASE 
      WHEN EXTRACT(DOW FROM CURRENT_DATE + i) IN (0, 6) THEN 'high'
      ELSE 'medium'
    END AS predicted_level,
    0.75 AS confidence
  FROM generate_series(1, p_days_ahead) AS i;
END;
$$ LANGUAGE plpgsql;

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.crowd_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.queue_status;
ALTER PUBLICATION supabase_realtime ADD TABLE public.parking_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.emergency_incidents;