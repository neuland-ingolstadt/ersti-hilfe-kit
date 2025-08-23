import { format, isSameDay, isToday, isTomorrow, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'

const WORD_TODAY = 'Heute'
const WORD_TOMORROW = 'Morgen'

const toDate = (date: Date | string | number): Date =>
  typeof date === 'string'
    ? parseISO(date)
    : new Date(date)

function formatFriendlyDate(date: Date | string): string {
  const dt = toDate(date)
  if (isToday(dt)) return WORD_TODAY
  if (isTomorrow(dt)) return WORD_TOMORROW
  return format(dt, 'EEE, d.MM.yyyy', { locale: de })
}

function formatFriendlyTime(date: Date | string): string {
  return format(toDate(date), 'HH:mm', { locale: de })
}

export function formatFriendlyDateTimeRange(
  beginDate: Date | string,
  endDate: Date | string
): string {
  const begin = toDate(beginDate)
  const end = toDate(endDate)
  if (isSameDay(begin, end)) {
    return `${formatFriendlyDate(begin)}, ${formatFriendlyTime(begin)} - ${formatFriendlyTime(end)}`
  }
  return `${formatFriendlyDate(begin)}, ${formatFriendlyTime(begin)} - ${formatFriendlyDate(end)}, ${formatFriendlyTime(end)}`
}

export function formatFriendlyDateTime(datetime: Date | string): string {
  const dt = toDate(datetime)
  return `${formatFriendlyDate(dt)}, ${formatFriendlyTime(dt)}`
}
