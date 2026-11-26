import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="route-message">
      <span className="route-message-code">404</span>
      <h1>That page isn't on the list.</h1>
      <p>The address may be out of date or the page may have moved.</p>
      <Link className="submit-button route-message-link" to="/sign-in">
        Back to sign in
      </Link>
    </main>
  )
}

export default NotFoundPage
