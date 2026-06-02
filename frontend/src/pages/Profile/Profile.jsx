import React from 'react';
import './Profile.css';

function Profile() {
  const [user] = React.useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
    loyaltyPoints: 2450,
    tier: 'Gold'
  });

  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">JD</div>
            <div className="profile-info">
              <h2>{user.name}</h2>
              <p>{user.tier} Member</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <label>Email:</label>
              <p>{user.email}</p>
            </div>

            <div className="detail-item">
              <label>Phone:</label>
              <p>{user.phone}</p>
            </div>

            <div className="detail-item">
              <label>Address:</label>
              <p>{user.address}</p>
            </div>

            <div className="detail-item">
              <label>Loyalty Points:</label>
              <p className="loyalty-points">{user.loyaltyPoints}</p>
            </div>
          </div>

          <button className="btn-edit">Edit Profile</button>
        </div>

        <div className="profile-sidebar">
          <div className="settings-card">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/orders">Order History</a></li>
              <li><a href="/loyalty">Loyalty Rewards</a></li>
              <li><a href="#">Preferences</a></li>
              <li><a href="#">Payment Methods</a></li>
              <li><a href="#">Addresses</a></li>
            </ul>
          </div>

          <div className="settings-card">
            <h3>Account</h3>
            <ul>
              <li><a href="#">Security Settings</a></li>
              <li><a href="#">Notifications</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
