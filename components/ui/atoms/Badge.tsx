import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary border border-primary/20',
        secondary: 'bg-muted text-muted-foreground',
        destructive: 'bg-destructive/10 text-destructive border border-destructive/20',
        warning: 'bg-warning/10 text-warning-foreground bg-amber-500 text-white',
        success: 'bg-success/10 text-success border border-success/20',
        admin: 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-xs',
        agent: 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-xs',
        outline: 'border border-border text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
