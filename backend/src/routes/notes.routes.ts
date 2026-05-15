import { Router } from 'express'
import * as notesController from '../controllers/notes.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()
router.use(authMiddleware)

router.get('/:userBookId', notesController.getNotes)
router.post('/', notesController.createNote)
router.put('/:id', notesController.updateNote)
router.delete('/:id', notesController.deleteNote)

export default router
