import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Group, Expense } from '@/types';
import { getGroupById, saveGroup, deleteGroup } from '@/utils/storage';
import { getTotalExpenses, getMemberShare, calculateMemberBalances, formatCurrency } from '@/utils/calculations';
import MemberAvatar from '@/components/MemberAvatar';
import ExpenseTable from '@/components/ExpenseTable';
import BalanceView from '@/components/BalanceView';
import AddExpenseModal from '@/components/AddExpenseModal';
import EditExpenseModal from '@/components/EditExpenseModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [activeTab, setActiveTab] = useState('expenses');

  useEffect(() => {
    if (id) {
      const g = getGroupById(id);
      if (g) {
        setGroup(g);
      } else {
        navigate('/dashboard');
      }
    }
  }, [id, navigate]);

  const handleAddExpense = (expense: Expense) => {
    if (!group) return;
    
    const updatedGroup = {
      ...group,
      expenses: [...group.expenses, expense]
    };
    
    saveGroup(updatedGroup);
    setGroup(updatedGroup);
  };

  const handleEditExpense = (expense: Expense) => {
    if (!group) return;
    
    const updatedGroup = {
      ...group,
      expenses: group.expenses.map(e => e.id === expense.id ? expense : e)
    };
    
    saveGroup(updatedGroup);
    setGroup(updatedGroup);
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (!group) return;
    
    const updatedGroup = {
      ...group,
      expenses: group.expenses.filter(e => e.id !== expenseId)
    };
    
    saveGroup(updatedGroup);
    setGroup(updatedGroup);
  };

  const handleDeleteGroup = () => {
    if (!group) return;
    deleteGroup(group.id);
    navigate('/dashboard');
  };

  if (!group) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const totalSpend = getTotalExpenses(group.expenses);
  const yourShare = getMemberShare(group.expenses, 'You');
  const balances = calculateMemberBalances(group.expenses, group.members);
  const yourBalance = balances.find(b => b.member === 'You');
  const isSettled = !yourBalance || Math.abs(yourBalance.netBalance) < 0.01;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-lg">Splitzy Lite</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <span 
            className="hover:text-foreground cursor-pointer transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{group.name}</span>
        </div>

        {/* Group Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{group.name}</h1>
            <div className="flex items-center gap-1">
              {group.members.slice(0, 5).map(member => (
                <MemberAvatar key={member} name={member} size="sm" className="-ml-2 first:ml-0 ring-2 ring-background" />
              ))}
              {group.members.length > 5 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  +{group.members.length - 5} more
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowAddExpense(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Expense
            </Button>
            <Button variant="outline" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Settle Up
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground mb-1">Total Group Spend</p>
            <p className="text-3xl font-bold">{formatCurrency(totalSpend)}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground mb-1">Your Share</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{formatCurrency(yourShare)}</p>
              {isSettled ? (
                <span className="flex items-center gap-1 text-sm font-medium text-primary">
                  <CheckCircle className="w-4 h-4" />
                  Settled
                </span>
              ) : yourBalance && yourBalance.netBalance > 0 ? (
                <span className="text-sm font-medium text-balance-positive">
                  You get {formatCurrency(yourBalance.netBalance)}
                </span>
              ) : yourBalance ? (
                <span className="text-sm font-medium text-balance-negative">
                  You owe {formatCurrency(Math.abs(yourBalance.netBalance))}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="balances">Balances</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses">
            <ExpenseTable 
              expenses={group.expenses} 
              members={group.members} 
              onEdit={setEditingExpense}
              onDelete={handleDeleteExpense}
            />
          </TabsContent>

          <TabsContent value="balances">
            <BalanceView balances={balances} totalSpend={totalSpend} />
          </TabsContent>

          <TabsContent value="settings">
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Group Members</h3>
                <div className="flex flex-wrap gap-2">
                  {group.members.map(member => (
                    <div key={member} className="flex items-center gap-2 bg-muted rounded-full pl-1 pr-3 py-1">
                      <MemberAvatar name={member} size="sm" />
                      <span className="text-sm">{member}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-semibold mb-2 text-destructive">Danger Zone</h3>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete Group
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{group.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. All expenses and balances will be permanently deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteGroup}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <AddExpenseModal
        open={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        members={group.members}
        onSave={handleAddExpense}
      />

      <EditExpenseModal
        open={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        expense={editingExpense}
        members={group.members}
        onSave={handleEditExpense}
      />
    </div>
  );
};

export default GroupDetail;
