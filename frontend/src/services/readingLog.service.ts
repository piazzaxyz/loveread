import { api } from './api'
import { ReadingLog } from '@/types'

export const readingLogService = {
  log: (userBookId: string, date: string, pagesRead: number, minutesRead: number) =>
    api.post<ReadingLog>('/reading-logs', { userBookId, date, pagesRead, minutesRead }),

  getMonthLogs: (year: number, month: number) =>
    api.get<ReadingLog[]>(`/reading-logs/${year}/${month}`),

  getStreak: () => api.get<{ streak: number }>('/reading-logs/streak'),

  getCalendarDates: () =>
    api.get<Array<{ date: string; pagesRead: number; minutesRead: number }>>('/reading-logs/calendar'),
}
