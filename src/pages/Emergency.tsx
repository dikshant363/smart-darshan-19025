import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, Phone, MapPin, Navigation, Users, Shield, 
  Heart, Siren, Car, Hospital, Clock, Share2
} from 'lucide-react';
import { useEmergencyMode } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

const Emergency = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isEmergencyMode, toggleEmergencyMode } = useEmergencyMode();
  const [locationShared, setLocationShared] = useState(false);

  const emergencyServices = [
    {
      name: 'Police',
      number: '100',
      icon: Shield,
      color: 'bg-blue-500',
      description: 'For security emergencies'
    },
    {
      name: 'Ambulance',
      number: '108',
      icon: Heart,
      color: 'bg-red-500',
      description: 'Medical emergencies'
    },
    {
      name: 'Fire Department',
      number: '101',
      icon: Siren,
      color: 'bg-orange-500',
      description: 'Fire and rescue'
    },
    {
      name: 'Tourist Helpline',
      number: '1363',
      icon: Phone,
      color: 'bg-green-500',
      description: 'Tourist assistance'
    }
  ];

  const nearbyFacilities = [
    {
      name: 'Somnath District Hospital',
      distance: '2.3 km',
      type: 'Hospital',
      phone: '+91 2876 231 175',
      icon: Hospital
    },
    {
      name: 'Veraval Police Station',
      distance: '1.8 km',
      type: 'Police',
      phone: '+91 2876 220 100',
      icon: Shield
    },
    {
      name: 'Temple Security Office',
      distance: '0.1 km',
      type: 'Security',
      phone: '+91 2876 231 200',
      icon: Users
    }
  ];

  const evacuationRoutes = [
    'Main Gate Exit - 150m North',
    'Side Gate Exit - 200m East',
    'Emergency Exit - 100m West',
    'Service Road - 300m South'
  ];

  const handlePanicButton = () => {
    toggleEmergencyMode();
    // In real implementation, this would trigger emergency alerts
    if (!isEmergencyMode) {
      alert('Emergency alert activated! Authorities have been notified.');
    }
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {
        setLocationShared(true);
        alert('Location shared with emergency contacts');
      });
    }
  };

  const handleQuickCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  return (
    <div className="container mx-auto p-4 space-y-6 animate-fade-in">
      <div className="text-center py-4">
        <h1 className="text-3xl font-poppins font-bold text-red-600 mb-2">
          Emergency Services
        </h1>
        <p className="text-muted-foreground">Quick access to emergency help</p>
      </div>

      {/* Emergency Status */}
      {isEmergencyMode && (
        <Card className="border-red-500 bg-red-50 animate-pulse-sacred">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Siren className="w-6 h-6 text-red-600" />
              <div className="flex-1">
                <div className="font-bold text-red-800">EMERGENCY MODE ACTIVE</div>
                <div className="text-sm text-red-600">
                  Emergency services have been notified of your location
                </div>
              </div>
              <Badge className="bg-red-600 text-white">Active</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Panic Button */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Button
              onClick={handlePanicButton}
              size="lg"
              className={cn(
                "w-32 h-32 rounded-full text-xl font-bold",
                isEmergencyMode 
                  ? "bg-gray-500 hover:bg-gray-600" 
                  : "bg-red-600 hover:bg-red-700 animate-pulse"
              )}
            >
              {isEmergencyMode ? (
                <>
                  <Shield className="w-8 h-8 mb-2" />
                  STOP
                </>
              ) : (
                <>
                  <AlertTriangle className="w-8 h-8 mb-2" />
                  PANIC
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {isEmergencyMode 
                ? "Emergency mode is active. Press to deactivate."
                : "Press and hold for 3 seconds to alert emergency services"
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <Button 
              onClick={handleShareLocation}
              variant="outline" 
              className="w-full"
              disabled={locationShared}
            >
              <Share2 className="w-4 h-4 mr-2" />
              {locationShared ? 'Location Shared' : 'Share Live Location'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Button 
              onClick={() => navigate('/crowd-monitor')}
              variant="outline" 
              className="w-full"
            >
              <Navigation className="w-4 h-4 mr-2" />
              View Evacuation Routes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Emergency Contacts
          </CardTitle>
          <CardDescription>Quick dial emergency services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyServices.map((service, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => handleQuickCall(service.number)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-3 rounded-full text-white", service.color)}>
                      <service.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{service.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {service.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{service.number}</div>
                      <div className="text-xs text-muted-foreground">Tap to call</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nearby Facilities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Nearby Emergency Facilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nearbyFacilities.map((facility, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <facility.icon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{facility.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {facility.type} • {facility.distance}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleQuickCall(facility.phone)}
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm">
                      <Navigation className="w-4 h-4 mr-1" />
                      Navigate
                    </Button>
                  </div>
                </div>
                {index < nearbyFacilities.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Evacuation Routes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Evacuation Routes
          </CardTitle>
          <CardDescription>Emergency exit directions from your location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {evacuationRoutes.map((route, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <span>{route}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
            <span>Stay calm and move slowly to avoid panic</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
            <span>Follow crowd management staff instructions</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
            <span>Keep emergency contacts updated in your profile</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
            <span>Share your location with family before visiting</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Emergency;