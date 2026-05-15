import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import styles from './Header.module.css'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.actions}>
        <button className={styles.themeBtn} onClick={toggleTheme} title="Trocar tema">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <div className={styles.userMenu}>
          <div className={styles.avatar}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} />
            ) : (
              <span>{user?.name?.[0]?.toUpperCase()}</span>
            )}
          </div>
          <span className={styles.userName}>{user?.name}</span>
          <button className={styles.logoutBtn} onClick={logout}>Sair</button>
        </div>
      </div>
    </header>
  )
}
