import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Cloud, Video, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
      {/* Greeting Section */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-poppins font-bold text-primary mb-2">
          {t('dashboard.greeting')}! 🙏
        </h1>
        <p className="text-muted-foreground">
          Welcome to your spiritual journey
        </p>
      </div>

      {/* Temple Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Selected Temple
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{t('temple.somnath')}</h3>
              <p className="text-sm text-muted-foreground">
                Saurashtra, Gujarat
              </p>
            </div>
            <Button variant="outline" size="sm">
              Change
            </Button>
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