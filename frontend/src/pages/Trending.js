import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const Trending = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get("http://localhost:8000/products/trending?limit=20");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching trending products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) return <div style={{ color: "white", padding: "50px", textAlign: "center" }}>Loading trending hits...</div>;

  return (
    <div style={{ padding: "40px", color: "white", backgroundColor: "#000", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2.5rem" }}>🔥 Trending Now</h1>
      <p style={{ textAlign: "center", marginBottom: "40px", color: "#888" }}>Discover what our community is loving right now.</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px", justifyItems: "center" }}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default Trending;
