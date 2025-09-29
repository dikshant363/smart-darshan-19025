import { X, MapPin, History, HelpCircle, Settings, Info, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
  const { t } = useTranslation();

  const menuItems = [
    { to: '/temple-info', icon: MapPin, label: 'Temple Information' },
    { to: '/booking-history', icon: History, label: 'Booking History' },
    { to: '/notifications', icon: Heart, label: 'Notifications' },
    { to: '/help', icon: HelpCircle, label: 'Help & Support' },
    { to: '/settings', icon: Settings, label: 'Settings' },
    { to: '/about', icon: Info, label: 'About' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80">
        <SheetHeader className="text-left">
          <SheetTitle className="text-2xl font-poppins text-primary">
            Smart Darshan
          </SheetTitle>
        </SheetHeader>
        
        <nav className="mt-8 space-y-2">
          {menuItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Version 1.0.0</p>
            <p className="mt-2">Made with 🙏 for devotees</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;