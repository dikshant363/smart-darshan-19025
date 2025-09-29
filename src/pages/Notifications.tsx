import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, Filter, Search, Check, Trash2, AlertTriangle, 
  Calendar, Users, Car, MapPin, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Notifications = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const notifications = [
    {
      id: '1',
      type: 'emergency',
      title: 'Emergency Alert',
      message: 'High crowd density detected at Main Temple. Consider alternative routes.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'booking',
      title: 'Booking Confirmation',
      message: 'Your darshan booking for Somnath Temple at 8:00 AM tomorrow has been confirmed.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      priority: 'normal'
    },
    {
      id: '3',
      type: 'crowd',
      title: 'Crowd Update',
      message: 'Queue wait time reduced to 25 minutes. Good time to visit!',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true,
      priority: 'low'
    },
    {
      id: '4',
      type: 'traffic',
      title: 'Traffic Alert',
      message: 'Construction work on NH-8A causing 20-minute delays. Plan accordingly.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: true,
      priority: 'normal'
    },
    {
      id: '5',
      type: 'booking',
      title: 'Booking Reminder',
      message: 'Your darshan is in 1 hour. QR code ready for entry.',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      read: false,
      priority: 'high'
    },
    {
      id: '6',
      type: 'crowd',
      title: 'Peak Hour Warning',
      message: 'Expected high crowd between 6-8 PM. Book your slot in advance.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      priority: 'normal'
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'booking': return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'crowd': return <Users className="w-5 h-5 text-yellow-500" />;
      case 'traffic': return <Car className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'unread' && !notification.read) ||
                         (selectedFilter === 'read' && notification.read) ||
                         notification.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'emergency', label: 'Emergency', count: notifications.filter(n => n.type === 'emergency').length },
    { value: 'booking', label: 'Bookings', count: notifications.filter(n => n.type === 'booking').length },
    { value: 'crowd', label: 'Crowd', count: notifications.filter(n => n.type === 'crowd').length },
    { value: 'traffic', label: 'Traffic', count: notifications.filter(n => n.type === 'traffic').length },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6 animate-fade-in">
      <div className="text-center py-4">
        <h1 className="text-3xl font-poppins font-bold text-primary mb-2">
          Notifications
        </h1>
        <p className="text-muted-foreground">Stay updated with latest alerts and updates</p>
      </div>

      {/* Notification Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{notifications.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
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
                <div className="text-2xl font-bold">{unreadCount}</div>
                <div className="text-sm text-muted-foreground">Unread</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {notifications.filter(n => n.type === 'crowd').length}
                </div>
                <div className="text-sm text-muted-foreground">Crowd Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {notifications.filter(n => n.type === 'booking').length}
                </div>
                <div className="text-sm text-muted-foreground">Bookings</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Check className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {filterOptions.map((option) => (
            <TabsTrigger key={option.value} value={option.value} className="text-xs">
              {option.label}
              {option.count > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {option.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedFilter} className="mt-6">
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={cn(
                    "transition-all hover:shadow-md",
                    !notification.read && "bg-blue-50/50 border-blue-200"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-3">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {getTimeAgo(notification.timestamp)}
                          </div>
                          
                          <div className="flex gap-2">
                            {!notification.read && (
                              <Button variant="ghost" size="sm" className="text-xs">
                                Mark as Read
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="text-xs">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No notifications found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? 'Try adjusting your search terms or filters'
                      : 'You\'re all caught up! No new notifications.'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;