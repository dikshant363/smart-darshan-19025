import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Navigation, ParkingCircle, AlertTriangle } from 'lucide-react';
import { TempleMap } from '@/components/maps/TempleMap';
import { useTemples } from '@/hooks/useTemples';

const Maps = () => {
  const { temples } = useTemples();

  // Convert temple data to markers - using default coordinates for Gujarat temples
  const templeMarkers = temples.map((temple, index) => {
    // Default coordinates for major Gujarat temples
    const coords: Record<string, [number, number]> = {
      'Somnath': [70.4015, 20.8880],
      'Dwarka': [68.9685, 22.2394],
      'Ambaji': [72.8537, 24.3305],
      'Pavagadh': [73.5319, 22.4809],
    };
    
    const templateName = temple.name.split(' ')[0]; // Get first word
    const coordinates = coords[templateName] || [72.8777, 21.5222];
    
    return {
      coordinates,
      title: temple.name,
      description: temple.city + ', ' + temple.state,
      color: '#FF9933',
    };
  });

  return (
    <div className="container mx-auto p-4 space-y-6 animate-fade-in">
      <div className="text-center py-4">
        <h1 className="text-3xl font-poppins font-bold text-primary mb-2">
          Maps & Navigation
        </h1>
        <p className="text-muted-foreground">
          Interactive maps for temples, parking, and navigation
        </p>
      </div>

      <Tabs defaultValue="temples" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="temples">
            <MapPin className="w-4 h-4 mr-2" />
            Temples
          </TabsTrigger>
          <TabsTrigger value="parking">
            <ParkingCircle className="w-4 h-4 mr-2" />
            Parking
          </TabsTrigger>
          <TabsTrigger value="navigation">
            <Navigation className="w-4 h-4 mr-2" />
            Navigate
          </TabsTrigger>
          <TabsTrigger value="emergency">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Evacuation
          </TabsTrigger>
        </TabsList>

        {/* Temple Map */}
        <TabsContent value="temples">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Temple Locations
              </CardTitle>
              <CardDescription>
                View all temple locations and get directions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px]">
                <TempleMap
                  center={[72.8777, 21.5222]}
                  zoom={8}
                  markers={templeMarkers}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parking Map */}
        <TabsContent value="parking">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ParkingCircle className="w-5 h-5" />
                Parking Facilities
              </CardTitle>
              <CardDescription>
                Find available parking near temples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px]">
                <TempleMap
                  center={[72.8777, 21.5222]}
                  zoom={10}
                  markers={[
                    {
                      coordinates: [72.8777, 21.5222],
                      title: 'Main Parking Zone A',
                      description: 'Available spots: 45/100',
                      color: '#10b981',
                    },
                    {
                      coordinates: [72.88, 21.53],
                      title: 'Parking Zone B',
                      description: 'Available spots: 12/80',
                      color: '#f59e0b',
                    },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigation Map */}
        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Get Directions
              </CardTitle>
              <CardDescription>
                Turn-by-turn navigation to your destination
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px]">
                <TempleMap center={[72.8777, 21.5222]} zoom={12} markers={[]} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Evacuation Map */}
        <TabsContent value="emergency">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Evacuation Routes
              </CardTitle>
              <CardDescription>
                Emergency exits and safe assembly points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px]">
                <TempleMap
                  center={[72.8777, 21.5222]}
                  zoom={15}
                  markers={[
                    {
                      coordinates: [72.877, 21.522],
                      title: 'Emergency Exit 1',
                      description: 'North Gate - Assembly Point A',
                      color: '#ef4444',
                    },
                    {
                      coordinates: [72.878, 21.523],
                      title: 'Emergency Exit 2',
                      description: 'South Gate - Assembly Point B',
                      color: '#ef4444',
                    },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Maps;
