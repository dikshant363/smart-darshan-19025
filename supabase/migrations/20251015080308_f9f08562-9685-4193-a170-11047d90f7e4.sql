-- Add RLS UPDATE policy for emergency responders
-- This allows users with 'admin' or 'security' roles to update emergency incidents
CREATE POLICY "Responders can update incidents"
ON public.emergency_incidents
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'security'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'security'::app_role)
);