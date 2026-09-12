import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'amber';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]';

    const variants = {
      default: 'bg-gradient-to-r from-kodic-purple to-kodic-fuchsia text-white shadow-lg hover:brightness-110 hover:shadow-kodic-fuchsia/20',
      primary: 'bg-gradient-to-r from-kodic-purple to-kodic-fuchsia text-white shadow-lg hover:brightness-110',
      secondary: 'bg-white/10 hover:bg-white/15 text-white border border-white/15',
      outline: 'border border-violet-500/30 bg-transparent hover:bg-violet-500/10 text-white',
      ghost: 'hover:bg-white/10 text-white',
      destructive: 'bg-red-500 text-white hover:bg-red-600',
      amber: 'bg-gradient-to-r from-kodic-amber to-kodic-orange text-white shadow-md hover:brightness-110'
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 rounded-lg px-3 text-xs',
      lg: 'h-12 rounded-2xl px-6 text-base',
      icon: 'h-9 w-9 rounded-full p-0'
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
