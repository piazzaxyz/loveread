import { NavLink } from 'react-router-dom'
import { BookOpen, LayoutDashboard, Library, Calendar, Sun, Moon, LogOut, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import styles from './Sidebar.module.css'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/library', icon: Library, label: 'Biblioteca' },
  { to: '/calendar', icon: Calendar, label: 'Calendário' },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <BookOpen size={26} color="var(--accent)" />
        <span className={styles.logoText}>Cantinho do Leitor</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <Icon size={18} />
            <span className={styles.navLabel}>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <button className={styles.themeBtn} onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
        </button>

        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} />
            ) : (
              <User size={15} />
            )}
          </div>
          <div className={styles.userText}>
            <span className={styles.userName}>{user?.name}</span>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>
        </div>

        <button className={styles.logoutBtn} onClick={logout}>
          <LogOut size={14} />
          Sair
        </button>
      </div>
    </aside>
  )
}
