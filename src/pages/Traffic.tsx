import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Car, Navigation, Clock, MapPin, Bus, AlertTriangle, 
  Route, Fuel, Phone, RefreshCw 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Traffic = () => {
  const { t } = useTranslation();
  const [fromLocation, setFromLocation] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('fastest');

  const currentConditions = {
    overall: 'moderate',
    lastUpdated: new Date().toLocaleTimeString(),
    incidents: 2,
    avgSpeed: '45 km/h'
  };

  const routes = [
    {
      id: 'fastest',
      name: 'Fastest Route',
      distance: '145 km',
      duration: '2h 45m',
      traffic: 'moderate',
      tolls: '₹280',
      fuel: '₹450',
      highlights: ['Highway route', 'Toll roads', 'Less crowded']
    },
    {
      id: 'scenic',
      name: 'Scenic Route',
      distance: '168 km',
      duration: '3h 15m',
      traffic: 'light',
      tolls: '₹120',
      fuel: '₹520',
      highlights: ['Coastal views', 'Historic sites', 'Photo stops']
    },
    {
      id: 'economical',
      name: 'Economical Route',
      distance: '152 km',
      duration: '3h 5m',
      traffic: 'heavy',
      tolls: '₹80',
      fuel: '₹470',
      highlights: ['No tolls mostly', 'Fuel stations', 'Local roads']
    }
  ];

  const publicTransport = [
    {
      type: 'bus',
      name: 'GSRTC Express',
      departure: '6:00 AM',
      arrival: '10:30 AM',
      fare: '₹180',
      availability: 'available',
      frequency: 'Every 2 hours'
    },
    {
      type: 'train',
      name: 'Somnath Express',
      departure: '7:15 AM',
      arrival: '11:45 AM',
      fare: '₹95',
      availability: 'available',
      frequency: 'Daily'
    },
    {
      type: 'shuttle',
      name: 'Temple Shuttle',
      departure: 'Every 30 min',
      arrival: 'Every 30 min',
      fare: '₹50',
      availability: 'limited',
      frequency: 'Every 30 minutes'
    }
  ];

  const trafficIncidents = [
    {
      type: 'construction',
      location: 'NH-8A, Rajkot bypass',
      description: 'Road construction - expect 15-20 min delay',
      severity: 'moderate',
      eta: '2 hours'
    },
    {
      type: 'accident',
      location: 'Junagadh-Somnath Road',
      description: 'Minor accident cleared - traffic flowing',
      severity: 'low',
      eta: 'cleared'
    }
  ];

  const getTrafficColor = (level: string) => {
    switch (level) {
      case 'light': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'heavy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'construction': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'accident': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6 animate-fade-in">
      <div className="text-center py-4">
        <h1 className="text-3xl font-poppins font-bold text-primary mb-2">
          Traffic & Navigation
        </h1>
        <p className="text-muted-foreground">Live traffic updates and route planning</p>
      </div>

      {/* Current Traffic Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Car className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-lg font-bold capitalize">{currentConditions.overall}</div>
                <div className="text-sm text-muted-foreground">Traffic Level</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Navigation className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-bold">{currentConditions.avgSpeed}</div>
                <div className="text-sm text-muted-foreground">Avg Speed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-lg font-bold">{currentConditions.incidents}</div>
                <div className="text-sm text-muted-foreground">Active Incidents</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-lg font-bold">{currentConditions.lastUpdated}</div>
                <div className="text-sm text-muted-foreground">Last Updated</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Route Planning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="w-5 h-5" />
            Plan Your Journey
          </CardTitle>
          <CardDescription>Find the best route to your destination</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <Input
                placeholder="Enter your location"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <Select defaultValue="somnath">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="somnath">Somnath Temple</SelectItem>
                  <SelectItem value="dwarka">Dwarka Temple</SelectItem>
                  <SelectItem value="ambaji">Ambaji Temple</SelectItem>
                  <SelectItem value="pavagadh">Pavagadh Temple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full">
            <Navigation className="w-4 h-4 mr-2" />
            Get Directions
          </Button>
        </CardContent>
      </Card>

      {/* Route Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recommended Routes</h3>
        <div className="grid gap-4">
          {routes.map((route) => (
            <Card 
              key={route.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedRoute === route.id && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedRoute(route.id)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{route.name}</h4>
                    <Badge className={getTrafficColor(route.traffic)}>
                      {route.traffic} traffic
                    </Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{route.distance}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{route.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-muted-foreground" />
                      <span>{route.fuel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-muted-foreground" />
                      <span>{route.tolls}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {route.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Public Transport & Shuttle */}
      <Tabs defaultValue="transport" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transport">Public Transport</TabsTrigger>
          <TabsTrigger value="incidents">Traffic Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="transport">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus className="w-5 h-5" />
                Public Transport Options
              </CardTitle>
              <CardDescription>Bus, train and shuttle services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {publicTransport.map((transport, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        <Bus className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium">{transport.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {transport.departure} → {transport.arrival}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transport.frequency}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{transport.fare}</div>
                      <Badge 
                        className={
                          transport.availability === 'available' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {transport.availability}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Traffic Incidents
                </CardTitle>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
              <CardDescription>Current road conditions and incidents</CardDescription>
            </CardHeader>
            <CardContent>
              {trafficIncidents.length > 0 ? (
                <div className="space-y-4">
                  {trafficIncidents.map((incident, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      {getIncidentIcon(incident.type)}
                      <div className="flex-1">
                        <div className="font-medium">{incident.location}</div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {incident.description}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={
                              incident.severity === 'low' 
                                ? 'bg-green-100 text-green-800'
                                : incident.severity === 'moderate'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {incident.severity} impact
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            ETA: {incident.eta}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No traffic incidents reported</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Phone className="w-4 h-4 mr-2" />
              Highway Police: 100
            </Button>
            <Button variant="outline" className="justify-start">
              <Phone className="w-4 h-4 mr-2" />
              Road Emergency: 1073
            </Button>
            <Button variant="outline" className="justify-start">
              <Phone className="w-4 h-4 mr-2" />
              Tourist Helpline: 1363
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Traffic;