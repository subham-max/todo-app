import type { ReactNode } from 'react'
import { AuthProvider } from '../../features/auth/context/AuthProvider'
import { ApiProvider } from '../../shared/api/ApiProvider'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <ApiProvider>{children}</ApiProvider>
    </AuthProvider>
  )
}
