-- Enable RLS on staff table
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own staff records
CREATE POLICY "Users can view their own staff record"
ON public.staff
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Admins can view all staff records
CREATE POLICY "Admins can view all staff records"
ON public.staff
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can insert staff records
CREATE POLICY "Admins can insert staff records"
ON public.staff
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can update staff records
CREATE POLICY "Admins can update staff records"
ON public.staff
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can delete staff records
CREATE POLICY "Admins can delete staff records"
ON public.staff
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));