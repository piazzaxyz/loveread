import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth.middleware'
import * as dashboardService from '../services/dashboard.service'

export async function getDashboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = await dashboardService.getDashboardStats()
    res.json(data)
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}
