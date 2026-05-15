import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth.middleware'

type ReadingStatus = 'READING' | 'READ' | 'WANT_TO_READ' | 'WANT_TO_BUY' | 'ABANDONED'
import * as booksService from '../services/books.service'

export async function searchBooks(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { q } = req.query
    const books = await booksService.searchBooks(String(q || ''))
    res.json(books)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export async function createBook(req: AuthRequest, res: Response): Promise<void> {
  try {
    const book = await booksService.createBook(req.body)
    res.status(201).json(book)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export async function getUserLibrary(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { status } = req.query
    const library = await booksService.getUserLibrary(
      req.userId!,
      status as ReadingStatus | undefined
    )
    res.json(library)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export async function getUserBook(req: AuthRequest, res: Response): Promise<void> {
  try {
    const ub = await booksService.getUserBook(req.userId!, req.params.id as string)
    res.json(ub)
  } catch (err: any) {
    res.status(404).json({ message: err.message })
  }
}

export async function addBookToLibrary(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { bookId, status } = req.body
    if (!bookId || !status) {
      res.status(400).json({ message: 'bookId e status são obrigatórios' })
      return
    }
    const ub = await booksService.addBookToLibrary(req.userId!, bookId, status)
    res.status(201).json(ub)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export async function addBookAndToLibrary(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { status, ...bookData } = req.body
    if (!bookData.title || !bookData.author || !status) {
      res.status(400).json({ message: 'Título, autor e status são obrigatórios' })
      return
    }
    const ub = await booksService.addBookAndToLibrary(req.userId!, bookData, status)
    res.status(201).json(ub)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export async function updateUserBook(req: AuthRequest, res: Response): Promise<void> {
  try {
    const ub = await booksService.updateUserBook(req.userId!, req.params.id as string, req.body)
    res.json(ub)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export async function removeBookFromLibrary(req: AuthRequest, res: Response): Promise<void> {
  try {
    await booksService.removeBookFromLibrary(req.userId!, req.params.id as string)
    res.status(204).end()
  } catch (err: any) {
    res.status(404).json({ message: err.message })
  }
}

export async function getAllUsers(req: AuthRequest, res: Response): Promise<void> {
  try {
    const users = await booksService.getAllUsers()
    res.json(users)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export async function getPartnerLibrary(req: AuthRequest, res: Response): Promise<void> {
  try {
    const library = await booksService.getPublicLibrary(req.params.userId as string)
    res.json(library)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}
