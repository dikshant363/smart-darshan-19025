import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface RealtimeOptions {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  onChange?: (payload: any) => void;
}

export function useRealtime({
  table,
  event = '*',
  filter,
  onInsert,
  onUpdate,
  onDelete,
  onChange,
}: RealtimeOptions) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const channelName = `${table}-changes-${Math.random()}`;
    const realtimeChannel = supabase.channel(channelName);

    const config: any = {
      event: event,
      schema: 'public',
      table: table,
    };

    if (filter) {
      config.filter = filter;
    }

    realtimeChannel.on('postgres_changes', config, (payload) => {
      console.log('Realtime update:', payload);

      if (onChange) {
        onChange(payload);
      }

      switch (payload.eventType) {
        case 'INSERT':
          if (onInsert) onInsert(payload);
          break;
        case 'UPDATE':
          if (onUpdate) onUpdate(payload);
          break;
        case 'DELETE':
          if (onDelete) onDelete(payload);
          break;
      }
    });

    realtimeChannel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to ${table} changes`);
      }
    });

    setChannel(realtimeChannel);

    return () => {
      realtimeChannel.unsubscribe();
    };
  }, [table, event, filter]);

  return { channel };
}

export function useCrowdRealtime(templeId: string, onUpdate: (data: any) => void) {
  return useRealtime({
    table: 'crowd_data',
    event: 'INSERT',
    filter: `temple_id=eq.${templeId}`,
    onInsert: (payload) => onUpdate(payload.new),
  });
}

export function useQueueRealtime(bookingId: string, onUpdate: (data: any) => void) {
  return useRealtime({
    table: 'queue_status',
    event: 'UPDATE',
    filter: `booking_id=eq.${bookingId}`,
    onUpdate: (payload) => onUpdate(payload.new),
  });
}

export function useParkingRealtime(templeId: string, onUpdate: (data: any) => void) {
  return useRealtime({
    table: 'parking_data',
    event: '*',
    filter: `temple_id=eq.${templeId}`,
    onChange: (payload) => onUpdate(payload.new),
  });
}

export function useEmergencyRealtime(onNewIncident: (data: any) => void) {
  return useRealtime({
    table: 'emergency_incidents',
    event: 'INSERT',
    onInsert: (payload) => onNewIncident(payload.new),
  });
}
