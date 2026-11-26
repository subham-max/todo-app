export interface AuthUser {
  id: number
  name: string
  email: string
}

export interface AuthSession {
  user: AuthUser
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: AuthSession
}
