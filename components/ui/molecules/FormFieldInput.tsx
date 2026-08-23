import * as React from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { Input, InputProps } from '@/components/ui/atoms/Input';
import { cn } from '@/lib/utils';

export interface FormFieldInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<InputProps, 'name' | 'defaultValue'> {
  name: TName;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  containerClassName?: string;
  'data-testid'?: string;
}

export function FormFieldInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  description,
  containerClassName,
  className,
  'data-testid': testId,
  ...inputProps
}: FormFieldInputProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('flex flex-col space-y-1.5', containerClassName)}>
          {label && (
            <label
              htmlFor={name}
              className="text-xs font-semibold uppercase tracking-wider text-foreground/80"
            >
              {label}
            </label>
          )}
          <Input
            id={name}
            data-testid={testId || `input-${name}`}
            hasError={!!error}
            className={className}
            {...inputProps}
            {...field}
            value={field.value ?? ''}
          />
          {description && !error && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {error && (
            <p className="text-xs font-medium text-destructive animate-in fade-in-50">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
