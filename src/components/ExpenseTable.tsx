import { useState } from 'react';
import { Search, ShoppingCart, Car, Home, Utensils, Package, Pencil, Trash2, CalendarIcon, X } from 'lucide-react';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Expense } from '@/types';
import { formatCurrency } from '@/utils/calculations';
import { cn } from '@/lib/utils';

interface ExpenseTableProps {
  expenses: Expense[];
  members: string[];
  currentUser?: string;
  onEdit?: (expense: Expense) => void;
  onDelete?: (expenseId: string) => void;
}

const categoryIcons = {
  groceries: ShoppingCart,
  transport: Car,
  lodging: Home,
  dining: Utensils,
  other: Package
};

const categoryColors = {
  groceries: 'bg-emerald-100 text-emerald-700',
  transport: 'bg-blue-100 text-blue-700',
  lodging: 'bg-purple-100 text-purple-700',
  dining: 'bg-orange-100 text-orange-700',
  other: 'bg-gray-100 text-gray-700'
};

const CATEGORIES = ['groceries', 'transport', 'lodging', 'dining', 'other'] as const;

const ExpenseTable = ({ expenses, members, currentUser = 'You', onEdit, onDelete }: ExpenseTableProps) => {
  const [search, setSearch] = useState('');
  const [deleteExpense, setDeleteExpense] = useState<Expense | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const filteredExpenses = expenses.filter(expense => {
    // Search filter
    const matchesSearch = expense.title.toLowerCase().includes(search.toLowerCase()) ||
      expense.paidBy.toLowerCase().includes(search.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    
    // Date range filter
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const expenseDate = new Date(expense.createdAt);
      if (dateFrom && dateTo) {
        matchesDate = isWithinInterval(expenseDate, {
          start: startOfDay(dateFrom),
          end: endOfDay(dateTo),
        });
      } else if (dateFrom) {
        matchesDate = expenseDate >= startOfDay(dateFrom);
      } else if (dateTo) {
        matchesDate = expenseDate <= endOfDay(dateTo);
      }
    }
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteExpense && onDelete) {
      onDelete(deleteExpense.id);
      setDeleteExpense(null);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setDateFrom(undefined);
    setDateTo(undefined);
    setSearch('');
  };

  const hasActiveFilters = selectedCategory !== 'all' || dateFrom || dateTo || search;

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border border-border">
        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No expenses yet</p>
        <p className="text-sm text-muted-foreground">Add your first expense to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-border space-y-3">
          {/* Category Filter */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</span>
            <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
              <div className="flex gap-1.5 min-w-max">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className="h-8 text-xs font-bold px-4 rounded-full"
                >
                  All
                </Button>
                {CATEGORIES.map((cat) => {
                  const Icon = categoryIcons[cat];
                  return (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      className="h-8 text-xs font-bold px-4 rounded-full gap-2 transition-all active:scale-95"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Date Range & Search */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date Range</span>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "flex-1 h-9 justify-start text-left font-bold text-xs rounded-xl",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                      {dateFrom ? format(dateFrom, "MMM d") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-muted-foreground">/</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "flex-1 h-9 justify-start text-left font-bold text-xs rounded-xl",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                      {dateTo ? format(dateTo, "MMM d") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Search</span>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-4 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-transparent"
                  >
                    Clear All
                  </Button>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-xl bg-muted/20 border-border/50 focus-visible:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-border">
          {filteredExpenses.length === 0 ? (
            <div className="px-4 py-12 text-center text-muted-foreground">
              No expenses found
            </div>
          ) : (
            filteredExpenses.map(expense => {
              const Icon = categoryIcons[expense.category];
              const colorClass = categoryColors[expense.category];
              const yourShare = expense.splitAmong.includes(currentUser)
                ? expense.amount / expense.splitAmong.length
                : 0;

              return (
                <div key={expense.id} className="p-4 space-y-3 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-base">{expense.title}</h4>
                      <p className="text-xs text-muted-foreground">{formatDate(expense.createdAt)} • Paid by {expense.paidBy}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(expense.amount)}</p>
                      {yourShare > 0 && (
                        <p className="text-[10px] text-muted-foreground">Your share: {formatCurrency(yourShare)}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium ${colorClass}`}>
                      <Icon className="w-3 h-3" />
                      {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onEdit?.(expense)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => setDeleteExpense(expense)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Paid by</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Share</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No expenses found
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(expense => {
                  const Icon = categoryIcons[expense.category];
                  const colorClass = categoryColors[expense.category];
                  const yourShare = expense.splitAmong.includes(currentUser)
                    ? expense.amount / expense.splitAmong.length
                    : 0;

                  return (
                    <tr key={expense.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(expense.createdAt)}
                      </td>
                      <td className="px-4 py-4 font-medium">{expense.title}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                          <Icon className="w-3 h-3" />
                          {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">{expense.paidBy}</td>
                      <td className="px-4 py-4 text-right font-semibold">{formatCurrency(expense.amount)}</td>
                      <td className="px-4 py-4 text-right text-sm text-muted-foreground">
                        {formatCurrency(yourShare)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onEdit?.(expense)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteExpense(expense)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!deleteExpense} onOpenChange={() => setDeleteExpense(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteExpense?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ExpenseTable;
