import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithOtp: (phone: string) => Promise<{ error: AuthError | null }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  signInAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Log activity when user logs in
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(async () => {
            try {
              await (supabase as any).rpc('log_user_activity', {
                p_user_id: session.user.id,
                p_activity_type: 'login',
                p_description: 'User logged in via phone OTP',
                p_metadata: { method: 'phone' }
              });
              console.log('Activity logged');
            } catch (error) {
              console.error('Failed to log activity:', error);
            }
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithOtp = async (phone: string) => {
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: true,
        }
      });

      if (error) {
        console.error('OTP Error:', error);

        if ((error as any).code === 'phone_provider_disabled') {
          toast({
            title: 'Phone OTP not enabled',
            description: 'Phone authentication is disabled. Continue as guest or use an alternative login method.',
            variant: 'destructive',
          });
        } else if (error.message?.includes('trigger') || error.message?.includes('database')) {
          toast({
            title: 'Setup Required',
            description: 'Please contact support to complete account setup.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'OTP Sent',
          description: 'Please check your phone for the verification code',
        });
      }

      return { error };
    } catch (error) {
      const authError = error as AuthError;
      console.error('OTP Exception:', error);
      toast({
        title: 'Error',
        description: 'Failed to send OTP. Please try again.',
        variant: 'destructive',
      });
      return { error: authError };
    }
  };

  const verifyOtp = async (phone: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Successfully logged in!',
        });
      }

      return { error };
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: 'Error',
        description: 'Failed to verify OTP. Please try again.',
        variant: 'destructive',
      });
      return { error: authError };
    }
  };

  const signOut = async () => {
    try {
      // Log activity before signing out
      await (supabase as any).rpc('log_user_activity', {
        p_user_id: user?.id,
        p_activity_type: 'logout',
        p_description: 'User signed out'
      });
      
      await supabase.auth.signOut();
      
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const signInAsGuest = () => {
    toast({
      title: 'Guest Mode',
      description: 'You are now browsing as a guest. Some features are limited.',
    });
    // Navigate to dashboard without authentication
    window.location.href = '/dashboard';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithOtp,
        verifyOtp,
        signOut,
        signInAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
