import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, value));

    return (
      <div
        ref={ref}
        className={cn('relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10', className)}
        {...props}
      >
        <div
          className="h-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-emerald-400 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
