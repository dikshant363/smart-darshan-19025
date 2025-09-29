import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import BottomNavigation from './BottomNavigation';
import EmergencyFAB from './EmergencyFAB';
import SideMenu from './SideMenu';

const AppLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-inter">
      <AppHeader onMenuClick={() => setIsMenuOpen(true)} />
      
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <main className="pb-20">
        <Outlet />
      </main>
      
      <BottomNavigation />
      <EmergencyFAB />
    </div>
  );
};

export default AppLayout;