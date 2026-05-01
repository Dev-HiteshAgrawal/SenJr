import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getSessionDurationSeconds, startAnalyticsSession, trackEvent } from '../lib/productAnalytics';

export default function AnalyticsLayer() {
  const location = useLocation();
  const maxScrollRef = useRef(0);

  useEffect(() => {
    startAnalyticsSession();
  }, []);

  useEffect(() => {
    maxScrollRef.current = 0;
    trackEvent('screen_view', { screen: location.pathname });
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      maxScrollRef.current = Math.max(maxScrollRef.current, Math.round((window.scrollY / scrollable) * 100));
    };

    const onPointerDown = (event) => {
      const target = event.target.closest?.('button, a, input, textarea, select');
      if (!target) return;
      trackEvent('interaction', {
        label: target.getAttribute('aria-label') || target.textContent?.trim()?.slice(0, 48) || target.tagName,
      });
    };

    const flush = () => {
      trackEvent('screen_exit', {
        durationSeconds: getSessionDurationSeconds(),
        maxScrollPercent: maxScrollRef.current,
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pagehide', flush);
    };
  }, []);

  return null;
}
