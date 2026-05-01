const QUEUE_KEY = 'senjr:retry-queue:v1';

function readQueue() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn('Could not read retry queue:', error);
    return [];
  }
}

function writeQueue(queue) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-50)));
  window.dispatchEvent(new CustomEvent('senjr:retry-queue', { detail: { size: queue.length } }));
}

export function enqueueRetry(action) {
  const queue = readQueue();
  writeQueue([
    ...queue,
    {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
      attempts: 0,
      ...action,
    },
  ]);
}

export function getRetryQueue() {
  return readQueue();
}

export function clearRetryQueue() {
  writeQueue([]);
}

export async function replayRetryQueue(handler) {
  const queue = readQueue();
  const remaining = [];

  for (const item of queue) {
    try {
      await handler(item);
    } catch (error) {
      remaining.push({ ...item, attempts: (item.attempts || 0) + 1, lastErrorAt: new Date().toISOString() });
    }
  }

  writeQueue(remaining);
  return { attempted: queue.length, remaining: remaining.length };
}

export function getConnectionState() {
  if (typeof navigator === 'undefined') return { online: true, effectiveType: 'unknown' };
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return {
    online: navigator.onLine,
    effectiveType: connection?.effectiveType || 'unknown',
    saveData: Boolean(connection?.saveData),
  };
}
