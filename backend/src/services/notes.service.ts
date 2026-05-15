import { prisma } from '../lib/prisma'

type NoteType = 'NOTE' | 'SUMMARY'

export async function getNotes(userId: string, userBookId: string) {
  return prisma.bookNote.findMany({
    where: { userId, userBookId },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function createNote(
  userId: string,
  userBookId: string,
  title: string,
  content: string,
  type: NoteType
) {
  const ub = await prisma.userBook.findFirst({ where: { id: userBookId, userId } })
  if (!ub) throw new Error('Livro não encontrado')
  return prisma.bookNote.create({ data: { userId, userBookId, title, content, type } })
}

export async function updateNote(
  userId: string,
  noteId: string,
  data: { title?: string; content?: string; type?: NoteType }
) {
  const note = await prisma.bookNote.findFirst({ where: { id: noteId, userId } })
  if (!note) throw new Error('Nota não encontrada')
  return prisma.bookNote.update({ where: { id: noteId }, data })
}

export async function deleteNote(userId: string, noteId: string) {
  const note = await prisma.bookNote.findFirst({ where: { id: noteId, userId } })
  if (!note) throw new Error('Nota não encontrada')
  await prisma.bookNote.delete({ where: { id: noteId } })
}
