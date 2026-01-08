import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MemberBalance } from '@/types';
import { Check, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MemberAvatar from './MemberAvatar';

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

interface SettleUpModalProps {
  open: boolean;
  onClose: () => void;
  balances: MemberBalance[];
  onSettle: (settlement: Settlement) => void;
  getCurrencySymbol: () => string;
}

const SettleUpModal = ({ open, onClose, balances, onSettle, getCurrencySymbol }: SettleUpModalProps) => {
  const { toast } = useToast();

  // Calculate simplified settlements
  const calculateSettlements = (): Settlement[] => {
    const settlements: Settlement[] = [];
    
    // Create a copy of balances sorted by net balance
    const debtors = balances
      .filter(b => b.netBalance < 0)
      .map(b => ({ member: b.member, amount: Math.abs(b.netBalance) }))
      .sort((a, b) => b.amount - a.amount);
    
    const creditors = balances
      .filter(b => b.netBalance > 0)
      .map(b => ({ member: b.member, amount: b.netBalance }))
      .sort((a, b) => b.amount - a.amount);

    // Match debtors with creditors
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      
      const amount = Math.min(debtor.amount, creditor.amount);
      
      if (amount > 0.01) { // Avoid tiny amounts
        settlements.push({
          from: debtor.member,
          to: creditor.member,
          amount: Math.round(amount * 100) / 100
        });
      }
      
      debtor.amount -= amount;
      creditor.amount -= amount;
      
      if (debtor.amount < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }
    
    return settlements;
  };

  const settlements = calculateSettlements();

  const handleSettle = (settlement: Settlement) => {
    onSettle(settlement);
    toast({
      title: 'Settlement recorded',
      description: `${settlement.from} paid ${getCurrencySymbol()}${settlement.amount.toFixed(2)} to ${settlement.to}`,
    });
  };

  const allSettled = settlements.length === 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settle Up</DialogTitle>
          <DialogDescription>
            Record payments to balance the squad's books.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {allSettled ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">All Settled!</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Everyone is square. No payments needed.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Here's the simplest way to settle all balances:
              </p>
              
              <div className="space-y-3">
                {settlements.map((settlement, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <MemberAvatar name={settlement.from} size="sm" />
                      <span className="font-medium text-sm">{settlement.from}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <MemberAvatar name={settlement.to} size="sm" />
                      <span className="font-medium text-sm">{settlement.to}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">
                        {getCurrencySymbol()}{settlement.amount.toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSettle(settlement)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground">
                Click the check button when a payment is made to record it.
              </p>
            </>
          )}
          
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettleUpModal;
