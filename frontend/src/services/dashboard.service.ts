import { api } from './api'
import { DashboardData } from '@/types'

export const dashboardService = {
  getDashboard: () => api.get<DashboardData>('/dashboard'),
}
