import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth.middleware'
import * as notesService from '../services/notes.service'

export async function getNotes(req: AuthRequest, res: Response): Promise<void> {
  try {
    const notes = await notesService.getNotes(req.userId!, req.params.userBookId as string)
    res.json(notes)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export async function createNote(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { userBookId, title, content, type } = req.body
    if (!userBookId || !title || content === undefined) {
      res.status(400).json({ message: 'userBookId, title e content são obrigatórios' })
      return
    }
    const note = await notesService.createNote(req.userId!, userBookId, title, content, type || 'NOTE')
    res.status(201).json(note)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export async function updateNote(req: AuthRequest, res: Response): Promise<void> {
  try {
    const note = await notesService.updateNote(req.userId!, req.params.id as string, req.body)
    res.json(note)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export async function deleteNote(req: AuthRequest, res: Response): Promise<void> {
  try {
    await notesService.deleteNote(req.userId!, req.params.id as string)
    res.status(204).end()
  } catch (err: any) {
    res.status(404).json({ message: err.message })
  }
}
