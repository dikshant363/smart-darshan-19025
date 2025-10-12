import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Types
interface Profile {
  id: string;
  display_name: string | null;
  phone_number: string | null;
  language_preference: string | null;
  accessibility_needs: string[] | null;
  notification_preferences: any;
  created_at: string | null;
  updated_at: string | null;
}

interface Booking {
  id: string;
  templeId: string;
  date: string;
  timeSlot: string;
  visitors: number;
  status: 'active' | 'completed' | 'cancelled';
  qrCode?: string;
}

interface AppState {
  profile: Profile | null;
  currentBooking: Booking | null;
  isOnline: boolean;
  emergencyMode: boolean;
  notifications: Notification[];
  crowdData: any;
  trafficData: any;
}

interface Notification {
  id: string;
  type: 'crowd' | 'emergency' | 'booking' | 'traffic';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Actions
type AppAction = 
  | { type: 'SET_PROFILE'; payload: Profile | null }
  | { type: 'SET_BOOKING'; payload: Booking }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'TOGGLE_EMERGENCY_MODE' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'UPDATE_CROWD_DATA'; payload: any }
  | { type: 'UPDATE_TRAFFIC_DATA'; payload: any }
  | { type: 'CLEAR_BOOKING' };

// Initial state
const initialState: AppState = {
  profile: null,
  currentBooking: null,
  isOnline: navigator.onLine,
  emergencyMode: false,
  notifications: [],
  crowdData: null,
  trafficData: null,
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'SET_BOOKING':
      return { ...state, currentBooking: action.payload };
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };
    case 'TOGGLE_EMERGENCY_MODE':
      return { ...state, emergencyMode: !state.emergencyMode };
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [action.payload, ...state.notifications] 
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        )
      };
    case 'UPDATE_CROWD_DATA':
      return { ...state, crowdData: action.payload };
    case 'UPDATE_TRAFFIC_DATA':
      return { ...state, trafficData: action.payload };
    case 'CLEAR_BOOKING':
      return { ...state, currentBooking: null };
    default:
      return state;
  }
};

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user } = useAuth();

  // Sync profile with authenticated user
  useEffect(() => {
    if (user) {
      loadProfile(user.id);
    } else {
      dispatch({ type: 'SET_PROFILE', payload: null });
    }
  }, [user]);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        dispatch({ type: 'SET_PROFILE', payload: data });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Utility hooks
export const useProfile = () => {
  const { state } = useAppContext();
  return state.profile;
};

export const useBooking = () => {
  const { state } = useAppContext();
  return state.currentBooking;
};

export const useOnlineStatus = () => {
  const { state } = useAppContext();
  return state.isOnline;
};

export const useEmergencyMode = () => {
  const { state, dispatch } = useAppContext();
  return {
    isEmergencyMode: state.emergencyMode,
    toggleEmergencyMode: () => dispatch({ type: 'TOGGLE_EMERGENCY_MODE' })
  };
};