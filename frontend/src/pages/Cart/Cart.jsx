import React, { useState } from 'react';
import CartItem from '../../components/CartItem/CartItem';
import './Cart.css';

function Cart() {
  const [items, setItems] = useState([
    { id: 1, name: 'Burger Deluxe', price: 12.99, quantity: 1 },
    { id: 2, name: 'Caesar Salad', price: 8.99, quantity: 2 },
  ]);

  const handleRemove = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id, quantity) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      
      {items.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))}
          </div>
          
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${(total * 0.1).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${(total * 1.1).toFixed(2)}</span>
            </div>
            <a href="/checkout" className="btn btn-checkout">Proceed to Checkout</a>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
