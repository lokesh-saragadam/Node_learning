import React from 'react';

/**
 * OverviewCard
 * Single stat card used for every metric in the Overview row
 * (Total Solved, Easy, Medium, Hard, Current Streak, Longest Streak,
 * Platforms Connected, Last Sync).
 *
 * Purely presentational — pass in whatever value/label/icon you want.
 */
export default function OverviewCard({ label, value, sublabel, icon, accent }) {
  return (
    <div className={`overview-card${accent ? ` overview-card--${accent}` : ''}`}>
      {icon && <div className="overview-card__icon">{icon}</div>}
      <div className="overview-card__value">{value}</div>
      <div className="overview-card__label">{label}</div>
      {sublabel && <div className="overview-card__sublabel">{sublabel}</div>}
    </div>
  );
}
