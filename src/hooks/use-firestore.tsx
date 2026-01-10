import { useState, useEffect } from 'react';
import { 
  doc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Group, Expense } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@clerk/clerk-react';
import {
    createGroup,
    deleteGroupService,
    updateGroupService,
    addExpenseService,
    updateExpenseService,
    deleteExpenseService,
    addMemberService,
    removeMemberService,
    renameMemberService,
    getGroupByShareCode
} from '@/services/group.service';

// Re-export specific service functions if needed or keep them usage-specific
export { createGroup, getGroupByShareCode } from '@/services/group.service';

// Use same name as legacy hook to minimize refactor friction
export const useGroups = () => {
  const { toast } = useToast();

  const deleteGroup = async (groupId: string) => {
    try {
      await deleteGroupService(groupId);
      toast({ title: 'Group deleted' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Could not delete group', variant: 'destructive' });
    }
  };

  return { deleteGroup };
};

export const useGroup = (groupId: string) => {
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { userId } = useAuth();

  useEffect(() => {
    if (!groupId) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'groups', groupId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        setGroup({ id: docSnapshot.id, ...docSnapshot.data() } as Group);
      } else {
        setGroup(null);
      }
      setIsLoading(false);
    }, (error) => {
      console.error(error);
      setIsLoading(false);
      toast({ title: "Error", description: "Failed to load group", variant: "destructive" });
    });

    return () => unsubscribe();
  }, [groupId, toast]);

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    if (!group) return;
    try {
      await addExpenseService(group.id, expenseData, userId || undefined);
      toast({ title: 'Expense added' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Could not add expense', variant: 'destructive' });
    }
  };

  const updateExpense = async ({ expenseId, data }: { expenseId: string, data: Partial<Expense> }) => {
    if (!group) return;
    try {
        const updatedExpenses = group.expenses.map(e => 
            e.id === expenseId ? { ...e, ...data } : e
        );
        await updateExpenseService(group.id, updatedExpenses);
        toast({ title: 'Expense updated' });
    } catch (error) {
        console.error(error);
        toast({ title: 'Error', description: 'Could not update expense', variant: 'destructive' });
    }
  };

  const deleteExpense = async (expenseId: string) => {
     if (!group) return;
     try {
         const expenseToDelete = group.expenses.find(e => e.id === expenseId);
         if (!expenseToDelete) return;
         await deleteExpenseService(group.id, expenseToDelete);
         toast({ title: 'Expense deleted' });
     } catch (error) {
         console.error(error);
         toast({ title: 'Error', description: 'Could not delete expense', variant: 'destructive' });
     }
  };

  const recordSettlement = async (settlement: { from: string; to: string; amount: number }, options?: { method?: 'upi' | 'cash' | 'other'; status?: 'pending' | 'completed' }) => {
      if (!group) return;
      const newSettlement: Omit<Expense, 'id'> = {
          title: `Settlement: ${settlement.from} -> ${settlement.to}`,
          amount: settlement.amount,
          paidBy: settlement.from,
          splitAmong: [settlement.to],
          category: 'other',
          createdAt: Date.now(),
          type: 'settlement',
          settledWith: settlement.to,
          paymentStatus: options?.status || 'pending',
          paymentMethod: options?.method || 'other',
      };
      
      try {
          await addExpenseService(group.id, newSettlement, userId || undefined);
          toast({ title: 'Settlement recorded' });
      } catch (error) {
          console.error(error);
          toast({ title: 'Error', description: 'Could not record settlement', variant: 'destructive' });
      }
  };

  const updateGroup = async (data: Partial<Group>) => {
      if (!group) return;
      try {
        await updateGroupService(group.id, data);
        toast({ title: 'Group updated' });
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to update group', variant: 'destructive' });
      }
  };

  const addMember = async (name: string) => {
      if (!group) return;
      try {
          await addMemberService(group.id, name);
          toast({ title: 'Member added' });
      } catch (error) {
          toast({ title: 'Error', description: 'Failed to add member', variant: 'destructive' });
      }
  };

  const removeMember = async (name: string) => {
      if (!group) return;
       try {
          await removeMemberService(group.id, name);
          toast({ title: 'Member removed' });
      } catch (error) {
          toast({ title: 'Error', description: 'Failed to remove member', variant: 'destructive' });
      }
  };

  const renameMember = async (oldName: string, newName: string) => {
    if (!group) return;
    try {
      await renameMemberService(group.id, oldName, newName);
      toast({ title: 'Member renamed' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to rename member', variant: 'destructive' });
    }
  };

  return {
    group,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    recordSettlement,
    updateGroup,
    addMember,
    removeMember,
    renameMember
  };
};

// Also export saveGroup as alias to createGroup if needed by older components
export const saveGroup = createGroup;
