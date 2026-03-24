import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Analytics = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Generate a simulated chart layout reflecting dummy history metrics.
    // In a prod app, this fetches from /analytics backend.
    const saved = JSON.parse(localStorage.getItem("search_history")) || [];
    setHistory(saved);
  }, []);

  const dataDistribution = [
    { name: "₹0 - ₹8k", count: 42 },
    { name: "₹8k - ₹40k", count: 120 },
    { name: "₹40k - ₹80k", count: 86 },
    { name: "₹80k+", count: 34 }
  ];

  const categoryData = [
    { name: "Smartphones", value: 400 },
    { name: "Laptops", value: 300 },
    { name: "Accessories", value: 300 },
    { name: "Home Audio", value: 200 }
  ];

  const COLORS = ['#e50914', '#b20710', '#e5e5e5', '#333'];

  return (
    <div style={{ padding: "40px", color: "white", backgroundColor: "#000", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>User Shopping Analytics</h1>
      
      <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", justifyContent: "center" }}>
        
        {/* Graph 1: Price Range Distribution */}
        <div style={{ backgroundColor: "#111", padding: "20px", borderRadius: "8px", width: "45%", minWidth: "300px" }}>
          <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#aaa" }}>Buying Price Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataDistribution}>
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip wrapperStyle={{ backgroundColor: "#333", color: "black" }} />
              <Bar dataKey="count" fill="#e50914" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Graph 2: Categories Viewed */}
        <div style={{ backgroundColor: "#111", padding: "20px", borderRadius: "8px", width: "45%", minWidth: "300px" }}>
          <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#aaa" }}>Popular Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name }) => name}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
