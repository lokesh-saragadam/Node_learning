import React from 'react';

/**
 * LoadingSkeleton
 * Shown while GET /dashboard is in flight. Mirrors the real layout
 * (8 overview cards + activity list) so there's no layout shift once
 * data arrives.
 */
export default function LoadingSkeleton() {
  return (
    <div className="dashboard-skeleton">
      <div className="overview-cards">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="overview-card overview-card--skeleton">
            <div className="skeleton-line skeleton-line--value" />
            <div className="skeleton-line skeleton-line--label" />
          </div>
        ))}
      </div>

      <section className="recent-activity">
        <div className="skeleton-line skeleton-line--title" />
        <ul className="recent-activity__list">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="activity-item activity-item--skeleton">
              <div className="skeleton-line skeleton-line--full" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
