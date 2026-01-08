export interface Group {
  id: string;
  name: string;
  members: string[];
  expenses: Expense[];
  createdAt: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
  category: 'groceries' | 'transport' | 'lodging' | 'dining' | 'other';
  createdAt: number;
}

export interface MemberBalance {
  member: string;
  totalPaid: number;
  totalOwed: number;
  netBalance: number;
  owesTo: { member: string; amount: number }[];
  getsFrom: { member: string; amount: number }[];
}
