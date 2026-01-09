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

  // Sync initialData to state when modal opens or initialData changes
  useEffect(() => {
    if (open && initialData) {
      if (initialData.amount) setAmount(initialData.amount);
      if (initialData.title) setTitle(initialData.title);
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0 || !paidBy) return;

    onSave({
      title: title.trim(),
      amount: numAmount,
      paidBy,
      splitAmong: members,
      category,
      createdAt: Date.now(),
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Expense</DialogTitle>
          <DialogDescription>
            Log a new expense to track who paid and how it's split.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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

          <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
            Split equally among all {members.length} members
          </div>

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
