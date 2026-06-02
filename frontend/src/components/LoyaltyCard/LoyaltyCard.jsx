import React from 'react';
import './LoyaltyCard.css';

function LoyaltyCard({ reward }) {
  return (
    <div className="loyalty-card">
      <div className="card-header">
        <h3>{reward.name}</h3>
        <span className="points-badge">{reward.pointsRequired} pts</span>
      </div>
      
      <p className="card-description">{reward.description}</p>
      
      <button className="btn-redeem">Redeem</button>
    </div>
  );
}

export default LoyaltyCard;
