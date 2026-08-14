import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from "react-router-dom";
import OverviewCards from './Components/Overview_Recent/OverviewCards.jsx';
import RecentActivity from './Components/Overview_Recent/RecentActivity.jsx';
import LoadingSkeleton from './Components/Page/LoadingSkeleton.jsx';
import Welcome from './Components/Page/Welcome.jsx';
import { Difficulty , Rating } from './Components/Distributions/Difficulty.jsx';
import Topic from './Components/Distributions/Topic.jsx'
import MonthAnaly from './Components/Analytics/Monthly_trend.jsx';
import HeatMap from './Components/Consistency/Heatmap.jsx';
import './Dashboard.css';

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
      setData(json);
      console.log("Dashboard API Data:", json);
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

      <Welcome username={data.username}/>
      
      <section className="dashboard__overview">
        <h2 className="section-title">Overview</h2>
        <OverviewCards overview={data.dashboardData.overview} />
      </section>

      <RecentActivity recentActivity={data.dashboardData.recentActivity} />

      {/* Reserved for later: Analytics, Heatmap, Recommendations */}
      <h2>Distributions</h2>
      <section className="DistributionD">
        < Difficulty data={data.dashboardData.overview} />
        < Rating data={data.dashboardData.overview.ratingCounts}/>
      </section>
      <h2>Tags</h2>
      <section className="DistributionT">
        < Topic data={data.dashboardData.TopicWiseSolved}/>
      </section>
      <section className ="Months_Analytics">
        <MonthAnaly data1 = {data.dashboardData.SolvedAtMonths}/>
      </section>
      <section className="HeatMap">
        <HeatMap data={data.dashboardData.DailyCounts}/>
      </section>
    </div>
  );
}
