export interface UpiId {
  id: string;
  vpa: string; // Virtual Payment Address
  label: string; // e.g., "GPay", "Personal"
  isPrimary: boolean;
}

export interface UserProfile {
  id: string; // Maps to Auth ID
  email?: string;
  displayName: string;
  photoURL?: string;
  upiIds: UpiId[];
  createdAt: number;
  updatedAt: number;
}

export interface Group {
  id: string;
  name: string;
  currency?: string;
  members: string[]; // Array of member NAMES (display purposes)
  memberUpiIds?: Record<string, string>; // Legacy support: memberName -> UPI ID
  expenses: Expense[];
  createdAt: number;
  shareCode: string;
  activities?: Activity[];
  userIds?: string[]; // Array of Auth UIDs for security/querying
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string; // Name of payer
  splitAmong: string[]; // Names of people sharing
  category: 'groceries' | 'transport' | 'lodging' | 'dining' | 'settlement' | 'other';
  createdAt: number;
  notes?: string;
  type?: 'expense' | 'settlement';
  // Settlement specific fields
  settledWith?: string; // Name of receiver
  paymentStatus?: 'pending' | 'completed' | 'failed';
  paymentMethod?: 'upi' | 'cash' | 'other';
  transactionId?: string;
  
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
  groupId?: string;
  link?: string;
}

