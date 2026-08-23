/**
 * Parses generic errors, FetchBaseQueryError, and API response error payloads into clean user-facing error messages.
 */
export function parseApiError(error: unknown, fallbackMessage = 'An unexpected error occurred'): string {
  if (!error) return fallbackMessage;

  if (typeof error === 'string') return error;

  if (typeof error === 'object' && error !== null) {
    // RTK Query FetchBaseQueryError shape
    if ('data' in error) {
      const errorData = (error as { data?: unknown }).data;
      if (typeof errorData === 'string') return errorData;
      if (typeof errorData === 'object' && errorData !== null) {
        if ('error' in errorData && typeof (errorData as { error: unknown }).error === 'string') {
          return (errorData as { error: string }).error;
        }
        if ('message' in errorData && typeof (errorData as { message: unknown }).message === 'string') {
          return (errorData as { message: string }).message;
        }
      }
    }

    if ('message' in error && typeof (error as { message: unknown }).message === 'string') {
      return (error as { message: string }).message;
    }
  }

  return fallbackMessage;
}
