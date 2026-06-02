import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          BOEHM
        </Link>
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/menu" className="nav-link">Menu</Link>
          <Link to="/cart" className="nav-link">Cart</Link>
          <Link to="/orders" className="nav-link">Orders</Link>
          <Link to="/loyalty" className="nav-link">Loyalty</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          <Link to="/login" className="nav-link btn-login">Login</Link>
        </div>
        <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
