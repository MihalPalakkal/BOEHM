import React from 'react';
import './LoyaltyCard.css';

function LoyaltyCard({ reward, userPoints = 0, onRedeem }) {
  const canRedeem = userPoints >= reward.pointsRequired;

  return (
    <article className="loyalty-card">
      <div className="card-header">
        <h3>{reward.name}</h3>
        <span className="points-badge">{reward.pointsRequired} pts</span>
      </div>
      
      <p className="card-description">{reward.description}</p>
      
      <button
        className="btn-redeem"
        type="button"
        disabled={!canRedeem}
        onClick={() => onRedeem?.(reward)}
      >
        {canRedeem ? 'Redeem' : 'Keep earning'}
      </button>
    </article>
  );
}

export default LoyaltyCard;
