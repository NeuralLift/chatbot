import { cn } from '@/lib/utils';

interface BadgeStatusProps {
  status: 'active' | 'inactive' | 'pending' | 'training';
  className?: string;
}

export function BadgeStatus({ status, className }: BadgeStatusProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn('h-2 w-2 rounded-full', {
          'bg-green-500': status === 'active',
          'bg-yellow-500': status === 'pending',
          'bg-red-500': status === 'inactive',
        })}
      />
      <span
        className={cn('text-xs capitalize', {
          'text-green-600': status === 'active',
          'text-yellow-600': status === 'pending',
          'text-red-600': status === 'inactive',
        })}>
        {status}
      </span>
    </div>
  );
}
