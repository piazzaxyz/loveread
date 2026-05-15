import { prisma } from '../lib/prisma'

type ReadingStatus = 'READING' | 'READ' | 'WANT_TO_READ' | 'WANT_TO_BUY' | 'ABANDONED'

export async function searchBooks(query: string) {
  return prisma.book.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { author: { contains: query } },
        { isbn: { contains: query } },
      ],
    },
    take: 20,
  })
}

export async function createBook(data: {
  title: string
  author: string
  coverUrl?: string
  totalPages?: number
  genre?: string
  isbn?: string
  description?: string
  publishedYear?: number
}) {
  return prisma.book.create({ data })
}

export async function getUserLibrary(userId: string, status?: ReadingStatus) {
  return prisma.userBook.findMany({
    where: { userId, ...(status ? { status } : {}) },
    include: {
      book: true,
      _count: { select: { readingLogs: true, notes: true, files: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function getUserBook(userId: string, userBookId: string) {
  const ub = await prisma.userBook.findFirst({
    where: { id: userBookId, userId },
    include: { book: true },
  })
  if (!ub) throw new Error('Livro não encontrado')
  return ub
}

export async function addBookToLibrary(userId: string, bookId: string, status: ReadingStatus) {
  const book = await prisma.book.findUnique({ where: { id: bookId } })
  if (!book) throw new Error('Livro não encontrado no catálogo')

  return prisma.userBook.upsert({
    where: { userId_bookId: { userId, bookId } },
    update: { status },
    create: {
      userId,
      bookId,
      status,
      startedAt: status === 'READING' ? new Date() : undefined,
    },
    include: { book: true },
  })
}

export async function addBookAndToLibrary(
  userId: string,
  bookData: {
    title: string
    author: string
    coverUrl?: string
    totalPages?: number
    genre?: string
    isbn?: string
    description?: string
    publishedYear?: number
  },
  status: ReadingStatus
) {
  const book = await prisma.book.create({ data: bookData })
  return prisma.userBook.create({
    data: {
      userId,
      bookId: book.id,
      status,
      startedAt: status === 'READING' ? new Date() : undefined,
    },
    include: { book: true },
  })
}

export async function updateUserBook(
  userId: string,
  userBookId: string,
  data: {
    status?: ReadingStatus
    currentPage?: number
    rating?: number
    startedAt?: Date
    finishedAt?: Date
  }
) {
  const ub = await prisma.userBook.findFirst({ where: { id: userBookId, userId } })
  if (!ub) throw new Error('Livro não encontrado')

  const updateData: any = { ...data }
  if (data.status === 'READ' && !ub.finishedAt) updateData.finishedAt = new Date()
  if (data.status === 'READING' && !ub.startedAt) updateData.startedAt = new Date()

  return prisma.userBook.update({
    where: { id: userBookId },
    data: updateData,
    include: { book: true },
  })
}

export async function removeBookFromLibrary(userId: string, userBookId: string) {
  const ub = await prisma.userBook.findFirst({ where: { id: userBookId, userId } })
  if (!ub) throw new Error('Livro não encontrado')
  await prisma.userBook.delete({ where: { id: userBookId } })
}

export async function getAllUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, avatarUrl: true },
  })
}

export async function getPublicLibrary(userId: string) {
  return prisma.userBook.findMany({
    where: { userId },
    include: { book: true },
    orderBy: { updatedAt: 'desc' },
  })
}
