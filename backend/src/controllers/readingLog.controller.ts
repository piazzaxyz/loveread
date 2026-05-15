import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth.middleware'
import * as readingLogService from '../services/readingLog.service'

export async function logReading(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { userBookId, date, pagesRead, minutesRead } = req.body
    if (!userBookId || !date) {
      res.status(400).json({ message: 'userBookId e date são obrigatórios' })
      return
    }
    const log = await readingLogService.logReading(
      req.userId!,
      userBookId,
      date,
      pagesRead || 0,
      minutesRead || 0
    )
    res.status(201).json(log)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export async function getMonthLogs(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { year, month } = req.params
    const logs = await readingLogService.getMonthLogs(req.userId!, Number(year), Number(month))
    res.json(logs)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export async function getStreak(req: AuthRequest, res: Response): Promise<void> {
  try {
    const streak = await readingLogService.getStreak(req.userId!)
    res.json({ streak })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export async function getCalendarDates(req: AuthRequest, res: Response): Promise<void> {
  try {
    const dates = await readingLogService.getUserCalendarDates(req.userId!)
    res.json(dates)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}
