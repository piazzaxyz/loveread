import { api } from './api'
import { ReadingStatus, UserBook, Book } from '@/types'

export const booksService = {
  search: (q: string) => api.get<Book[]>('/books/search', { params: { q } }),

  getLibrary: (status?: ReadingStatus) =>
    api.get<UserBook[]>('/books/library', { params: status ? { status } : {} }),

  getUserBook: (id: string) => api.get<UserBook>(`/books/library/${id}`),

  addExistingBook: (bookId: string, status: ReadingStatus) =>
    api.post<UserBook>('/books/library', { bookId, status }),

  addNewBook: (bookData: Partial<Book> & { title: string; author: string }, status: ReadingStatus) =>
    api.post<UserBook>('/books/library/new', { ...bookData, status }),

  updateUserBook: (id: string, data: Partial<UserBook>) =>
    api.put<UserBook>(`/books/library/${id}`, data),

  removeBook: (id: string) => api.delete(`/books/library/${id}`),

  getAllUsers: () => api.get('/books/users'),

  getPartnerLibrary: (userId: string) => api.get<UserBook[]>(`/books/library/user/${userId}`),
}
