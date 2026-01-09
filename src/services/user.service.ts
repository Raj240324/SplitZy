import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, UpiId } from '@/types';

const USERS_COLLECTION = 'users';

export const createUserProfile = async (user: { id: string, email?: string, displayName: string, photoURL?: string }) => {
  const userRef = doc(db, USERS_COLLECTION, user.id);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const newProfile: UserProfile = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      upiIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await setDoc(userRef, newProfile);
    return newProfile;
  }
  
  return userSnap.data() as UserProfile;
};

export const getUserProfile = async (userId: string) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await updateDoc(userRef, {
    ...data,
    updatedAt: Date.now()
  });
};

export const addUpiId = async (userId: string, upiData: { vpa: string, label: string }) => {
  const userProfile = await getUserProfile(userId);
  if (!userProfile) throw new Error('User not found');

  const newUpiId: UpiId = {
    id: crypto.randomUUID(),
    vpa: upiData.vpa,
    label: upiData.label,
    isPrimary: userProfile.upiIds.length === 0 // Make primary if it's the first one
  };

  const updatedUpiIds = [...userProfile.upiIds, newUpiId];

  await updateDoc(doc(db, USERS_COLLECTION, userId), {
    upiIds: updatedUpiIds,
    updatedAt: Date.now()
  });

  return newUpiId;
};

export const removeUpiId = async (userId: string, upiIdId: string) => {
  const userProfile = await getUserProfile(userId);
  if (!userProfile) throw new Error('User not found');

  const updatedUpiIds = userProfile.upiIds.filter(upi => upi.id !== upiIdId);

  // If we removed the primary, make the first one primary (if exists)
  if (updatedUpiIds.length > 0 && !updatedUpiIds.some(u => u.isPrimary)) {
    updatedUpiIds[0].isPrimary = true;
  }

  await updateDoc(doc(db, USERS_COLLECTION, userId), {
    upiIds: updatedUpiIds,
    updatedAt: Date.now()
  });
};

export const setPrimaryUpiId = async (userId: string, upiIdId: string) => {
  const userProfile = await getUserProfile(userId);
  if (!userProfile) throw new Error('User not found');

  const updatedUpiIds = userProfile.upiIds.map(upi => ({
    ...upi,
    isPrimary: upi.id === upiIdId
  }));

  await updateDoc(doc(db, USERS_COLLECTION, userId), {
    upiIds: updatedUpiIds,
    updatedAt: Date.now()
  });
};
