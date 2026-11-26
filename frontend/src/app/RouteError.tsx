import { Link, useRouteError } from 'react-router-dom'

export function RouteError() {
  const error = useRouteError()
  console.error('Application route error:', error)

  return (
    <main className="route-message">
      <span className="route-message-code">Something went wrong</span>
      <h1>We couldn't load this page.</h1>
      <p>Please try again. If the problem continues, return to sign in.</p>
      <Link className="submit-button route-message-link" to="/sign-in">
        Back to sign in
      </Link>
    </main>
  )
}
