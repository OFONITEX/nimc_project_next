import * as React from 'react';
import { cn } from '@/lib/utils';

export const insetPanelOuterClassName = 'bg-muted flex flex-1 flex-col rounded-[20px] p-1.5';
export const insetPanelInnerClassName = 'bg-card overflow-hidden rounded-[18px] shadow-xs';

export interface InsetPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  footer?: React.ReactNode;
  'data-testid'?: string;
}

export function InsetPanel({
  children,
  footer,
  className,
  'data-testid': testId,
  ...props
}: InsetPanelProps) {
  return (
    <div
      className={cn(insetPanelOuterClassName, className)}
      data-testid={testId || 'inset-panel'}
      {...props}
    >
      <div className={insetPanelInnerClassName}>
        {children}
      </div>
      {footer && (
        <div className="px-4 py-3 text-xs text-muted-foreground flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
}
