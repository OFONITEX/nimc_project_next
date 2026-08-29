import * as React from 'react';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/atoms/Button';
import { cn } from '@/lib/utils';

export type StatusDialogType = 'success' | 'warning' | 'error' | 'info';

export interface StatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  type?: StatusDialogType;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function StatusDialog({
  isOpen,
  onClose,
  title,
  description,
  type = 'success',
  primaryAction,
  secondaryAction,
}: StatusDialogProps) {
  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle2 className="h-10 w-10 text-success animate-in zoom-in-75" />,
    warning: <AlertTriangle className="h-10 w-10 text-amber-500 animate-in zoom-in-75" />,
    error: <AlertCircle className="h-10 w-10 text-destructive animate-in zoom-in-75" />,
    info: <Info className="h-10 w-10 text-sky-500 animate-in zoom-in-75" />,
  };

  const iconBg = {
    success: 'bg-success/10 border-success/20',
    warning: 'bg-amber-500/10 border-amber-500/20',
    error: 'bg-destructive/10 border-destructive/20',
    info: 'bg-sky-500/10 border-sky-500/20',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred backdrop overlay */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Dialog Card */}
      <div className="relative z-50 w-full max-w-md rounded-2xl border border-border bg-card p-4 shadow-floating animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={cn(
              'mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border',
              iconBg[type]
            )}
          >
            {icons[type]}
          </div>

          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>

          <div className="mt-6 flex w-full items-center justify-center gap-3">
            {secondaryAction && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
            <Button
              className={cn('flex-1', !secondaryAction && 'w-full')}
              onClick={primaryAction ? primaryAction.onClick : onClose}
            >
              {primaryAction ? primaryAction.label : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
