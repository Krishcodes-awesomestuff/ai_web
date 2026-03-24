import React from "react";
import ProductCard from "./ProductCard";
import "./ProductRow.css";

const ProductRow = ({ title, products = [] }) => {
  return (
    <div className="row">
      <h2 className="row-title">{title}</h2>
      <div className="row-posters">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductRow;
