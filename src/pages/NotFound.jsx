import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-mont font-extrabold text-5xl">404</h1>
        <p className="mt-2 text-text/80">Page not found.</p>
        <Link to="/" className="inline-block mt-6 px-5 py-3 rounded-xl bg-accent text-white font-semibold shadow-soft">Go Home</Link>
      </div>
    </div>
  )
}


