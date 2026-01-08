import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Expense, Group } from '@/types';
import { formatCurrency } from '@/utils/calculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatisticsProps {
  group: Group;
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f97316', '#6b7280']; // Emerald, Blue, Violet, Orange, Gray
const CATEGORY_COLORS: Record<string, string> = {
  groceries: '#10b981',
  transport: '#3b82f6',
  lodging: '#8b5cf6',
  dining: '#f97316',
  other: '#6b7280'
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Member Spending */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Spending by Member</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
