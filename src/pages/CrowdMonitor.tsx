import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, TrendingUp, AlertTriangle, Clock, MapPin, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const CrowdMonitor = () => {
  const { t } = useTranslation();
  const [selectedArea, setSelectedArea] = useState('main-entrance');

  const hourlyData = [
    { hour: '6 AM', crowd: 20, predicted: 25 },
    { hour: '8 AM', crowd: 45, predicted: 50 },
    { hour: '10 AM', crowd: 78, predicted: 80 },
    { hour: '12 PM', crowd: 92, predicted: 95 },
    { hour: '2 PM', crowd: 67, predicted: 70 },
    { hour: '4 PM', crowd: 85, predicted: 85 },
    { hour: '6 PM', crowd: 95, predicted: 98 },
    { hour: '8 PM', crowd: 60, predicted: 55 },
  ];

  const areaData = [
    { name: 'Main Temple', value: 85, color: '#FF9933' },
    { name: 'Entrance', value: 92, color: '#FFD700' },
    { name: 'Parking', value: 70, color: '#003366' },
    { name: 'Food Court', value: 45, color: '#00AA66' },
  ];

  const weeklyTrend = [
    { day: 'Mon', visitors: 1200 },
    { day: 'Tue', visitors: 980 },
    { day: 'Wed', visitors: 1100 },
    { day: 'Thu', visitors: 1400 },
    { day: 'Fri', visitors: 1800 },
    { day: 'Sat', visitors: 2500 },
    { day: 'Sun', visitors: 2800 },
  ];

  const templeAreas = [
    {
      id: 'main-entrance',
      name: 'Main Entrance',
      capacity: 200,
      current: 184,
      level: 'high',
      temperature: '28°C',
      humidity: '65%'
    },
    {
      id: 'main-temple',
      name: 'Main Temple',
      capacity: 300,
      current: 255,
      level: 'high',
      temperature: '26°C',
      humidity: '70%'
    },
    {
      id: 'outer-courtyard',
      name: 'Outer Courtyard',
      capacity: 500,
      current: 350,
      level: 'moderate',
      temperature: '29°C',
      humidity: '60%'
    },
    {
      id: 'parking',
      name: 'Parking Area',
      capacity: 800,
      current: 560,
      level: 'moderate',
      temperature: '31°C',
      humidity: '55%'
    }
  ];

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCapacityPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  return (
    <div className="container mx-auto p-4 space-y-6 animate-fade-in">
      <div className="text-center py-4">
        <h1 className="text-3xl font-poppins font-bold text-primary mb-2">
          Crowd Monitor
        </h1>
        <p className="text-muted-foreground">Real-time crowd density and analytics</p>
      </div>

      {/* Current Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">2,847</div>
                <div className="text-sm text-muted-foreground">Current Visitors</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm text-muted-foreground">Capacity Used</div>
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
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">Alert Areas</div>
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
                <div className="text-2xl font-bold">45</div>
                <div className="text-sm text-muted-foreground">Avg Wait (min)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Area Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Temple Area Monitoring
          </CardTitle>
          <CardDescription>Click on areas to view detailed information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {templeAreas.map((area) => (
              <Card
                key={area.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedArea === area.id && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedArea(area.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{area.name}</h4>
                      <Badge className={getCrowdColor(area.level)}>
                        {area.level}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Occupancy</span>
                        <span>{area.current}/{area.capacity}</span>
                      </div>
                      <Progress value={getCapacityPercentage(area.current, area.capacity)} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Temp:</span>
                        <span className="ml-1">{area.temperature}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Humidity:</span>
                        <span className="ml-1">{area.humidity}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Area View */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle>
                {templeAreas.find(a => a.id === selectedArea)?.name} Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {templeAreas.find(a => a.id === selectedArea)?.current}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Count</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">
                    {getCapacityPercentage(
                      templeAreas.find(a => a.id === selectedArea)?.current || 0,
                      templeAreas.find(a => a.id === selectedArea)?.capacity || 1
                    )}%
                  </div>
                  <div className="text-sm text-muted-foreground">Capacity</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">Safe</div>
                  <div className="text-sm text-muted-foreground">Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Analytics Dashboard */}
      <Tabs defaultValue="hourly" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hourly">Hourly Trends</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Pattern</TabsTrigger>
          <TabsTrigger value="distribution">Area Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="hourly">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Hourly Crowd Trends
              </CardTitle>
              <CardDescription>Today's actual vs predicted visitor count</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="crowd" 
                    stroke="#FF9933" 
                    strokeWidth={3}
                    name="Actual"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#FFD700" 
                    strokeDasharray="5 5"
                    name="Predicted" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Visitor Pattern</CardTitle>
              <CardDescription>Average daily visitors over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visitors" fill="#FF9933" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Current Area Distribution</CardTitle>
              <CardDescription>Crowd distribution across temple areas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={areaData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {areaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Emergency Actions */}
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            Emergency Controls
          </CardTitle>
          <CardDescription>Quick actions for crowd management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="destructive" size="sm">
              Initiate Crowd Control
            </Button>
            <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700">
              Issue Advisory
            </Button>
            <Button variant="outline" size="sm">
              Contact Security
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrowdMonitor;