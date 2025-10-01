import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Temple {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  opening_time: string;
  closing_time: string;
  capacity: number;
  current_crowd_level: string | null;
  image_urls: string[] | null;
  facilities: string[] | null;
  is_active: boolean;
}

export function useTemples() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemples();
  }, []);

  const loadTemples = async () => {
    try {
      const { data, error } = await supabase
        .from('temples')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTemples(data || []);
    } catch (error) {
      console.error('Failed to load temples:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTempleById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('temples')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to load temple:', error);
      return null;
    }
  };

  return {
    temples,
    loading,
    getTempleById,
    refreshTemples: loadTemples,
  };
}
