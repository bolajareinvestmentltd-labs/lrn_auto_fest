// Utility functions for date and time operations

export const EVENT_DATE = new Date('2026-05-30T00:00:00Z');
export const PRESALE_END_DATE = new Date('2026-03-31T23:59:59Z');
export const ONSALE_START_DATE = new Date('2026-04-01T00:00:00Z');

/**
 * Check if presale is currently active
 */
export function isPresaleActive(): boolean {
  const now = new Date();
  return now <= PRESALE_END_DATE;
}

/**
 * Get current date (can be mocked for testing)
 */
export function getCurrentDate(): Date {
  return new Date();
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date and time for display
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get countdown to event date
 */
export function getCountdownToEvent(targetDate = EVENT_DATE) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isOver: false };
}

/**
 * Get remaining days to presale end
 */
export function getDaysUntilPresaleEnd(): number {
  const now = new Date();
  const diff = PRESALE_END_DATE.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
