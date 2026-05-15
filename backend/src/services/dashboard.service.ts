import { prisma } from '../lib/prisma'

export async function getDashboardStats() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      userBooks: {
        include: { book: true, readingLogs: true },
      },
    },
  })

  const stats = await Promise.all(
    users.map(async (user) => {
      const totalBooks = user.userBooks.length
      const booksRead = user.userBooks.filter((ub) => ub.status === 'READ').length
      const booksReading = user.userBooks.filter((ub) => ub.status === 'READING').length
      const totalPages = user.userBooks.reduce((sum, ub) => sum + (ub.currentPage || 0), 0)
      const totalMinutes = user.userBooks
        .flatMap((ub) => ub.readingLogs)
        .reduce((sum, log) => sum + log.minutesRead, 0)

      const genreCounts: Record<string, number> = {}
      for (const ub of user.userBooks) {
        const genre = ub.book.genre || 'Sem gênero'
        genreCounts[genre] = (genreCounts[genre] || 0) + 1
      }
      const favoriteGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null

      const streak = await getStreakForUser(user.id)

      return {
        userId: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        totalBooks,
        booksRead,
        booksReading,
        totalPages,
        totalMinutes,
        favoriteGenre,
        streak,
        genres: genreCounts,
      }
    })
  )

  const leaderboard = [...stats].sort((a, b) => b.booksRead - a.booksRead || b.totalPages - a.totalPages)

  const allGenres: Record<string, number> = {}
  for (const s of stats) {
    for (const [genre, count] of Object.entries(s.genres)) {
      allGenres[genre] = (allGenres[genre] || 0) + count
    }
  }

  const recentActivity = await prisma.readingLog.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
      userBook: { include: { book: true } },
    },
  })

  return { stats, leaderboard, allGenres, recentActivity }
}

async function getStreakForUser(userId: string): Promise<number> {
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
