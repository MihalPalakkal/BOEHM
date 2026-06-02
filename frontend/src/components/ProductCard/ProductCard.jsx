import React from 'react';
import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-details">
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        <p className="price">${product.price}</p>
        <button className="btn-add" onClick={() => onAddToCart(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
