import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import { useApi } from './useApi';
import { Group, Expense } from '@/types';
import { useToast } from './use-toast';

export function useGroups() {
  const { user } = useUser();
  const api = useApi();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const userId = user?.id;

  const {
    data: groups = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['groups', userId],
    queryFn: async () => {
      // Use API for authenticated users (which uses local storage internally now)
      return await api.getGroups();
    },
    staleTime: 1000 * 60, // 1 minute
    enabled: !!userId,
  });

  const createGroupMutation = useMutation({
    mutationFn: async (data: { name: string; members: string[] }) => {
      return api.createGroup(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({ title: 'Group created successfully!' });
    },
    onError: (err: Error) => {
      toast({ title: 'Failed to create group', description: err.message, variant: 'destructive' });
    }
  });

  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      return api.deleteGroup(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({ title: 'Group deleted' });
    },
    onError: (err: Error) => {
      toast({ title: 'Failed to delete group', description: err.message, variant: 'destructive' });
    }
  });

  const joinGroupMutation = useMutation({
    mutationFn: async (shareCode: string) => {
      return api.joinGroup(shareCode, user?.firstName || 'Member');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({ title: 'Joined group successfully!' });
    },
    onError: (err: Error) => {
      toast({ title: 'Failed to join group', description: err.message, variant: 'destructive' });
    }
  });

  return {
    groups,
    isLoading,
    error,
    refetch,
    createGroup: createGroupMutation.mutate,
    deleteGroup: deleteGroupMutation.mutate,
    joinGroup: joinGroupMutation.mutate,
    isCreating: createGroupMutation.isPending,
    isDeleting: deleteGroupMutation.isPending,
    isJoining: joinGroupMutation.isPending,
  };
}

export function useGroup(groupId: string) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const api = useApi();
  
  const {
    data: group,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      if (!groupId) return null;
      return api.getGroup(groupId);
    },
    enabled: !!groupId
  });

  const { toast } = useToast();

  const addExpenseMutation = useMutation({
    mutationFn: async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
      return api.createExpense(groupId, expense);
    },
    onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['group', groupId] });
       queryClient.invalidateQueries({ queryKey: ['groups'] });
       toast({ title: 'Expense added' });
    },
    onError: (err) => {
      toast({ title: 'Failed to add expense', description: (err as Error).message, variant: 'destructive' });
    }
  });

  const updateExpenseMutation = useMutation({
    mutationFn: async ({ expenseId, data }: { expenseId: string; data: Partial<Expense> }) => {
      return api.updateExpense(expenseId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({ title: 'Expense updated!' });
    },
    onError: (err: Error) => {
      toast({ title: 'Failed to update expense', description: err.message, variant: 'destructive' });
    }
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: async (expenseId: string) => {
      return api.deleteExpense(expenseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({ title: 'Expense deleted' });
    },
    onError: (err: Error) => {
      toast({ title: 'Failed to delete expense', description: err.message, variant: 'destructive' });
    }
  });

  const recordSettlementMutation = useMutation({
    mutationFn: async (data: { from: string; to: string; amount: number }) => {
      return api.recordSettlement(groupId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({ title: 'Settlement recorded!' });
    },
    onError: (err: Error) => {
      toast({ title: 'Failed to record settlement', description: err.message, variant: 'destructive' });
    }
  });

  const updateGroupMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      return api.updateGroup(groupId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({ title: 'Group updated' });
    },
    onError: (err: Error) => {
      toast({ title: 'Failed to update group', description: err.message, variant: 'destructive' });
    }
  });

  const addMemberMutation = useMutation({
    mutationFn: async (memberName: string) => {
      return api.addMember(groupId, memberName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({ title: 'Member added' });
    },
    onError: (err: Error) => {
      toast({ title: 'Failed to add member', description: err.message, variant: 'destructive' });
    }
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberName: string) => {
      return api.removeMember(groupId, memberName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({ title: 'Member removed' });
    },
    onError: (err: Error) => {
      toast({ title: 'Failed to remove member', description: err.message, variant: 'destructive' });
    }
  });

  return {
    group,
    isLoading,
    error,
    refetch,
    addExpense: addExpenseMutation.mutate,
    updateExpense: updateExpenseMutation.mutate,
    deleteExpense: deleteExpenseMutation.mutate,
    recordSettlement: recordSettlementMutation.mutate,
    isAddingExpense: addExpenseMutation.isPending,
    isUpdatingExpense: updateExpenseMutation.isPending,
    isDeletingExpense: deleteExpenseMutation.isPending,
    isRecordingSettlement: recordSettlementMutation.isPending,
    updateGroup: updateGroupMutation.mutate,
    addMember: addMemberMutation.mutate,
    removeMember: removeMemberMutation.mutate,
  };
}
