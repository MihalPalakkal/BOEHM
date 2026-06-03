import React from 'react';
import { formatCurrency } from '../../services/currencyService';
import './CartItem.css';

function CartItem({ item, onRemove, onUpdateQuantity }) {
  return (
    <article className="cart-item">
      <img className="cart-item-image" src={item.image} alt={item.name} />

      <div className="item-details">
        <h3>{item.name}</h3>
        <p>{item.category} - {item.prepTime}</p>
        <p className="item-price">{formatCurrency(item.price)}</p>
      </div>
      
      <div className="item-quantity">
        <button
          type="button"
          aria-label={`Decrease ${item.name}`}
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        >
          -
        </button>
        <span aria-label={`${item.quantity} in cart`}>{item.quantity}</span>
        <button
          type="button"
          aria-label={`Increase ${item.name}`}
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          +
        </button>
      </div>

      <div className="item-total">
        <p>{formatCurrency(item.price * item.quantity)}</p>
      </div>

      <button 
        className="btn-remove"
        type="button"
        onClick={() => onRemove(item.id)}
      >
        Remove
      </button>
    </article>
  );
}

export default CartItem;
