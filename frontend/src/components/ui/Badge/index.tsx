import { ReadingStatus, STATUS_LABELS } from '@/types'
import styles from './Badge.module.css'

interface BadgeProps {
  status: ReadingStatus
}

const STATUS_CLASS: Record<ReadingStatus, string> = {
  READING: 'reading',
  READ: 'read',
  WANT_TO_READ: 'wantToRead',
  WANT_TO_BUY: 'wantToBuy',
  ABANDONED: 'abandoned',
}

export function Badge({ status }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[STATUS_CLASS[status]]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
