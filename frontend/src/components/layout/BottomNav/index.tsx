import { NavLink } from 'react-router-dom'
import styles from './BottomNav.module.css'

const navItems = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/library', icon: '📚', label: 'Biblioteca' },
  { to: '/calendar', icon: '📅', label: 'Calendário' },
]

export function BottomNav() {
  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
