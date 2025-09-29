import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Car, MapPin, Clock, IndianRupee, Navigation, QrCode, 
  Smartphone, AlertTriangle, Shield, Calendar 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Parking = () => {
  const { t } = useTranslation();
  const [selectedZone, setSelectedZone] = useState('zone-a');
  const [reservationDate, setReservationDate] = useState('');
  const [vehicleType, setVehicleType] = useState('car');

  const parkingZones = [
    {
      id: 'zone-a',
      name: 'Zone A - Main Entrance',
      available: 45,
      total: 200,
      rate: 20,
      walkTime: '2 min',
      features: ['CCTV', 'Security', 'Covered'],
      distance: '50m from temple'
    },
    {
      id: 'zone-b',
      name: 'Zone B - Side Entrance',
      available: 78,
      total: 150,
      rate: 15,
      walkTime: '5 min',
      features: ['CCTV', 'Open Air'],
      distance: '150m from temple'
    },
    {
      id: 'zone-c',
      name: 'Zone C - Economy',
      available: 120,
      total: 300,
      rate: 10,
      walkTime: '8 min',
      features: ['Basic Security'],
      distance: '300m from temple'
    },
    {
      id: 'two-wheeler',
      name: 'Two Wheeler Zone',
      available: 250,
      total: 400,
      rate: 5,
      walkTime: '3 min',
      features: ['Covered', 'CCTV'],
      distance: '100m from temple'
    }
  ];

  const currentBookings = [
    {
      id: 'PK001',
      zone: 'Zone A',
      spot: 'A-23',
      date: 'Today',
      time: '8:00 AM - 2:00 PM',
      amount: '₹120',
      status: 'active'
    }
  ];

  const priceRates = {
    car: {
      hourly: 20,
      daily: 150,
      overnight: 100
    },
    bike: {
      hourly: 5,
      daily: 40,
      overnight: 25
    },
    bus: {
      hourly: 50,
      daily: 400,
      overnight: 250
    }
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'bg-green-100 text-green-800';
    if (percentage > 20) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getAvailabilityText = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'Good';
    if (percentage > 20) return 'Limited';
    return 'Nearly Full';
  };

  return (
    <div className="container mx-auto p-4 space-y-6 animate-fade-in">
      <div className="text-center py-4">
        <h1 className="text-3xl font-poppins font-bold text-primary mb-2">
          Parking Management
        </h1>
        <p className="text-muted-foreground">Find and reserve parking spots</p>
      </div>

      {/* Quick Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">493</div>
                <div className="text-sm text-muted-foreground">Available Spots</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">4</div>
                <div className="text-sm text-muted-foreground">Parking Zones</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <IndianRupee className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">₹5</div>
                <div className="text-sm text-muted-foreground">Starting Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-muted-foreground">Min Walk</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Bookings */}
      {currentBookings.length > 0 && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Your Active Booking
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentBookings.map((booking) => (
              <div key={booking.id} className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Booking ID</div>
                    <div className="font-medium">{booking.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Spot</div>
                    <div className="font-medium">{booking.zone} - {booking.spot}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="font-medium">{booking.time}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Amount</div>
                    <div className="font-medium">{booking.amount}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <QrCode className="w-4 h-4 mr-2" />
                    Show QR Code
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Navigation className="w-4 h-4 mr-2" />
                    Navigate to Spot
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Parking Zone Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Available Parking Zones
          </CardTitle>
          <CardDescription>Select a parking zone based on your preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {parkingZones.map((zone) => (
              <Card
                key={zone.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedZone === zone.id && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedZone(zone.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{zone.name}</h4>
                      <Badge className={getAvailabilityColor(zone.available, zone.total)}>
                        {getAvailabilityText(zone.available, zone.total)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Available:</span>
                        <span className="ml-1 font-medium">{zone.available}/{zone.total}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Rate:</span>
                        <span className="ml-1 font-medium">₹{zone.rate}/hour</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Walk:</span>
                        <span className="ml-1 font-medium">{zone.walkTime}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Distance:</span>
                        <span className="ml-1 font-medium">{zone.distance}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {zone.features.map((feature, index) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reservation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Reserve Parking Spot
          </CardTitle>
          <CardDescription>Book your parking in advance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Vehicle Type</label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="bike">Two Wheeler</SelectItem>
                  <SelectItem value="bus">Bus/Large Vehicle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2hours">2 Hours</SelectItem>
                  <SelectItem value="halfday">Half Day (6 hours)</SelectItem>
                  <SelectItem value="fullday">Full Day</SelectItem>
                  <SelectItem value="overnight">Overnight</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Vehicle Number</label>
            <Input placeholder="GJ-01-AB-1234" />
          </div>

          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Pricing Information</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Hourly:</span>
                <span className="ml-1 font-medium">₹{priceRates[vehicleType as keyof typeof priceRates]?.hourly}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Daily:</span>
                <span className="ml-1 font-medium">₹{priceRates[vehicleType as keyof typeof priceRates]?.daily}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Overnight:</span>
                <span className="ml-1 font-medium">₹{priceRates[vehicleType as keyof typeof priceRates]?.overnight}</span>
              </div>
            </div>
          </div>

          <Button className="w-full" size="lg">
            Reserve Parking Spot
          </Button>
        </CardContent>
      </Card>

      {/* Parking Rules & Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Parking Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Maximum parking duration: 12 hours</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Keep vehicle locked and valuables secure</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Parking fees are non-refundable</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Follow traffic rules within premises</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
              <span>UPI payments accepted</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
              <span>Credit/Debit cards supported</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
              <span>Cash payments at entry gate</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
              <span>Digital receipts via SMS/Email</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Parking;