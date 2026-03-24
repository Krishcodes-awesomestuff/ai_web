import React, { useState, useEffect } from "react";
import axios from "axios";
import Hero from "../components/Hero";
import ProductRow from "../components/ProductRow";

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        const trendingRes = await axios.get("http://localhost:8000/products/trending");
        setTrending(trendingRes.data);

        // Conditional fetches if logged in (placeholder for now)
        const token = localStorage.getItem("token");
        if (token) {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const recommendedRes = await axios.get("http://localhost:8000/recommend/personalized", config);
          setRecommended(recommendedRes.data);
          
          const historyRes = await axios.get("http://localhost:8000/products/history", config);
          setHistory(historyRes.data);
        }
      } catch (err) {
        console.error("Error fetching home data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home">
      <Hero />
      <div className="rows-container" style={{ marginTop: "-150px", position: "relative", zIndex: 10 }}>
        {recommended.length > 0 && <ProductRow title="Because You Viewed" products={recommended} />}
        <ProductRow title="Trending Now" products={trending} />
        {history.length > 0 && <ProductRow title="Continue Watching" products={history} />}
        <ProductRow title="New Arrivals" products={trending.slice().reverse()} />
      </div>
    </div>
  );
};

export default Home;