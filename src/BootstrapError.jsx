/**
 * Shown when the app shell fails to load (e.g. Firebase config missing in production).
 * Keeps static import graph minimal — no firebase, no router.
 */
export default function BootstrapError({ error, onRetry }) {
  const message = error?.message || String(error || 'Unknown error');
  const isConfig = /Firebase|VITE_FIREBASE|environment|configured/i.test(message);

  return (
    <main className="bootstrap-error">
      <div className="bootstrap-error-card">
        <p className="bootstrap-error-kicker">Senjr</p>
        <h1>{isConfig ? 'Configuration needed' : 'Could not start the app'}</h1>
        <p className="bootstrap-error-lead">
          {isConfig
            ? 'The production build is missing Firebase (or other) environment variables. In Netlify: Site settings → Environment variables — add every VITE_FIREBASE_* key and scope them to Builds, then redeploy.'
            : 'Something went wrong while loading the application. You can retry or open the browser console for details.'}
        </p>
        <pre className="bootstrap-error-detail" role="status">
          {message}
        </pre>
        <div className="bootstrap-error-actions">
          <button type="button" className="btn-primary" onClick={onRetry}>
            Reload page
          </button>
        </div>
      </div>
    </main>
  );
}
