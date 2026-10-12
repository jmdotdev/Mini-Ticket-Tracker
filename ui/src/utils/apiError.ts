import axios from 'axios';

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ error?: string }>(error)) {
    return error.response?.data?.error ?? error.message;
  }
  return error instanceof Error ? error.message : 'Request failed.';
}