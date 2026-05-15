import { useState } from 'react'
import { UserBook, STATUS_LABELS, ReadingStatus } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { booksService } from '@/services/books.service'
import styles from './BookCard.module.css'

interface BookCardProps {
  userBook: UserBook
  onUpdate: () => void
  onSelect: (ub: UserBook) => void
}

const BOOK_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="180" viewBox="0 0 120 180"%3E%3Crect width="120" height="180" fill="%23313244"/%3E%3Ctext x="60" y="100" text-anchor="middle" font-size="40" fill="%236c7086"%3E📚%3C/text%3E%3C/svg%3E'

export function BookCard({ userBook, onUpdate, onSelect }: BookCardProps) {
  const { book } = userBook
  const [updatingPage, setUpdatingPage] = useState(false)
  const [pageInput, setPageInput] = useState(String(userBook.currentPage))
  const [showPageInput, setShowPageInput] = useState(false)

  const updatePage = async () => {
    const page = parseInt(pageInput)
    if (isNaN(page) || page < 0) return
    setUpdatingPage(true)
    try {
      const newStatus: ReadingStatus = book.totalPages && page >= book.totalPages ? 'READ' : userBook.status
      await booksService.updateUserBook(userBook.id, { currentPage: page, status: newStatus })
      onUpdate()
      setShowPageInput(false)
    } finally {
      setUpdatingPage(false)
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.cover} onClick={() => onSelect(userBook)}>
        <img
          src={book.coverUrl || BOOK_PLACEHOLDER}
          alt={book.title}
          onError={(e) => { (e.target as HTMLImageElement).src = BOOK_PLACEHOLDER }}
        />
        <div className={styles.overlay}>
          <span>Ver detalhes</span>
        </div>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title} title={book.title}>{book.title}</h3>
        <p className={styles.author}>{book.author}</p>
        {book.genre && <span className={styles.genre}>{book.genre}</span>}

        <Badge status={userBook.status} />

        {userBook.status === 'READING' && book.totalPages && (
          <div className={styles.progress}>
            <ProgressBar
              current={userBook.currentPage}
              total={book.totalPages}
              size="sm"
            />
            {showPageInput ? (
              <div className={styles.pageInputRow}>
                <input
                  type="number"
                  className={styles.pageInput}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  min={0}
                  max={book.totalPages}
                  onKeyDown={(e) => { if (e.key === 'Enter') updatePage() }}
                  autoFocus
                />
                <Button size="sm" onClick={updatePage} loading={updatingPage}>✓</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowPageInput(false)}>✕</Button>
              </div>
            ) : (
              <button className={styles.updatePageBtn} onClick={() => setShowPageInput(true)}>
                Atualizar página
              </button>
            )}
          </div>
        )}

        <div className={styles.meta}>
          {userBook._count && (
            <span title="Notas">📝 {userBook._count.notes}</span>
          )}
          {userBook._count && (
            <span title="Arquivos">📄 {userBook._count.files}</span>
          )}
          {userBook.rating && (
            <span title="Avaliação">{'⭐'.repeat(userBook.rating)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
