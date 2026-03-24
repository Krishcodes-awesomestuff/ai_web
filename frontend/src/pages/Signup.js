import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/auth/signup", {
        username,
        password
      });
      localStorage.setItem("token", res.data.access_token);
      navigate("/");
    } catch (err) {
      setError("Username already exists");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass">
        <h2>Create Account</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSignup}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
        <p>Already have an account? <Link to="/login">Sign in now.</Link></p>
      </div>
    </div>
  );
};

export default Signup;