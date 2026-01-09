import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Expense, Group } from '@/types';
import { formatCurrency } from '@/utils/calculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatisticsProps {
  group: Group;
}

const COLORS = ['#00f2ff', '#7000ff', '#ff00ea', '#f97316', '#10b981']; // Cyan, Violet, Pink, Orange, Emerald
const CATEGORY_COLORS: Record<string, string> = {
  groceries: '#10b981', // Emerald
  transport: '#00f2ff', // Cyan
  lodging: '#7000ff',   // Violet
  dining: '#ff00ea',    // Pink
  other: '#6b7280'      // Gray
};

const Statistics = ({ group }: StatisticsProps) => {
  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {};
    group.expenses.forEach(expense => {
      if (expense.type === 'settlement') return;
      const amount = expense.amount; // Total amounts
      totals[expense.category] = (totals[expense.category] || 0) + amount;
    });

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [group.expenses]);

  const memberData = useMemo(() => {
    const spending: Record<string, number> = {};
    group.members.forEach(member => spending[member] = 0);
    
    group.expenses.forEach(expense => {
      if (expense.type === 'settlement') return;
      spending[expense.paidBy] = (spending[expense.paidBy] || 0) + expense.amount;
    });

    return Object.entries(spending)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [group.expenses, group.members]);

  const totalSpent = categoryData.reduce((sum, item) => sum + item.value, 0);

  if (totalSpent === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No expenses to visualize yet.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Category Breakdown */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl shadow-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CATEGORY_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: 'rgba(var(--background), 0.8)', 
                    backdropFilter: 'blur(12px)',
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '1rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ fontWeight: '800', fontSize: '12px' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-fluid-xs font-black uppercase tracking-widest text-muted-foreground/70">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Member Spending */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl shadow-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Spending by Member</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberData} layout="vertical" margin={{ left: 0, right: 30 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={70} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: 'hsl(var(--muted-foreground))' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  cursor={{ fill: 'rgba(var(--primary), 0.05)', radius: 8 }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(var(--background), 0.8)', 
                    backdropFilter: 'blur(12px)',
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '1rem'
                  }}
                  itemStyle={{ fontWeight: '800', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#barGradient)" 
                  radius={[0, 10, 10, 0]} 
                  barSize={16} 
                >
                  {memberData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
