import * as React from 'react';
import { cn } from '@/lib/utils';
import { InsetPanel, InsetPanelProps } from './InsetPanel';

export interface SectionPanelProps extends Omit<InsetPanelProps, 'title'> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  toolbar?: React.ReactNode;
  containerClassName?: string;
}

export function SectionPanel({
  title,
  subtitle,
  toolbar,
  containerClassName,
  children,
  footer,
  ...insetProps
}: SectionPanelProps) {
  return (
    <div className={cn('flex flex-col space-y-3', containerClassName)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1">
        <div>
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
      </div>
      <InsetPanel footer={footer} {...insetProps}>
        {children}
      </InsetPanel>
    </div>
  );
}
