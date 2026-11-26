import { createContext, useContext } from 'react'
import type { ApiClient } from './apiTypes'

export const ApiContext = createContext<ApiClient | null>(null)

export function useApi() {
  const context = useContext(ApiContext)
  if (!context) throw new Error('useApi must be used within ApiProvider')
  return context
}
