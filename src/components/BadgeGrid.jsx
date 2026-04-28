import { ALL_BADGES } from '../lib/badgeHelpers';
import './BadgeGrid.css';

export default function BadgeGrid({ earnedBadges = [] }) {
  const earnedMap = {};
  earnedBadges.forEach(b => {
    earnedMap[b.id] = b.earnedAt;
  });

  return (
    <div className="badge-grid">
      {ALL_BADGES.map(badge => {
        const isEarned = !!earnedMap[badge.id];
        const earnedDate = earnedMap[badge.id] 
          ? new Date(earnedMap[badge.id]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : null;

        return (
          <div 
            key={badge.id} 
            className={`badge-tile ${isEarned ? 'earned' : 'locked'}`}
            title={isEarned ? `Earned on ${earnedDate}` : `How to earn: ${badge.howToEarn}`}
          >
            <div className="badge-tile-icon">
              {badge.icon}
            </div>
            <div className="badge-tile-info">
              <span className="badge-tile-name">{badge.name}</span>
              {isEarned ? (
                <span className="badge-tile-date">Earned {earnedDate}</span>
              ) : (
                <span className="badge-tile-hint">{badge.howToEarn}</span>
              )}
            </div>
            {!isEarned && <div className="badge-lock-icon">🔒</div>}
          </div>
        );
      })}
    </div>
  );
}
