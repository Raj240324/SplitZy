import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, CheckCircle, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Group, Expense } from '@/types';
import { getGroupById, saveGroup, deleteGroup } from '@/utils/storage';
import { getTotalExpenses, getMemberShare, calculateMemberBalances, formatCurrency } from '@/utils/calculations';
import MemberAvatar from '@/components/MemberAvatar';
import ExpenseTable from '@/components/ExpenseTable';
import BalanceView from '@/components/BalanceView';
import AddExpenseModal from '@/components/AddExpenseModal';
import EditExpenseModal from '@/components/EditExpenseModal';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();
  const [group, setGroup] = useState<Group | null>(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [activeTab, setActiveTab] = useState('expenses');
  
  // Settings state
  const [editedName, setEditedName] = useState('');
  const [newMemberName, setNewMemberName] = useState('');

  useEffect(() => {
    if (id) {
      const g = getGroupById(id);
      if (g) {
        setGroup(g);
        setEditedName(g.name);
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

  // Settings handlers
  const handleSaveGroupName = () => {
    if (!group) return;
    const trimmedName = editedName.trim();
    if (!trimmedName) {
      toast({
        title: "Invalid name",
        description: "Group name cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    if (trimmedName === group.name) return;
    
    const updatedGroup = { ...group, name: trimmedName };
    saveGroup(updatedGroup);
    setGroup(updatedGroup);
    toast({
      title: "Group updated",
      description: "Group name has been updated.",
    });
  };

  const handleAddMember = () => {
    if (!group) return;
    const trimmedName = newMemberName.trim();
    if (!trimmedName) {
      toast({
        title: "Invalid name",
        description: "Member name cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    if (group.members.some((m) => m.toLowerCase() === trimmedName.toLowerCase())) {
      toast({
        title: "Duplicate member",
        description: "This member already exists in the group.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedGroup = {
      ...group,
      members: [...group.members, trimmedName],
    };
    saveGroup(updatedGroup);
    setGroup(updatedGroup);
    setNewMemberName('');
    toast({
      title: "Member added",
      description: `${trimmedName} has been added to the group.`,
    });
  };

  const handleRemoveMember = (memberName: string) => {
    if (!group) return;
    if (memberName === 'You') {
      toast({
        title: "Cannot remove",
        description: "You cannot remove yourself from the group.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if member has any expenses
    const hasExpenses = group.expenses.some(
      (e) => e.paidBy === memberName || e.splitAmong.includes(memberName)
    );
    if (hasExpenses) {
      toast({
        title: "Cannot remove",
        description: "This member has expenses. Delete their expenses first.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedGroup = {
      ...group,
      members: group.members.filter((m) => m !== memberName),
    };
    saveGroup(updatedGroup);
    setGroup(updatedGroup);
    toast({
      title: "Member removed",
      description: `${memberName} has been removed from the group.`,
    });
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
            <div className="space-y-6">
              {/* Group Name */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold mb-4">Group Name</h3>
                <div className="flex gap-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Enter group name"
                    className="max-w-sm"
                  />
                  <Button
                    onClick={handleSaveGroupName}
                    disabled={editedName.trim() === group.name}
                  >
                    Save
                  </Button>
                </div>
              </div>

              {/* Group Members */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold mb-4">Group Members</h3>
                <div className="space-y-4">
                  {/* Add Member */}
                  <div className="flex gap-2">
                    <Input
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="New member name"
                      className="max-w-sm"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                    />
                    <Button onClick={handleAddMember}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Member
                    </Button>
                  </div>

                  {/* Member List */}
                  <div className="space-y-2">
                    {group.members.map((member) => (
                      <div
                        key={member}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <MemberAvatar name={member} size="sm" />
                          <span className="font-medium">{member}</span>
                          {member === 'You' && (
                            <span className="text-xs text-muted-foreground">(you)</span>
                          )}
                        </div>
                        {member !== 'You' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveMember(member)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-card rounded-xl border border-destructive/50 p-6">
                <h3 className="font-semibold mb-4 text-destructive">Danger Zone</h3>
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
