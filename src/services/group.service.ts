import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  arrayUnion, 
  arrayRemove, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { Group, Expense } from '@/types';
import { createNotification } from './notification.service';

const GROUPS_COLLECTION = 'groups';

// Helper to notify group members
const notifyGroup = async (groupId: string, title: string, message: string, type: 'expense' | 'group' | 'settlement', actorId?: string) => {
    try {
        const groupDoc = await getDoc(doc(db, GROUPS_COLLECTION, groupId));
        if (groupDoc.exists()) {
            const data = groupDoc.data();
            const userIds = data.userIds || [];
            const groupName = data.name || 'Group';
            
            userIds.forEach((userId: string) => {
                if (userId !== actorId) {
                    createNotification(userId, title, `${message} in "${groupName}"`, type);
                }
            });
        }
    } catch (error) {
        console.error('Error notifying group:', error);
    }
};


// Helper to add activity
const addActivity = async (groupId: string, type: string, description: string, byUser?: string) => {
    const activity = {
        id: crypto.randomUUID(),
        type,
        description,
        timestamp: Date.now(),
        byUser: byUser || 'Unknown'
    };

    await updateDoc(doc(db, GROUPS_COLLECTION, groupId), {
        activities: arrayUnion(activity)
    });
};

export const createGroup = async (groupData: Omit<Group, 'id'>, userId?: string) => {
    const dataToSave = {
        ...groupData,
        shareCode: groupData.shareCode || Math.random().toString(36).substring(2, 8).toUpperCase(),
        createdAt: groupData.createdAt || Date.now(),
        expenses: [],
        activities: [], // Initialize activities
        // Store userIds for querying, even if not in strict Group type
        userIds: userId ? [userId] : []
    };

    const docRef = await addDoc(collection(db, GROUPS_COLLECTION), dataToSave);
    
    // Initial activity
    await addActivity(docRef.id, 'group_updated', `Group "${groupData.name}" created`, userId);

    // Initial notification (only for the creator)
    if (userId) {
        await createNotification(userId, 'Group Created', `You created your new group "${groupData.name}"`, 'group');
    }
    
    return docRef.id;
};

// Export as deleteGroup for consumers like Settings.tsx
export const deleteGroup = async (groupId: string) => {
    await deleteDoc(doc(db, GROUPS_COLLECTION, groupId));
};

// Alias for internal/clean usage
export const deleteGroupService = deleteGroup;

export const updateGroupService = async (groupId: string, data: Partial<Group>) => {
    await updateDoc(doc(db, GROUPS_COLLECTION, groupId), data);
    
    if (data.name) {
        await addActivity(groupId, 'group_updated', `Group renamed to "${data.name}"`);
    }
};

export const getGroupByShareCode = async (code: string, userId?: string) => {
    const q = query(collection(db, GROUPS_COLLECTION), where('shareCode', '==', code));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docData = snapshot.docs[0];
    return { id: docData.id, ...docData.data() } as Group;
};

export const joinGroupByShareCode = async (code: string, userId?: string) => {
    const group = await getGroupByShareCode(code);
    if (group && userId) {
        // Add user to the group's visibility list
        // Note: This does NOT add their name to 'members' list (which contains display names)
        // The modal logic might handle name adding, or we should do it here?
        // Given existing logic, we just ensure they can SEE it.
        await updateDoc(doc(db, GROUPS_COLLECTION, group.id), {
            userIds: arrayUnion(userId)
        });
        
        // Notify others that someone joined
        await notifyGroup(group.id, 'Member Joined', 'Someone joined the group using the share code', 'group', userId);
        
        // Notify the joining user
        await createNotification(userId, 'Joined Group', `You successfully joined "${group.name}"`, 'group');
    }
    return group;
};

export const listenGroups = (userId: string, callback: (groups: Group[]) => void) => {
    // Query groups where userIds array contains the userId
    const q = query(
        collection(db, GROUPS_COLLECTION), 
        where('userIds', 'array-contains', userId)
    );
    
    return onSnapshot(q, (snapshot) => {
        const groups: Group[] = [];
        snapshot.forEach((doc) => {
            groups.push({ id: doc.id, ...doc.data() } as Group);
        });
        callback(groups);
    });
};

