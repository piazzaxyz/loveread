import { api } from './api'
import { BookFile } from '@/types'

export const filesService = {
  getFiles: (userBookId: string) => api.get<BookFile[]>(`/files/${userBookId}`),

  uploadFile: (userBookId: string, file: File, onProgress?: (pct: number) => void) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userBookId', userBookId)
    return api.post<BookFile>('/files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total))
      },
    })
  },

  deleteFile: (id: string) => api.delete(`/files/${id}`),
}
