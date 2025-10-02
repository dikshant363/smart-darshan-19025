import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  HelpCircle, Search, Phone, Mail, MessageSquare, 
  BookOpen, Video, Download, ExternalLink, Star, Bot
} from 'lucide-react';
import { ChatAssistant } from '@/components/help/ChatAssistant';

const Help = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState('');

  const faqData = [
    {
      id: 'booking',
      question: 'How do I book a darshan slot?',
      answer: 'Go to the Booking section, select your preferred temple, choose a date and time slot, specify the number of visitors, and proceed with payment. You\'ll receive a QR code for entry.'
    },
    {
      id: 'queue',
      question: 'How accurate is the queue time prediction?',
      answer: 'Our AI-powered system analyzes real-time crowd data, historical patterns, and current conditions to provide estimates with 85-90% accuracy. Times are updated every 5 minutes.'
    },
    {
      id: 'parking',
      question: 'Can I reserve parking in advance?',
      answer: 'Yes! You can reserve parking spots up to 7 days in advance. Select your vehicle type, preferred zone, and duration. Payment can be made online or at the facility.'
    },
    {
      id: 'emergency',
      question: 'What happens when I press the emergency button?',
      answer: 'The emergency button immediately alerts temple security, local authorities, and your registered emergency contacts. Your location is shared automatically, and help is dispatched.'
    },
    {
      id: 'offline',
      question: 'Does the app work offline?',
      answer: 'Yes, the app stores essential information offline including your bookings, emergency contacts, and basic temple information. Real-time features require internet connection.'
    },
    {
      id: 'refund',
      question: 'What is the cancellation policy?',
      answer: 'Bookings can be cancelled up to 2 hours before the scheduled time with full refund. Cancellations within 2 hours are subject to 25% processing fee.'
    },
    {
      id: 'accessibility',
      question: 'Are there accessibility features?',
      answer: 'Yes! The app includes voice navigation, large text options, high contrast mode, priority booking for elderly/disabled, and wheelchair accessibility information.'
    },
    {
      id: 'languages',
      question: 'Which languages are supported?',
      answer: 'Smart Darshan supports English, Hindi, and Gujarati. You can change the language in your profile settings or during initial setup.'
    }
  ];

  const tutorials = [
    {
      title: 'Getting Started with Smart Darshan',
      duration: '3:45',
      description: 'Complete walkthrough of app features and setup',
      thumbnail: '/placeholder.svg'
    },
    {
      title: 'Booking Your First Darshan',
      duration: '2:30',
      description: 'Step-by-step booking process guide',
      thumbnail: '/placeholder.svg'
    },
    {
      title: 'Using Emergency Features',
      duration: '4:15',
      description: 'Safety features and emergency procedures',
      thumbnail: '/placeholder.svg'
    },
    {
      title: 'Understanding Crowd Predictions',
      duration: '3:00',
      description: 'How to read and use crowd analytics',
      thumbnail: '/placeholder.svg'
    }
  ];

  const supportChannels = [
    {
      name: 'Phone Support',
      description: '24/7 helpline for urgent issues',
      contact: '+91 1800-123-4567',
      icon: Phone,
      action: 'Call Now'
    },
    {
      name: 'Email Support',
      description: 'Detailed queries and feedback',
      contact: 'support@smartdarshan.in',
      icon: Mail,
      action: 'Send Email'
    },
    {
      name: 'Live Chat',
      description: 'Instant messaging with support team',
      contact: 'Available 6 AM - 10 PM',
      icon: MessageSquare,
      action: 'Start Chat'
    }
  ];

  const troubleshootingSteps = [
    {
      issue: 'App not loading',
      steps: [
        'Check your internet connection',
        'Close and restart the app',
        'Clear app cache in settings',
        'Update to latest version',
        'Restart your device'
      ]
    },
    {
      issue: 'QR code not scanning',
      steps: [
        'Ensure adequate lighting',
        'Clean your camera lens',
        'Hold device steady',
        'Check QR code isn\'t damaged',
        'Try manual entry option'
      ]
    },
    {
      issue: 'Payment failed',
      steps: [
        'Check internet connection',
        'Verify card/UPI details',
        'Ensure sufficient balance',
        'Try alternative payment method',
        'Contact your bank if issue persists'
      ]
    }
  ];

  const filteredFAQ = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 space-y-6 animate-fade-in">
      <div className="text-center py-4">
        <h1 className="text-3xl font-poppins font-bold text-primary mb-2">
          Help & Support
        </h1>
        <p className="text-muted-foreground">Get help with Smart Darshan features</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help articles, FAQs, or features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="ai-chat" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="ai-chat">
            <Bot className="w-4 h-4 mr-1" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* AI Chat Tab */}
        <TabsContent value="ai-chat">
          <ChatAssistant />
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Find answers to common questions about Smart Darshan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQ.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              {filteredFAQ.length === 0 && (
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No FAQs found matching your search.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Video Tutorials
              </CardTitle>
              <CardDescription>
                Watch step-by-step guides for using Smart Darshan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tutorials.map((tutorial, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                        <Video className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">{tutorial.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {tutorial.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Duration: {tutorial.duration}
                          </span>
                          <Button size="sm" variant="outline">
                            <Video className="w-4 h-4 mr-2" />
                            Watch
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Troubleshooting Tab */}
        <TabsContent value="troubleshooting">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Troubleshooting Guide
              </CardTitle>
              <CardDescription>
                Step-by-step solutions for common issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {troubleshootingSteps.map((guide, index) => (
                  <div key={index}>
                    <h4 className="font-semibold mb-3">{guide.issue}</h4>
                    <ol className="space-y-2">
                      {guide.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                            {stepIndex + 1}
                          </div>
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ol>
                    {index < troubleshootingSteps.length - 1 && (
                      <hr className="my-6 border-muted" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact">
          <div className="space-y-6">
            {/* Support Channels */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Choose the best way to reach our support team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {supportChannels.map((channel, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <channel.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{channel.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {channel.description}
                          </div>
                          <div className="text-sm font-medium">{channel.contact}</div>
                        </div>
                      </div>
                      <Button variant="outline">
                        {channel.action}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feedback Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send Feedback</CardTitle>
                <CardDescription>
                  Help us improve Smart Darshan with your suggestions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Message</label>
                  <Textarea
                    placeholder="Tell us about your experience or suggest improvements..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rate your experience</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-6 h-6 text-yellow-400 cursor-pointer hover:text-yellow-500" />
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  Send Feedback
                </Button>
              </CardContent>
            </Card>

            {/* Quick Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download User Manual
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Knowledge Base
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Help;