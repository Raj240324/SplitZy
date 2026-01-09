import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { user } = useUser();
  const userId = user?.id;

  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
              <h1 className="text-2xl md:text-3xl font-bold">Your Groups</h1>
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
                <div
                  key={group.id}
                  onClick={() => navigate(`/group/${group.id}`)}
                  className="group cursor-pointer bg-card rounded-2xl border border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className={`h-2 bg-gradient-to-r ${color}`} />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Users className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total spent</p>
                        <p className="text-lg font-bold">{formatCurrency(totalExpenses)}</p>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{group.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{group.members.length} members</p>

                    <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                      <div className="flex -space-x-2">
                        {group.members.slice(0, 3).map((member, i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold">
                            {member[0]}
                          </div>
                        ))}
                        {group.members.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold">
                            +{group.members.length - 3}
                          </div>
                        )}
                      </div>
                      
                      {userBalance && Math.abs(userBalance.netBalance) > 0.01 ? (
                        <div className={`text-sm font-bold ${userBalance.netBalance > 0 ? 'text-balance-positive' : 'text-balance-negative'}`}>
                          {userBalance.netBalance > 0 ? 'Gets' : 'Owes'} {formatCurrency(Math.abs(userBalance.netBalance))}
                        </div>
                      ) : (
                        <div className="text-sm font-medium text-muted-foreground italic">Settled</div>
                      )}
                    </div>
                  </div>
                </div>
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
        />
      </div>
    </div>
  );
};

export default Dashboard;
