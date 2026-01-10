import { useNotifications } from '@/hooks/use-notifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Check, Trash2, History, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const NotificationHistory = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Notification History
          </CardTitle>
          <CardDescription>
            View and manage your recent activity alerts
          </CardDescription>
        </div>
        {notifications.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => markAllAsRead()}
            className="text-xs font-bold"
          >
            Mark all read
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Bell className="w-8 h-8 opacity-20 mb-3" />
            <p className="text-sm font-medium">No notification history</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (!n.read) markAsRead(n.id);
                  if (n.link) navigate(n.link);
                  else if (n.groupId) navigate(`/group/${n.groupId}`);
                }}
                className={cn(
                  "p-4 flex items-start gap-4 cursor-pointer transition-colors hover:bg-muted/30 group relative",
                  !n.read && "bg-primary/[0.02]"
                )}
              >
                <div className={cn(
                  "mt-1 w-2 h-2 rounded-full flex-shrink-0",
                  n.read ? "bg-transparent" : "bg-primary"
                )} />
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "text-sm",
                      n.read ? "text-foreground/70" : "font-bold text-foreground"
                    )}>
                      {n.title}
                    </p>
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {n.createdAt?.toDate ? formatDistanceToNow(n.createdAt.toDate(), { addSuffix: true }) : 'just now'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {n.message}
                  </p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                   <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                         e.stopPropagation();
                         deleteNotification(n.id);
                      }}
                   >
                     <Trash2 className="w-3.5 h-3.5" />
                   </Button>
                   {n.link && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
