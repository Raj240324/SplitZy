import { cn } from '@/lib/utils';

const avatarColors = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-cyan-500',
  'bg-amber-500',
  'bg-rose-500'
];

interface MemberAvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const MemberAvatar = ({ name, size = 'md', className }: MemberAvatarProps) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color = avatarColors[colorIndex % avatarColors.length];

  const sizeClasses = {
    xs: 'w-6 h-6 text-[8px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div 
      className={cn(
        'rounded-full flex items-center justify-center text-white font-semibold',
        color,
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
};

export default MemberAvatar;
