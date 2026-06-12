import React from 'react';
import { formatCurrency, getRewardPoints } from '../../services/currencyService';
import './ProductCard.css';

function ProductCard({ product, onAddToCart, quantity = 0, compact = false }) {
  return (
    <article className={`product-card ${compact ? 'compact' : ''}`}>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <span style={{ '--accent': product.accent }} className="product-category">
          {product.category}
        </span>
      </div>

      <div className="product-details">
        <div>
          <h3>{product.name}</h3>
          <p className="description">{product.description}</p>
        </div>

        <div className="product-meta" aria-label={`${product.prepTime} preparation time`}>
          <span>{product.prepTime}</span>
          <span>{product.calories} cal</span>
          <span>{getRewardPoints(product.price)} pts</span>
        </div>

        <div className="product-tags">
          {product.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="product-footer">
          <p className="price">{formatCurrency(product.price)}</p>
          <button className="btn-add" type="button" onClick={() => onAddToCart(product)}>
            {quantity > 0 ? `Add again (${quantity})` : 'Add'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
