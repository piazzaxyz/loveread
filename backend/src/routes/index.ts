import { Router } from 'express'
import authRoutes from './auth.routes'
import booksRoutes from './books.routes'
import readingLogRoutes from './readingLog.routes'
import notesRoutes from './notes.routes'
import filesRoutes from './files.routes'
import dashboardRoutes from './dashboard.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/books', booksRoutes)
router.use('/reading-logs', readingLogRoutes)
router.use('/notes', notesRoutes)
router.use('/files', filesRoutes)
router.use('/dashboard', dashboardRoutes)

export default router
