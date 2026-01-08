import { Expense, MemberBalance } from '@/types';

export const formatCurrency = (amount: number): string => {
  return `₹${Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

export const calculateMemberBalances = (expenses: Expense[], members: string[]): MemberBalance[] => {
  // Track how much each member paid and owes
  const paid: Record<string, number> = {};
  const owed: Record<string, number> = {};
  
  members.forEach(m => {
    paid[m] = 0;
    owed[m] = 0;
  });

  expenses.forEach(expense => {
    const splitAmount = expense.amount / expense.splitAmong.length;
    
    // Who paid
    if (paid[expense.paidBy] !== undefined) {
      paid[expense.paidBy] += expense.amount;
    }
    
    // Who owes
    expense.splitAmong.forEach(member => {
      if (owed[member] !== undefined) {
        owed[member] += splitAmount;
      }
    });
  });

  // Calculate net balances
  const balances: MemberBalance[] = members.map(member => {
    const totalPaid = paid[member] || 0;
    const totalOwed = owed[member] || 0;
    const netBalance = totalPaid - totalOwed;

    return {
      member,
      totalPaid,
      totalOwed,
      netBalance,
      owesTo: [],
      getsFrom: []
    };
  });

  // Calculate who owes whom using a simple settlement algorithm
  const debtors = balances.filter(b => b.netBalance < 0).map(b => ({ ...b }));
  const creditors = balances.filter(b => b.netBalance > 0).map(b => ({ ...b }));

  debtors.forEach(debtor => {
    let remaining = Math.abs(debtor.netBalance);
    
    creditors.forEach(creditor => {
      if (remaining <= 0 || creditor.netBalance <= 0) return;
      
      const payment = Math.min(remaining, creditor.netBalance);
      if (payment > 0.01) {
        const debtorBalance = balances.find(b => b.member === debtor.member);
        const creditorBalance = balances.find(b => b.member === creditor.member);
        
        if (debtorBalance) {
          debtorBalance.owesTo.push({ member: creditor.member, amount: payment });
        }
        if (creditorBalance) {
          creditorBalance.getsFrom.push({ member: debtor.member, amount: payment });
        }
        
        remaining -= payment;
        creditor.netBalance -= payment;
      }
    });
  });

  return balances;
};

export const getTotalExpenses = (expenses: Expense[]): number => {
  // Exclude settlements from total expenses
  return expenses
    .filter(e => e.type !== 'settlement')
    .reduce((sum, e) => sum + e.amount, 0);
};

export const getMemberShare = (expenses: Expense[], member: string): number => {
  // Exclude settlements from member share calculation
  return expenses
    .filter(e => e.type !== 'settlement')
    .reduce((sum, e) => {
      if (e.splitAmong.includes(member)) {
        return sum + (e.amount / e.splitAmong.length);
      }
      return sum;
    }, 0);
};
