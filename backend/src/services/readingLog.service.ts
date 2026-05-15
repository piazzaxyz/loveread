import { prisma } from '../lib/prisma'

export async function logReading(
  userId: string,
  userBookId: string,
  date: string,
  pagesRead: number,
  minutesRead: number
) {
  const ub = await prisma.userBook.findFirst({ where: { id: userBookId, userId }, include: { book: true } })
  if (!ub) throw new Error('Livro não encontrado')

  const log = await prisma.readingLog.upsert({
    where: { userId_userBookId_date: { userId, userBookId, date } },
    update: { pagesRead, minutesRead },
    create: { userId, userBookId, date, pagesRead, minutesRead },
  })

  if (pagesRead > 0 && ub.book) {
    const newPage = Math.min(ub.currentPage + pagesRead, ub.book.totalPages || 9999)
    await prisma.userBook.update({ where: { id: userBookId }, data: { currentPage: newPage } })
  }

  return log
}

export async function getMonthLogs(userId: string, year: number, month: number) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`
  return prisma.readingLog.findMany({
    where: { userId, date: { startsWith: prefix } },
    include: { userBook: { include: { book: true } } },
    orderBy: { date: 'asc' },
  })
}

export async function getStreak(userId: string): Promise<number> {
  const logs = await prisma.readingLog.findMany({
    where: { userId },
    select: { date: true },
    distinct: ['date'],
    orderBy: { date: 'desc' },
  })

  if (logs.length === 0) return 0

  const dates = logs.map((l) => l.date)
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  if (dates[0] !== today && dates[0] !== yesterday) return 0

  let streak = 0
  let current = dates[0] === today ? today : yesterday

  for (const date of dates) {
    if (date === current) {
      streak++
      const prev = new Date(new Date(current).getTime() - 86400000)
      current = prev.toISOString().split('T')[0]
    } else {
      break
    }
  }

  return streak
}

export async function getUserCalendarDates(userId: string) {
  const logs = await prisma.readingLog.findMany({
    where: { userId },
    select: { date: true, pagesRead: true, minutesRead: true },
    distinct: ['date'],
    orderBy: { date: 'asc' },
  })
  return logs
}
