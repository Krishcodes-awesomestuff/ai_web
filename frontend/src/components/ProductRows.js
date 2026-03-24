import React from "react";
import ProductCard from "./ProductCard";

function ProductRow({ title, products }) {
  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>{title}</h2>

      <div style={{
        display: "flex",
        overflowX: "auto",
        padding: "10px"
      }}>
        {products.map((p, i) => (
          <ProductCard key={i} product={p} />
        ))}
      </div>
    </div>
  );
}

export default ProductRow;