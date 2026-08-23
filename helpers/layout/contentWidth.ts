export type ContentWidthVariant = 'narrow' | 'wide' | 'full' | 'shellFull';

export const CONTENT_WIDTH_VARIANTS: Record<ContentWidthVariant, string> = {
  narrow: 'max-w-[574px] mx-auto w-full',
  wide: 'max-w-[1030px] mx-auto w-full',
  full: 'max-w-7xl mx-auto w-full',
  shellFull: 'max-w-7xl mx-auto w-full',
};

export const LAYOUT_PAGE_MAX_CLASS = 'max-w-7xl mx-auto w-full';

export function getContentWidthClass(variant: ContentWidthVariant = 'full'): string {
  return CONTENT_WIDTH_VARIANTS[variant] || LAYOUT_PAGE_MAX_CLASS;
}
