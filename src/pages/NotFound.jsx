import { Home, SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="min-h-[calc(100vh-8rem)] bg-gray-50 px-6 py-16 flex items-center justify-center">
    <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-md">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-50 text-primary-500">
        <SearchX className="h-8 w-8" />
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-primary-600">404</p>
      <h1 className="mt-2 text-2xl font-black text-gray-900">Page not found</h1>
      <p className="mt-3 text-sm font-medium leading-6 text-gray-500">
        This route does not exist or may have moved. Head back home and continue from there.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-primary-500/20 transition hover:bg-primary-600 active:scale-[0.98]"
      >
        <Home className="h-4 w-4" />
        Go home
      </Link>
    </div>
  </div>
)

export default NotFound
