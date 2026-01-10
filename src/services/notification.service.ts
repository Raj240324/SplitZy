import { db } from '@/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  writeBatch,
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import { AppNotification } from '@/types';

export const createNotification = async (
  userId: string, 
  title: string, 
  message: string, 
  type: AppNotification['type'],
  groupId?: string,
  link?: string
) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: serverTimestamp(),
      groupId: groupId || null,
      link: link || null
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, { read: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

export const markAllAsRead = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'notifications'), 
      where('userId', '==', userId), 
      where('read', '==', false)
    );
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
    
    querySnapshot.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
  }
};

export const listenToUserNotifications = (
  userId: string, 
  callback: (notifications: AppNotification[]) => void
) => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (snapshot) => {
    const notifications: AppNotification[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data({ serverTimestamps: 'estimate' }),
    })) as AppNotification[];
    
    // Sort manually in memory to avoid needing a Firestore composite index
    const sortedNotifications = notifications.sort((a, b) => {
      const timeA = (a.createdAt as any)?.toMillis?.() || (typeof a.createdAt === 'number' ? a.createdAt : 0);
      const timeB = (b.createdAt as any)?.toMillis?.() || (typeof b.createdAt === 'number' ? b.createdAt : 0);
      return timeB - timeA;
    });
    
    callback(sortedNotifications);
  });
};

export const deleteNotification = async (notificationId: string) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await deleteDoc(notificationRef);
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
};
