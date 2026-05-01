import { useEffect, useState } from 'react';
import { getConnectionState, getRetryQueue } from '../lib/offlineQueue';

export default function OfflineRecoveryBar() {
  const [state, setState] = useState(() => getConnectionState());
  const [queueSize, setQueueSize] = useState(() => getRetryQueue().length);

  useEffect(() => {
    const update = () => setState(getConnectionState());
    const updateQueue = (event) => setQueueSize(event.detail?.size ?? getRetryQueue().length);

    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    window.addEventListener('senjr:retry-queue', updateQueue);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
      window.removeEventListener('senjr:retry-queue', updateQueue);
    };
  }, []);

  if (state.online && queueSize === 0 && !state.saveData) return null;

  return (
    <div className="offline-recovery-bar" role="status" aria-live="polite">
      <span className={`offline-dot ${state.online ? 'online' : ''}`} />
      <span>
        {state.online
          ? queueSize > 0
            ? `${queueSize} update${queueSize > 1 ? 's' : ''} waiting to sync`
            : 'Low-data mode detected. Senjr is keeping things light.'
          : 'You are offline. Progress is saved locally and will sync when you return.'}
      </span>
    </div>
  );
}
