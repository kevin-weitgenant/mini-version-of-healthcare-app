import { format } from 'date-fns';

/**
 * Get the user's current timezone
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Format a UTC timestamp in the user's timezone
 * This is the key function that fixes the date display issue
 */
export function formatAppointmentDate(utcDateTime: string): string {
  // Parse the UTC datetime and format it in the user's local timezone
  const date = new Date(utcDateTime);
  return format(date, "MMM dd, yyyy");
}

/**
 * Format a UTC timestamp with time in the user's timezone
 */
export function formatAppointmentDateTime(utcDateTime: string): { date: string; time: string } {
  const date = new Date(utcDateTime);
  return {
    date: format(date, "MMM dd, yyyy"),
    time: format(date, "h:mm a")
  };
}

/**
 * Convert local date and time to UTC for storage
 */
export function convertToUTC(localDate: string, localTime: string): string {
  // Create a date in the user's local timezone
  const localDateTime = new Date(`${localDate}T${localTime}`);
  return localDateTime.toISOString();
}
