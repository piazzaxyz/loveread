import { useState, useEffect } from 'react'
import { Trophy, Zap, BarChart2, PieChart as PieChartIcon, Heart, BookOpen, Flame } from 'lucide-react'
import { DashboardData, UserStats } from '@/types'
import { dashboardService } from '@/services/dashboard.service'
import { Card } from '@/components/ui/Card'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import styles from './DashboardPage.module.css'

const CHART_COLORS = ['#cba6f7', '#89b4fa', '#a6e3a1', '#f9e2af', '#fab387', '#f38ba8', '#94e2d5']

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService.getDashboard().then((res) => setData(res.data)).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>Carregando dashboard...</span>
      </div>
    )
  }

  if (!data) return null

  const genreData = Object.entries(data.allGenres).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([name, value]) => ({ name, value }))
  const leaderboardData = data.leaderboard.map((u) => ({ name: u.name, lidos: u.booksRead, páginas: u.totalPages }))

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Acompanhe o progresso de todos os leitores</p>
      </div>

      <section>
        <h2 className={styles.sectionTitle}><Trophy size={18} /> Ranking de Leitores</h2>
        <div className={styles.leaderboard}>
          {data.leaderboard.map((user, i) => <LeaderboardCard key={user.userId} user={user} rank={i + 1} />)}
        </div>
      </section>

      <div className={styles.chartsRow}>
        {genreData.length > 0 && (
          <Card className={styles.chartCard}>
            <h3 className={styles.chartTitle}><PieChartIcon size={15} /> Gêneros Mais Lidos</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={genreData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {genreData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}
        {leaderboardData.length > 0 && (
          <Card className={styles.chartCard}>
            <h3 className={styles.chartTitle}><BarChart2 size={15} /> Livros Lidos por Pessoa</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={leaderboardData} margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                <Bar dataKey="lidos" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {data.recentActivity.length > 0 && (
        <section>
          <h2 className={styles.sectionTitle}><Zap size={18} /> Atividade Recente</h2>
          <Card>
            <div className={styles.activityList}>
              {data.recentActivity.map((log) => (
                <div key={log.id} className={styles.activityItem}>
                  <div className={styles.activityAvatar}>
                    {log.user.avatarUrl ? <img src={log.user.avatarUrl} alt={log.user.name} /> : <span>{log.user.name[0].toUpperCase()}</span>}
                  </div>
                  <div className={styles.activityInfo}>
                    <span className={styles.activityText}>
                      <strong>{log.user.name}</strong> leu <span className={styles.bookName}>{log.userBook.book.title}</span>
                    </span>
                    <span className={styles.activityMeta}>
                      {log.pagesRead > 0 && `${log.pagesRead} páginas`}
                      {log.pagesRead > 0 && log.minutesRead > 0 && ' · '}
                      {log.minutesRead > 0 && `${log.minutesRead} min`}
                    </span>
                  </div>
                  <span className={styles.activityDate}>{new Date(log.date).toLocaleDateString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}
    </div>
  )
}

function LeaderboardCard({ user, rank }: { user: UserStats; rank: number }) {
  const medals = ['🥇', '🥈', '🥉']
  return (
    <Card className={styles.leaderCard}>
      <div className={styles.rankBadge}>{medals[rank - 1] || `#${rank}`}</div>
      <div className={styles.leaderAvatar}>
        {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} /> : <span>{user.name[0].toUpperCase()}</span>}
      </div>
      <h3 className={styles.leaderName}>{user.name}</h3>
      <div className={styles.leaderStats}>
        <div className={styles.leaderStat}>
          <span className={styles.leaderStatVal}>{user.booksRead}</span>
          <span className={styles.leaderStatLabel}>Lidos</span>
        </div>
        <div className={styles.leaderStat}>
          <span className={styles.leaderStatVal}>{user.totalPages}</span>
          <span className={styles.leaderStatLabel}>Páginas</span>
        </div>
        <div className={styles.leaderStat}>
          <span className={`${styles.leaderStatVal} ${styles.streakVal}`}>
            <Flame size={14} /> {user.streak}
          </span>
          <span className={styles.leaderStatLabel}>Streak</span>
        </div>
      </div>
      {user.favoriteGenre && (
        <span className={styles.favoriteGenre}><Heart size={11} /> {user.favoriteGenre}</span>
      )}
      {user.booksReading > 0 && (
        <span className={styles.readingNow}><BookOpen size={11} /> Lendo {user.booksReading} livro{user.booksReading > 1 ? 's' : ''}</span>
      )}
    </Card>
  )
}
