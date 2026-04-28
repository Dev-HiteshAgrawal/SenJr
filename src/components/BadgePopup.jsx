import { useState, useEffect } from 'react';
import { getBadgeById } from '../lib/badgeHelpers';
import './BadgePopup.css';

export default function BadgePopup({ badgeId, onClose }) {
  const [show, setShow] = useState(false);
  const badge = getBadgeById(badgeId);

  useEffect(() => {
    // Trigger animation after mount
    requestAnimationFrame(() => setShow(true));
    
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 400);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!badge) return null;

  return (
    <div className={`badge-popup-overlay ${show ? 'visible' : ''}`}>
      <div className={`badge-popup-card ${show ? 'animate-in' : 'animate-out'}`}>
        <div className="badge-sparkle-container">
          <div className="sparkle s1">✦</div>
          <div className="sparkle s2">✧</div>
          <div className="sparkle s3">✦</div>
          <div className="sparkle s4">✧</div>
          <div className="sparkle s5">✦</div>
          <div className="sparkle s6">✧</div>
        </div>
        <div className="badge-popup-icon">{badge.icon}</div>
        <h3 className="badge-popup-title">New Badge Unlocked! 🎉</h3>
        <p className="badge-popup-name">{badge.name}</p>
        <p className="badge-popup-desc">{badge.description}</p>
        <button className="btn-primary badge-popup-btn" onClick={() => { setShow(false); setTimeout(onClose, 400); }}>
          Awesome!
        </button>
      </div>
    </div>
  );
}
