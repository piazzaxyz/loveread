import { useState, useEffect } from 'react'
import { readingLogService } from '@/services/readingLog.service'
import { booksService } from '@/services/books.service'
import { UserBook } from '@/types'
import { Button } from '@/components/ui/Button'
import styles from './CalendarPage.module.css'

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

interface DayLog {
  date: string
  pagesRead: number
  minutesRead: number
}

export function CalendarPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [readDates, setReadDates] = useState<DayLog[]>([])
  const [streak, setStreak] = useState(0)
  const [library, setLibrary] = useState<UserBook[]>([])
  const [logDate, setLogDate] = useState(today.toISOString().split('T')[0])
  const [selectedBook, setSelectedBook] = useState('')
  const [pages, setPages] = useState('')
  const [minutes, setMinutes] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const [calRes, streakRes, libRes] = await Promise.all([
      readingLogService.getCalendarDates(),
      readingLogService.getStreak(),
      booksService.getLibrary('READING'),
    ])
    setReadDates(calRes.data)
    setStreak(streakRes.data.streak)
    setLibrary(libRes.data)
    if (libRes.data.length > 0 && !selectedBook) {
      setSelectedBook(libRes.data[0].id)
    }
  }

  useEffect(() => { load() }, [])

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const getCalendarDays = () => {
    const firstDay = new Date(year, month - 1, 1).getDay()
    const daysInMonth = new Date(year, month, 0).getDate()
    const cells: (number | null)[] = Array(firstDay).fill(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }

  const isReadDay = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return readDates.some((d) => d.date === dateStr)
  }

  const getDayData = (day: number): DayLog | undefined => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return readDates.find((d) => d.date === dateStr)
  }

  const isToday = (day: number) => {
    return year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate()
  }

  const logSession = async () => {
    if (!selectedBook || !logDate) return
    setSaving(true)
    try {
      await readingLogService.log(selectedBook, logDate, parseInt(pages) || 0, parseInt(minutes) || 0)
      setPages('')
      setMinutes('')
      load()
    } finally {
      setSaving(false)
    }
  }

  const totalThisMonth = readDates.filter((d) => d.date.startsWith(`${year}-${String(month).padStart(2, '0')}`))
  const totalPagesMonth = totalThisMonth.reduce((s, d) => s + d.pagesRead, 0)
  const totalMinutesMonth = totalThisMonth.reduce((s, d) => s + d.minutesRead, 0)

  const cells = getCalendarDays()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Calendário de Leitura</h1>
          <p className={styles.subtitle}>Mantenha sua ofensiva de leitura!</p>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.calendarSection}>
          <div className={styles.streakBanner}>
            <span className={styles.streakFire}>🔥</span>
            <div>
              <span className={styles.streakCount}>{streak}</span>
              <span className={styles.streakLabel}>dias seguidos</span>
            </div>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{totalThisMonth.length}</span>
              <span className={styles.statLabel}>dias lidos</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{totalPagesMonth}</span>
              <span className={styles.statLabel}>páginas</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{Math.round(totalMinutesMonth / 60)}h</span>
              <span className={styles.statLabel}>de leitura</span>
            </div>
          </div>

          <div className={styles.calNav}>
            <button className={styles.navBtn} onClick={prevMonth}>‹</button>
            <span className={styles.monthLabel}>{MONTHS[month - 1]} {year}</span>
            <button className={styles.navBtn} onClick={nextMonth}>›</button>
          </div>

          <div className={styles.calGrid}>
            {DAYS.map((d) => (
              <div key={d} className={styles.dayLabel}>{d}</div>
            ))}
            {cells.map((day, i) => {
              if (!day) return <div key={i} className={styles.emptyCell} />
              const data = getDayData(day)
              return (
                <div
                  key={i}
                  className={`${styles.dayCell} ${isReadDay(day) ? styles.readDay : ''} ${isToday(day) ? styles.todayCell : ''}`}
                  title={data ? `${data.pagesRead} páginas · ${data.minutesRead} min` : ''}
                >
                  <span className={styles.dayNum}>{day}</span>
                  {isReadDay(day) && <span className={styles.readDot} />}
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles.logSection}>
          <h2 className={styles.logTitle}>Registrar Sessão</h2>
          <p className={styles.logSubtitle}>Marque os dias que você leu</p>

          <div className={styles.logForm}>
            <div className={styles.field}>
              <label>Livro</label>
              <select
                className={styles.select}
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
              >
                {library.length === 0 && (
                  <option value="">Nenhum livro em leitura</option>
                )}
                {library.map((ub) => (
                  <option key={ub.id} value={ub.id}>{ub.book.title}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Data</label>
              <input
                type="date"
                className={styles.input}
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                max={today.toISOString().split('T')[0]}
              />
            </div>

            <div className={styles.field}>
              <label>Páginas lidas</label>
              <input
                type="number"
                className={styles.input}
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="0"
                min={0}
              />
            </div>

            <div className={styles.field}>
              <label>Minutos de leitura</label>
              <input
                type="number"
                className={styles.input}
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="0"
                min={0}
              />
            </div>

            <Button
              fullWidth
              onClick={logSession}
              loading={saving}
              disabled={!selectedBook}
            >
              📅 Registrar Sessão
            </Button>
          </div>

          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.readDot}`} />
              <span>Dia lido</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.todayDot}`} />
              <span>Hoje</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
