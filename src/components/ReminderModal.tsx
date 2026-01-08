import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ReminderModalProps {
  open: boolean;
  onClose: () => void;
  memberName: string;
  amount: number;
  groupName: string;
  getCurrencySymbol: () => string;
}

const ReminderModal = ({ open, onClose, memberName, amount, groupName, getCurrencySymbol }: ReminderModalProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const defaultMessage = `Hey ${memberName}! 👋

Just a friendly reminder that you owe ${getCurrencySymbol()}${amount.toFixed(2)} for "${groupName}" expenses.

Please settle up when you get a chance! 🙏

- Sent via SplitZy`;

  const [message, setMessage] = useState(defaultMessage);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Reminder message copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the message manually',
        variant: 'destructive',
      });
    }
  };

  const handleWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Reminder to {memberName}</DialogTitle>
          <DialogDescription>
            Send a friendly nudge to {memberName} about their outstanding balance in "{groupName}".
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="resize-none"
          />
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCopy} className="flex-1">
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button onClick={handleWhatsApp} className="flex-1 bg-green-600 hover:bg-green-700">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
          
          <Button variant="ghost" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderModal;
