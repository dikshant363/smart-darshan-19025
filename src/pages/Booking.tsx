import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Users, Clock, IndianRupee, MapPin, Star, Minus, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { UPIPaymentDialog } from '@/components/booking/UPIPaymentDialog';
import { useToast } from '@/hooks/use-toast';
import somnathImage from '@/assets/somnath-temple.jpg';
import dwarkaImage from '@/assets/dwarka-temple.jpg';
import ambajiImage from '@/assets/ambaji-temple.jpg';
import pavagradhImage from '@/assets/pavagadh-temple.jpg';

const Booking = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedTemple, setSelectedTemple] = useState('somnath');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState('');
  const [visitorCount, setVisitorCount] = useState(2);
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const temples = [
    {
      id: 'somnath',
      name: t('temple.somnath'),
      location: 'Prabhas Patan, Veraval',
      image: somnathImage,
      crowdLevel: 'moderate',
      price: 50,
      rating: 4.8
    },
    {
      id: 'dwarka',
      name: t('temple.dwarka'),
      location: 'Dwarka, Gujarat',
      image: dwarkaImage,
      crowdLevel: 'high',
      price: 75,
      rating: 4.9
    },
    {
      id: 'ambaji',
      name: t('temple.ambaji'),
      location: 'Banaskantha, Gujarat',
      image: ambajiImage,
      crowdLevel: 'low',
      price: 40,
      rating: 4.7
    },
    {
      id: 'pavagadh',
      name: t('temple.pavagadh'),
      location: 'Panchmahal, Gujarat',
      image: pavagradhImage,
      crowdLevel: 'moderate',
      price: 60,
      rating: 4.6
    }
  ];

  const timeSlots = [
    { id: 'morning-1', time: '6:00 AM', label: 'Morning Aarti', available: 45, total: 50, price: 50 },
    { id: 'morning-2', time: '8:00 AM', label: 'Morning Darshan', available: 30, total: 60, price: 40 },
    { id: 'midday', time: '12:00 PM', label: 'Midday Aarti', available: 20, total: 40, price: 60 },
    { id: 'evening-1', time: '5:00 PM', label: 'Evening Darshan', available: 15, total: 80, price: 45 },
    { id: 'evening-2', time: '7:00 PM', label: 'Evening Aarti', available: 5, total: 50, price: 75 },
    { id: 'night', time: '9:00 PM', label: 'Night Darshan', available: 35, total: 40, price: 55 }
  ];

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const calculateTotal = () => {
    const slot = timeSlots.find(s => s.id === selectedSlot);
    return slot ? slot.price * visitorCount : 0;
  };

  return (
    <div className="container mx-auto p-4 space-y-6 animate-fade-in">
      <div className="text-center py-4">
        <h1 className="text-3xl font-poppins font-bold text-primary mb-2">
          {t('dashboard.book_darshan')}
        </h1>
        <p className="text-muted-foreground">Select your preferred temple and time</p>
      </div>

      {/* Temple Selection Carousel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Select Temple
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Carousel className="w-full">
            <CarouselContent>
              {temples.map((temple) => (
                <CarouselItem key={temple.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card 
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-lg hover-scale",
                      selectedTemple === temple.id && "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedTemple(temple.id)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                        <img 
                          src={temple.image} 
                          alt={temple.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{temple.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{temple.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{temple.location}</p>
                        <div className="flex items-center justify-between">
                          <Badge className={getCrowdColor(temple.crowdLevel)}>
                            {temple.crowdLevel} crowd
                          </Badge>
                          <span className="text-sm font-medium">₹{temple.price}/person</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>

      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {selectedDate && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Crowd Prediction for {format(selectedDate, "PPP")}</p>
              <div className="flex items-center gap-4">
                <Badge className="bg-yellow-100 text-yellow-800">Moderate Expected</Badge>
                <span className="text-sm text-muted-foreground">
                  Best time: 8:00 AM - 10:00 AM
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Time Slot Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Select Time Slot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timeSlots.map((slot) => (
              <Card
                key={slot.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedSlot === slot.id && "ring-2 ring-primary",
                  slot.available === 0 && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => slot.available > 0 && setSelectedSlot(slot.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{slot.time}</h4>
                      <span className="text-sm font-medium">₹{slot.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{slot.label}</p>
                    <div className="flex items-center justify-between">
                      <span className={cn("text-sm font-medium", getAvailabilityColor(slot.available, slot.total))}>
                        {slot.available}/{slot.total} available
                      </span>
                      {slot.available === 0 && (
                        <Badge variant="destructive">Full</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Visitor Count & Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Number of Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setVisitorCount(Math.max(1, visitorCount - 1))}
                disabled={visitorCount <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-2xl font-bold w-16 text-center">{visitorCount}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setVisitorCount(Math.min(10, visitorCount + 1))}
                disabled={visitorCount >= 10}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Special Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select requirements" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wheelchair">Wheelchair Access</SelectItem>
                <SelectItem value="elderly">Elderly Assistance</SelectItem>
                <SelectItem value="child">Child Friendly</SelectItem>
                <SelectItem value="vip">VIP Darshan</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Additional requests..."
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              className="mt-3"
            />
          </CardContent>
        </Card>
      </div>

      {/* Booking Summary */}
      {selectedDate && selectedSlot && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Booking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Temple:</span>
                <span className="font-medium">{temples.find(t => t.id === selectedTemple)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-medium">{format(selectedDate, "PPP")}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span className="font-medium">{timeSlots.find(s => s.id === selectedSlot)?.time}</span>
              </div>
              <div className="flex justify-between">
                <span>Visitors:</span>
                <span className="font-medium">{visitorCount}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹{calculateTotal()}</span>
              </div>
            </div>
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => {
                const tempBookingId = `BK${Date.now()}`;
                setBookingId(tempBookingId);
                setShowPayment(true);
              }}
            >
              Proceed to Payment
            </Button>
          </CardContent>
        </Card>
      )}

      <UPIPaymentDialog
        open={showPayment}
        onClose={() => setShowPayment(false)}
        amount={calculateTotal()}
        bookingId={bookingId}
        onSuccess={() => {
          toast({
            title: 'Booking Confirmed!',
            description: 'Your darshan booking has been successfully confirmed.',
          });
          // Reset form
          setSelectedDate(undefined);
          setSelectedSlot('');
          setVisitorCount(2);
          setSpecialRequirements('');
        }}
      />
    </div>
  );
};

export default Booking;