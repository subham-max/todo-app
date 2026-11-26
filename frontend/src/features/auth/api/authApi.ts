import type { ApiClient } from '../../../shared/api/apiTypes'
import type { LoginCredentials, LoginResponse } from '../types'

export async function signIn(api: ApiClient, credentials: LoginCredentials) {
  const response = await api.post<LoginResponse>('/auth/login', credentials)

  if (!response.success) {
    throw new Error(response.message || 'Unable to sign in.')
  }

  return response.data
}
