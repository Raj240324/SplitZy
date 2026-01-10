import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle } from "lucide-react";

interface EditMemberModalProps {
  open: boolean;
  onClose: () => void;
  memberName: string;
  onUpdate: (newName: string) => void;
  existingMembers: string[];
}

const EditMemberModal = ({ open, onClose, memberName, onUpdate, existingMembers }: EditMemberModalProps) => {
  const [name, setName] = useState(memberName);

  useEffect(() => {
    if (open) {
      setName(memberName);
    }
  }, [open, memberName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed === memberName) return;
    
    onUpdate(trimmed);
    onClose();
  };

  const isDuplicate = name.trim().toLowerCase() !== memberName.toLowerCase() && 
                      existingMembers.some(m => m.toLowerCase() === name.trim().toLowerCase());

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-primary" />
            Rename Member
          </DialogTitle>
          <DialogDescription>
            Change how "{memberName}" appears in this group and all their expenses.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="member-name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">New Name</Label>
            <Input
              id="member-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., John Doe"
              className="h-12 rounded-2xl bg-muted/30 border-transparent focus:border-primary/20 transition-all font-semibold"
              autoFocus
            />
            {isDuplicate && (
              <p className="text-xs text-destructive font-medium ml-1">This name already exists in the group.</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-2xl">
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || name.trim() === memberName || isDuplicate} className="rounded-2xl px-8 font-bold shadow-lg shadow-primary/20">
              Rename
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberModal;
