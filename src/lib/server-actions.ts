/**
 * Reusable server action utilities
 * These can be used across the application for data mutations
 */

'use server';

export async function serverError(message: string) {
  return {
    success: false,
    error: message,
  };
}

export async function serverSuccess(data: unknown = null) {
  return {
    success: true,
    data,
  };
}
