import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, Smartphone, QrCode, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateUpiLink } from '@/utils/payment';
import MemberAvatar from '../MemberAvatar';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  fromUser: { name: string; id?: string };
  toUser: { name: string; id?: string; upiId?: string }; // upiId is crucial
  amount: number;
  currencySymbol: string;
  onPaymentComplete: (method: 'upi' | 'cash') => void;
}

export const PaymentModal = ({ 
  open, 
  onClose, 
  fromUser, 
  toUser, 
  amount, 
  currencySymbol,
  onPaymentComplete 
}: PaymentModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'method' | 'pay' | 'confirm'>('method');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash'>('upi');

  // Reset step on open
  useEffect(() => {
    if (open) setStep('method'); 
  }, [open]);

  const upiLink = toUser.upiId 
    ? generateUpiLink(toUser.upiId, toUser.name, amount) 
    : '';

  const handleCopyUpi = () => {
    if (toUser.upiId) {
      navigator.clipboard.writeText(toUser.upiId);
      toast({ title: 'UPI ID Copied' });
    }
  };

  const handleCopyLink = () => {
    if (upiLink) {
        navigator.clipboard.writeText(upiLink);
        toast({ title: 'Payment Link Copied' });
    }
  };

  const handleMarkPaid = () => {
    onPaymentComplete(paymentMethod);
    setStep('confirm'); // Or close?
    // Actually, onPaymentComplete might close it. Let's assume user wants feedback.
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Make Payment</DialogTitle>
          <DialogDescription>
            Settle your debt with {toUser.name}
          </DialogDescription>
        </DialogHeader>

        {step === 'method' && (
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <MemberAvatar name={fromUser.name} />
                <div className="text-muted-foreground text-sm">pays</div>
                <MemberAvatar name={toUser.name} />
              </div>
              <div className="text-xl font-bold">
                {currencySymbol}{amount.toFixed(2)}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Select Payment Method</p>
              
              <Button 
                variant="outline" 
                className="w-full justify-between h-14"
                disabled={!toUser.upiId} // Disable if no UPI
                onClick={() => { setPaymentMethod('upi'); setStep('pay'); }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">UPI Apps</div>
                    <div className="text-xs text-muted-foreground">
                      {toUser.upiId ? 'GPay, PhonePe, Paytm' : 'Receiver has no UPI linked'}
                    </div>
                  </div>
                </div>
                {toUser.upiId && <Badge variant="secondary" className="mr-2">Instant</Badge>}
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-between h-14"
                onClick={() => { setPaymentMethod('cash'); handleMarkPaid(); }}
              >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-full">
                        <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                        <div className="font-semibold">Cash / Manual</div>
                        <div className="text-xs text-muted-foreground">Mark as paid manually</div>
                    </div>
                </div>
              </Button>
            </div>
          </div>
        )}

        {step === 'pay' && paymentMethod === 'upi' && (
          <div className="space-y-6">
            <div className="flex justify-center py-2">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiLink)}`} 
                alt="UPI QR Code" 
                className="rounded-lg shadow-sm border p-2"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleCopyUpi} className="w-full text-xs">
                    <Copy className="w-3 h-3 mr-2" /> Copy UPI ID
                </Button>
                <Button variant="outline" onClick={handleCopyLink} className="w-full text-xs">
                    <ExternalLink className="w-3 h-3 mr-2" /> Copy Link
                </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground px-4">
               Open any UPI app and scan the QR code, or use a deep link below.
            </div>

            <div className="grid grid-cols-3 gap-2">
               {/* Deep links often rely on OS handling 'upi://' scheme */}
               <Button className="col-span-3" onClick={() => window.location.href = upiLink}>
                  Open UPI App
               </Button>
            </div>

             <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setStep('method')} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={handleMarkPaid} className="flex-[2]">
                    I Have Paid
                </Button>
            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
};
