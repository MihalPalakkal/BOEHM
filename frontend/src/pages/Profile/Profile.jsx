import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { menuItems } from '../../services/menuService';
import { formatCurrency } from '../../services/currencyService';
import { useCart } from '../../context/CartContext';
import authService from '../../services/authService';
import userService from '../../services/userService';
import './Profile.css';

function Profile() {
  const { addItem } = useCart();
  const [user, setUser] = useState(null);
  const favoriteItems = menuItems.slice(0, 3);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  return (
    <div className="profile-page">
      <section className="section-shell page-heading">
        <p className="eyebrow">Account</p>
        <h1>Profile</h1>
      </section>

      <div className="profile-container section-shell">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {(user?.name || 'User')
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="profile-info">
              <h2>{user?.name || 'Guest'}</h2>
              <p>{user?.tier || 'Bronze'} Member</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <label>Email</label>
              <p>{user?.email || '-'}</p>
            </div>

            <div className="detail-item">
              <label>Phone</label>
              <p>{user?.phone || '-'}</p>
            </div>

            <div className="detail-item">
              <label>Default address</label>
              <p>{user?.address || '-'}</p>
            </div>

            <div className="detail-item">
              <label>Loyalty points</label>
              <p className="loyalty-points">{user?.loyaltyPoints || 0}</p>
            </div>
          </div>

          <div className="preference-chips">
            {(user?.preferences || ['No plastic cutlery', 'Text updates', 'Leave at door']).map(
              (preference) => (
                <span key={preference}>{preference}</span>
              )
            )}
          </div>

          <button className="btn-edit" type="button">
            Edit profile
          </button>
        </div>

        <div className="profile-sidebar">
          <div className="settings-card">
            <h3>Quick links</h3>
            <ul>
              <li>
                <Link to="/orders">Order history</Link>
              </li>
              <li>
                <Link to="/loyalty">Loyalty rewards</Link>
              </li>
              <li>
                <Link to="/cart">Current cart</Link>
              </li>
              <li>
                <Link to="/menu">Browse menu</Link>
              </li>
            </ul>
          </div>

          <div className="settings-card">
            <h3>Favorites</h3>
            <div className="profile-favorites">
              {favoriteItems.map((item) => (
                <button key={item.id} type="button" onClick={() => addItem(item)}>
                  <img src={item.image} alt="" />
                  <span>
                    <strong>{item.name}</strong>
                    <small>{formatCurrency(item.price)}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;