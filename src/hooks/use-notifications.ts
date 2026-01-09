import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { AppNotification } from '@/types';
import { 
  listenToUserNotifications, 
  markNotificationAsRead, 
  markAllAsRead 
} from '@/services/notification.service';
import { toast } from 'sonner';

export const useNotifications = () => {
  const { userId } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const knownIds = useRef<Set<string>>(new Set());
  const initialLoad = useRef(true);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const unsubscribe = listenToUserNotifications(userId, (newNotifications) => {
      newNotifications.forEach(notification => {
        if (!notification.read && !knownIds.current.has(notification.id)) {
          // Only toast if it's truly new and not part of the initial fetch
          if (!initialLoad.current) {
            toast(notification.title, {
              description: notification.message,
            });
          }
        }
        knownIds.current.add(notification.id);
      });

      initialLoad.current = false;
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.filter(n => !n.read).length);
    });

    return () => unsubscribe();
  }, [userId]);

  return {
    notifications,
    unreadCount,
    markAsRead: markNotificationAsRead,
    markAllAsRead: () => userId && markAllAsRead(userId),
  };
};
