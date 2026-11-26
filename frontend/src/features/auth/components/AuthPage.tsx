import { useState, type FormEvent } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { signIn } from '../api/authApi'
import { useApi } from '../../../shared/api/apiContext'
import { Button } from '../../../shared/components/Button'
import { TextField } from '../../../shared/components/TextField'

export type AuthMode = 'signin' | 'signup'

interface AuthPageProps {
  mode: AuthMode
}

export function AuthPage({ mode }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const api = useApi()
  const { setSession } = useAuth()
  const navigate = useNavigate()
  const isSignup = mode === 'signup'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('')
    setErrorMessage('')

    if (isSignup) {
      setNotice('Account creation is not available yet. No information was submitted.')
      return
    }

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    setIsSubmitting(true)
    try {
      const session = await signIn(api, { email, password })
      setSession(session)
      navigate('/app/today', { replace: true })
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to sign in. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="form-content">
      <header className="form-heading">
        <p className="eyebrow">{isSignup ? 'GET STARTED' : 'YOUR DAY AWAITS'}</p>
        <h2>{isSignup ? 'Create your account' : 'Welcome back'}</h2>
        <p>
          {isSignup
            ? 'Start making space for the things that matter.'
            : 'Sign in to pick up right where you left off.'}
        </p>
      </header>

      <nav className="mode-switch" aria-label="Account options">
        <NavLink to="/sign-in" end className={({ isActive }) => isActive ? 'active' : ''}>
          Sign in
        </NavLink>
        <NavLink to="/sign-up" end className={({ isActive }) => isActive ? 'active' : ''}>
          Create account
        </NavLink>
      </nav>

      <form className="auth-form" onSubmit={handleSubmit}>
        {isSignup && (
          <TextField
            label="Your name"
            name="name"
            type="text"
            placeholder="Alex Morgan"
            autoComplete="name"
            required
          />
        )}
        <TextField
          label="Email address"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <TextField
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder={isSignup ? 'At least 8 characters' : 'Enter your password'}
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          minLength={isSignup ? 8 : undefined}
          required
          trailing={
            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          }
        />

        {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
        {notice && <p className="form-notice" role="status">{notice}</p>}

        <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? 'Signing in…' : isSignup ? 'Create account' : 'Sign in'}
          {!isSubmitting && <span aria-hidden="true">→</span>}
        </Button>
      </form>

      <p className="form-terms">
        By continuing, you're ready to make today count.
      </p>
      <p className="switch-prompt">
        {isSignup ? 'Already have an account?' : 'New to daylist?'}{' '}
        <NavLink to={isSignup ? '/sign-in' : '/sign-up'}>
          {isSignup ? 'Sign in' : 'Create an account'}
        </NavLink>
      </p>
    </div>
  )
}
