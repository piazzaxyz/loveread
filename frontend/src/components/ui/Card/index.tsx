import styles from './Card.module.css'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
}

export function Card({ children, className = '', onClick, hoverable }: CardProps) {
  return (
    <div
      className={`${styles.card} ${hoverable ? styles.hoverable : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
