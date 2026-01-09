import { Group, Expense } from '@/types';

export const exportToCSV = (group: Group, getCurrencySymbol: () => string): void => {
  const headers = ['Date', 'Description', 'Category', 'Amount', 'Paid By', 'Split Among'];
  
  const rows = group.expenses.map(expense => [
    new Date(expense.createdAt).toLocaleDateString(),
    expense.title,
    expense.category,
    `${getCurrencySymbol()}${expense.amount.toFixed(2)}`,
    expense.paidBy,
    expense.splitAmong.join(', ')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${group.name.replace(/\s+/g, '-')}-expenses.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

import { getCurrencySymbol } from '@/utils/calculations';

export { getCurrencySymbol };
