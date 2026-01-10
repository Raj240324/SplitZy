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
import { cn } from "@/lib/utils";
import MemberAvatar from "./MemberAvatar";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Expense } from "@/types";
import { 
  Receipt, 
  Utensils, 
  Car, 
  Home, 
  ShoppingBag,
  HelpCircle,
  ChevronDown, 
  Wallet,
  Users,
  X
} from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  members: string[];
  onSave: (expense: Omit<Expense, "id">) => void;
  initialData?: { amount?: string; title?: string };
  currencySymbol?: string;
}

const categories = [
  { value: "groceries", label: "Groceries", icon: ShoppingBag },
  { value: "transport", label: "Transport", icon: Car },
  { value: "lodging", label: "Lodging", icon: Home },
  { value: "dining", label: "Dining", icon: Utensils },
  { value: "other", label: "Other", icon: HelpCircle },
];

const AddExpenseModal = ({
  open,
  onClose,
  members,
  onSave,
  initialData,
  currencySymbol = "₹"
}: AddExpenseModalProps) => {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [category, setCategory] = useState<Expense["category"]>("other");
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [splitDetails, setSplitDetails] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();

  // Sync initialData to state
  useEffect(() => {
    if (open) {
      if (initialData) {
        if (initialData.amount) setAmount(initialData.amount);
        if (initialData.title) setTitle(initialData.title);
      }
      // Reset or init splits
      const initial: Record<string, string> = {};
      members.forEach(m => initial[m] = "");
      setSplitDetails(initial);
      setSplitType('equal');
      
      // Auto-select "You" or real name if available
      const myName = members.find(m => m === "You" || m === "Me") || members[0];
      if (myName && !paidBy) {
        setPaidBy(myName);
      }
    } else {
        // Reset when closed
        setAmount("");
        setTitle("");
        setPaidBy("");
        setCategory("other");
    }
  }, [open, initialData, members]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    
    if (!title.trim()) {
      toast({ title: "Missing details", description: "Please enter a description", variant: "destructive" });
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    if (!paidBy) {
      toast({ title: "Who paid?", description: "Please select who paid for this", variant: "destructive" });
      return;
    }

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

    // Track expense added event
    trackEvent("expense_added", {
      category,
      amount: numAmount,
      currency: currencySymbol,
      split_type: splitType,
      member_count: members.length
    });

    onClose();
  };

  const SelectedCategoryIcon = categories.find(c => c.value === category)?.icon || HelpCircle;
  const isFormValid = parseFloat(amount) > 0 && !!paidBy && !!title.trim();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-0 sm:max-w-md bg-background overflow-hidden flex flex-col h-[92vh] sm:h-auto sm:max-h-[90vh] rounded-t-[2rem] sm:rounded-3xl border-0 sm:border [&>button]:hidden">
        
        {/* Sticky Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div>
            <DialogTitle className="text-xl font-black tracking-tight">Add Expense</DialogTitle>
            <DialogDescription className="text-xs font-medium text-muted-foreground mt-0.5">
              Track who paid and how it's split
            </DialogDescription>
          </div>
          <DialogPrimitive.Close className="rounded-full p-2 bg-muted/50 hover:bg-muted transition-colors">
             <X className="w-4 h-4 text-foreground/70" />
          </DialogPrimitive.Close>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scroll-smooth min-h-0">
          <div className="px-6 py-8 pb-32">
            <form id="add-expense-form" onSubmit={handleSubmit} className="space-y-10">
            
            {/* Neo-Fintech Amount Hero - Balanced Size */}
            <div className="space-y-8 flex flex-col items-center py-4">
              <div className="flex flex-col items-center gap-2 w-full max-w-full overflow-hidden">
                <div className="relative group/amount flex items-center justify-center gap-4 px-4 transition-all duration-500">
                  <span className="text-5xl sm:text-6xl font-black text-primary select-none leading-none inline-flex items-center">
                    {currencySymbol}
                  </span>
                  <div className="relative flex items-center justify-center">
                    <input
                      type="number"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full text-center text-5xl sm:text-6xl font-black border-0 bg-transparent p-0 focus:outline-none focus:ring-0 placeholder:text-muted-foreground/5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none tracking-tighter leading-none text-primary"
                      autoFocus
                      min="0"
                      step="0.01"
                      style={{ width: `${Math.max(amount.length, 1) + 0.5}ch`, maxWidth: '100vw' }}
                    />
                  </div>
                </div>
                
                {/* Interactive Underline */}
                <div className="relative w-40 sm:w-48 h-1.5 mt-4">
                  <div className="absolute inset-0 bg-muted/20 rounded-full" />
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-r from-primary/40 via-primary to-primary/40 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(var(--primary),0.3)]",
                    amount ? "w-full scale-x-100" : "w-0 scale-x-0 group-focus-within/amount:w-full group-focus-within/amount:scale-x-100"
                  )} />
                </div>
                
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mt-4 animate-pulse">
                  {amount ? "Amount to split" : "Enter amount"}
                </Label>
              </div>
              
              <div className="max-w-[320px] w-full px-4">
                 <div className="relative group/title">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                       <Receipt className="h-4 w-4 text-muted-foreground/40 group-focus-within/title:text-primary transition-colors duration-300" />
                    </div>
                    <Input
                      placeholder="What is this for?"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="pl-11 h-14 rounded-2xl bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all text-center font-bold text-lg placeholder:font-medium placeholder:text-muted-foreground/30 shadow-sm"
                    />
                 </div>
              </div>
            </div>

            {/* Config Grid */}
            <div className="grid grid-cols-2 gap-4">
               {/* Category Select */}
               <div className="space-y-2">
                 <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Category</Label>
                 <Select value={category} onValueChange={(v) => setCategory(v as any)}>
                   <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-transparent hover:bg-muted/50 focus:ring-0 gap-2 px-3">
                     <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <SelectedCategoryIcon className="w-4 h-4" />
                     </div>
                     <span className="font-semibold truncate flex-1 text-left">
                       {categories.find(c => c.value === category)?.label}
                     </span>
                   </SelectTrigger>
                   <SelectContent>
                     {categories.map((cat) => (
                       <SelectItem key={cat.value} value={cat.value}>
                         <div className="flex items-center gap-2">
                            <cat.icon className="w-4 h-4 opacity-50" />
                            <span>{cat.label}</span>
                         </div>
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>

               {/* Paid By Select */}
               <div className="space-y-2">
                 <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Paid By</Label>
                 <Select value={paidBy} onValueChange={setPaidBy}>
                   <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-transparent hover:bg-muted/50 focus:ring-0 gap-2 px-3">
                      {paidBy ? (
                        <MemberAvatar name={paidBy} size="sm" className="w-8 h-8" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted-foreground/10 flex items-center justify-center shrink-0">
                           <Wallet className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                     <span className={cn("font-semibold truncate flex-1 text-left", !paidBy && "text-muted-foreground font-normal")}>
                       {paidBy || "Who paid?"}
                     </span>
                   </SelectTrigger>
                   <SelectContent>
                     {members.map((m) => (
                       <SelectItem key={m} value={m}>
                         <div className="flex items-center gap-2">
                            <MemberAvatar name={m} size="xs" />
                            <span>{m}</span>
                         </div>
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
            </div>

            {/* Split Strategy Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-black tracking-widest">
                  Split Strategy
                </span>
              </div>
            </div>

            {/* Split Toggle */}
            <div className="bg-muted/30 p-1.5 rounded-[1.5rem] flex gap-1">
               <button
                 type="button"
                 onClick={() => setSplitType('equal')}
                 className={cn(
                   "flex-1 py-3 px-4 rounded-[1.2rem] text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2",
                   splitType === 'equal' 
                     ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                     : "text-muted-foreground hover:bg-muted/50"
                 )}
               >
                 <Users className="w-4 h-4" />
                 Split Equally
               </button>
               <button
                 type="button"
                 onClick={() => setSplitType('custom')}
                 className={cn(
                   "flex-1 py-3 px-4 rounded-[1.2rem] text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2",
                   splitType === 'custom' 
                     ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                     : "text-muted-foreground hover:bg-muted/50"
                 )}
               >
                 <Receipt className="w-4 h-4" />
                 Custom Split
               </button>
            </div>

            {/* Equal Split Info */}
            {splitType === 'equal' && (
              <div className="text-center p-4 bg-primary/5 rounded-3xl border border-primary/10">
                <p className="text-sm font-medium text-muted-foreground">Everyone pays</p>
                <p className="text-2xl font-black text-primary mt-1">
                   ₹{amount ? (parseFloat(amount) / members.length).toFixed(2) : '0.00'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">per person</p>
              </div>
            )}

            {/* Custom Split Inputs */}
            {splitType === 'custom' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                  {members.map(member => (
                    <div key={member} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-muted/30 transition-colors">
                      <div className="flex-1 flex items-center gap-3 min-w-0">
                        <MemberAvatar name={member} size="sm" className="ring-2 ring-background shadow-sm" />
                        <span className="font-bold text-sm truncate">{member}</span>
                      </div>
                      <div className="relative w-28 shrink-0">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">₹</span>
                        <Input
                          type="number"
                          placeholder="0"
                          value={splitDetails[member] || ''}
                          onChange={(e) => setSplitDetails({ ...splitDetails, [member]: e.target.value })}
                          className="h-10 pl-7 text-right font-bold rounded-xl bg-background border-border/60 focus:border-primary/50"
                        />
                      </div>
                    </div>
                  ))}
                  
                  {/* Total Check */}
                  <div className="flex justify-between items-center px-4 py-3 bg-muted/50 rounded-2xl mt-2">
                     <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Total</span>
                     <span className={cn(
                        "font-black font-mono",
                        Math.abs(Object.values(splitDetails).reduce((sum, v) => sum + (parseFloat(v) || 0), 0) - (parseFloat(amount) || 0)) < 0.01 
                        ? "text-primary" 
                        : "text-destructive"
                     )}>
                        ₹{Object.values(splitDetails).reduce((sum, v) => sum + (parseFloat(v) || 0), 0).toFixed(2)}
                     </span>
                  </div>
                </div>
            )}

          </form>
        </div>
      </div>

      {/* Sticky Footer */}
        <div className="p-4 bg-background/90 backdrop-blur-xl border-t border-border/40 shrink-0">
          <Button 
            form="add-expense-form" 
            type="submit" 
            disabled={!isFormValid}
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
          >
            Add Expense
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;
