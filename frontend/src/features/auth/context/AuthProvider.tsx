import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { AuthSession } from '../types'
import { AuthContext, type AuthContextValue } from './authContext'

const SESSION_STORAGE_KEY = 'daylist.session.v1'

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== 'object' || value === null) return false
  const session = value as Partial<AuthSession>
  return (
    typeof session.token === 'string' &&
    typeof session.user?.id === 'number' &&
    typeof session.user.name === 'string' &&
    typeof session.user.email === 'string'
  )
}

function readSession(): AuthSession | null {
  const storedSession = sessionStorage.getItem(SESSION_STORAGE_KEY)
  if (!storedSession) return null

  try {
    const parsed: unknown = JSON.parse(storedSession)
    if (isAuthSession(parsed)) return parsed
  } catch {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    return null
  }

  sessionStorage.removeItem(SESSION_STORAGE_KEY)
  return null
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSessionState] = useState<AuthSession | null>(readSession)

  const setSession = useCallback((nextSession: AuthSession) => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession))
    setSessionState(nextSession)
  }, [])

  const signOut = useCallback(() => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    setSessionState(null)
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user: session?.user ?? null,
    token: session?.token ?? null,
    isAuthenticated: session !== null,
    setSession,
    signOut,
  }), [session, setSession, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
