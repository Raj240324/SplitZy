import { Group, Expense, Activity } from '@/types';
import { useUser } from '@clerk/clerk-react';
import { 
  getGroups as getLocalGroups, 
  saveGroup as saveLocalGroup, 
  deleteGroup as deleteLocalGroup,
  generateShareCode
} from '@/utils/storage';

export function useApi() {
  const { user } = useUser();

  // Helper to ensure we have a user ID, fallback to 'demo_guest' if somehow called without auth
  const getUserId = () => user?.id || 'demo_guest';

  return {
    // ============ GROUPS ============
    async getGroups(): Promise<Group[]> {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return getLocalGroups(getUserId());
    },

    async getGroup(id: string): Promise<Group> {
      await new Promise(resolve => setTimeout(resolve, 300));
      const groups = getLocalGroups(getUserId());
      const group = groups.find(g => g.id === id);
      if (!group) throw new Error('Group not found');
      return group;
    },

    async createGroup(data: { name: string; members: string[]; currency?: string }): Promise<Group> {
      await new Promise(resolve => setTimeout(resolve, 300));

      const newGroup: Group = {
        id: `group_${Date.now()}`,
        name: data.name,
        currency: data.currency || 'INR',
        shareCode: generateShareCode(),
        createdAt: Date.now(),
        members: data.members, 
        expenses: [],
        activities: []
      };
      
      saveLocalGroup(newGroup, getUserId());
      return newGroup;
    },

    async updateGroup(id: string, data: { name?: string; currency?: string }): Promise<void> {
      await new Promise(resolve => setTimeout(resolve, 300));
      const userId = getUserId();
      const groups = getLocalGroups(userId);
      const group = groups.find(g => g.id === id);
      
      if (group) {
        if (data.name) group.name = data.name;
        if (data.currency) group.currency = data.currency;
        saveLocalGroup(group, userId);
      }
    },

    async deleteGroup(id: string): Promise<void> {
      await new Promise(resolve => setTimeout(resolve, 300));
      deleteLocalGroup(id, getUserId());
    },

    async addMember(groupId: string, displayName: string): Promise<void> {
      await new Promise(resolve => setTimeout(resolve, 300));
      const userId = getUserId();
      const groups = getLocalGroups(userId);
      const group = groups.find(g => g.id === groupId);
      
      if (group) {
        if (!group.members.includes(displayName)) {
          group.members.push(displayName);
          saveLocalGroup(group, userId);
        }
      }
    },

    async removeMember(groupId: string, memberName: string): Promise<void> {
      await new Promise(resolve => setTimeout(resolve, 300));
      const userId = getUserId();
      const groups = getLocalGroups(userId);
      const group = groups.find(g => g.id === groupId);
      
      if (group) {
        group.members = group.members.filter(m => m !== memberName);
        saveLocalGroup(group, userId);
      }
    },

    async joinGroup(shareCode: string, displayName?: string): Promise<{ groupId: string }> {
      throw new Error('Joining groups via code is not supported in local mode.');
    },

    // ============ EXPENSES ============
    async createExpense(groupId: string, expense: any): Promise<Expense> {
      await new Promise(resolve => setTimeout(resolve, 300));
      const userId = getUserId();
      const groups = getLocalGroups(userId);
      const group = groups.find(g => g.id === groupId);
      
      if (!group) throw new Error('Group not found');

      const newExpense: Expense = {
        id: `exp_${Date.now()}`,
        title: expense.title,
        amount: expense.amount,
        paidBy: expense.paidBy,
        splitAmong: expense.splitAmong,
        category: expense.category || 'other',
        type: expense.type || 'expense',
        notes: expense.notes,
        createdAt: Date.now()
      };

      group.expenses.push(newExpense);
      saveLocalGroup(group, userId);
      
      return newExpense;
    },
    
    async updateExpense(id: string, expense: Partial<Expense>): Promise<Expense> {
      await new Promise(resolve => setTimeout(resolve, 300));
      const userId = getUserId();
      const groups = getLocalGroups(userId);
      
      let targetGroup: Group | undefined;
      let expenseIndex = -1;

      for (const g of groups) {
        const idx = g.expenses.findIndex(e => e.id === id);
        if (idx !== -1) {
            targetGroup = g;
            expenseIndex = idx;
            break;
        }
      }

      if (!targetGroup || expenseIndex === -1) throw new Error('Expense not found');

      const updatedExpense = { ...targetGroup.expenses[expenseIndex], ...expense };
      targetGroup.expenses[expenseIndex] = updatedExpense;
      saveLocalGroup(targetGroup, userId);

      return updatedExpense;
    },

    async deleteExpense(id: string): Promise<void> {
      await new Promise(resolve => setTimeout(resolve, 300));
      const userId = getUserId();
      const groups = getLocalGroups(userId);
      
      for (const g of groups) {
        const idx = g.expenses.findIndex(e => e.id === id);
        if (idx !== -1) {
            g.expenses.splice(idx, 1);
            saveLocalGroup(g, userId);
            return;
        }
      }
    },

    async recordSettlement(groupId: string, data: { from: string; to: string; amount: number }): Promise<void> {
      await new Promise(resolve => setTimeout(resolve, 300));
      const userId = getUserId();
      const groups = getLocalGroups(userId);
      const group = groups.find(g => g.id === groupId);
      
      if (!group) throw new Error('Group not found');

      const settlement: Expense = {
        id: `settle_${Date.now()}`,
        title: `${data.from} paid ${data.to}`,
        amount: data.amount,
        paidBy: data.from,
        splitAmong: [data.to],
        category: 'other',
        type: 'settlement',
        notes: `Settlement: ${data.from} -> ${data.to}`,
        createdAt: Date.now()
      };

      group.expenses.push(settlement);
      saveLocalGroup(group, userId);
    }
  };
}
