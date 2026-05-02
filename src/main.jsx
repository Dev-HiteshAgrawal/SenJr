import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

function setDynamicViewportHeight() {
  document.documentElement.style.setProperty('--dvh', `${window.innerHeight * 0.01}px`);
}

setDynamicViewportHeight();
window.addEventListener('resize', setDynamicViewportHeight);
window.visualViewport?.addEventListener('resize', setDynamicViewportHeight);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
