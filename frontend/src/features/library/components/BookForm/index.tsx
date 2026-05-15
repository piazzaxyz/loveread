import { useState } from 'react'
import { ReadingStatus, STATUS_LABELS } from '@/types'
import { Button } from '@/components/ui/Button'
import { booksService } from '@/services/books.service'
import styles from './BookForm.module.css'

interface BookFormProps {
  onSuccess: () => void
  onCancel: () => void
}

const STATUS_OPTIONS: ReadingStatus[] = ['READING', 'WANT_TO_READ', 'WANT_TO_BUY', 'READ', 'ABANDONED']

export function BookForm({ onSuccess, onCancel }: BookFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    author: '',
    coverUrl: '',
    totalPages: '',
    genre: '',
    isbn: '',
    description: '',
    publishedYear: '',
    status: 'WANT_TO_READ' as ReadingStatus,
  })

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await booksService.addNewBook(
        {
          title: form.title,
          author: form.author,
          coverUrl: form.coverUrl || undefined,
          totalPages: form.totalPages ? parseInt(form.totalPages) : undefined,
          genre: form.genre || undefined,
          isbn: form.isbn || undefined,
          description: form.description || undefined,
          publishedYear: form.publishedYear ? parseInt(form.publishedYear) : undefined,
        },
        form.status
      )
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao adicionar livro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
        <div className={styles.field}>
          <label>Título *</label>
          <input
            className={styles.input}
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            required
            placeholder="Ex: O Senhor dos Anéis"
          />
        </div>

        <div className={styles.field}>
          <label>Autor *</label>
          <input
            className={styles.input}
            value={form.author}
            onChange={(e) => set('author', e.target.value)}
            required
            placeholder="Ex: J.R.R. Tolkien"
          />
        </div>

        <div className={styles.field}>
          <label>URL da Capa</label>
          <input
            className={styles.input}
            value={form.coverUrl}
            onChange={(e) => set('coverUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className={styles.field}>
          <label>Total de Páginas</label>
          <input
            type="number"
            className={styles.input}
            value={form.totalPages}
            onChange={(e) => set('totalPages', e.target.value)}
            placeholder="Ex: 300"
            min={1}
          />
        </div>

        <div className={styles.field}>
          <label>Gênero</label>
          <input
            className={styles.input}
            value={form.genre}
            onChange={(e) => set('genre', e.target.value)}
            placeholder="Ex: Fantasia, Romance..."
          />
        </div>

        <div className={styles.field}>
          <label>ISBN</label>
          <input
            className={styles.input}
            value={form.isbn}
            onChange={(e) => set('isbn', e.target.value)}
            placeholder="Ex: 9788535914849"
          />
        </div>

        <div className={styles.field}>
          <label>Ano de Publicação</label>
          <input
            type="number"
            className={styles.input}
            value={form.publishedYear}
            onChange={(e) => set('publishedYear', e.target.value)}
            placeholder="Ex: 1954"
            min={1000}
            max={new Date().getFullYear()}
          />
        </div>

        <div className={styles.field}>
          <label>Status *</label>
          <select
            className={styles.input}
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={`${styles.field} ${styles.fullWidth}`}>
        <label>Descrição</label>
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Sinopse ou descrição do livro..."
          rows={3}
        />
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}>Adicionar Livro</Button>
      </div>
    </form>
  )
}
