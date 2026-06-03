import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { featuredItems, menuItems } from '../../services/menuService';
import { formatCurrency } from '../../services/currencyService';
import { useCart } from '../../context/CartContext';
import './Home.css';

function Home() {
  const { addItem, itemCount, total, freeDeliveryRemaining } = useCart();
  const todayPicks = menuItems.slice(3, 6);

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="section-shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Direct ordering from the BOEHM kitchen</p>
            <h1>Order tonight's table favorites in a few taps.</h1>
            <p>
              Pickup or delivery, live INR pricing, rewards on every order, and a menu
              designed for fast decisions.
            </p>

            <div className="hero-actions">
              <Link className="btn primary" to="/menu">Start order</Link>
              <Link className="btn secondary" to="/loyalty">View rewards</Link>
            </div>
          </div>

          <aside className="instant-order-panel" aria-label="Current cart">
            <div>
              <span className="panel-kicker">Current cart</span>
              <strong>{itemCount} items</strong>
            </div>
            <p className="panel-total">{formatCurrency(total)}</p>
            <p>
              {itemCount > 0 && freeDeliveryRemaining > 0
                ? `${formatCurrency(freeDeliveryRemaining)} from free delivery`
                : 'Free delivery threshold reached'}
            </p>
            <Link className="btn dark" to={itemCount > 0 ? '/checkout' : '/menu'}>
              {itemCount > 0 ? 'Checkout' : 'Build cart'}
            </Link>
          </aside>
        </div>
      </section>

      <section className="section-shell home-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Most ordered</p>
            <h2>Kitchen signatures</h2>
          </div>
          <Link to="/menu" className="text-link">Full menu</Link>
        </div>

        <div className="featured-grid">
          {featuredItems.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addItem} compact />
          ))}
        </div>
      </section>

      <section className="section-shell service-strip" aria-label="Ordering promises">
        <div>
          <strong>18-24 min</strong>
          <span>average handoff</span>
        </div>
        <div>
          <strong>8 tiers</strong>
          <span>menu categories</span>
        </div>
        <div>
          <strong>1 point</strong>
          <span>per ₹10 ordered</span>
        </div>
        <div>
          <strong>₹799</strong>
          <span>free delivery threshold</span>
        </div>
      </section>

      <section className="section-shell home-section two-column">
        <div className="kitchen-note">
          <p className="eyebrow">Tonight's board</p>
          <h2>Fresh, fast, and built for direct ordering.</h2>
          <p>
            BOEHM keeps the menu tight enough to scan quickly and deep enough for a
            proper dinner order. Browse by mood, add favorites, and keep the cart
            visible from first bite to checkout.
          </p>
        </div>

        <div className="today-picks">
          {todayPicks.map((item) => (
            <button key={item.id} type="button" onClick={() => addItem(item)}>
              <img src={item.image} alt="" />
              <span>
                <strong>{item.name}</strong>
                <small>{formatCurrency(item.price)} - {item.prepTime}</small>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
