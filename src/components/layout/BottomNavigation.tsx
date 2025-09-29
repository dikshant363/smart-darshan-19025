import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Calendar, Users, Car, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  const { t } = useTranslation();

  const navItems = [
    { to: '/dashboard', icon: Home, label: t('nav.home') },
    { to: '/booking', icon: Calendar, label: t('nav.book') },
    { to: '/crowd-monitor', icon: Users, label: t('nav.crowd') },
    { to: '/traffic', icon: Car, label: t('nav.traffic') },
    { to: '/profile', icon: User, label: t('nav.profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center p-3 rounded-lg transition-colors",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;