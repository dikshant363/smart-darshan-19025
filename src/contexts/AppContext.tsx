import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
interface User {
  id: string;
  phone: string;
  name?: string;
  preferredTemple?: string;
  emergencyContacts?: EmergencyContact[];
}

interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
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
  user: User | null;
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
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_BOOKING'; payload: Booking }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'TOGGLE_EMERGENCY_MODE' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'UPDATE_CROWD_DATA'; payload: any }
  | { type: 'UPDATE_TRAFFIC_DATA'; payload: any }
  | { type: 'CLEAR_USER' }
  | { type: 'CLEAR_BOOKING' };

// Initial state
const initialState: AppState = {
  user: null,
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
    case 'SET_USER':
      return { ...state, user: action.payload };
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
    case 'CLEAR_USER':
      return { ...state, user: null };
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

  // Online/offline detection
  React.useEffect(() => {
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
export const useUser = () => {
  const { state } = useAppContext();
  return state.user;
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