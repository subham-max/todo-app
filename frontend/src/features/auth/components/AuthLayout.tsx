import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { Brand } from '../../../shared/components/Brand'
import './auth.css'

export function AuthLayout() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) return <Navigate to="/app/today" replace />

  return (
    <main className="auth-page">
      <section className="auth-card" aria-label="Todo account access">
        <aside className="welcome-panel">
          <Brand className="brand" />
          <div className="welcome-copy">
            <p className="eyebrow">A calmer kind of productive</p>
            <h1>Make room for what matters.</h1>
            <p className="welcome-description">
              One small list can make a big difference. Keep your day clear,
              focused, and feeling like yours.
            </p>
          </div>

          <div className="preview" aria-label="A preview of your todo list">
            <div className="preview-heading">
              <div>
                <span className="preview-date">MONDAY, OCTOBER 21</span>
                <strong>Your day, in focus</strong>
              </div>
              <span className="preview-menu" aria-hidden="true">···</span>
            </div>
            <div className="preview-task">
              <span className="task-check task-check-done" aria-hidden="true">✓</span>
              <span className="task-done">Water the plants</span>
              <span className="task-time">9:00</span>
            </div>
            <div className="preview-task">
              <span className="task-check" aria-hidden="true" />
              <span>Plan the week ahead</span>
              <span className="task-time">10:30</span>
            </div>
            <div className="preview-task">
              <span className="task-check" aria-hidden="true" />
              <span>Take a proper lunch break</span>
              <span className="task-time">12:00</span>
            </div>
            <div className="preview-progress">
              <span><b>1</b> of 3 completed</span>
              <span className="progress-track"><span /></span>
            </div>
          </div>

          <p className="welcome-footer">A little progress is still progress.</p>
        </aside>

        <div className="form-panel">
          <Brand className="mobile-brand" />
          <Outlet />
        </div>
      </section>
    </main>
  )
}
