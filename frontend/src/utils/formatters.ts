/**
 * Utility functions for formatting values in the UI
 */

/**
 * Format a number as currency using the specified locale and currency
 */
export const formatCurrency = (
  amount: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date string to a more readable format
 * @param dateString - ISO date string or any valid date string format
 * @returns Formatted date string (e.g. Jan 15, 2023)
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format a date with time in a human-readable format
 */
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Format a date as a relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObject.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

/**
 * Truncate text with an ellipsis if it exceeds the maximum length
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Formats a phone number to a standard format
 * Example: formatPhoneNumber("1234567890") returns "(123) 456-7890"
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format the phone number based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 11)}`;
  }
  
  // Return the original number if it doesn't match expected formats
  return phoneNumber;
};

/**
 * Format a number with thousand separators
 * @param value - Numeric value to format
 * @returns Formatted number string with thousand separators
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Format a file size in bytes to a human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format a percentage value
 * @param value - Numeric value to format as percentage (e.g. 0.25 for 25%)
 * @param decimalPlaces - Number of decimal places to show (default: 2)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimalPlaces = 2): string => {
  return `${(value * 100).toFixed(decimalPlaces)}%`;
};

/**
 * Calculate the difference between two dates in days
 * @param startDate - Start date string
 * @param endDate - End date string (optional, defaults to current date)
 * @returns Number of days between dates
 */
export const dateDiffInDays = (startDate: string, endDate?: string): number => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  // Convert to UTC to avoid timezone issues
  const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  
  // Calculate difference in milliseconds and convert to days
  const diffInMs = utcEnd - utcStart;
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
};

/**
 * Check if a date is in the past
 * @param dateString - Date string to check
 * @returns Boolean indicating if date is in the past
 */
export const isDatePast = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  
  // Set time to beginning of day for both dates for accurate comparison
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  
  return date < today;
}; 