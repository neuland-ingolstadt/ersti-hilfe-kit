import {
  addWeeks,
  differenceInMilliseconds,
  endOfWeek,
  format,
  formatDistance,
  formatDistanceToNow,
  isSameDay,
  isSameWeek,
  isToday,
  isTomorrow,
  startOfDay,
  startOfWeek,
} from 'date-fns'
import { de } from 'date-fns/locale'

// --- Constants ---
const WORD_TODAY = 'Heute'
const WORD_TOMORROW = 'Morgen'
const WORD_THIS_WEEK = 'Diese Woche'
const WORD_NEXT_WEEK = 'Nächste Woche'

// --- Helpers ---

/**
 * Ensures the input is a Date object.
 * For strings, it uses `new Date()` to mimic original flexibility.
 * For production, consider `parseISO` if strings are ISO 8601, or a more specific parser.
 */
const ensureDate = (date: Date | string | number): Date => {
  if (date instanceof Date) {
    return date
  }
  if (typeof date === 'number') {
    // Assuming number is a timestamp
    return new Date(date)
  }
  return new Date(date) // Matches original string parsing behavior
}

// --- Formatting Functions ---

/**
 * Formats a date like "Mo., 1.10.2020", or "Heute", "Morgen".
 */
export function formatFriendlyDate(date: Date | string): string {
  const dt = ensureDate(date)

  if (isToday(dt)) return WORD_TODAY
  if (isTomorrow(dt)) return WORD_TOMORROW

  // Original: weekday: 'short', day: 'numeric', month: '2-digit', year: 'numeric'
  // 'EEE, d.MM.yyyy' -> "Mo., 1.10.2020" with German locale
  return format(dt, 'EEE, d.MM.yyyy', { locale: de })
}

/**
 * Formats a date range like "Mo., 1.10.2021 - Di., 2.10.2021".
 * If begin and end are the same day, only the begin date is shown.
 */
export function formatFriendlyDateRange(
  begin: Date | string,
  end: Date | string
): string {
  const beginDate = ensureDate(begin)
  const endDate = ensureDate(end)

  const formattedBegin = formatFriendlyDate(beginDate)
  if (isSameDay(beginDate, endDate)) {
    return formattedBegin
  }
  return `${formattedBegin} - ${formatFriendlyDate(endDate)}`
}

/**
 * Formats a time like "8:15".
 */
export function formatFriendlyTime(date: Date | string): string {
  const datetime = ensureDate(date)
  // 'HH:mm' -> "08:15" (24-hour format)
  return format(datetime, 'HH:mm', { locale: de })
}

/**
 * Formats a date range like "Mo., 1.10.2021 08:00 – 12:00" or "Mo., 1.10.2021 08:00 – Do., 2.10.2021 08:00".
 * Note: Assumes endDate is always provided. If optional, adjust signature and logic.
 */
export function formatFriendlyDateTimeRange(
  beginDate: Date | string,
  endDate: Date | string
): string {
  const begin = ensureDate(beginDate)
  const end = ensureDate(endDate)

  const formattedBeginDate = formatFriendlyDate(begin)
  const formattedBeginTime = formatFriendlyTime(begin)

  if (isSameDay(begin, end)) {
    return `${formattedBeginDate}, ${formattedBeginTime} - ${formatFriendlyTime(end)}`
  }
  return `${formattedBeginDate}, ${formattedBeginTime} - ${formatFriendlyDate(end)}, ${formatFriendlyTime(end)}`
}

/**
 * Formats a date and time like "Mo., 1.10.2020, 08:15".
 */
export function formatFriendlyDateTime(datetime: Date | string): string {
  const dt = ensureDate(datetime)
  // formatFriendlyDate handles "Heute", "Morgen" correctly
  return `${formatFriendlyDate(dt)}, ${formatFriendlyTime(dt)}`
}

/**
 * Formats a day like "Morgen" or "Montag, 1.10.".
 */
export function formatNearDate(datetime: Date | string): string {
  const dt = ensureDate(datetime)

  if (isToday(dt)) return WORD_TODAY
  if (isTomorrow(dt)) return WORD_TOMORROW

  // Original: weekday: 'long', day: 'numeric', month: 'numeric'
  // 'EEEE, d.M.' -> "Montag, 1.10" with German locale
  return format(dt, 'EEEE, d.M.', { locale: de })
}

/**
 * Formats a time delta using Intl.RelativeTimeFormat.
 * e.g., "in 1 Woche", "vor 2 Tagen".
 * The original implementation using Intl.RelativeTimeFormat is robust and standard.
 */
