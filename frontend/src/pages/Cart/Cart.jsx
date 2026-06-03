import React from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../../components/CartItem/CartItem';
import ProductCard from '../../components/ProductCard/ProductCard';
import { menuItems } from '../../services/menuService';
import { formatCurrency } from '../../services/currencyService';
import { useCart } from '../../context/CartContext';
import './Cart.css';

function Cart() {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    subtotal,
    tax,
    serviceFee,
    deliveryFee,
    total,
    freeDeliveryRemaining,
    rewardPoints,
  } = useCart();

  const suggestedItems = menuItems
    .filter((menuItem) => !items.some((cartItem) => cartItem.id === menuItem.id))
    .slice(0, 3);

  return (
    <div className="cart-page">
      <section className="section-shell page-heading">
        <p className="eyebrow">Your order</p>
        <h1>Cart</h1>
      </section>
      
      <section className="section-shell cart-layout">
        {items.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is ready when you are.</h2>
            <p>Start with a signature dish, then checkout for pickup or delivery.</p>
            <Link to="/menu" className="btn primary">Browse menu</Link>
          </div>
        ) : (
          <div className="cart-items">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeItem}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>
        )}

        <aside className="cart-summary">
          <h2>Order summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Service fee</span>
            <span>{formatCurrency(serviceFee)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>{deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}</span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>

          {freeDeliveryRemaining > 0 && (
            <p className="cart-note">
              Add {formatCurrency(freeDeliveryRemaining)} more for free delivery.
            </p>
          )}

          <p className="cart-note">Earn {rewardPoints} reward points with this order.</p>
          <Link
            to={items.length > 0 ? '/checkout' : '/menu'}
            className={`btn ${items.length > 0 ? 'primary' : 'secondary'}`}
          >
            {items.length > 0 ? 'Proceed to checkout' : 'Add dishes'}
          </Link>
        </aside>
      </section>

      {suggestedItems.length > 0 && (
        <section className="section-shell cart-suggestions">
          <div className="section-heading split">
            <div>
              <p className="eyebrow">Pairs well</p>
              <h2>Round out the order</h2>
            </div>
          </div>

          <div className="featured-grid">
            {suggestedItems.map((item) => (
              <ProductCard key={item.id} product={item} onAddToCart={addItem} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Cart;
