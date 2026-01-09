export interface Group {
  id: string;
  name: string;
  currency?: string;
  members: string[];
  memberUpiIds?: Record<string, string>; // memberName -> UPI ID
  expenses: Expense[];
  createdAt: number;
  shareCode: string;
  activities?: Activity[];
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
  category: 'groceries' | 'transport' | 'lodging' | 'dining' | 'other';
  createdAt: number;
  notes?: string;
  type?: 'expense' | 'settlement';
  settledWith?: string;
  splitType?: 'equal' | 'custom';
  splitDetails?: Record<string, number>; // memberName -> amount
}

export interface MemberBalance {
  member: string;
  totalPaid: number;
  totalOwed: number;
  netBalance: number;
  owesTo: { member: string; amount: number }[];
  getsFrom: { member: string; amount: number }[];
}

export interface Activity {
  id: string;
  type: 'expense_added' | 'expense_updated' | 'expense_deleted' | 'settlement' | 'member_added' | 'member_removed' | 'group_updated';
  description: string;
  timestamp: number;
  byUser?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'expense' | 'group' | 'settlement';
  read: boolean;
  createdAt: any;
}

