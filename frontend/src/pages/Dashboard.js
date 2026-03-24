import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get("http://localhost:8000/analytics/dashboard", config);
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="dashboard-loading">Loading Stats...</div>;
  if (!stats) return <div className="dashboard-error">Error loading dashboard</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h1>Admin Analytics</h1>
        
        <div className="stats-grid">
          <div className="stat-card glass">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.stats.users}</p>
          </div>
          <div className="stat-card glass">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.stats.products}</p>
          </div>
          <div className="stat-card glass">
            <h3>Total Interactions</h3>
            <p className="stat-value">{stats.stats.interactions}</p>
          </div>
        </div>

        <div className="dashboard-charts">
          <div className="chart-container glass">
            <h3>Top Categories</h3>
            <div className="bar-chart">
              {stats.top_categories.map((cat, idx) => (
                <div key={idx} className="bar-item">
                  <div className="bar-label">{cat.category}</div>
                  <div className="bar-wrap">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${(cat.count / stats.top_categories[0].count) * 100}%` }}
                    ></div>
                  </div>
                  <div className="bar-value">{cat.count}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-container glass">
            <h3>Daily Activity (Last 7 Days)</h3>
            <div className="trend-list">
              {stats.daily_trends.map((day, idx) => (
                <div key={idx} className="trend-item">
                  <span>{day.date}</span>
                  <span className="trend-count">{day.count} interactions</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
