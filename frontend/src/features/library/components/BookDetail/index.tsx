import { useState, useEffect } from 'react'
import { UserBook, ReadingStatus, STATUS_LABELS } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { booksService } from '@/services/books.service'
import { NotesPanel } from '../../notes'
import { FilesPanel } from '../../files'
import { readingLogService } from '@/services/readingLog.service'
import styles from './BookDetail.module.css'

interface BookDetailProps {
  userBook: UserBook
  onUpdate: () => void
  onClose: () => void
}

const STATUS_OPTIONS: ReadingStatus[] = ['READING', 'READ', 'WANT_TO_READ', 'WANT_TO_BUY', 'ABANDONED']
type Tab = 'progress' | 'notes' | 'files'

export function BookDetail({ userBook: initialUb, onUpdate, onClose }: BookDetailProps) {
  const [ub, setUb] = useState(initialUb)
  const [tab, setTab] = useState<Tab>('progress')
  const [status, setStatus] = useState(ub.status)
  const [currentPage, setCurrentPage] = useState(String(ub.currentPage))
  const [rating, setRating] = useState(ub.rating || 0)
  const [saving, setSaving] = useState(false)
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0])
  const [logPages, setLogPages] = useState('')
  const [logMinutes, setLogMinutes] = useState('')
  const [loggingSession, setLoggingSession] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      const updated = await booksService.updateUserBook(ub.id, {
        status,
        currentPage: parseInt(currentPage) || 0,
        rating: rating || undefined,
      })
      setUb(updated.data)
      onUpdate()
    } finally {
      setSaving(false)
    }
  }

  const logSession = async () => {
    if (!logDate) return
    setLoggingSession(true)
    try {
      await readingLogService.log(ub.id, logDate, parseInt(logPages) || 0, parseInt(logMinutes) || 0)
      setLogPages('')
      setLogMinutes('')
      onUpdate()
    } finally {
      setLoggingSession(false)
    }
  }

  const pct = ub.book.totalPages
    ? Math.min(Math.round((ub.currentPage / ub.book.totalPages) * 100), 100)
    : 0

  return (
    <div className={styles.detail}>
      <div className={styles.hero}>
        <div className={styles.coverWrap}>
          <img
            src={ub.book.coverUrl || ''}
            alt={ub.book.title}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
        <div className={styles.heroInfo}>
          <h2 className={styles.bookTitle}>{ub.book.title}</h2>
          <p className={styles.bookAuthor}>{ub.book.author}</p>
          {ub.book.genre && <span className={styles.genre}>{ub.book.genre}</span>}
          {ub.book.publishedYear && (
            <span className={styles.year}>{ub.book.publishedYear}</span>
          )}
          <Badge status={ub.status} />
          {ub.book.description && (
            <p className={styles.description}>{ub.book.description}</p>
          )}
        </div>
      </div>

      <div className={styles.tabs}>
        {(['progress', 'notes', 'files'] as Tab[]).map((t) => (
          <button
            key={t}
            className={`${styles.tabBtn} ${tab === t ? styles.activeTab : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'progress' ? '📈 Progresso' : t === 'notes' ? '📝 Notas' : '📄 Arquivos'}
          </button>
        ))}
      </div>

      {tab === 'progress' && (
        <div className={styles.progressTab}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Status</h3>
            <select
              className={styles.select}
              value={status}
              onChange={(e) => setStatus(e.target.value as ReadingStatus)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>

          {ub.book.totalPages && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Progresso de Leitura</h3>
              <ProgressBar current={parseInt(currentPage) || 0} total={ub.book.totalPages} />
              <div className={styles.pageRow}>
                <input
                  type="number"
                  className={styles.pageInput}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(e.target.value)}
                  min={0}
                  max={ub.book.totalPages}
                  placeholder="Página atual"
                />
                <span className={styles.pageTotal}>de {ub.book.totalPages}</span>
              </div>
            </div>
          )}

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Avaliação</h3>
            <div className={styles.stars}>
              {[1,2,3,4,5].map((star) => (
                <button
                  key={star}
                  className={`${styles.star} ${star <= rating ? styles.starActive : ''}`}
                  onClick={() => setRating(star === rating ? 0 : star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <Button onClick={save} loading={saving} fullWidth>Salvar Alterações</Button>

          <div className={styles.divider} />

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Registrar Sessão de Leitura</h3>
            <div className={styles.sessionForm}>
              <div className={styles.sessionField}>
                <label>Data</label>
                <input
                  type="date"
                  className={styles.pageInput}
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                />
              </div>
              <div className={styles.sessionField}>
                <label>Páginas lidas</label>
                <input
                  type="number"
                  className={styles.pageInput}
                  value={logPages}
                  onChange={(e) => setLogPages(e.target.value)}
                  placeholder="0"
                  min={0}
                />
              </div>
              <div className={styles.sessionField}>
                <label>Minutos</label>
                <input
                  type="number"
                  className={styles.pageInput}
                  value={logMinutes}
                  onChange={(e) => setLogMinutes(e.target.value)}
                  placeholder="0"
                  min={0}
                />
              </div>
            </div>
            <Button variant="secondary" onClick={logSession} loading={loggingSession} fullWidth>
              📅 Registrar no Calendário
            </Button>
          </div>
        </div>
      )}

      {tab === 'notes' && <NotesPanel userBookId={ub.id} />}
      {tab === 'files' && <FilesPanel userBookId={ub.id} />}
    </div>
  )
}
