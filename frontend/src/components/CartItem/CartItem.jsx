import React from 'react';
import './CartItem.css';

function CartItem({ item, onRemove, onUpdateQuantity }) {
  return (
    <div className="cart-item">
      <div className="item-details">
        <h3>{item.name}</h3>
        <p className="item-price">${item.price.toFixed(2)}</p>
      </div>
      
      <div className="item-quantity">
        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
      </div>

      <div className="item-total">
        <p>${(item.price * item.quantity).toFixed(2)}</p>
      </div>

      <button 
        className="btn-remove"
        onClick={() => onRemove(item.id)}
      >
        Remove
      </button>
    </div>
  );
}

export default CartItem;
