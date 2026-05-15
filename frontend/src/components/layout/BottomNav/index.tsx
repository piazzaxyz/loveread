import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Library, Calendar } from 'lucide-react'
import styles from './BottomNav.module.css'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/library', icon: Library, label: 'Biblioteca' },
  { to: '/calendar', icon: Calendar, label: 'Calendário' },
]

export function BottomNav() {
  return (
    <nav className={styles.bottomNav}>
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <Icon size={22} />
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
