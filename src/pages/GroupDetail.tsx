import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, CheckCircle, Trash2, X, Share2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Group, Expense } from '@/types';
import { getTotalExpenses, getMemberShare, calculateMemberBalances, formatCurrency } from '@/utils/calculations';
import MemberAvatar from '@/components/MemberAvatar';
import ExpenseTable from '@/components/ExpenseTable';
import BalanceView from '@/components/BalanceView';
import AddExpenseModal from '@/components/AddExpenseModal';
import EditExpenseModal from '@/components/EditExpenseModal';
import ShareGroupModal from '@/components/ShareGroupModal';
import { Header } from '@/components/Header';
import SettleUpModal from '@/components/SettleUpModal';
import Statistics from '@/components/Statistics';
import ActivityFeed from '@/components/ActivityFeed';
import { useToast } from '@/hooks/use-toast';
import { exportToCSV, getCurrencySymbol } from '@/utils/export';
import { generateId } from '@/utils/storage';
import { useGroup, useGroups } from '@/hooks/useGroups';
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

import { useUser } from '@clerk/clerk-react';


const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  
  // Use the hook for data and mutations
  const { 
    group, 
    isLoading, 
    addExpense, 
    updateExpense, 
    deleteExpense, 
    recordSettlement,
    updateGroup,
    addMember,
    removeMember
  } = useGroup(id || '');

  // For delete group, we use the list hook
  const { deleteGroup } = useGroups();

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [activeTab, setActiveTab] = useState('expenses');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  
  // Settings state
  const [editedName, setEditedName] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (group) {
      setEditedName(group.name);
    }
  }, [group]);

  const handleAddExpense = (expense: Expense) => {
    const { id, createdAt, ...rest } = expense;
    addExpense(rest);
    setShowAddExpense(false);
  };

  const handleEditExpense = (expense: Expense) => {
    const { id, ...data } = expense; 
    updateExpense({ expenseId: id, data });
    setEditingExpense(null);
  };

  const handleDeleteExpense = (expenseId: string) => {
    deleteExpense(expenseId);
  };

  const handleDeleteGroup = () => {
    if (id) {
      deleteGroup(id);
      navigate('/dashboard');
    }
  };

  const handleSettlement = (settlement: { from: string; to: string; amount: number }) => {
    recordSettlement(settlement);
    setShowSettleModal(false);
  };

  const handleExportCSV = () => {
    if (!group) return;
    exportToCSV(group, getCurrencySymbol);
    toast({
      title: 'Exported',
      description: 'Expenses exported to CSV file',
    });
  };

  // Settings handlers
  const handleSaveGroupName = () => {
    if (!group) return;
    const trimmedName = editedName.trim();
    if (!trimmedName) {
      toast({ title: "Invalid name", description: "Group name cannot be empty.", variant: "destructive" });
      return;
    }
    if (trimmedName === group.name) return;
    
    updateGroup({ name: trimmedName });
  };

  const handleAddMember = () => {
    if (!group) return;
    const trimmedName = newMemberName.trim();
    if (!trimmedName) {
      toast({ title: "Invalid name", description: "Member name cannot be empty.", variant: "destructive" });
      return;
    }
    if (group.members.some((m) => m.toLowerCase() === trimmedName.toLowerCase())) {
      toast({ title: "Duplicate member", description: "This member already exists in the group.", variant: "destructive" });
      return;
    }
    
    addMember(trimmedName);
    setNewMemberName('');
  };

  const handleRemoveMember = (memberName: string) => {
    if (!group) return;
    if (memberName === 'You') {
      toast({ title: "Cannot remove", description: "You cannot remove yourself from the group.", variant: "destructive" });
      return;
    }
    
    // Check if member has any expenses
    const hasExpenses = group.expenses.some(
      (e) => e.paidBy === memberName || e.splitAmong.includes(memberName)
    );
    if (hasExpenses) {
      toast({ title: "Cannot remove", description: "This member has expenses. Delete their expenses first.", variant: "destructive" });
      return;
    }
    
    removeMember(memberName);
  };

  if (isLoading || !group) {
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
    <div className="min-h-screen bg-background pt-24 pb-12">
      <Header />
      <div className="container mx-auto max-w-6xl px-4">
        <div className="py-6">
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
            <div className="flex flex-col xs:flex-row flex-wrap gap-2 sm:gap-3">
              <Button onClick={() => setShowAddExpense(true)} className="gap-2 w-full xs:w-auto order-first xs:order-none">
                <Plus className="w-4 h-4" />
                Add Expense
              </Button>
              <div className="flex flex-wrap gap-2 w-full xs:w-auto">
                <Button variant="outline" className="flex-1 xs:flex-none gap-2" onClick={() => setShowSettleModal(true)}>
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Settle Up</span><span className="sm:hidden">Settle</span>
                </Button>
                <Button variant="outline" size="icon" className="xs:w-10" onClick={() => setShowShareModal(true)}>
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="xs:w-10" onClick={handleExportCSV}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-card rounded-xl border border-border p-4 md:p-5">
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Group Spend</p>
              <p className="text-2xl md:text-3xl font-bold">{formatCurrency(totalSpend)}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 md:p-5">
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Your Share</p>
              <div className="flex items-center justify-between gap-2">
                <p className="text-2xl md:text-3xl font-bold">{formatCurrency(yourShare)}</p>
                {isSettled ? (
                  <span className="flex items-center gap-1 text-[10px] sm:text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3 sm:w-4 h-4" />
                    Settled
                  </span>
                ) : yourBalance && yourBalance.netBalance > 0 ? (
                  <span className="text-[10px] sm:text-sm font-medium text-balance-positive bg-balance-positive/10 px-2 py-1 rounded-full whitespace-nowrap">
                    Get {formatCurrency(yourBalance.netBalance)}
                  </span>
                ) : yourBalance ? (
                  <span className="text-[10px] sm:text-sm font-medium text-balance-negative bg-balance-negative/10 px-2 py-1 rounded-full whitespace-nowrap">
                    Owe {formatCurrency(Math.abs(yourBalance.netBalance))}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-5">
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="balances">Balances</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="expenses" className="space-y-4">
              <div className="flex items-center gap-2">
                <Button onClick={() => setShowAddExpense(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Expense
                </Button>
                <Button variant="outline" onClick={() => setShowSettleModal(true)}>
                  Settle Up
                </Button>
              </div>
              <ExpenseTable 
                expenses={group.expenses} 
                members={group.members} 
                onEdit={(expense) => setEditingExpense(expense)}
                onDelete={handleDeleteExpense}
              />
            </TabsContent>

            <TabsContent value="balances">
              <BalanceView
                balances={balances}
                totalSpend={totalSpend}
              />
            </TabsContent>

            <TabsContent value="statistics">
              <Statistics group={group} />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityFeed activities={group.activities || []} />
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                {/* Group Name */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold mb-4">Group Name</h3>
                  <div className="flex gap-2">
                    <input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Enter group name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-sm"
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
                      <input
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        placeholder="New member name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-sm"
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
        </div>

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
        
        <ShareGroupModal
          open={showShareModal}
          onClose={() => setShowShareModal(false)}
          groupName={group.name}
          shareCode={group.shareCode}
        />
        
        <SettleUpModal
          open={showSettleModal}
          onClose={() => setShowSettleModal(false)}
          balances={balances}
          onSettle={handleSettlement}
          getCurrencySymbol={getCurrencySymbol}
        />
      </div>
    </div>
  );
};

export default GroupDetail;
