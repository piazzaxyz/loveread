import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/types'
import { api } from '@/services/api'

interface AuthContextValue {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('cantinho-token')
    if (savedToken) {
      setToken(savedToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
      api.get('/auth/profile')
        .then((res) => setUser(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    const { user: u, token: t } = res.data
    setUser(u)
    setToken(t)
    localStorage.setItem('cantinho-token', t)
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { name, email, password })
    const { user: u, token: t } = res.data
    setUser(u)
    setToken(t)
    localStorage.setItem('cantinho-token', t)
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('cantinho-token')
    delete api.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
