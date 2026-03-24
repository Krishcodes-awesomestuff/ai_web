import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    let url = `/search?q=${encodeURIComponent(searchQuery)}`;
    if (sortOption === "high") {
      url += "&sort_by=price&order=desc";
    } else if (sortOption === "low") {
      url += "&sort_by=price&order=asc";
    }
    navigate(url);
  };

  return (
    <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">SHOP.AI</Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/trending">Trending</Link>
          <Link to="/history">My History</Link>
          <Link to="/dashboard">Analytics</Link>
        </div>
      </div>
      
      <div className="navbar-center">
      </div>

      <div className="navbar-right">
        <Link to="/chat" className="navbar-chat-btn">Ask AI</Link>
        {localStorage.getItem("token") ? (
          <button 
            className="btn btn-primary" 
            onClick={() => { 
                localStorage.removeItem("token"); 
                window.location.href = "/login"; 
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="btn btn-primary">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;