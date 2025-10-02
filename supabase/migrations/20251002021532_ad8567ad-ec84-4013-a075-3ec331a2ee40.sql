-- Security Fix: Initialize Role-Based Access Control System
-- This migration sets up the infrastructure for secure role management

-- First, ensure the has_role function exists and is properly configured
-- This function is critical for avoiding RLS recursion issues
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT exists (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
  )
$$;

-- Add helpful comment
COMMENT ON FUNCTION public.has_role IS 'Security definer function to check user roles without RLS recursion';

-- Emergency Contacts Security Review:
-- After analysis, emergency_contacts (temple services like hospitals, police)
-- should remain publicly accessible for safety reasons.
-- This is institutional data, not personal user data.
-- Personal emergency contacts are in user_emergency_contacts (already secured).

-- However, we'll add authentication requirement with a public fallback for safety
DROP POLICY IF EXISTS "Anyone can view emergency contacts" ON public.emergency_contacts;

-- Authenticated users can see all emergency contacts
CREATE POLICY "Authenticated users can view emergency contacts"
ON public.emergency_contacts
FOR SELECT
TO authenticated
USING (is_active = true);

-- Anonymous users can still access emergency contacts for safety
-- This is intentional - emergency information should be accessible to all
CREATE POLICY "Anonymous users can view active emergency contacts"
ON public.emergency_contacts
FOR SELECT
TO anon
USING (is_active = true);

-- Initialize first admin user
-- IMPORTANT: Replace 'YOUR-USER-ID-HERE' with an actual user UUID from auth.users
-- You can find user IDs in Supabase Dashboard > Authentication > Users
-- Uncomment and customize the following line after getting a real user ID:

-- INSERT INTO public.user_roles (user_id, role, is_active, assigned_by)
-- VALUES (
--   'YOUR-USER-ID-HERE'::uuid,
--   'admin'::app_role,
--   true,
--   'YOUR-USER-ID-HERE'::uuid
-- )
-- ON CONFLICT (user_id, role) DO NOTHING;

-- Add admin management policies
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));