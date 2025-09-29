import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, MapPin, RefreshCw, Bell, QrCode, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

const QueueStatus = () => {
  const { t } = useTranslation();
  const [currentPosition, setCurrentPosition] = useState(23);
  const [estimatedWait, setEstimatedWait] = useState(45);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPosition(prev => Math.max(1, prev - Math.floor(Math.random() * 2)));
      setEstimatedWait(prev => Math.max(5, prev - Math.floor(Math.random() * 3)));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const queueData = {
    totalInQueue: 156,
    averageWaitTime: '3-5 minutes per person',
    lastUpdated: new Date().toLocaleTimeString(),
    crowdLevel: 'moderate'
  };

  const alternativeSlots = [
    { time: '2:30 PM', wait: '15 min', available: true },
    { time: '4:00 PM', wait: '8 min', available: true },
    { time: '6:30 PM', wait: '25 min', available: false },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6 animate-fade-in">
      <div className="text-center py-4">
        <h1 className="text-3xl font-poppins font-bold text-primary mb-2">
          Queue Status
        </h1>
        <p className="text-muted-foreground">Real-time darshan queue information</p>
      </div>

      {/* Current Booking Status */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Your Booking
            </CardTitle>
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          </div>
          <CardDescription>Somnath Temple - Morning Aarti (8:00 AM)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-3xl font-bold text-primary">{currentPosition}</div>
              <div className="text-sm text-muted-foreground">Your Position</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-3xl font-bold text-accent">{estimatedWait}</div>
              <div className="text-sm text-muted-foreground">Minutes Wait</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Queue Progress</span>
              <span>{Math.round(((queueData.totalInQueue - currentPosition) / queueData.totalInQueue) * 100)}%</span>
            </div>
            <Progress 
              value={((queueData.totalInQueue - currentPosition) / queueData.totalInQueue) * 100} 
              className="h-3"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex-1"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
              {isRefreshing ? 'Updating...' : 'Refresh'}
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Bell className="w-4 h-4 mr-2" />
              Notify Me
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Queue Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Live Queue Visualization
          </CardTitle>
          <CardDescription>Real-time view of temple queue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Queue representation */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Temple Entrance</span>
                <Badge className="bg-yellow-100 text-yellow-800">
                  {queueData.crowdLevel} crowd
                </Badge>
              </div>
              
              {/* Visual queue representation */}
              <div className="space-y-2">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full opacity-30" />
                    <div className="flex-1 h-2 bg-muted-foreground/20 rounded-full">
                      {i === 2 && (
                        <div className="h-full w-4 bg-primary rounded-full animate-pulse-sacred" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {i === 2 ? 'You' : `Position ${(i + 1) * 10}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold">{queueData.totalInQueue}</div>
                <div className="text-sm text-muted-foreground">Total in Queue</div>
              </div>
              <div>
                <div className="text-lg font-bold">{queueData.averageWaitTime.split(' ')[0]}</div>
                <div className="text-sm text-muted-foreground">Avg Wait/Person</div>
              </div>
              <div>
                <div className="text-lg font-bold">{queueData.lastUpdated}</div>
                <div className="text-sm text-muted-foreground">Last Updated</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Time Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Alternative Time Slots</CardTitle>
          <CardDescription>Consider these shorter wait times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alternativeSlots.map((slot, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{slot.time}</div>
                    <div className="text-sm text-muted-foreground">Wait: {slot.wait}</div>
                  </div>
                </div>
                <Button 
                  variant={slot.available ? "outline" : "ghost"} 
                  size="sm"
                  disabled={!slot.available}
                >
                  {slot.available ? 'Switch' : 'Full'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Camera Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Live Temple View</CardTitle>
          <CardDescription>Current crowd situation at temple premises</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Live camera feed</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              🔴 Live • {new Date().toLocaleTimeString()}
            </span>
            <Button variant="outline" size="sm">
              <Navigation className="w-4 h-4 mr-2" />
              Directions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QueueStatus;