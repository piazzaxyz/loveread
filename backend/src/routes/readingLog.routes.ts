import { Router } from 'express'
import * as readingLogController from '../controllers/readingLog.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()
router.use(authMiddleware)

router.post('/', readingLogController.logReading)
router.get('/calendar', readingLogController.getCalendarDates)
router.get('/streak', readingLogController.getStreak)
router.get('/:year/:month', readingLogController.getMonthLogs)

export default router
