import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Group } from "@/types";
import { Settings2 } from "lucide-react";

interface EditGroupModalProps {
  open: boolean;
  onClose: () => void;
  group: Group;
  onUpdate: (data: Partial<Group>) => void;
}

const currencies = [
  { value: "INR", label: "₹ Indian Rupee (INR)" },
  { value: "USD", label: "$ US Dollar (USD)" },
  { value: "EUR", label: "€ Euro (EUR)" },
  { value: "GBP", label: "£ British Pound (GBP)" },
];

const EditGroupModal = ({ open, onClose, group, onUpdate }: EditGroupModalProps) => {
  const [name, setName] = useState(group.name);
  const [currency, setCurrency] = useState(group.currency || "INR");

  useEffect(() => {
    if (open) {
      setName(group.name);
      setCurrency(group.currency || "INR");
    }
  }, [open, group]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onUpdate({
      name: name.trim(),
      currency
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            Edit Group
          </DialogTitle>
          <DialogDescription>
            Update the identity and preferences for this group.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="group-name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Group Name</Label>
            <Input
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Road Trip"
              className="h-12 rounded-2xl bg-muted/30 border-transparent focus:border-primary/20 transition-all font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="currency" className="h-12 rounded-2xl bg-muted/30 border-transparent focus:border-primary/20 transition-all font-semibold">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {currencies.map((c) => (
                  <SelectItem key={c.value} value={c.value} className="rounded-xl">
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-2xl">
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()} className="rounded-2xl px-8 font-bold shadow-lg shadow-primary/20">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditGroupModal;
