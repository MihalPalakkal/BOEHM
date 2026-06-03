import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    event.currentTarget.reset();
  };

  return (
    <footer className="footer" aria-label="Restaurant information">
      <div className="footer-container section-shell">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            BOEHM
          </Link>
          <p>
            Direct ordering from the BOEHM kitchen with pickup, delivery, rewards, and
            order tracking in one place.
          </p>
        </div>

        <div className="footer-section">
          <h4>Order</h4>
          <ul>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/orders">Order history</Link></li>
            <li><Link to="/loyalty">Rewards</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Hours</h4>
          <p>Mon-Thu: 11:00 AM - 10:00 PM</p>
          <p>Fri-Sat: 11:00 AM - 11:30 PM</p>
          <p>Sun: 12:00 PM - 9:00 PM</p>
        </div>

        <form className="footer-signup" onSubmit={handleNewsletterSubmit}>
          <h4>Kitchen notes</h4>
          <label htmlFor="footer-email">Newsletter email</label>
          <div>
            <input id="footer-email" type="email" placeholder="you@example.com" required />
            <button type="submit">Join</button>
          </div>
        </form>
      </div>

      <div className="footer-bottom section-shell">
        <p>BOEHM Restaurant. Direct ordering frontend.</p>
        <p>info@boehm.com - +91 98765 43210</p>
      </div>
    </footer>
  );
}

export default Footer;
