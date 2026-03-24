import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      const searches = JSON.parse(localStorage.getItem("search_history")) || [];
      searches.unshift({ query: query, timestamp: new Date().toISOString() });
      localStorage.setItem("search_history", JSON.stringify(searches.slice(0, 20)));
      navigate(`/search?q=${encodeURIComponent(query)}&semantic=true`);
    }
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Experience AI-Driven Shopping</h1>
        <p className="hero-description">
          Discover over 20,000 products personalized just for you. 
          Use our semantic search or ask our AI assistant to find exactly what you need.
        </p>
        <div className="hero-search-bar" style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Search for products, brands or ask 'Find me the best noise-cancelling headphones'..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            style={{ flex: 1 }}
          />
          <button onClick={handleSearch} className="btn btn-primary">Search</button>
        </div>
      </div>
      <div className="hero-fade-bottom"></div>
    </div>
  );
};

export default Hero;
