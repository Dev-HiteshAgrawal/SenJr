const EVENT_KEY = 'senjr:analytics-events:v1';
const SESSION_KEY = 'senjr:session-started-at';

function readEvents() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(EVENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn('Analytics buffer unavailable:', error);
    return [];
  }
}

function writeEvents(events) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(EVENT_KEY, JSON.stringify(events.slice(-200)));
}

export function trackEvent(name, properties = {}) {
  if (typeof window === 'undefined') return;
  const event = {
    name,
    properties,
    path: window.location.pathname,
    createdAt: new Date().toISOString(),
  };
  writeEvents([...readEvents(), event]);
}

export function startAnalyticsSession() {
  if (typeof window === 'undefined') return;
  if (!window.sessionStorage.getItem(SESSION_KEY)) {
    window.sessionStorage.setItem(SESSION_KEY, String(Date.now()));
  }
}

export function getSessionDurationSeconds() {
  if (typeof window === 'undefined') return 0;
  const startedAt = Number(window.sessionStorage.getItem(SESSION_KEY) || Date.now());
  return Math.max(0, Math.round((Date.now() - startedAt) / 1000));
}

export function getBufferedEvents() {
  return readEvents();
}
