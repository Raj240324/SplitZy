import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, Link as LinkIcon, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ShareGroupModalProps {
  open: boolean;
  onClose: () => void;
  groupName: string;
  shareCode: string;
}

const ShareGroupModal = ({ open, onClose, groupName, shareCode }: ShareGroupModalProps) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const { toast } = useToast();

  const baseUrl = window.location.origin;
  const inviteLink = `${baseUrl}/join?code=${shareCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopiedLink(true);
      toast({
        title: 'Link Copied!',
        description: 'Invite link copied to clipboard',
      });
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the link manually',
        variant: 'destructive',
      });
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(shareCode);
      setCopiedCode(true);
      toast({
        title: 'Code Copied!',
        description: 'Share code copied to clipboard',
      });
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the code manually',
        variant: 'destructive',
      });
    }
  };

  const handleShareMessage = async () => {
    const message = `Join my expense group "${groupName}" on SplitZy!\n\n${inviteLink}\n\nGroup Code: ${shareCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ 
          title: `Join ${groupName} on SplitZy`,
          text: message,
          url: inviteLink
        });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(message);
      toast({
        title: 'Copied!',
        description: 'Full invite message copied',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Share Group</DialogTitle>
          <DialogDescription>
            Invite others to join "{groupName}" to start splitting expenses together.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          {/* Invite Link Section */}
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Invite Link</p>
            <div className="flex items-center gap-2 p-1.5 bg-muted/50 rounded-2xl border border-border/50">
              <div className="flex-1 px-3 py-2 text-sm font-medium truncate opacity-70">
                {inviteLink}
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleCopyLink}
                className="rounded-xl h-9 px-3 gap-2 font-bold"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
                {copiedLink ? "Copied" : "Copy Link"}
              </Button>
            </div>
          </div>
          
          {/* Share Code Section */}
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Group Code</p>
            <div className="flex items-center justify-between gap-2 p-4 bg-primary/5 rounded-3xl border border-primary/10">
              <div className="text-3xl font-mono tracking-[0.3em] font-black text-primary ml-2">
                {shareCode}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCopyCode}
                className="h-12 w-12 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all"
              >
                {copiedCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1 rounded-2xl h-12 font-bold">
              Close
            </Button>
            <Button onClick={handleShareMessage} className="flex-1 rounded-2xl h-12 font-bold gap-2">
              <Share2 className="w-4 h-4" />
              Send Invite
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareGroupModal;
