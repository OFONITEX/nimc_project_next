/**
 * Formats an amount into Nigerian Naira currency format (e.g. ₦1,500.00)
 */
export function formatMoney(amount: number | string | null | undefined): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0);
  if (isNaN(numericAmount)) return '₦0.00';
  return '₦' + numericAmount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
