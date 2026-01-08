import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ShareGroupModalProps {
  open: boolean;
  onClose: () => void;
  groupName: string;
  shareCode: string;
}

const ShareGroupModal = ({ open, onClose, groupName, shareCode }: ShareGroupModalProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareCode);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Share code copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the code manually',
        variant: 'destructive',
      });
    }
  };

  const handleShareMessage = async () => {
    const message = `Join my expense group "${groupName}" on Splitzy!\n\nShare code: ${shareCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text: message });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(message);
      toast({
        title: 'Copied!',
        description: 'Share message copied to clipboard',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Share this code with others so they can join "{groupName}"
          </p>
          
          <div className="flex items-center justify-center gap-2">
            <div className="bg-muted rounded-lg px-6 py-4 text-3xl font-mono tracking-widest font-bold">
              {shareCode}
            </div>
            <Button variant="outline" size="icon" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button onClick={handleShareMessage} className="flex-1">
              Share Invite
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareGroupModal;
