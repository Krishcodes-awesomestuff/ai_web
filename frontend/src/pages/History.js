import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const History = () => {
  const [searches, setSearches] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("search_history")) || [];
    setSearches(history);
  }, []);

  return (
    <div style={{ padding: "40px", color: "white", backgroundColor: "#000", minHeight: "100vh" }}>
      <h1 style={{ borderBottom: "1px solid #333", paddingBottom: "20px", marginBottom: "30px" }}>Your Activity History</h1>
      
      {searches.length === 0 ? (
        <p style={{ color: "#aaa" }}>You haven't made any searches yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {searches.map((s, idx) => (
            <li key={idx} style={{ 
              backgroundColor: "#111", 
              margin: "15px 0", 
              padding: "20px", 
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h3 style={{ margin: "0 0 10px 0", color: "#fff" }}>Searched For: "{s.query}"</h3>
                <span style={{ fontSize: "0.85rem", color: "#888" }}>{new Date(s.timestamp).toLocaleString()}</span>
              </div>
              <Link to={`/search?q=${encodeURIComponent(s.query)}`} style={{
                padding: "8px 20px",
                backgroundColor: "#e50914",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                fontWeight: "bold"
              }}>
                View Results Again
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
