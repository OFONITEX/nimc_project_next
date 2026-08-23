import * as React from 'react';
import { Button, ButtonProps } from '@/components/ui/atoms/Button';
import { cn } from '@/lib/utils';

export interface DialogActionButtonConfig {
  label: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonProps['variant'];
  'data-testid'?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface DialogActionFooterProps {
  secondaryAction?: DialogActionButtonConfig;
  primaryAction: DialogActionButtonConfig;
  className?: string;
}

export function DialogActionFooter({
  secondaryAction,
  primaryAction,
  className,
}: DialogActionFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between w-full shrink-0 gap-4 pt-4 mt-2 border-t border-border/40',
        className
      )}
    >
      {secondaryAction ? (
        <Button
          type={secondaryAction.type || 'button'}
          variant={secondaryAction.variant || 'outline'}
          onClick={secondaryAction.onClick}
          disabled={secondaryAction.disabled || secondaryAction.loading}
          isLoading={secondaryAction.loading}
          data-testid={secondaryAction['data-testid'] || 'dialog-secondary-action'}
        >
          {secondaryAction.label}
        </Button>
      ) : (
        <div />
      )}

      <Button
        type={primaryAction.type || 'button'}
        variant={primaryAction.variant || 'default'}
        onClick={primaryAction.onClick}
        disabled={primaryAction.disabled || primaryAction.loading}
        isLoading={primaryAction.loading}
        data-testid={primaryAction['data-testid'] || 'dialog-primary-action'}
      >
        {primaryAction.label}
      </Button>
    </div>
  );
}
