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
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import { Group, Expense } from '@/types';

const GROUPS_COLLECTION = 'groups';

export const createGroup = async (groupData: Omit<Group, 'id'>, userId?: string) => {
    const dataToSave = {
        ...groupData,
        shareCode: groupData.shareCode || Math.random().toString(36).substring(2, 8).toUpperCase(),
        createdAt: groupData.createdAt || Date.now(),
        expenses: [],
        // Store userIds for querying, even if not in strict Group type
        userIds: userId ? [userId] : []
    };

    const docRef = await addDoc(collection(db, GROUPS_COLLECTION), dataToSave);
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
    
    await updateDoc(doc(db, GROUPS_COLLECTION, groupId), {
        expenses: arrayUnion(newExpense)
    });
    return newExpense;
};

export const updateExpenseService = async (groupId: string, expenses: Expense[]) => {
    await updateDoc(doc(db, GROUPS_COLLECTION, groupId), {
        expenses
    });
};

export const deleteExpenseService = async (groupId: string, expense: Expense) => {
    await updateDoc(doc(db, GROUPS_COLLECTION, groupId), {
        expenses: arrayRemove(expense)
    });
};

export const addMemberService = async (groupId: string, name: string) => {
    await updateDoc(doc(db, GROUPS_COLLECTION, groupId), {
        members: arrayUnion(name)
    });
};

export const removeMemberService = async (groupId: string, name: string) => {
    await updateDoc(doc(db, GROUPS_COLLECTION, groupId), {
        members: arrayRemove(name)
    });
};
