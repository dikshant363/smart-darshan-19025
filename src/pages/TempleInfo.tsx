import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Phone, Camera, Calendar, Heart, Star } from 'lucide-react';

const TempleInfo = () => {
  const { t } = useTranslation();
  const { templeId } = useParams();

  // Mock temple data
  const templeData = {
    somnath: {
      name: t('temple.somnath'),
      location: 'Prabhas Patan, Veraval, Gujarat',
      description: 'The Somnath Temple is one of the most sacred Shiva temples and is considered the first among the twelve Jyotirlinga shrines.',
      timings: ['5:00 AM - 9:00 PM', 'Aarti: 7:00 AM, 12:00 PM, 7:00 PM'],
      facilities: ['Parking', 'Wheelchair Access', 'Food Court', 'Rest House', 'Medical Aid'],
      gallery: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
      contact: '+91 2876 231 175',
    },
    dwarka: {
      name: t('temple.dwarka'),
      location: 'Dwarka, Gujarat',
      description: 'Dwarkadhish Temple is dedicated to Lord Krishna and is one of the Char Dham pilgrimage sites.',
      timings: ['6:00 AM - 1:00 PM', '5:00 PM - 9:30 PM'],
      facilities: ['Parking', 'Cloak Room', 'Prasadam', 'Guest House'],
      gallery: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
      contact: '+91 2892 234 820',
    },
    ambaji: {
      name: t('temple.ambaji'),
      location: 'Ambaji, Banaskantha, Gujarat',
      description: 'Ambaji Temple is one of the 51 Shakti Peethas and is dedicated to Goddess Amba.',
      timings: ['4:00 AM - 11:30 PM'],
      facilities: ['Parking', 'Accommodation', 'Medical Center', 'Shopping'],
      gallery: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
      contact: '+91 2749 273 727',
    },
    pavagadh: {
      name: t('temple.pavagadh'),
      location: 'Pavagadh Hill, Panchmahal, Gujarat',
      description: 'Kalika Mata Temple at Pavagadh is a famous Shakti Peetha located on top of Pavagadh hill.',
      timings: ['5:00 AM - 8:00 PM', 'Ropeway: 8:00 AM - 6:00 PM'],
      facilities: ['Ropeway', 'Parking', 'Rest House', 'Food Stalls'],
      gallery: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
      contact: '+91 2676 262 565',
    },
  };

  const temple = templeData[templeId as keyof typeof templeData] || templeData.somnath;

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-3xl font-poppins font-bold text-primary mb-2">
          {temple.name}
        </h1>
        <p className="text-muted-foreground flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4" />
          {temple.location}
        </p>
      </div>

      {/* Image Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {temple.gallery.map((image, index) => (
              <div
                key={index}
                className="aspect-video bg-muted rounded-lg flex items-center justify-center"
              >
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Temple Description */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {temple.description}
          </p>
        </CardContent>
      </Card>

      {/* Timings & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Darshan Timings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {temple.timings.map((timing, index) => (
              <p key={index} className="text-muted-foreground">
                {timing}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{temple.contact}</p>
            <Button className="w-full">
              Call Temple Office
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Facilities */}
      <Card>
        <CardHeader>
          <CardTitle>Facilities Available</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {temple.facilities.map((facility, index) => (
              <Badge key={index} variant="secondary">
                {facility}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Festival Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Festivals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Maha Shivratri</p>
              <p className="text-sm text-muted-foreground">Special celebrations</p>
            </div>
            <Badge>Mar 8, 2024</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Kartik Purnima</p>
              <p className="text-sm text-muted-foreground">Major festival</p>
            </div>
            <Badge>Nov 15, 2024</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Book Darshan
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Add to Favorites
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          Virtual Tour
        </Button>
      </div>
    </div>
  );
};

export default TempleInfo;