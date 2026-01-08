import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getGroupByShareCode } from '@/utils/storage';
import { useNavigate } from 'react-router-dom';

interface JoinGroupModalProps {
  open: boolean;
  onClose: () => void;
  userId?: string;
}

const JoinGroupModal = ({ open, onClose, userId }: JoinGroupModalProps) => {
  const [shareCode, setShareCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const code = shareCode.trim().toUpperCase();
    if (!code || code.length !== 6) {
      toast({
        title: 'Invalid code',
        description: 'Please enter a valid 6-character share code',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate a small delay for UX
    setTimeout(() => {
      const group = getGroupByShareCode(code, userId);
      
      if (group) {
        toast({
          title: 'Group found!',
          description: `Joined "${group.name}" successfully`,
        });
        onClose();
        setShareCode('');
        navigate(`/group/${group.id}`);
      } else {
        toast({
          title: 'Group not found',
          description: 'No group found with this share code. Please check and try again.',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join a Group</DialogTitle>
          <DialogDescription>
            Enter a unique share code to join an existing squad.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="share-code">Share Code</Label>
            <Input
              id="share-code"
              placeholder="Enter 6-character code"
              value={shareCode}
              onChange={(e) => setShareCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="text-center text-2xl font-mono tracking-widest"
              autoComplete="off"
            />
            <p className="text-sm text-muted-foreground">
              Ask the group creator for the share code
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading || shareCode.length !== 6}>
              {isLoading ? 'Joining...' : 'Join Group'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupModal;
