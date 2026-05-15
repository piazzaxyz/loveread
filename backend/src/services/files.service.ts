import { prisma } from '../lib/prisma'
import fs from 'fs'
import path from 'path'

export async function uploadFile(
  userId: string,
  userBookId: string,
  filename: string,
  fileUrl: string,
  fileSizeKb?: number
) {
  const ub = await prisma.userBook.findFirst({ where: { id: userBookId, userId } })
  if (!ub) throw new Error('Livro não encontrado')
  return prisma.bookFile.create({ data: { userId, userBookId, filename, fileUrl, fileSizeKb } })
}

export async function getFiles(userId: string, userBookId: string) {
  return prisma.bookFile.findMany({
    where: { userId, userBookId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function deleteFile(userId: string, fileId: string) {
  const file = await prisma.bookFile.findFirst({ where: { id: fileId, userId } })
  if (!file) throw new Error('Arquivo não encontrado')

  const diskPath = path.join(process.env.UPLOAD_DIR || 'uploads', path.basename(file.fileUrl))
  if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath)

  await prisma.bookFile.delete({ where: { id: fileId } })
}
