import { useState } from 'react';
import { Search, ShoppingCart, Car, Home, Utensils, Package, Pencil, Trash2 } from 'lucide-react';
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
import { Expense } from '@/types';
import { formatCurrency } from '@/utils/calculations';

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

const ExpenseTable = ({ expenses, members, currentUser = 'You', onEdit, onDelete }: ExpenseTableProps) => {
  const [search, setSearch] = useState('');
  const [deleteExpense, setDeleteExpense] = useState<Expense | null>(null);

  const filteredExpenses = expenses.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.paidBy.toLowerCase().includes(search.toLowerCase())
  );

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
        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
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
              {filteredExpenses.map(expense => {
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
              })}
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