export function formatFriendlyTimeDelta(deltaMs: number): string {
  const rtl = new Intl.RelativeTimeFormat('de-DE', {
    // Using 'de-DE' for consistency
    numeric: 'auto',
    style: 'long',
  })

  const absDeltaMs = Math.abs(deltaMs)
  const sign = Math.sign(deltaMs)

  // Calculate units based on absolute value
  const minutes = Math.floor(absDeltaMs / (60 * 1000))
  const hours = Math.floor(absDeltaMs / (60 * 60 * 1000))
  const days = Math.floor(absDeltaMs / (24 * 60 * 60 * 1000))
  const weeks = Math.floor(absDeltaMs / (7 * 24 * 60 * 60 * 1000))

  if (weeks > 0) {
    return rtl.format(sign * weeks, 'week')
  }
  if (days > 0) {
    return rtl.format(sign * days, 'day')
  }
  if (hours > 0) {
    return rtl.format(sign * hours, 'hour')
  }
  return rtl.format(sign * minutes, 'minute')
}

/**
 * Formats a relative date and time like "in 5 Minuten" or "vor 10 Minuten".
 * For durations beyond 24 hours, it refers to day differences like "in 2 Tagen".
 */
export function formatFriendlyRelativeTime(dateInput: Date | string): string {
  const date = ensureDate(dateInput)
  const now = new Date()

  const diffMs = differenceInMilliseconds(date, now)

  if (Math.abs(diffMs) < 24 * 60 * 60 * 1000) {
    // Less than 24 hours
    return formatDistanceToNow(date, { locale: de, addSuffix: true })
  }
  // 24 hours or more
  // Compare start of days for "in X Tagen" / "vor X Tagen"
  return formatDistance(startOfDay(date), startOfDay(now), {
    locale: de,
    addSuffix: true,
  })
}

/**
 * Formats a relative duration in minutes like "5 min".
 * Shows 0 min if the datetime is in the past or less than a minute in the future.
 */
export function formatRelativeMinutes(datetime: Date | string): string {
  const dt = ensureDate(datetime)
  const now = new Date()

  const diffMs = differenceInMilliseconds(dt, now)
  // Calculate minutes; Math.max ensures it's not negative (past dates show 0)
  const minutes = Math.max(0, Math.floor(diffMs / 60000))

  return `${minutes} min`
}

// --- ISO Formatting ---

/**
 * Formats a date as ISO date string: "2020-10-01".
 */
export function formatISODate(date: Date | string): string {
  return format(ensureDate(date), 'yyyy-MM-dd')
}

/**
 * Formats a time as ISO time string: "08:15".
 */
export function formatISOTime(date: Date | string): string {
  return format(ensureDate(date), 'HH:mm')
}

// --- Week Utilities ---

/**
 * Returns the start of the week (Monday, 00:00:00) for the given date.
 * The `de` locale ensures Monday is the start of the week.
 */
export function getMonday(dateInput: Date | string): Date {
  const date = ensureDate(dateInput)
  return startOfWeek(date, { locale: de })
}

/**
 * Returns an interval representing the week: [Monday 00:00:00 This Week, Monday 00:00:00 Next Week).
 * The end date is exclusive.
 */
export function getWeek(dateInput: Date | string): [Date, Date] {
  const date = ensureDate(dateInput)
  const start = startOfWeek(date, { locale: de }) // Monday 00:00:00
  const end = addWeeks(start, 1) // Next Monday 00:00:00
  return [start, end]
}

/**
 * Adds (or subtracts) a number of weeks to a date. Returns a new Date instance.
 */
export function addWeek(dateInput: Date | string, amount: number): Date {
  return addWeeks(ensureDate(dateInput), amount)
}

/**
 * Formats a week relative to the current date like 'Diese Woche', 'Nächste Woche',
 * or as a date range like '17.5. – 23.5.'.
 */
export function getFriendlyWeek(dateInput: Date | string): string {
  const date = ensureDate(dateInput)
  const now = new Date()

  if (isSameWeek(date, now, { locale: de })) {
    return WORD_THIS_WEEK
  }
  if (isSameWeek(date, addWeeks(now, 1), { locale: de })) {
    return WORD_NEXT_WEEK
  }

  // Default format: "17.5. – 23.5." (Start of week to End of week)
  const mondayOfWeek = startOfWeek(date, { locale: de })
  const sundayOfWeek = endOfWeek(date, { locale: de }) // Inclusive Sunday

  // 'd.M.' format -> "17.5"
  const formatPattern = 'd.M.'
  return `${format(mondayOfWeek, formatPattern, { locale: de })} – ${format(sundayOfWeek, formatPattern, { locale: de })}`
}
