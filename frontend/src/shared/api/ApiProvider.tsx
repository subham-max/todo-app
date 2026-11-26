import { useCallback, useMemo, type ReactNode } from 'react'
import { useAuth } from '../../features/auth/context/authContext'
import { ApiContext } from './apiContext'
import { ApiError, type ApiClient } from './apiTypes'

function getErrorMessage(payload: unknown, fallback: string) {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof payload.message === 'string'
  ) {
    return payload.message
  }
  return fallback
}

interface ApiProviderProps {
  children: ReactNode
}

export function ApiProvider({ children }: ApiProviderProps) {
  const { token, signOut } = useAuth()
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'https://todo-app-1-pike.onrender.com/api')
    .replace(/\/+$/, '')

  const request = useCallback(async <T,>(path: string, init?: RequestInit): Promise<T> => {
    const headers = new Headers(init?.headers)
    headers.set('Accept', 'application/json')
    if (init?.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
    if (token) headers.set('Authorization', `Bearer ${token}`)

    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers,
    })

    let payload: unknown
    try {
      payload = await response.json()
    } catch {
      throw new ApiError('The server returned an invalid response.', response.status)
    }

    if (!response.ok) {
      if (response.status === 401 && token) signOut()
      throw new ApiError(
        getErrorMessage(payload, `Request failed (${response.status}).`),
        response.status,
      )
    }

    return payload as T
  }, [baseUrl, signOut, token])

  const api = useMemo<ApiClient>(() => ({
    get: <T,>(path: string) => request<T>(path),
    post: <T,>(path: string, body: unknown) =>
      request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  }), [request])

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}
