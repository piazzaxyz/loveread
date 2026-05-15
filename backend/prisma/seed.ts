import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Usuário principal: teamo / 1105
  const passwordHashPrincipal = await bcrypt.hash('1105', 10)
  const passwordHashAna = await bcrypt.hash('teamo', 10)

  const edu = await prisma.user.upsert({
    where: { email: 'teamo@cantinho.app' },
    update: {},
    create: { name: 'Eduardo', email: 'teamo@cantinho.app', passwordHash: passwordHashPrincipal },
  })

  const ana = await prisma.user.upsert({
    where: { email: 'ana@cantinho.app' },
    update: {},
    create: { name: 'Ana', email: 'ana@cantinho.app', passwordHash: passwordHashAna },
  })

  const books = await Promise.all([
    prisma.book.upsert({
      where: { isbn: '9788535914849' },
      update: {},
      create: {
        title: 'O Senhor dos Anéis',
        author: 'J.R.R. Tolkien',
        totalPages: 1200,
        genre: 'Fantasia',
        isbn: '9788535914849',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788535914849-L.jpg',
        publishedYear: 1954,
      },
    }),
    prisma.book.upsert({
      where: { isbn: '9788532530783' },
      update: {},
      create: {
        title: 'Harry Potter e a Pedra Filosofal',
        author: 'J.K. Rowling',
        totalPages: 264,
        genre: 'Fantasia',
        isbn: '9788532530783',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788532530783-L.jpg',
        publishedYear: 1997,
      },
    }),
    prisma.book.upsert({
      where: { isbn: '9788535902778' },
      update: {},
      create: {
        title: 'Dom Casmurro',
        author: 'Machado de Assis',
        totalPages: 256,
        genre: 'Romance',
        isbn: '9788535902778',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788535902778-L.jpg',
        publishedYear: 1899,
      },
    }),
    prisma.book.upsert({
      where: { isbn: '9786555520101' },
      update: {},
      create: {
        title: 'Atomic Habits',
        author: 'James Clear',
        totalPages: 320,
        genre: 'Autoajuda',
        isbn: '9786555520101',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
        publishedYear: 2018,
      },
    }),
  ])

  await prisma.userBook.upsert({
    where: { userId_bookId: { userId: edu.id, bookId: books[0].id } },
    update: {},
    create: { userId: edu.id, bookId: books[0].id, status: 'READING', currentPage: 340, startedAt: new Date() },
  })

  await prisma.userBook.upsert({
    where: { userId_bookId: { userId: edu.id, bookId: books[2].id } },
    update: {},
    create: { userId: edu.id, bookId: books[2].id, status: 'READ', currentPage: 256, rating: 5, startedAt: new Date(Date.now() - 30 * 86400000), finishedAt: new Date() },
  })

  await prisma.userBook.upsert({
    where: { userId_bookId: { userId: edu.id, bookId: books[3].id } },
    update: {},
    create: { userId: edu.id, bookId: books[3].id, status: 'WANT_TO_READ' },
  })

  await prisma.userBook.upsert({
    where: { userId_bookId: { userId: ana.id, bookId: books[1].id } },
    update: {},
    create: { userId: ana.id, bookId: books[1].id, status: 'READING', currentPage: 120, startedAt: new Date() },
  })

  await prisma.userBook.upsert({
    where: { userId_bookId: { userId: ana.id, bookId: books[3].id } },
    update: {},
    create: { userId: ana.id, bookId: books[3].id, status: 'READ', currentPage: 320, rating: 4, startedAt: new Date(Date.now() - 15 * 86400000), finishedAt: new Date() },
  })

  // Seed reading logs for streak demonstration
  const eduBook = await prisma.userBook.findFirst({ where: { userId: edu.id, bookId: books[0].id } })
  if (eduBook) {
    const today = new Date()
    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      await prisma.readingLog.upsert({
        where: { userId_userBookId_date: { userId: edu.id, userBookId: eduBook.id, date: dateStr } },
        update: {},
        create: { userId: edu.id, userBookId: eduBook.id, date: dateStr, pagesRead: 20 + i * 5, minutesRead: 30 + i * 5 },
      })
    }
  }

  console.log('✅ Seed concluído!')
  console.log('👤 Login principal: teamo@cantinho.app / senha: 1105')
  console.log('👤 Login Ana: ana@cantinho.app / senha: teamo')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
