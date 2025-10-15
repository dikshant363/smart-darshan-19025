import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Cloud, Video, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedTemple, setSelectedTemple] = useState('somnath');

  const temples = [
    { id: 'somnath', name: t('temple.somnath'), location: 'Saurashtra, Gujarat' },
    { id: 'dwarka', name: t('temple.dwarka'), location: 'Dwarka, Gujarat' },
    { id: 'ambaji', name: t('temple.ambaji'), location: 'Banaskantha, Gujarat' },
    { id: 'pavagadh', name: t('temple.pavagadh'), location: 'Panchmahal, Gujarat' },
  ];

  const currentTemple = temples.find(t => t.id === selectedTemple) || temples[0];

  const quickActions = [
    {
      title: t('dashboard.book_darshan'),
      description: 'Book your darshan slot',
      icon: Calendar,
      action: () => navigate('/booking'),
      color: 'bg-primary text-primary-foreground',
    },
    {
      title: t('dashboard.crowd_status'),
      description: 'Real-time crowd monitoring',
      icon: Users,
      action: () => navigate('/crowd-monitor'),
      color: 'bg-secondary text-secondary-foreground',
    },
    {
      title: t('dashboard.live_darshan'),
      description: 'Watch live temple darshan',
      icon: Video,
      action: () => {},
      color: 'bg-accent text-accent-foreground',
    },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Temple Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Selected Temple
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold">{currentTemple.name}</h3>
              <p className="text-sm text-muted-foreground">
                {currentTemple.location}
              </p>
            </div>
            <Select value={selectedTemple} onValueChange={setSelectedTemple}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select temple" />
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
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={action.action}
          >
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                <action.icon className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg">{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Weather Widget */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            {t('dashboard.weather')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">28°C</p>
              <p className="text-sm text-muted-foreground">Partly Cloudy</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Crowd Impact</p>
              <p className="text-sm font-medium text-green-600">Low</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Temple Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Current Queue Time</span>
              <span className="font-medium">~45 minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Crowd Density</span>
              <span className="font-medium text-yellow-600">Moderate</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Next Available Slot</span>
              <span className="font-medium">2:30 PM</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;