import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from "react-router-dom";
import OverviewCards from '../components/OverviewCards';
import RecentActivity from '../components/RecentActivity';
import LoadingSkeleton from '../components/LoadingSkeleton';
import '../css/Dashboard.css';

/**
 * Dashboard
 * Single container that hits GET /dashboard once and fans the response
 * out to every section (Part 2 & 4 of the spec: one API call, split
 * into presentational sections).
 *
 * Response shape expected from the backend:
 * {
 *   overview: { totalSolved, easy, medium, hard, currentStreak,
 *               longestStreak, platformsConnected, lastSync },
 *   recentActivity: [ { problemId, title, difficulty, platform, ... } ]
 * }
 */
export default function Dashboard() {
  const [data, setData] = useState(null);
  const { id: userid } = useParams();
  const token = localStorage.getItem("token");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:3000/api/dashboard/${userid}`
        , {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = await res.json();
      setData(json.dashboardData);
      console.log("Dashboard Data:", json.dashboardData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="dashboard-error">
        <p>Couldn't load your dashboard: {error}</p>
        <button onClick={fetchDashboard}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <section className="dashboard__overview">
        <h2 className="section-title">Overview</h2>
        <OverviewCards overview={data.overview} />
      </section>

      <RecentActivity recentActivity={data.recentActivity} />

      {/* Reserved for later: Analytics, Heatmap, Recommendations */}
      <section className="dashboard__placeholder" aria-hidden="true" />
    </div>
  );
}
