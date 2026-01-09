import { useState } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { Trash2, Users } from 'lucide-react';
import { Group } from '@/types';
import { formatCurrency } from '@/utils/calculations';
import { cn } from '@/lib/utils';

interface SwipeableGroupCardProps {
  group: Group;
  color: string;
  totalExpenses: number;
  userBalance: { member: string; netBalance: number } | undefined;
  onClick: () => void;
  onDelete: () => void;
}

const SwipeableGroupCard = ({
  group,
  color,
  totalExpenses,
  userBalance,
  onClick,
  onDelete,
}: SwipeableGroupCardProps) => {
  const controls = useAnimation();
  const [isDeleting, setIsDeleting] = useState(false);
  const swipeThreshold = -100;

  const handleDragEnd = async (_: any, info: PanInfo) => {
    if (info.offset.x < swipeThreshold) {
      // Trigger delete preview/confirmation
      await controls.start({ x: swipeThreshold, transition: { type: 'spring', stiffness: 300, damping: 30 } });
      onDelete();
      // Reset after a bit if not deleted (though usually a modal will pop up)
      setTimeout(() => {
        controls.start({ x: 0 });
      }, 2000);
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl group">
      {/* Background/Delete Action Layer */}
      <div className="absolute inset-0 bg-destructive flex items-center justify-end px-6 rounded-2xl">
        <div className="flex flex-col items-center gap-1 text-destructive-foreground">
          <Trash2 className="w-6 h-6 animate-pulse" />
          <span className="text-fluid-xs font-black uppercase tracking-widest">Delete</span>
        </div>
      </div>

      {/* Foreground/Card Layer */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={controls}
        whileTap={{ scale: 0.98 }}
        className="relative bg-card rounded-2xl border border-border/50 hover:border-primary/50 transition-colors shadow-sm cursor-pointer z-10"
        onClick={(e) => {
            // Only navigate if we're not swiping
            if (Math.abs(window.event && (window.event as any).movementX || 0) < 5) {
                onClick();
            }
        }}
      >
        <div className={`h-2 bg-gradient-to-r ${color}`} />
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Users className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total spent</p>
              <p className="text-lg font-bold">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{group.name}</h3>
          <p className="text-sm text-muted-foreground mb-6">{group.members.length} members</p>

          <div className="pt-4 border-t border-border/50 flex justify-between items-center">
            <div className="flex -space-x-2">
              {group.members.slice(0, 3).map((member, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-fluid-xs font-bold">
                  {member[0]}
                </div>
              ))}
              {group.members.length > 3 && (
                <div className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-fluid-xs font-bold">
                  +{group.members.length - 3}
                </div>
              )}
            </div>
            
            {userBalance && Math.abs(userBalance.netBalance) > 0.01 ? (
              <div className={cn(
                "text-sm font-bold",
                userBalance.netBalance > 0 ? 'text-balance-positive' : 'text-balance-negative'
              )}>
                {userBalance.netBalance > 0 ? 'Gets' : 'Owes'} {formatCurrency(Math.abs(userBalance.netBalance))}
              </div>
            ) : (
              <div className="text-sm font-medium text-muted-foreground italic">Settled</div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Hint Indicator (only visible on mount/interaction hint) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: [0, 1, 0], x: [20, 0, 20] }}
        transition={{ duration: 2, repeat: 1, delay: 1 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/30 sm:hidden"
      >
        <div className="flex items-center gap-1">
          <span className="text-fluid-xs font-black uppercase">Swipe</span>
          <Trash2 className="w-3 h-3" />
        </div>
      </motion.div>
    </div>
  );
};

export default SwipeableGroupCard;
