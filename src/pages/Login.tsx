import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Smartphone, Globe, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOTP] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedTemple, setSelectedTemple] = useState('');

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

  const handleSendOTP = () => {
    if (phone.length >= 10) {
      setShowOTP(true);
    }
  };

  const handleLogin = () => {
    if (otp.length === 6) {
      navigate('/dashboard');
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

          {/* Phone Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              {t('login.phone')}
            </label>
            <div className="flex gap-2">
              <Input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1"
              />
              {!showOTP && (
                <Button onClick={handleSendOTP} disabled={phone.length < 10}>
                  Send OTP
                </Button>
              )}
            </div>
          </div>

          {/* OTP Input */}
          {showOTP && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('login.otp')}
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  maxLength={6}
                  className="flex-1"
                />
                <Button onClick={handleLogin} disabled={otp.length !== 6}>
                  {t('common.continue')}
                </Button>
              </div>
            </div>
          )}

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