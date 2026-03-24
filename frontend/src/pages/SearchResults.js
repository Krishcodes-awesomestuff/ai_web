import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "./SearchResults.css";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get("q") || "";
  const brand = queryParams.get("brand") || "";
  const sortBy = queryParams.get("sort_by") || "";
  const order = queryParams.get("order") || "";

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        let url = `http://localhost:8000/products/?limit=50`;
        if (q) url += `&q=${encodeURIComponent(q)}`;
        if (brand) url += `&brand=${encodeURIComponent(brand)}`;
        if (sortBy) url += `&sort_by=${sortBy}&order=${order}`;

        const res = await axios.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [q, brand, sortBy, order]);

  const removeFilter = (type) => {
    const params = new URLSearchParams(location.search);
    params.delete(type);
    navigate({ search: params.toString() });
  };

  return (
    <div className="search-results-page">
      <div className="search-info">
        <h2>
          {q ? `Search results for "${q}"` : brand ? `Products from ${brand}` : "All Products"}
        </h2>
        <div className="active-filters">
           {brand && <span className="filter-badge">Brand: {brand} <button onClick={() => removeFilter("brand")}>x</button></span>}
           <select 
              value={sortBy === "price" ? order : ""} 
              onChange={(e) => {
                 const params = new URLSearchParams(location.search);
                 if (!e.target.value) {
                    params.delete("sort_by");
                    params.delete("order");
                 } else {
                    params.set("sort_by", "price");
                    params.set("order", e.target.value);
                 }
                 navigate({ search: params.toString() });
              }}
              style={{ padding: '5px', borderRadius: '5px', background: '#333', color: 'white', border: 'none' }}
           >
             <option value="">Sort By Relevance</option>
             <option value="desc">Price: High to Low</option>
             <option value="asc">Price: Low to High</option>
           </select>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : products.length > 0 ? (
        <div className="search-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="no-results">No products found.</p>
      )}
    </div>
  );
};

export default SearchResults;
