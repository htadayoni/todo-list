import moment from 'moment-jalaali';

/**
 * Date utility functions for handling Persian (Shamsi) calendar dates
 */

/**
 * Format a date to Persian calendar format
 * @param date - Date object or string
 * @param format - Moment.js format string (default: 'jYYYY/jMM/jDD')
 * @returns Formatted date string in Persian calendar
 */
export const formatPersianDate = (date: Date | string, format: string = 'jYYYY/jMM/jDD'): string => {
    return moment(date).format(format);
};

/**
 * Format a date to Persian calendar with time
 * @param date - Date object or string
 * @param format - Moment.js format string (default: 'jYYYY/jMM/jDD HH:mm')
 * @returns Formatted date and time string in Persian calendar
 */
export const formatPersianDateTime = (date: Date | string, format: string = 'jYYYY/jMM/jDD HH:mm'): string => {
    return moment(date).format(format);
};

/**
 * Get relative time in Persian (e.g., "2 روز پیش")
 * @param date - Date object or string
 * @returns Relative time string in Persian
 */
export const getPersianRelativeTime = (date: Date | string): string => {
    return moment(date).fromNow();
};

/**
 * Check if a date is today
 * @param date - Date object or string
 * @returns boolean indicating if the date is today
 */
export const isToday = (date: Date | string): boolean => {
    return moment(date).isSame(moment(), 'day');
};

/**
 * Check if a date is in the past
 * @param date - Date object or string
 * @returns boolean indicating if the date is in the past
 */
export const isPastDate = (date: Date | string): boolean => {
    return moment(date).isBefore(moment(), 'day');
};

/**
 * Check if a date is in the future
 * @param date - Date object or string
 * @returns boolean indicating if the date is in the future
 */
export const isFutureDate = (date: Date | string): boolean => {
    return moment(date).isAfter(moment(), 'day');
};

/**
 * Get the difference in days between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days difference
 */
export const getDaysDifference = (date1: Date | string, date2: Date | string): number => {
    return moment(date1).diff(moment(date2), 'days');
};

/**
 * Add days to a date
 * @param date - Date object or string
 * @param days - Number of days to add
 * @returns New Date object
 */
export const addDays = (date: Date | string, days: number): Date => {
    return moment(date).add(days, 'days').toDate();
};

/**
 * Get current date in Persian calendar format
 * @param format - Moment.js format string (default: 'jYYYY/jMM/jDD')
 * @returns Current date formatted in Persian calendar
 */
export const getCurrentPersianDate = (format: string = 'jYYYY/jMM/jDD'): string => {
    return moment().format(format);
};

/**
 * Convert Persian date string to Date object
 * @param persianDate - Persian date string (e.g., '1402/07/08')
 * @returns Date object
 */
export const persianDateToDate = (persianDate: string): Date => {
    return moment(persianDate, 'jYYYY/jMM/jDD').toDate();
};

/**
 * Get Persian month names
 */
export const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

/**
 * Get Persian day names
 */
export const persianDays = [
    'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'
];

/**
 * Format date with Persian month and day names
 * @param date - Date object or string
 * @returns Formatted date with Persian names
 */
export const formatPersianDateWithNames = (date: Date | string): string => {
    const momentDate = moment(date);
    const dayName = persianDays[momentDate.day()];
    const monthName = persianMonths[momentDate.jMonth()];
    const year = momentDate.jYear();
    const day = momentDate.jDate();

    return `${dayName}، ${day} ${monthName} ${year}`;
};
