import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  current: number
  total: number
  showLabel?: boolean
  color?: string
  size?: 'sm' | 'md'
}

export function ProgressBar({ current, total, showLabel = true, color, size = 'md' }: ProgressBarProps) {
  const pct = total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.track} ${styles[size]}`}>
        <div
          className={styles.fill}
          style={{ width: `${pct}%`, background: color || 'var(--accent)' }}
        />
      </div>
      {showLabel && (
        <span className={styles.label}>
          {current}/{total} páginas ({pct}%)
        </span>
      )}
    </div>
  )
}