// Expense Operations
export const addExpenseService = async (groupId: string, expense: Omit<Expense, 'id'>) => {
    const newExpense = {
        ...expense,
        id: crypto.randomUUID(), 
        createdAt: Date.now()
    };
    
    // Sanitize: Firestore rejects undefined values, so we must remove them
    Object.keys(newExpense).forEach(key => 
        (newExpense as any)[key] === undefined && delete (newExpense as any)[key]
    );
    
    await updateDoc(doc(db, GROUPS_COLLECTION, groupId), {
        expenses: arrayUnion(newExpense)
    });

    const isSettlement = expense.type === 'settlement';
    const type = isSettlement ? 'settlement' : 'expense_added';
    const desc = isSettlement 
        ? `${expense.paidBy} paid ${expense.splitAmong[0]} ${expense.amount}`
        : `${expense.paidBy} added "${expense.title}"`;

    await addActivity(groupId, type, desc, expense.paidBy);

    // Notifications
    const notificationTitle = isSettlement ? 'Settlement Recorded' : 'New Expense';
    const notificationType = isSettlement ? 'settlement' : 'expense';
    
    // Note: We don't have actor's Clerk ID here directly, but we can pass it if we update the callers.
    // For now, it will notify everyone. Ideally callers should pass Clerk ID.
    await notifyGroup(groupId, notificationTitle, desc, notificationType);

    return newExpense;
};

export const updateExpenseService = async (groupId: string, expenses: Expense[]) => {
    // We need to know WHICH expense changed to log it, but here we just replace the whole array.
    // Ideally we would fetch the old one, but for now let's just update.
    // To properly log "expense_updated", we might need to change the signature or just log generic "Expense updated".
    // For a better UX, let's assume the UI calls this for a single update usually? 
    // Actually, updateExpenseService replaces ALL expenses. This is slightly dangerous for concurrency but matches existing pattern.
    // Let's just log a generic message or try to find diff? 
    // Finding diff is too expensive here without old data.
    // We will trust the UI to trigger this ONLY when an expense is updated.

    await updateDoc(doc(db, GROUPS_COLLECTION, groupId), {
        expenses
    });

    // NOTE: Detailed logging for updates is tricky with this "replace all" strategy. 
    // We'll log a generic message.
    await addActivity(groupId, 'expense_updated', 'An expense was updated');
};

// We need a better update service that takes just the ID to log better, but keeping existing signature for now.

export const deleteExpenseService = async (groupId: string, expense: Expense) => {
    await updateDoc(doc(db, GROUPS_COLLECTION, groupId), {
        expenses: arrayRemove(expense)
    });

    await addActivity(groupId, 'expense_deleted', `Expense "${expense.title}" deleted`, expense.paidBy);
};

export const updateSettlementStatus = async (groupId: string, expenseId: string, status: 'confirmed' | 'failed', actorName: string) => {
    const groupDoc = await getDoc(doc(db, GROUPS_COLLECTION, groupId));
    if (!groupDoc.exists()) return;

    const groupData = groupDoc.data() as Group;
    const expenseIndex = groupData.expenses.findIndex(e => e.id === expenseId);

    if (expenseIndex === -1) return;

    const expense = groupData.expenses[expenseIndex];
    const updatedExpenses = [...groupData.expenses];
    updatedExpenses[expenseIndex] = {
        ...expense,
        paymentStatus: status === 'confirmed' ? 'completed' : 'failed'
    };

    await updateDoc(doc(db, GROUPS_COLLECTION, groupId), {
        expenses: updatedExpenses
    });

    const action = status === 'confirmed' ? 'confirmed' : 'rejected';
    await addActivity(groupId, 'settlement', `Settlement from ${expense.paidBy} was ${action} by ${actorName}`);

    // Notify the payer
    // Ideally we need the Payer's UserID. Since we only have name here (legacy issue), we will notify everyone or try to find ID?
    // For now, let's notify the group with a specific message that targets the payer by name in the text.
    await notifyGroup(
        groupId, 
        `Payment ${status === 'confirmed' ? 'Confirmed' : 'Rejected'}`, 
        `${actorName} has ${action} the payment from ${expense.paidBy}`, 
        'settlement'
    );
};

export const addMemberService = async (groupId: string, name: string) => {
    await updateDoc(doc(db, GROUPS_COLLECTION, groupId), {
        members: arrayUnion(name)
    });

    await addActivity(groupId, 'member_added', `${name} joined the group`);
};

export const removeMemberService = async (groupId: string, name: string) => {
    await updateDoc(doc(db, GROUPS_COLLECTION, groupId), {
        members: arrayRemove(name)
    });

    await addActivity(groupId, 'member_removed', `${name} left the group`);
};
