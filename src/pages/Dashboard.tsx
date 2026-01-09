import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Plus, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Group } from '@/types';
import { listenGroups } from "@/services/group.service";
import { getTotalExpenses, calculateMemberBalances, formatCurrency } from '@/utils/calculations';
import CreateGroupModal from '@/components/CreateGroupModal';
import JoinGroupModal from '@/components/JoinGroupModal';
import { getCurrencySymbol } from '@/utils/export';
import { Header } from '@/components/Header';
import SwipeableGroupCard from '@/components/SwipeableGroupCard';
import { useGroups } from '@/hooks/use-firestore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';

const groupColors = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-red-500',
  'from-pink-500 to-rose-500',
  'from-indigo-500 to-blue-500'
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get('code');
  const { user } = useUser();
  const userId = user?.id;

  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(!!inviteCode);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);
  const { deleteGroup } = useGroups();
  const currencySymbol = getCurrencySymbol();

  useEffect(() => {
  if (!userId) return;

  const unsub = listenGroups(userId, setGroups);
  return () => unsub();
}, [userId]);


  const getBalanceStatus = (group: Group, currentUser: string = 'You') => {
    if (group.expenses.length === 0) return { type: 'settled', text: 'No expenses yet' };
    
    const balances = calculateMemberBalances(group.expenses, group.members);
    const userBalance = balances.find(b => b.member === currentUser);
    
    if (!userBalance || Math.abs(userBalance.netBalance) < 0.01) {
      return { type: 'settled', text: 'Settled up' };
    }
    
    if (userBalance.netBalance > 0) {
      return { type: 'positive', text: `You get ${formatCurrency(userBalance.netBalance)}` };
    }
    
    return { type: 'negative', text: `You owe ${formatCurrency(Math.abs(userBalance.netBalance))}` };
  };
  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <Header />
      <div className="container mx-auto max-w-6xl px-4">
        {/* Main Content */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-fluid-2xl font-bold">Your Groups</h1>
              <p className="text-muted-foreground">Manage your shared expenses with friends and family</p>
            </div>
            <div className="flex flex-col xs:flex-row gap-3 w-full xs:w-auto">
              <Button onClick={() => setShowJoinModal(true)} variant="outline" className="flex-1 xs:flex-none">
                Join Group
              </Button>
              <Button onClick={() => setShowCreateModal(true)} className="gap-2 flex-1 xs:flex-none">
                <Plus className="w-4 h-4" />
                New Group
              </Button>
            </div>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              className="pl-10 h-12 bg-card border-border/50 focus:border-primary/50 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group, index) => {
              const balances = calculateMemberBalances(group.expenses, group.members);
              const totalExpenses = getTotalExpenses(group.expenses);
              const userBalance = balances.find(b => b.member === 'You');
              const color = groupColors[index % groupColors.length];

              return (
                <SwipeableGroupCard
                  key={group.id}
                  group={group}
                  color={color}
                  totalExpenses={totalExpenses}
                  userBalance={userBalance}
                  onClick={() => navigate(`/group/${group.id}`)}
                  onDelete={() => setDeleteGroupId(group.id)}
                />
              );
            })}

            {/* Create New Group Card */}
            <div
              onClick={() => setShowCreateModal(true)}
              className="cursor-pointer bg-card rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center min-h-[200px] gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <Plus className="w-7 h-7 text-muted-foreground" />
              </div>
              <span className="text-muted-foreground font-medium">Create another group</span>
            </div>
          </div>

          {groups.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No groups yet</h3>
              <p className="text-muted-foreground mb-6">Create your first group to start splitting expenses</p>
              <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Group
              </Button>
            </div>
          )}
        </div>

       <CreateGroupModal 
  open={showCreateModal} 
  onClose={() => setShowCreateModal(false)}
  onCreated={() => setShowCreateModal(false)}
  userId={userId}
/>

        
        <JoinGroupModal
          open={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          userId={userId}
          initialCode={inviteCode || undefined}
        />

        <AlertDialog open={!!deleteGroupId} onOpenChange={() => setDeleteGroupId(null)}>
          <AlertDialogContent className="rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-black text-xl tracking-tight flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-destructive" />
                Delete Group?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm font-medium">
                This will permanently remove the group and all its expenses. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-2xl font-bold">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => {
                  if (deleteGroupId) {
                    deleteGroup(deleteGroupId);
                    setDeleteGroupId(null);
                  }
                }}
                className="bg-destructive hover:bg-destructive/90 rounded-2xl font-bold"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Dashboard;
