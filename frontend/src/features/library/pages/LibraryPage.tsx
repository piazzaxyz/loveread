import { useState, useEffect, useCallback } from 'react'
import { Plus, BookOpen, CheckCircle, Bookmark, ShoppingCart, XCircle } from 'lucide-react'
import { UserBook, ReadingStatus } from '@/types'
import { booksService } from '@/services/books.service'
import { BookCard } from '../components/BookCard'
import { BookForm } from '../components/BookForm'
import { BookDetail } from '../components/BookDetail'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import styles from './LibraryPage.module.css'

const FILTER_OPTIONS: { value: ReadingStatus | 'ALL'; label: string; icon: React.ReactNode }[] = [
  { value: 'ALL', label: 'Todos', icon: <BookOpen size={14} /> },
  { value: 'READING', label: 'Lendo', icon: <BookOpen size={14} /> },
  { value: 'READ', label: 'Lidos', icon: <CheckCircle size={14} /> },
  { value: 'WANT_TO_READ', label: 'Quero Ler', icon: <Bookmark size={14} /> },
  { value: 'WANT_TO_BUY', label: 'Quero Comprar', icon: <ShoppingCart size={14} /> },
  { value: 'ABANDONED', label: 'Abandonados', icon: <XCircle size={14} /> },
]

export function LibraryPage() {
  const [library, setLibrary] = useState<UserBook[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ReadingStatus | 'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState<UserBook | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await booksService.getLibrary(filter === 'ALL' ? undefined : filter)
      setLibrary(res.data)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { load() }, [load])

  const filtered = library.filter((ub) => {
    if (!search) return true
    const q = search.toLowerCase()
    return ub.book.title.toLowerCase().includes(q) || ub.book.author.toLowerCase().includes(q)
  })

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Minha Biblioteca</h1>
          <p className={styles.subtitle}>{library.length} livro{library.length !== 1 ? 's' : ''} na sua coleção</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Adicionar Livro
        </Button>
      </div>

      <div className={styles.controls}>
        <div className={styles.filters}>
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`${styles.filterBtn} ${filter === opt.value ? styles.activeFilter : ''}`}
              onClick={() => setFilter(opt.value)}
            >
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>
        <input
          className={styles.searchInput}
          placeholder="Buscar por título ou autor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Carregando biblioteca...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <BookOpen size={64} color="var(--text-muted)" strokeWidth={1} />
          <h3>Nenhum livro encontrado</h3>
          <p>{search ? 'Tente buscar por outro termo' : 'Adicione seu primeiro livro clicando no botão acima!'}</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((ub) => (
            <BookCard key={ub.id} userBook={ub} onUpdate={load} onSelect={setSelectedBook} />
          ))}
        </div>
      )}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Adicionar Livro" size="lg">
        <BookForm onSuccess={() => { setShowAddModal(false); load() }} onCancel={() => setShowAddModal(false)} />
      </Modal>

      <Modal isOpen={!!selectedBook} onClose={() => setSelectedBook(null)} title="Detalhes do Livro" size="lg">
        {selectedBook && (
          <BookDetail userBook={selectedBook} onUpdate={load} onClose={() => setSelectedBook(null)} />
        )}
      </Modal>
    </div>
  )
}
