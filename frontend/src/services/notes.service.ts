import { api } from './api'
import { BookNote, NoteType } from '@/types'

export const notesService = {
  getNotes: (userBookId: string) => api.get<BookNote[]>(`/notes/${userBookId}`),

  createNote: (userBookId: string, title: string, content: string, type: NoteType) =>
    api.post<BookNote>('/notes', { userBookId, title, content, type }),

  updateNote: (id: string, data: Partial<BookNote>) =>
    api.put<BookNote>(`/notes/${id}`, data),

  deleteNote: (id: string) => api.delete(`/notes/${id}`),
}
