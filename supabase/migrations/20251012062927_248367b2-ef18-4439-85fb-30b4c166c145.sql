-- Fix linter warnings: set search_path for functions without it
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

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
$$ LANGUAGE plpgsql SET search_path = public;