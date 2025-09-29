import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EmergencyFAB = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleEmergency = () => {
    navigate('/emergency');
  };

  return (
    <Button
      onClick={handleEmergency}
      size="lg"
      className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg"
      aria-label={t('common.emergency')}
    >
      <AlertTriangle className="h-6 w-6" />
    </Button>
  );
};

export default EmergencyFAB;