import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle, Copy, ExternalLink } from 'lucide-react';
import { generateQRCode } from '@/lib/qrcode';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UPIPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  bookingId: string;
  onSuccess: () => void;
}

export const UPIPaymentDialog = ({ open, onClose, amount, bookingId, onSuccess }: UPIPaymentDialogProps) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [upiString, setUpiString] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [status, setStatus] = useState<'loading' | 'pending' | 'success' | 'failed'>('loading');
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      initializePayment();
    }
  }, [open]);

  const initializePayment = async () => {
    try {
      setStatus('loading');
      
      // Create UPI payment request using Supabase client
      const { data, error } = await supabase.functions.invoke('upi-payment', {
        body: {
          action: 'create',
          booking_id: bookingId,
          amount,
        },
      });

      if (error) throw error;
      
      if (data.success) {
        setUpiString(data.upi_string);
        setTransactionRef(data.transaction_reference);
        
        // Generate QR code from UPI string
        const qr = await generateQRCode(data.upi_string);
        setQrCode(qr);
        setStatus('pending');
      } else {
        throw new Error('Failed to create payment request');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      setStatus('failed');
      toast({
        title: 'Payment Error',
        description: 'Failed to initialize payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const copyUPIString = () => {
    navigator.clipboard.writeText(upiString);
    toast({
      title: 'Copied!',
      description: 'UPI ID copied to clipboard',
    });
  };

  const openUPIApp = () => {
    window.location.href = upiString;
  };

  const verifyPayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('upi-payment', {
        body: {
          action: 'verify',
          booking_id: bookingId,
          transaction_id: transactionRef,
        },
      });

      if (error) throw error;
      
      if (data.status === 'success') {
        setStatus('success');
        toast({
          title: 'Payment Successful!',
          description: 'Your booking has been confirmed.',
        });
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        toast({
          title: 'Payment Pending',
          description: 'Please complete the payment and verify again.',
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: 'Verification Failed',
        description: 'Could not verify payment status.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Scan QR code or use UPI apps to complete payment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">Generating payment request...</p>
            </div>
          )}

          {status === 'pending' && (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">₹{amount}</p>
                      <p className="text-sm text-muted-foreground">Amount to Pay</p>
                    </div>

                    {qrCode && (
                      <div className="p-4 bg-white rounded-lg">
                        <img src={qrCode} alt="UPI QR Code" className="w-48 h-48" />
                      </div>
                    )}

                    <div className="text-center text-xs text-muted-foreground">
                      <p>Transaction Ref: {transactionRef}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-2">
                <Button onClick={openUPIApp} className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Pay with UPI App
                </Button>
                <Button onClick={copyUPIString} variant="outline" className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy UPI ID
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground text-center mb-3">
                  After completing payment, click verify
                </p>
                <Button onClick={verifyPayment} variant="secondary" className="w-full">
                  Verify Payment
                </Button>
              </div>
            </>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
              <p className="mt-4 text-lg font-semibold">Payment Successful!</p>
              <p className="text-sm text-muted-foreground">Your booking has been confirmed</p>
            </div>
          )}

          {status === 'failed' && (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="w-16 h-16 text-red-600" />
              <p className="mt-4 text-lg font-semibold">Payment Failed</p>
              <Button onClick={initializePayment} className="mt-4">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
