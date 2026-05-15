import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '../Sidebar'
import { BottomNav } from '../BottomNav'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import styles from './AppShell.module.css'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/library': 'Biblioteca',
  '/calendar': 'Calendário de Leitura',
}

export function AppShell() {
  const isDesktop = useIsDesktop()
  const location = useLocation()

  return (
    <div className={styles.shell}>
      {isDesktop && <Sidebar />}
      <main className={`${styles.main} ${isDesktop ? styles.withSidebar : styles.withBottomNav}`}>
        <Outlet />
      </main>
      {!isDesktop && <BottomNav />}
    </div>
  )
}
