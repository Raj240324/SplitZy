import { Group, Expense, Activity } from '../types';


const STORAGE_PREFIX = 'splitzy_groups_';

// Helper to generate activity
export const createActivity = (
  type: Activity['type'],
  description: string,
  byUser?: string
): Activity => ({
  id: generateId(),
  type,
  description,
  timestamp: Date.now(),
  byUser
});

const getStorageKey = (userId?: string | null) => {
  if (!userId) return STORAGE_PREFIX;
  return `${STORAGE_PREFIX}${userId}`;
};

export const getGroups = (userId?: string | null): Group[] => {
  const online = localStorage.getItem('auth_online') === 'true';
  // If we are "offline" auth_online=false, we might still want local storage.
  // But for this requirement, we focus on the authenticated user's data.
  
  try {
    const key = getStorageKey(userId);
    const data = localStorage.getItem(key);
    const groups = data ? JSON.parse(data) : [];
    return groups.map((g: Group) => ({
      ...g,
      shareCode: g.shareCode || generateShareCode()
    }));
  } catch {
    return [];
  }
};

export const saveGroups = (groups: Group[], userId?: string | null): void => {
  const key = getStorageKey(userId);
  localStorage.setItem(key, JSON.stringify(groups));
};

export const getGroupById = (id: string, userId?: string | null): Group | undefined => {
  const groups = getGroups(userId);
  return groups.find(g => g.id === id);
};

export const getGroupByShareCode = (shareCode: string, userId?: string | null): Group | undefined => {
  // Share codes might be global or we might need to search all users? 
  // For now, let's restrict to current user or maybe we need a global lookup index later.
  // Assuming simpler scope: user can only join valid groups they have access to?
  // Actually, joining a group usually adds it to your list.
  // If I join a group, I need to fetch it from SOMEWHERE. 
  // If it's local only, I can't really 'join' another user's group unless we have a backend.
  // Since this is SplitZy (Local Storage), 'Sharing' usually implies just copying state 
  // or it won't work across devices/users without a backend.
  // For strict isolation, we just look in current user's groups.
  const groups = getGroups(userId);
  return groups.find(g => g.shareCode.toUpperCase() === shareCode.toUpperCase());
};

export const saveGroup = (group: Group, userId?: string | null): void => {
  // Ensure activities array exists
  if (!group.activities) {
    group.activities = [];
  }
  
  const groups = getGroups(userId);
  const index = groups.findIndex(g => g.id === group.id);
  if (index >= 0) {
    groups[index] = group;
  } else {
    groups.push(group);
  }
  saveGroups(groups, userId);
};

export const deleteGroup = (id: string, userId?: string | null): void => {
  const groups = getGroups(userId).filter(g => g.id !== id);
  saveGroups(groups, userId);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const generateShareCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};


