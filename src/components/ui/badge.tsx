import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'fuchsia' | 'green' | 'amber' | 'blue' | 'purple' | 'outline' | 'destructive';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'border-violet-500/30 bg-violet-500/20 text-kodic-purple',
    purple: 'border-violet-500/30 bg-violet-500/20 text-kodic-purple',
    fuchsia: 'border-fuchsia-500/30 bg-fuchsia-500/20 text-kodic-fuchsia',
    green: 'border-emerald-500/30 bg-emerald-500/20 text-kodic-green',
    amber: 'border-amber-500/30 bg-amber-500/20 text-kodic-amber',
    blue: 'border-blue-500/30 bg-blue-500/20 text-kodic-blue',
    outline: 'border-violet-500/40 text-violet-200 bg-transparent',
    destructive: 'border-red-500/30 bg-red-500/20 text-red-400'
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider transition-colors',
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
