import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Phone, Mail, Globe, Shield, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EmergencyContactsManager } from '@/components/profile/EmergencyContactsManager';

interface ProfileData {
  display_name: string;
  phone_number: string;
  language_preference: string;
  accessibility_needs: string[];
  notification_preferences: {
    booking: boolean;
    crowd: boolean;
    emergency: boolean;
    general: boolean;
  };
}

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    display_name: '',
    phone_number: '',
    language_preference: 'en',
    accessibility_needs: [],
    notification_preferences: {
      booking: true,
      crowd: true,
      emergency: true,
      general: true,
    },
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [user, navigate]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        const notifPrefs = typeof data.notification_preferences === 'object' && data.notification_preferences !== null
          ? data.notification_preferences as any
          : { booking: true, crowd: true, emergency: true, general: true };

        setProfileData({
          display_name: data.display_name || '',
          phone_number: data.phone_number || '',
          language_preference: data.language_preference || 'en',
          accessibility_needs: data.accessibility_needs || [],
          notification_preferences: notifPrefs,
        });
        i18n.changeLanguage(data.language_preference || 'en');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profileData.display_name,
          phone_number: profileData.phone_number,
          language_preference: profileData.language_preference,
          accessibility_needs: profileData.accessibility_needs,
          notification_preferences: profileData.notification_preferences as any,
        })
        .eq('id', user.id);

      if (error) throw error;

      i18n.changeLanguage(profileData.language_preference);
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });

      await supabase.rpc('log_user_activity', {
        p_activity_type: 'profile_update',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const toggleAccessibilityNeed = (need: string) => {
    setProfileData(prev => ({
      ...prev,
      accessibility_needs: prev.accessibility_needs.includes(need)
        ? prev.accessibility_needs.filter(n => n !== need)
        : [...prev.accessibility_needs, need],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center py-4">
        <h1 className="text-2xl font-poppins font-bold text-primary">
          {t('nav.profile')}
        </h1>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Manage your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={profileData.display_name}
                onChange={(e) => setProfileData(prev => ({ ...prev, display_name: e.target.value }))}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={profileData.phone_number}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone_number: e.target.value }))}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize your app experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Language
            </Label>
            <Select
              value={profileData.language_preference}
              onValueChange={(value) => setProfileData(prev => ({ ...prev, language_preference: value }))}
            >
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

          {/* Notification Preferences */}
          <div className="space-y-4">
            <Label>Notification Preferences</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Booking Updates</span>
                <Switch
                  checked={profileData.notification_preferences.booking}
                  onCheckedChange={(checked) => 
                    setProfileData(prev => ({
                      ...prev,
                      notification_preferences: { ...prev.notification_preferences, booking: checked }
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Crowd Alerts</span>
                <Switch
                  checked={profileData.notification_preferences.crowd}
                  onCheckedChange={(checked) => 
                    setProfileData(prev => ({
                      ...prev,
                      notification_preferences: { ...prev.notification_preferences, crowd: checked }
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Emergency Alerts</span>
                <Switch
                  checked={profileData.notification_preferences.emergency}
                  onCheckedChange={(checked) => 
                    setProfileData(prev => ({
                      ...prev,
                      notification_preferences: { ...prev.notification_preferences, emergency: checked }
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span>General Updates</span>
                <Switch
                  checked={profileData.notification_preferences.general}
                  onCheckedChange={(checked) => 
                    setProfileData(prev => ({
                      ...prev,
                      notification_preferences: { ...prev.notification_preferences, general: checked }
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Needs</CardTitle>
          <CardDescription>
            Select features that enhance your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {['wheelchair', 'visual_impairment', 'hearing_impairment', 'elderly', 'mobility_assistance'].map((need) => (
            <div key={need} className="flex items-center space-x-2">
              <Checkbox
                id={need}
                checked={profileData.accessibility_needs.includes(need)}
                onCheckedChange={() => toggleAccessibilityNeed(need)}
              />
              <Label htmlFor={need} className="cursor-pointer capitalize">
                {need.replace('_', ' ')}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <EmergencyContactsManager userId={user?.id || ''} />

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={handleSave} disabled={saving} className="flex-1">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t('common.save')}
        </Button>
        <Button variant="outline" onClick={handleSignOut} className="flex-1">
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Profile;