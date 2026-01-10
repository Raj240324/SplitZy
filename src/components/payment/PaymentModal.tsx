import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, Smartphone, Copy, ExternalLink, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateUpiLink, generateTransactionRef } from '@/utils/payment';
import MemberAvatar from '../MemberAvatar';
import QRCode from 'react-qr-code';

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
  const [transactionRef, setTransactionRef] = useState<string>('');

  // Reset step on open and generate fresh transaction reference
  useEffect(() => {
    if (open) {
      setStep('method'); 
      setTransactionRef(generateTransactionRef());
    }
  }, [open]);

  const upiLink = toUser.upiId 
    ? generateUpiLink(toUser.upiId, toUser.name, amount, `Payment to ${toUser.name}`, transactionRef) 
    : '';

  const handleCopyUpi = () => {
    if (toUser.upiId) {
      navigator.clipboard.writeText(toUser.upiId);
      toast({ title: 'UPI ID Copied' });
    }
  };

  const handleMarkPaid = () => {
    onPaymentComplete(paymentMethod);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settlement</DialogTitle>
          <DialogDescription>
            Choose a payment method to settle with {toUser.name}
          </DialogDescription>
        </DialogHeader>

        {step === 'method' && (
          <div className="space-y-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
              <div className="flex items-center gap-3">
                <MemberAvatar name={fromUser.name} size="sm" />
                <div className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">pays</div>
                <MemberAvatar name={toUser.name} size="sm" />
              </div>
              <div className="text-xl sm:text-2xl font-bold tracking-tight">
                {currencySymbol}{amount.toFixed(2)}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold px-1">Select Payment Method</p>
              
              <Button 
                variant="outline" 
                className="w-full justify-between h-auto min-h-[4rem] p-4 rounded-xl hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 group"
                disabled={!toUser.upiId}
                onClick={() => { setPaymentMethod('upi'); setStep('pay'); }}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors shrink-0">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left overflow-hidden">
                    <div className="font-bold text-sm">UPI Payment</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-none">
                      {toUser.upiId ? (
                        <span className="font-mono">{toUser.upiId}</span>
                      ) : (
                        'No UPI linked'
                      )}
                    </div>
                  </div>
                </div>
                {toUser.upiId && <Badge variant="secondary" className="px-1.5 py-0 font-bold bg-primary/20 text-primary border-none text-[9px] shrink-0">QR FIRST</Badge>}
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-between h-auto min-h-[4rem] p-4 rounded-xl hover:bg-green-500/5 hover:border-green-500/50 transition-all duration-300 group"
                onClick={() => { setPaymentMethod('cash'); handleMarkPaid(); }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors shrink-0">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm">Mark as Paid</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">Cash or offline settlement</div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        )}

        {step === 'pay' && paymentMethod === 'upi' && (
          <div className="space-y-6 py-2">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-zinc-100 flex items-center justify-center">
                {upiLink && (
                  <QRCode 
                    value={upiLink} 
                    size={220}
                    level="H"
                    className="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px]"
                  />
                )}
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="font-bold text-lg">Scan using any UPI app</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-primary" />
                  QR payments are safer and fully supported on web.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3 pt-2">
              <Button 
                variant="secondary" 
                className="w-full h-12 rounded-xl border border-orange-200/50 hover:bg-orange-50 hover:border-orange-300 transition-all text-orange-800 font-medium" 
                onClick={() => window.location.href = upiLink}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Open UPI App <span className="text-[10px] ml-1 opacity-70">(May show warning)</span>
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleCopyUpi} className="rounded-xl h-11 text-xs">
                    <Copy className="w-3.5 h-3.5 mr-2" /> Copy UPI ID
                </Button>
                <Button variant="outline" onClick={handleMarkPaid} className="rounded-xl h-11 text-xs font-bold text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300">
                    <Check className="w-3.5 h-3.5 mr-2" /> I Have Paid
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-orange-50/50 rounded-xl border border-orange-100 italic">
                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-[10.5px] leading-relaxed text-orange-900/80">
                  <span className="font-bold">Security Note:</span> Browsers may flag direct UPI deep links as risky. 
                  Scanning the QR code is the <span className="font-bold">standard & most secure</span> way to pay from a web browser.
                </p>
            </div>

            <Button variant="ghost" onClick={() => setStep('method')} className="w-full rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
            </Button>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
};
