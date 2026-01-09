import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { getGroupByShareCode } from '@/hooks/use-firestore';
import { joinGroupByShareCode } from "@/services/group.service";

interface JoinGroupModalProps {
  open: boolean;
  onClose: () => void;
  userId?: string;
}

const JoinGroupModal = ({ open, onClose, userId }: JoinGroupModalProps) => {
  const [shareCode, setShareCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) return;

    const code = shareCode.trim().toUpperCase();

    if (code.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a valid 6-character share code",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      await joinGroupByShareCode(code, userId);

      toast({
        title: "Joined group",
        description: "You have successfully joined the group",
      });

      setShareCode("");
      onClose();
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Join failed",
        description: err?.message || "Unable to join group",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join a Group</DialogTitle>
          <DialogDescription>
            Enter the share code to join an existing group.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="share-code">Share Code</Label>
            <Input
              id="share-code"
              placeholder="ABC123"
              value={shareCode}
              onChange={(e) => setShareCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="text-center text-2xl font-mono tracking-widest"
              autoComplete="off"
            />
            <p className="text-sm text-muted-foreground">
              Ask the group creator for the 6-character code
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || shareCode.length !== 6}
            >
              {isLoading ? "Joining..." : "Join Group"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupModal;
