import { Router } from 'express'
import * as booksController from '../controllers/books.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()
router.use(authMiddleware)

router.get('/search', booksController.searchBooks)
router.post('/', booksController.createBook)

router.get('/library', booksController.getUserLibrary)
router.post('/library', booksController.addBookToLibrary)
router.post('/library/new', booksController.addBookAndToLibrary)
router.get('/library/:id', booksController.getUserBook)
router.put('/library/:id', booksController.updateUserBook)
router.delete('/library/:id', booksController.removeBookFromLibrary)

router.get('/users', booksController.getAllUsers)

export default router
