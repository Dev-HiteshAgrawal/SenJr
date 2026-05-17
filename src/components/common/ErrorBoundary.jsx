import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('Unhandled UI error:', error, info)
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div className="min-h-screen bg-gray-50 px-6 py-16 flex items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-md">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-red-500">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Something went wrong</h1>
          <p className="mt-3 text-sm font-medium leading-6 text-gray-500">
            The page hit an unexpected issue. Refreshing should get you back into a clean session.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-primary-500/20 transition hover:bg-primary-600 active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh page
          </button>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
