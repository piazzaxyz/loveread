export type ReadingStatus = 'READING' | 'READ' | 'WANT_TO_READ' | 'WANT_TO_BUY' | 'ABANDONED'
export type NoteType = 'NOTE' | 'SUMMARY'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  createdAt: string
}

export interface Book {
  id: string
  title: string
  author: string
  coverUrl?: string
  totalPages?: number
  genre?: string
  isbn?: string
  description?: string
  publishedYear?: number
  createdAt: string
}

export interface UserBook {
  id: string
  userId: string
  bookId: string
  status: ReadingStatus
  currentPage: number
  rating?: number
  startedAt?: string
  finishedAt?: string
  createdAt: string
  updatedAt: string
  book: Book
  _count?: {
    readingLogs: number
    notes: number
    files: number
  }
}

export interface ReadingLog {
  id: string
  userId: string
  userBookId: string
  date: string
  pagesRead: number
  minutesRead: number
  createdAt: string
  userBook?: UserBook
}

export interface BookNote {
  id: string
  userId: string
  userBookId: string
  title: string
  content: string
  type: NoteType
  createdAt: string
  updatedAt: string
}

export interface BookFile {
  id: string
  userId: string
  userBookId: string
  filename: string
  fileUrl: string
  fileSizeKb?: number
  createdAt: string
}

export interface UserStats {
  userId: string
  name: string
  avatarUrl?: string
  totalBooks: number
  booksRead: number
  booksReading: number
  totalPages: number
  totalMinutes: number
  favoriteGenre?: string
  streak: number
  genres: Record<string, number>
}

export interface DashboardData {
  stats: UserStats[]
  leaderboard: UserStats[]
  allGenres: Record<string, number>
  recentActivity: Array<{
    id: string
    date: string
    pagesRead: number
    minutesRead: number
    user: { id: string; name: string; avatarUrl?: string }
    userBook: UserBook
  }>
}

export const STATUS_LABELS: Record<ReadingStatus, string> = {
  READING: 'Lendo',
  READ: 'Lido',
  WANT_TO_READ: 'Quero Ler',
  WANT_TO_BUY: 'Quero Comprar',
  ABANDONED: 'Abandonado',
}

export const STATUS_COLORS: Record<ReadingStatus, string> = {
  READING: 'var(--color-blue)',
  READ: 'var(--color-green)',
  WANT_TO_READ: 'var(--color-mauve)',
  WANT_TO_BUY: 'var(--color-yellow)',
  ABANDONED: 'var(--color-red)',
}
