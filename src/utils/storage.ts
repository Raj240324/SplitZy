import { Group } from '@/types';

const STORAGE_KEY = 'splitzy_groups';

export const getGroups = (): Group[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveGroups = (groups: Group[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
};

export const getGroupById = (id: string): Group | undefined => {
  const groups = getGroups();
  return groups.find(g => g.id === id);
};

export const saveGroup = (group: Group): void => {
  const groups = getGroups();
  const index = groups.findIndex(g => g.id === group.id);
  if (index >= 0) {
    groups[index] = group;
  } else {
    groups.push(group);
  }
  saveGroups(groups);
};

export const deleteGroup = (id: string): void => {
  const groups = getGroups().filter(g => g.id !== id);
  saveGroups(groups);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
