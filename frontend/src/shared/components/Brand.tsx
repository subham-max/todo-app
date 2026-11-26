import { Link } from 'react-router-dom'

interface BrandProps {
  className: string
}

export function Brand({ className }: BrandProps) {
  return (
    <Link className={className} to="/sign-in" aria-label="Daylist home">
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span>daylist</span>
    </Link>
  )
}
