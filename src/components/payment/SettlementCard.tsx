import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { Expense } from '@/types';
import { formatCurrency } from '@/utils/calculations';
import MemberAvatar from '@/components/MemberAvatar';
import { updateSettlementStatus } from '@/services/group.service';
import { useToast } from '@/hooks/use-toast';

interface SettlementCardProps {
  settlement: Expense;
  currentUserName: string;
  groupId: string;
}

export const SettlementCard = ({ settlement, currentUserName, groupId }: SettlementCardProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const isPayer = settlement.paidBy === currentUserName;
  const isReceiver = settlement.settledWith === currentUserName || (settlement.splitAmong && settlement.splitAmong[0] === currentUserName);
  
  if (settlement.type !== 'settlement') return null;

  const handleStatusUpdate = async (status: 'confirmed' | 'failed') => {
    setLoading(true);
    try {
      await updateSettlementStatus(groupId, settlement.id, status, currentUserName);
      toast({ 
        title: status === 'confirmed' ? 'Payment Confirmed' : 'Payment Rejected',
        variant: status === 'confirmed' ? 'default' : 'destructive'
      });
    } catch (error) {
      toast({ title: 'Error updating status', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const status = settlement.paymentStatus || 'pending'; // Default to pending if legacy

  return (
    <Card className="mb-3 border-l-4 border-l-primary">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
           {/* Status Icon */}
           <div className={`p-2 rounded-full ${
             status === 'completed' ? 'bg-green-100 text-green-600' :
             status === 'failed' ? 'bg-red-100 text-red-600' :
             'bg-yellow-100 text-yellow-600'
           }`}>
             {status === 'completed' ? <Check className="w-5 h-5" /> : 
              status === 'failed' ? <AlertCircle className="w-5 h-5" /> : 
              <Clock className="w-5 h-5" />}
           </div>

           <div>
             <div className="font-semibold text-sm flex items-center gap-2">
               <span>{settlement.paidBy}</span>
               <span className="text-muted-foreground">paid</span>
               <span>{settlement.settledWith || settlement.splitAmong[0]}</span>
             </div>
             <div className="text-xs text-muted-foreground mt-0.5">
               {formatCurrency(settlement.amount)} • {status === 'completed' ? 'Settled' : status === 'failed' ? 'Rejected' : 'Pending Confirmation'}
             </div>
           </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {status === 'pending' && isReceiver && (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => handleStatusUpdate('failed')}
                disabled={loading}
                title="Reject Payment"
              >
                <X className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleStatusUpdate('confirmed')}
                disabled={loading}
              >
                Confirm
              </Button>
            </>
          )}
          
          {status === 'pending' && !isReceiver && (
             <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
               Waiting
             </Badge>
          )}

          {status === 'completed' && (
             <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
               Confirmed
             </Badge>
          )}

           {status === 'failed' && (
             <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
               Failed
             </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
