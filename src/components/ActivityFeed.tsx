import { formatDistanceToNow } from 'date-fns';
import { Activity } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Plus, Pencil, Trash2, Users, Settings as SettingsIcon, CheckCircle } from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
}

const activityIcons = {
  expense_added: Plus,
  expense_updated: Pencil,
  expense_deleted: Trash2,
  settlement: CheckCircle,
  member_added: Users,
  member_removed: Users,
  group_updated: SettingsIcon,
};

const activityColors = {
  expense_added: 'text-emerald-600 dark:text-emerald-400',
  expense_updated: 'text-blue-600 dark:text-blue-400',
  expense_deleted: 'text-red-600 dark:text-red-400',
  settlement: 'text-primary',
  member_added: 'text-indigo-600 dark:text-indigo-400',
  member_removed: 'text-orange-600 dark:text-orange-400',
  group_updated: 'text-violet-600 dark:text-violet-400',
};

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No activity yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type];
              const colorClass = activityColors[activity.type];

              return (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`mt-0.5 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
