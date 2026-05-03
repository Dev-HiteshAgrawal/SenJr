import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import BootstrapError from './BootstrapError.jsx';

function setDynamicViewportHeight() {
  document.documentElement.style.setProperty('--dvh', `${window.innerHeight * 0.01}px`);
}

setDynamicViewportHeight();
window.addEventListener('resize', setDynamicViewportHeight);
window.visualViewport?.addEventListener('resize', setDynamicViewportHeight);

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Senjr: #root element is missing from index.html.');
}

const root = createRoot(rootEl);

async function boot() {
  try {
    const { default: App } = await import('./App.jsx');
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('Senjr bootstrap failed:', error);
    root.render(
      <BootstrapError error={error} onRetry={() => window.location.reload()} />
    );
  }
}

boot();
