import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Group } from '@/types';
import { formatCurrency } from '@/utils/calculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatisticsProps {
  group: Group;
}

// Trendy Vibrant Palette (HSLs for better control)
const COLORS = [
  '#00f2ff', // Neon Cyan
  '#7000ff', // Vivid Violet
  '#ff00ea', // Hot Pink
  '#ff3d00', // Bright Orange
  '#00ff95', // Spring Green
  '#ffcc00'  // Amber
];

const CATEGORY_COLORS: Record<string, string> = {
  groceries: '#00ff95', 
  transport: '#00f2ff', 
  lodging: '#7000ff',   
  dining: '#ff00ea',    
  other: '#ffcc00'      
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/85 backdrop-blur-xl border border-border/50 p-3 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 mb-1">
          {payload[0].name}
        </p>
        <p className="text-sm font-black text-primary">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const Statistics = ({ group }: StatisticsProps) => {
  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {};
    group.expenses.forEach(expense => {
      if (expense.type === 'settlement') return;
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
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
      <div className="text-center py-20 px-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
          <PieChart className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground italic">
          Feed some expenses to start the vibez...
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
      {/* Category Breakdown */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5 transition-all hover:border-primary/20">
        <CardHeader className="pb-0 pt-6 px-8">
          <CardTitle className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground/70">Category Mix</CardTitle>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-[340px] w-full relative">
            {/* Center Summary */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">Total</span>
              <span className="text-xl font-black tracking-tighter text-foreground">{formatCurrency(totalSpent)}</span>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={100}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                  animationBegin={200}
                  animationDuration={1500}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CATEGORY_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                      className="hover:opacity-90 transition-opacity cursor-pointer transition-all duration-300 outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={60} 
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 px-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Member Spending */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5 transition-all hover:border-primary/20">
        <CardHeader className="pb-0 pt-6 px-8">
          <CardTitle className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground/70">Member Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="h-[340px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberData} layout="vertical" margin={{ left: 10, right: 40, top: 10, bottom: 10 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={80} 
                  tick={{ fontSize: 11, fontWeight: 900, fill: 'hsl(var(--foreground))' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(var(--primary), 0.05)', radius: 12 }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[0, 14, 14, 0]} 
                  barSize={24}
                  animationBegin={400}
                  animationDuration={1500}
                >
                  {memberData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      className="hover:opacity-90 transition-opacity"
                    />
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
