import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Group } from '@/types';
import { getGroups } from '@/utils/storage';
import { getTotalExpenses, calculateMemberBalances } from '@/utils/calculations';
import { formatCurrency } from '@/utils/calculations';
import CreateGroupModal from '@/components/CreateGroupModal';

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
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    setGroups(getGroups());
  }, []);

  const refreshGroups = () => {
    setGroups(getGroups());
  };

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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Users className="w-4 h-4" />
              Join Group
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Your Groups</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                Data saved locally
              </span>
            </div>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Group
          </Button>
        </div>

        {/* Groups Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, index) => {
            const total = getTotalExpenses(group.expenses);
            const status = getBalanceStatus(group);
            const colorClass = groupColors[index % groupColors.length];
            
            return (
              <div
                key={group.id}
                onClick={() => navigate(`/group/${group.id}`)}
                className="group cursor-pointer bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className={`h-24 bg-gradient-to-br ${colorClass} relative`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-3 left-4">
                    <h3 className="text-white font-semibold text-lg drop-shadow-md">
                      {group.name}
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">
                      {group.members.length} members
                    </span>
                    <span className="font-semibold">{formatCurrency(total)}</span>
                  </div>
                  <div className={`text-sm font-medium px-3 py-1.5 rounded-full inline-block ${
                    status.type === 'positive' 
                      ? 'bg-balance-positive text-balance-positive' 
                      : status.type === 'negative'
                      ? 'bg-balance-negative text-balance-negative'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {status.text}
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
      </main>

      <CreateGroupModal 
        open={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        onCreated={refreshGroups}
      />
    </div>
  );
};

export default Dashboard;
