import { Request, Response } from 'express'
import * as authService from '../services/auth.service'
import { AuthRequest } from '../middlewares/auth.middleware'

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Nome, email e senha são obrigatórios' })
      return
    }
    const result = await authService.register(name, email, password)
    res.status(201).json(result)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ message: 'Email e senha são obrigatórios' })
      return
    }
    const result = await authService.login(email, password)
    res.json(result)
  } catch (err: any) {
    res.status(401).json({ message: err.message })
  }
}

export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = await authService.getProfile(req.userId!)
    res.json(user)
  } catch (err: any) {
    res.status(404).json({ message: err.message })
  }
}

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { name, avatarUrl } = req.body
    const user = await authService.updateProfile(req.userId!, { name, avatarUrl })
    res.json(user)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}
