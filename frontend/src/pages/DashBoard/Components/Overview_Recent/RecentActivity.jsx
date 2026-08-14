import React from 'react';

const DIFFICULTY_CLASS = {
  Easy: 'badge--easy',
  Medium: 'badge--medium',
  Hard: 'badge--hard',
};

/**
 * RecentActivity
 * Takes the `recentActivity` array straight from GET /dashboard.
 *
 * Expected shape (from dashboard/service.js -> getRecentActivity):
 * [
 *   {
 *     problemId: 123,
 *     title: "Merge Intervals",
 *     difficulty: "Medium" | null,
 *     rating: 1800 | null,          // Codeforces problems
 *     platform: "LeetCode",
 *     language: "Python3" | null,
 *     solvedAt: "2026-08-03T12:40:00Z",
 *     solvedAtRelative: "2 hours ago"
 *   },
 *   ...
 * ]
 */
export default function RecentActivity({ recentActivity }) {
  if (!recentActivity || recentActivity.length === 0) {
    return (
      <section className="recent-activity">
        <h2 className="section-title">Recent Activity</h2>
        <p className="recent-activity__empty">
          Nothing solved yet — once you solve a problem it'll show up here.
        </p>
      </section>
    );
  }

  return (
    <section className="recent-activity">
      <h2 className="section-title">Recent Activity</h2>
      <ul className="recent-activity__list">
        {recentActivity.map((item) => (
          <li key={item.problemId} className="activity-item">
            <span className="activity-item__check">✓</span>

            <div className="activity-item__main">
              <span className="activity-item__title">{item.title}</span>
              <div className="activity-item__meta">
                {item.difficulty && (
                  <span className={`badge ${DIFFICULTY_CLASS[item.difficulty] || ''}`}>
                    {item.difficulty}
                  </span>
                )}
                {item.rating && <span className="badge badge--rating">{item.rating}</span>}
                <span className="activity-item__platform">{item.platform}</span>
              </div>
            </div>

            <span className="activity-item__time">
              {item.solvedAtRelative ?? new Date(item.solvedAt).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
