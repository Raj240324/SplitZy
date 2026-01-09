import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, CheckCircle, Trash2, X, Share2, Download, Printer, Settings, Smartphone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useGroup, useGroups } from '@/hooks/use-firestore';
import { cn } from '@/lib/utils';
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

import ScanBillModal from '@/components/ScanBillModal';
import { ScanLine } from 'lucide-react';

import { useUser } from '@clerk/clerk-react';
import { SettlementCard } from '@/components/payment/SettlementCard';


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
  
  // Scan Bill state
  const [showScanBill, setShowScanBill] = useState(false);
  const [scannedData, setScannedData] = useState<{ amount?: string; title?: string } | undefined>(undefined);

  const handleScanComplete = (data: { amount?: number; title?: string }) => {
    setScannedData({
        amount: data.amount?.toString(),
        title: data.title
    });
    // Slight delay to allow modal to close smoothly before opening the next one
    setTimeout(() => setShowAddExpense(true), 100);
  };

  const { toast } = useToast();

  useEffect(() => {
    if (group) {
      setEditedName(group.name);
    }
  }, [group]);

  const handleAddExpense = (expense: Expense) => {
    const { id, ...rest } = expense;
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

  const handleSettlement = (settlement: { from: string; to: string; amount: number }, options?: { method?: 'upi' | 'cash' | 'other'; status?: 'pending' | 'completed' }) => {
    recordSettlement(settlement, options);
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

  const pendingSettlements = group.expenses.filter(
    e => e.type === 'settlement' && (e.paymentStatus === 'pending')
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <Header />
      <div className="container mx-auto max-w-6xl px-4">
        <div className="py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-fluid-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6">
            <span 
              className="hover:text-primary cursor-pointer transition-colors"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </span>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <span className="text-foreground tracking-widest">{group.name}</span>
          </div>

          {/* Group Header */}
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="text-fluid-2xl font-black tracking-tight">{group.name}</h1>
                <div className="flex items-center gap-1.5 opacity-80">
                  {group.members.slice(0, 3).map(member => (
                    <MemberAvatar key={member} name={member} size="xs" className="-ml-1.5 first:ml-0 ring-2 ring-background border-none" />
                  ))}
                  {group.members.length > 3 && (
                    <span className="text-fluid-xs font-bold text-muted-foreground ml-1">
                      +{group.members.length - 3}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("rounded-full transition-all active:scale-95 h-9 w-9 sm:h-10 sm:w-10", activeTab === 'settings' && "bg-primary/10 text-primary")}
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="w-4 h-4 sm:w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 sm:h-10 sm:w-10" onClick={() => setShowShareModal(true)}>
                  <Share2 className="w-4 h-4 sm:w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => setShowScanBill(true)} variant="secondary" className="h-11 sm:h-12 gap-2 text-fluid-xs font-black uppercase tracking-widest rounded-2xl border-b-2 border-muted active:border-b-0 active:translate-y-[1px] transition-all">
                <ScanLine className="w-3.5 h-3.5 sm:w-4 h-4" />
                Scan Bill
              </Button>
              <Button onClick={() => { setScannedData(undefined); setShowAddExpense(true); }} className="h-11 sm:h-12 gap-2 text-fluid-xs font-black uppercase tracking-widest rounded-2xl border-b-2 border-primary-foreground/20 active:border-b-0 active:translate-y-[1px] transition-all shadow-xl shadow-primary/20">
                <Plus className="w-3.5 h-3.5 sm:w-4 h-4" />
                Add Expense
              </Button>
            </div>
            

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-10 sm:h-11 gap-1.5 sm:gap-2 text-fluid-xs font-black uppercase tracking-[0.15em] rounded-xl border-border/50" onClick={() => setShowSettleModal(true)}>
                <CheckCircle className="w-3 h-3 sm:w-3.5 h-3.5 text-emerald-500" />
                Settle Up
              </Button>
              <Button variant="outline" className="h-10 sm:h-11 gap-1.5 sm:gap-2 text-fluid-xs font-black uppercase tracking-[0.15em] rounded-xl border-border/50" onClick={handleExportCSV}>
                <Download className="w-3 h-3 sm:w-3.5 h-3.5 text-blue-500" />
                Export
              </Button>
            </div>
          </div>

          {/* Pending Settlements */}
          {pendingSettlements.length > 0 && (
            <div className="mb-6 animate-in slide-in-from-top-4 duration-500">
               <h3 className="text-fluid-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Pending Confirmations</h3>
               {pendingSettlements.map(settlement => (
                 <SettlementCard 
                    key={settlement.id} 
                    settlement={settlement} 
                    currentUserName="You" // Logic needed here for actual user name if possible, or assume 'You' maps to local user
                    groupId={group.id}
                 />
               ))}
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="group relative overflow-hidden bg-card/40 backdrop-blur-xl rounded-3xl border border-border/50 p-4 xs:p-6 transition-all hover:shadow-2xl hover:shadow-primary/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-primary/10" />
              <p className="text-fluid-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">Total Budget</p>
              <p className="text-fluid-3xl font-black tracking-tight text-foreground">{formatCurrency(totalSpend)}</p>
            </div>
            <div className="group relative overflow-hidden bg-card/40 backdrop-blur-xl rounded-3xl border border-border/50 p-4 xs:p-6 transition-all hover:shadow-2xl hover:shadow-primary/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-emerald-500/10" />
              <p className="text-fluid-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">Your Impact</p>
              <div className="flex flex-col xs:flex-row xs:items-end justify-between gap-3">
                <p className="text-fluid-3xl font-black tracking-tight text-foreground">{formatCurrency(yourShare)}</p>
                {isSettled ? (
                  <span className="inline-flex items-center gap-1.5 text-fluid-xs font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                    <CheckCircle className="w-3 h-3" />
                    Settled
                  </span>
                ) : yourBalance && yourBalance.netBalance > 0 ? (
                  <span className="inline-flex items-center text-fluid-xs font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 whitespace-nowrap">
                    Recieve {formatCurrency(yourBalance.netBalance)}
                  </span>
                ) : yourBalance ? (
                  <span className="inline-flex items-center text-fluid-xs font-black uppercase tracking-widest text-rose-500 bg-rose-500/10 px-4 py-1.5 rounded-full border border-rose-500/20 whitespace-nowrap">
                    Owe {formatCurrency(Math.abs(yourBalance.netBalance))}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center">
              <TabsList className="bg-muted/50 p-1 rounded-full h-11 border border-border/50 flex w-full">
                <TabsTrigger value="expenses" className="flex-1 px-2 sm:px-5 py-2 text-fluid-xs font-black uppercase tracking-widest rounded-full data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all">Expenses</TabsTrigger>
                <TabsTrigger value="balances" className="flex-1 px-2 sm:px-5 py-2 text-fluid-xs font-black uppercase tracking-widest rounded-full data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all">Balances</TabsTrigger>
                <TabsTrigger value="statistics" className="flex-1 px-2 sm:px-5 py-2 text-fluid-xs font-black uppercase tracking-widest rounded-full data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all">Charts</TabsTrigger>
                <TabsTrigger value="activity" className="flex-1 px-2 sm:px-5 py-2 text-fluid-xs font-black uppercase tracking-widest rounded-full data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all">History</TabsTrigger>
              </TabsList>
            </div>

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
                memberUpiIds={group.memberUpiIds}
              />
            </TabsContent>

            <TabsContent value="statistics">
              <Statistics group={group} />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityFeed activities={group.activities || []} />
            </TabsContent>

            <TabsContent value="settings" className="mt-0 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 mb-6">
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('expenses')} className="rounded-full h-8 w-8 p-0">
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </Button>
                <h2 className="text-xl font-black tracking-tight">Group Settings</h2>
              </div>
              <div className="space-y-6">
                {/* Group Name */}
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 p-6 shadow-sm">
                  <p className="text-fluid-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Identity</p>
                  <div className="flex gap-2">
                    <input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Enter group name"
                      className="flex h-12 w-full rounded-2xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Button
                      onClick={handleSaveGroupName}
                      disabled={editedName.trim() === group.name}
                      className="rounded-2xl h-12 px-6 font-bold"
                    >
                      Save
                    </Button>
                  </div>
                </div>

                {/* UPI IDs Management */}
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Smartphone className="w-4 h-4 text-primary" />
                    <p className="text-fluid-xs font-black uppercase tracking-widest text-muted-foreground">Settlement Setup</p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground mb-4">Add UPI IDs to enable one-tap payments in the balances tab.</p>
                    {group.members.map((member) => (
                      <div key={`upi-${member}`} className="flex flex-col gap-2">
                        <Label className="text-xs font-bold ml-1">{member}'s UPI ID</Label>
                        <div className="flex gap-2">
                          <input
                            defaultValue={group.memberUpiIds?.[member] || ''}
                            placeholder="e.g., name@okaxis"
                            className="flex h-11 w-full rounded-2xl border border-input bg-background/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            onBlur={(e) => {
                              const newUpi = e.target.value.trim();
                              if (newUpi !== (group.memberUpiIds?.[member] || '')) {
                                updateGroup({
                                  memberUpiIds: {
                                    ...(group.memberUpiIds || {}),
                                    [member]: newUpi
                                  }
                                });
                              }
                            }}
                          />
                          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-primary/10 text-primary">
                            <Check className="w-4 h-4 opacity-50" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Group Members */}
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 p-6 shadow-sm">
                  <p className="text-fluid-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Community</p>
                  <div className="space-y-4">
                    {/* Add Member */}
                    <div className="flex gap-2">
                      <input
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        placeholder="New member name"
                        className="flex h-12 w-full rounded-2xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                      />
                      <Button onClick={handleAddMember} className="rounded-2xl h-12 px-6 font-bold">
                        <Plus className="mr-2 h-4 w-4" />
                        Join
                      </Button>
                    </div>

                    {/* Member List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.members.map((member) => (
                        <div
                          key={member}
                          className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/30 p-3"
                        >
                          <div className="flex items-center gap-3">
                            <MemberAvatar name={member} size="sm" />
                            <span className="font-bold text-sm">{member}</span>
                            {member === 'You' && (
                              <span className="text-fluid-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">Owner</span>
                            )}
                          </div>
                          {member !== 'You' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemoveMember(member)}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-destructive/5 rounded-3xl border border-destructive/20 p-6">
                  <p className="text-fluid-xs font-black uppercase tracking-widest text-destructive mb-4">Danger Zone</p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="w-full h-12 gap-2 rounded-2xl border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground font-black uppercase tracking-widest text-xs">
                        <Trash2 className="w-4 h-4" />
                        Teardown Group
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-black text-xl tracking-tight">Destructive Action</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium">
                          Are you absolutely sure? This will wipe all expenses and history for "{group.name}". This cannot be reversed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="rounded-2xl font-bold">Abort</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteGroup} className="bg-destructive hover:bg-destructive/90 rounded-2xl font-bold">
                          Yes, Delete Everything
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
          onClose={() => {
            setShowAddExpense(false);
            setScannedData(undefined);
          }}
          members={group.members}
          onSave={handleAddExpense}
          initialData={scannedData}
        />

        <ScanBillModal
            open={showScanBill}
            onClose={() => setShowScanBill(false)}
            onScanComplete={handleScanComplete}
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
          memberUpiIds={group.memberUpiIds}
        />
      </div>
    </div>
  );
};

export default GroupDetail;
