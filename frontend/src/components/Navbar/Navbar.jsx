import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const generalNavItems = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
];

const authenticatedNavItems = [
  { to: '/orders', label: 'Orders' },
  { to: '/loyalty', label: 'Rewards' },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const navItems = user 
    ? [...generalNavItems, ...authenticatedNavItems]
    : generalNavItems;

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
          
          {user ? (
            <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <NavLink to="/profile" className="account-link" onClick={closeMenu}>
                Hi, {user.name ? user.name.split(' ')[0] : 'User'}
              </NavLink>
              <button onClick={handleLogout} className="account-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                Sign out
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="account-link" onClick={closeMenu}>
              Sign in
            </NavLink>
          )}

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
