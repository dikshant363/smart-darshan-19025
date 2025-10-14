import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Heart, Users, Shield, Zap, Phone, Mail, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-poppins font-bold text-primary mb-2">
          Smart Darshan
        </h1>
        <p className="text-muted-foreground text-lg">
          Your Spiritual Journey Companion
        </p>
        <Badge variant="secondary" className="mt-3">
          Version 1.0.0
        </Badge>
      </div>

      {/* Mission */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Smart Darshan revolutionizes crowd management and enhances the pilgrimage experience 
            at Gujarat's most sacred destinations including Somnath, Dwarka, Ambaji, and Pavagadh. 
            We leverage AI-powered crowd prediction, IoT integration, and real-time data analytics 
            to provide seamless darshan booking, queue management, and safety monitoring for millions 
            of devotees visiting these holy sites.
          </p>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
          <CardDescription>What makes Smart Darshan special</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">AI-Powered Crowd Management</h3>
              <p className="text-sm text-muted-foreground">
                Real-time crowd density monitoring and AI-based surge prediction for better planning
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Smart Queue Management</h3>
              <p className="text-sm text-muted-foreground">
                Virtual queue system with real-time updates and QR code-based entry
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Emergency & Safety</h3>
              <p className="text-sm text-muted-foreground">
                Panic button, medical assistance, and real-time evacuation guidance
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Multilingual Support</h3>
              <p className="text-sm text-muted-foreground">
                Available in Gujarati, Hindi, and English with audio navigation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Temples Covered */}
      <Card>
        <CardHeader>
          <CardTitle>Temples Covered</CardTitle>
          <CardDescription>Sacred destinations we serve</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-1">Somnath Temple</h3>
              <p className="text-sm text-muted-foreground">Saurashtra, Gujarat</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-1">Dwarkadhish Temple</h3>
              <p className="text-sm text-muted-foreground">Dwarka, Gujarat</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-1">Ambaji Temple</h3>
              <p className="text-sm text-muted-foreground">Banaskantha, Gujarat</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-1">Pavagadh Temple</h3>
              <p className="text-sm text-muted-foreground">Panchmahal, Gujarat</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>Get in touch with our team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-3">
            <Mail className="h-4 w-4" />
            support@smartdarshan.com
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3">
            <Phone className="h-4 w-4" />
            +91 1800-XXX-XXXX
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3">
            <Globe className="h-4 w-4" />
            www.smartdarshan.com
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center py-6 text-muted-foreground">
        <p className="text-sm">Made with 🙏 for devotees</p>
        <p className="text-xs mt-2">© 2025 Smart Darshan. All rights reserved.</p>
      </div>
    </div>
  );
};

export default About;
