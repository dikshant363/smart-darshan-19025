import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Smartphone, Globe, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedTemple, setSelectedTemple] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  ];

  const temples = [
    { id: 'somnath', name: t('temple.somnath') },
    { id: 'dwarka', name: t('temple.dwarka') },
    { id: 'ambaji', name: t('temple.ambaji') },
    { id: 'pavagadh', name: t('temple.pavagadh') },
  ];

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    i18n.changeLanguage(langCode);
  };

  const handleAuth = async () => {
    if (!email || !password || !phoneNumber) return;
    
    setLoading(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-poppins text-primary">
            {t('login.title')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('login.subtitle')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Language Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {t('login.language')}
            </label>
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.native}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Temple Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {t('login.temple')}
            </label>
            <Select value={selectedTemple} onValueChange={setSelectedTemple}>
              <SelectTrigger>
                <SelectValue placeholder={t('common.select')} />
              </SelectTrigger>
              <SelectContent>
                {temples.map((temple) => (
                  <SelectItem key={temple.id} value={temple.id}>
                    {temple.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Number Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              {t('login.phone')} *
            </label>
            <Input
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={loading || authLoading}
              required
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Email *
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || authLoading}
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Password *
            </label>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || authLoading}
              required
            />
          </div>

          {/* Auth Button */}
          <Button 
            onClick={handleAuth} 
            disabled={!email || !password || !phoneNumber || loading || authLoading}
            className="w-full"
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>

          {/* Toggle Sign Up / Sign In */}
          <Button 
            onClick={() => setIsSignUp(!isSignUp)} 
            variant="link"
            className="w-full"
            disabled={loading || authLoading}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>

          {/* Guest Login */}
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleGuestLogin}
              className="w-full"
            >
              {t('login.guest')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;