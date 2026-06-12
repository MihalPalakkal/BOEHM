import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { menuItems } from '../../services/menuService';
import { formatCurrency } from '../../services/currencyService';
import { useCart } from '../../context/CartContext';
import authService from '../../services/authService';
import userService from '../../services/userService';
import loyaltyService from '../../services/loyaltyService';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

function Profile() {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const favoriteItems = menuItems.slice(0, 3);

  const [profile, setProfile] = useState(null);
  const [loyaltyData, setLoyaltyData] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const [profileRes, loyaltyRes] = await Promise.all([
          userService.getUserProfile(user.id),
          loyaltyService.getUserPoints(user.id),
        ]);
        setProfile(profileRes.data);
        setLoyaltyData(loyaltyRes.data);
      } catch (err) {
        console.error('Failed to load profile:', err.message);
      }
    };

    loadProfile();
  }, [user, navigate]);

  const displayName = profile?.name || user?.name || 'Guest';
  const displayEmail = profile?.email || user?.email || '-';
  const displayPhone = profile?.phone || '-';
  const displayTier = loyaltyData?.tier || 'Bronze';
  const displayPoints = loyaltyData?.points ?? 0;

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
              {displayName
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="profile-info">
              <h2>{displayName}</h2>
              <p>{displayTier} Member</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <label>Email</label>
              <p>{displayEmail}</p>
            </div>

            <div className="detail-item">
              <label>Phone</label>
              <p>{displayPhone}</p>
            </div>

            <div className="detail-item">
              <label>Loyalty points</label>
              <p className="loyalty-points">{displayPoints}</p>
            </div>
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