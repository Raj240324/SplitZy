import { Bell, Check, Inbox } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/5 hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-background animate-in zoom-in duration-300">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[calc(100vw-2.5rem)] sm:w-80 p-0 overflow-hidden rounded-3xl border-border bg-background/95 backdrop-blur-xl shadow-2xl" 
        align="end" 
        sideOffset={12}
        collisionPadding={16}
      >
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => markAllAsRead()}
              className="h-7 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 rounded-full px-3"
            >
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground p-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Inbox className="w-6 h-6 opacity-20" />
              </div>
              <p className="text-sm font-medium tracking-tight">No notifications yet</p>
              <p className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-50">Empty Era</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                  className={cn(
                    "p-4 cursor-pointer transition-colors hover:bg-muted/50 relative group",
                    !notification.read && "bg-primary/[0.03]"
                  )}
                >
                  <div className="flex gap-3">
                    <div className={cn(
                      "mt-1 w-2 h-2 rounded-full flex-shrink-0 transition-all",
                      notification.read ? "bg-transparent" : "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                    )} />
                    <div className="space-y-1 pr-2">
                      <p className={cn(
                        "text-xs leading-tight tracking-tight",
                        notification.read ? "text-foreground/70 font-medium" : "text-foreground font-black"
                      )}>
                        {notification.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-snug font-medium line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 pt-1">
                        {notification.createdAt 
                          ? formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true }) 
                          : 'just now'}
                      </p>
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
