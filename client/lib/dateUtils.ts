// System-wide date formatting utility
// Default format follows Month-day-year as configured by super admin

interface DateFormatOptions {
  includeTime?: boolean;
  format?: "short" | "long" | "numeric";
}

/**
 * Formats a date according to system-wide configuration
 * Default format: MM/dd/yyyy (Month-day-year)
 */
export function formatSystemDate(
  date: string | Date,
  options: DateFormatOptions = {},
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  const { includeTime = false, format = "numeric" } = options;

  // Base format configuration (can be made configurable via super admin settings)
  const baseOptions: Intl.DateTimeFormatOptions = {
    month:
      format === "long" ? "long" : format === "short" ? "short" : "2-digit",
    day: "2-digit",
    year: "numeric",
  };

  if (includeTime) {
    baseOptions.hour = "2-digit";
    baseOptions.minute = "2-digit";
    baseOptions.hour12 = true;
  }

  return dateObj.toLocaleDateString("en-US", baseOptions);
}

/**
 * Formats a date for display in tables and lists
 */
export function formatTableDate(date: string | Date): string {
  return formatSystemDate(date, { format: "numeric" });
}

/**
 * Formats a date with time for detailed views
 */
export function formatDateTime(date: string | Date): string {
  return formatSystemDate(date, { includeTime: true, format: "short" });
}

/**
 * Formats a date in a readable format for descriptions
 */
export function formatReadableDate(date: string | Date): string {
  return formatSystemDate(date, { format: "long" });
}

/**
 * Get system date format preference from super admin settings
 * This would typically come from an API or global settings
 */
export function getSystemDateFormat(): string {
  // Default to Month-day-year format
  // In a real app, this would be fetched from super admin configuration
  return "MM/dd/yyyy";
}
