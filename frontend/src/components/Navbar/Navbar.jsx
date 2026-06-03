import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/orders', label: 'Orders' },
  { to: '/loyalty', label: 'Rewards' },
  { to: '/profile', label: 'Profile' },
  { to: '/menu-manager', label: 'Manage' },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Primary navigation">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-mark">B</span>
          <span>
            BOEHM
            <small>direct kitchen</small>
          </span>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-actions">
          <NavLink to="/cart" className="cart-link" onClick={closeMenu}>
            <span>Cart</span>
            <strong>{itemCount}</strong>
          </NavLink>
          <NavLink to="/login" className="account-link" onClick={closeMenu}>
            Sign in
          </NavLink>
          <button
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
