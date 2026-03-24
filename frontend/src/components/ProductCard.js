import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image_url} alt={product.name} className="product-card-img" />
      <div className="product-card-info">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-brand">
          <Link to={`/search?brand=${encodeURIComponent(product.brand)}`} style={{ color: '#aaa', textDecoration: 'none' }}>
            {product.brand}
          </Link>
        </p>
        <p className="product-card-price">₹ {(product.price * 83).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <div className="product-card-rating">
          <span>⭐ {product.rating}</span>
        </div>
      </div>
      <div className="product-card-overlay">
        <button className="btn btn-primary">View Details</button>
        {product.product_url && (
          <a href={product.product_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ marginTop: '10px', textDecoration: 'none', textAlign: 'center' }}>
            Buy Now
          </a>
        )}
      </div>
    </div>
  );
};

export default ProductCard;