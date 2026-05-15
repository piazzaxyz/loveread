import { Router } from 'express'
import * as filesController from '../controllers/files.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { upload } from '../middlewares/upload.middleware'

const router = Router()
router.use(authMiddleware)

router.get('/:userBookId', filesController.getFiles)
router.post('/', upload.single('file'), filesController.uploadFile)
router.delete('/:id', filesController.deleteFile)

export default router
