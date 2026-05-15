import { Response } from 'express'
import path from 'path'
import { AuthRequest } from '../middlewares/auth.middleware'
import * as filesService from '../services/files.service'

export async function uploadFile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const file = req.file
    if (!file) {
      res.status(400).json({ message: 'Arquivo não enviado' })
      return
    }
    const { userBookId } = req.body
    if (!userBookId) {
      res.status(400).json({ message: 'userBookId é obrigatório' })
      return
    }

    const fileUrl = `/uploads/${file.filename}`
    const fileSizeKb = Math.round(file.size / 1024)

    const bookFile = await filesService.uploadFile(
      req.userId!,
      userBookId,
      file.originalname,
      fileUrl,
      fileSizeKb
    )
    res.status(201).json(bookFile)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export async function getFiles(req: AuthRequest, res: Response): Promise<void> {
  try {
    const files = await filesService.getFiles(req.userId!, req.params.userBookId as string)
    res.json(files)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export async function deleteFile(req: AuthRequest, res: Response): Promise<void> {
  try {
    await filesService.deleteFile(req.userId!, req.params.id as string)
    res.status(204).end()
  } catch (err: any) {
    res.status(404).json({ message: err.message })
  }
}
