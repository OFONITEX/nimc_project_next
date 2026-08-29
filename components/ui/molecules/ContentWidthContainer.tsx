import * as React from 'react';
import { ContentWidthVariant, getContentWidthClass } from '@/helpers/layout/contentWidth';
import { cn } from '@/lib/utils';

export interface ContentWidthContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ContentWidthVariant;
}

export function ContentWidthContainer({
  variant = 'full',
  className,
  children,
  ...props
}: ContentWidthContainerProps) {
  return (
    <div className={cn(getContentWidthClass(variant), 'px-4 sm:px-6 lg:px-8', className)} {...props}>
      {children}
    </div>
  );
}
