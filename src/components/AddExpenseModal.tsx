import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import MemberAvatar from "./MemberAvatar";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Expense } from "@/types";

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  members: string[];
  onSave: (expense: Omit<Expense, "id">) => void;
  initialData?: { amount?: string; title?: string };
}

const categories = [
  { value: "groceries", label: "Groceries" },
  { value: "transport", label: "Transport" },
  { value: "lodging", label: "Lodging" },
  { value: "dining", label: "Dining" },
  { value: "other", label: "Other" },
];

const AddExpenseModal = ({
  open,
  onClose,
  members,
  onSave,
  initialData
}: AddExpenseModalProps) => {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [category, setCategory] = useState<Expense["category"]>("other");
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [splitDetails, setSplitDetails] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Sync initialData to state when modal opens or initialData changes
  useEffect(() => {
    if (open && initialData) {
      if (initialData.amount) setAmount(initialData.amount);
      if (initialData.title) setTitle(initialData.title);
    }
    if (open) {
      const initial: Record<string, string> = {};
      members.forEach(m => initial[m] = "");
      setSplitDetails(initial);
      setSplitType('equal');
    }
  }, [open, initialData, members]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0 || !paidBy) return;

    let finalSplitDetails: Record<string, number> | undefined = undefined;
    if (splitType === 'custom') {
      const details: Record<string, number> = {};
      let total = 0;
      members.forEach(m => {
        const val = parseFloat(splitDetails[m] || '0');
        details[m] = val;
        total += val;
      });

      if (Math.abs(total - numAmount) > 0.01) {
        toast({
          title: "Total mismatch",
          description: `Custom splits (₹${total.toFixed(2)}) must equal total (₹${numAmount.toFixed(2)})`,
          variant: "destructive"
        });
        return;
      }
      finalSplitDetails = details;
    }

    onSave({
      title: title.trim(),
      amount: numAmount,
      paidBy,
      splitAmong: members,
      category,
      createdAt: Date.now(),
      splitType,
      splitDetails: finalSplitDetails
    });

    handleClose();
  };

  const handleClose = () => {
    setAmount("");
    setTitle("");
    setPaidBy("");
    setCategory("other");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto px-4 sm:px-6">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Expense</DialogTitle>
          <DialogDescription>
            Log a new expense to track who paid and how it's split.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                ₹
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-14 text-2xl font-semibold pl-8"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Dinner at restaurant"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as Expense["category"])}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Paid By */}
          <div className="space-y-2">
            <Label>Paid by</Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Who paid?" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member} value={member}>
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Split Mode */}
          <div className="space-y-3 pb-2 pt-1">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Split Strategy</Label>
            <div className="flex p-1 bg-muted rounded-2xl gap-1">
              <Button
                type="button"
                variant={splitType === 'equal' ? 'secondary' : 'ghost'}
                className={cn(
                  "flex-1 rounded-xl h-10 font-black text-[10px] uppercase tracking-widest transition-all",
                  splitType === 'equal' && "bg-background shadow-md text-primary"
                )}
                onClick={() => setSplitType('equal')}
              >
                Split Equally
              </Button>
              <Button
                type="button"
                variant={splitType === 'custom' ? 'secondary' : 'ghost'}
                className={cn(
                  "flex-1 rounded-xl h-10 font-black text-[10px] uppercase tracking-widest transition-all",
                  splitType === 'custom' && "bg-background shadow-md text-primary"
                )}
                onClick={() => setSplitType('custom')}
              >
                Custom Split
              </Button>
            </div>
          </div>

          {/* Custom Split Inputs */}
          {splitType === 'custom' && (
            <div className="space-y-3 p-4 bg-muted/30 rounded-3xl border border-border/50 animate-in fade-in slide-in-from-top-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Individual Shares</p>
              {members.map(member => (
                <div key={member} className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-2">
                    <MemberAvatar name={member} size="xs" className="ring-1 ring-border" />
                    <span className="text-[11px] font-bold truncate">{member}</span>
                  </div>
                  <div className="relative w-28">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-bold">₹</span>
                    <Input
                      type="number"
                      placeholder="0"
                      value={splitDetails[member] || ''}
                      onChange={(e) => setSplitDetails({ ...splitDetails, [member]: e.target.value })}
                      className="h-8 pl-5 text-right font-black text-xs rounded-xl"
                    />
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-border/50 mt-1 flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Split Sum</span>
                <span className={cn(
                  "text-xs font-black",
                  Math.abs(Object.values(splitDetails).reduce((sum, v) => sum + (parseFloat(v) || 0), 0) - (parseFloat(amount) || 0)) < 0.01 
                    ? "text-primary" 
                    : "text-destructive"
                )}>
                  ₹{Object.values(splitDetails).reduce((sum, v) => sum + (parseFloat(v) || 0), 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {splitType === 'equal' && (
            <div className="bg-muted/50 rounded-2xl p-4 text-[11px] font-bold text-muted-foreground flex items-center justify-between border border-border/50">
              <span>Split equally among members</span>
              <span className="text-primary font-black">₹{amount ? (parseFloat(amount) / members.length).toFixed(2) : '0.00'} / each</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;
