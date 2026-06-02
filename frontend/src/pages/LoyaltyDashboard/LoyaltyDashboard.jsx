import React from 'react';
import LoyaltyCard from '../../components/LoyaltyCard/LoyaltyCard';
import './LoyaltyDashboard.css';

function LoyaltyDashboard() {
  const [loyalty] = React.useState({
    points: 2450,
    tier: 'Gold',
    nextTier: 'Platinum',
    pointsNeeded: 7550,
    rewards: [
      { id: 1, name: 'Free Drink', pointsRequired: 50, description: 'Get a free beverage' },
      { id: 2, name: '$5 Off', pointsRequired: 100, description: 'Receive $5 off' },
      { id: 3, name: 'Free Dessert', pointsRequired: 75, description: 'Complimentary dessert' }
    ]
  });

  return (
    <div className="loyalty-dashboard">
      <h1>Loyalty Program</h1>
      
      <div className="loyalty-header">
        <div className="loyalty-stats">
          <div className="stat">
            <h2>{loyalty.points}</h2>
            <p>Current Points</p>
          </div>
          <div className="stat">
            <h2>{loyalty.tier}</h2>
            <p>Member Tier</p>
          </div>
          <div className="stat">
            <h2>{loyalty.pointsNeeded - loyalty.points}</h2>
            <p>Points to {loyalty.nextTier}</p>
          </div>
        </div>
      </div>

      <section className="rewards-section">
        <h2>Available Rewards</h2>
        <div className="rewards-grid">
          {loyalty.rewards.map(reward => (
            <LoyaltyCard key={reward.id} reward={reward} />
          ))}
        </div>
      </section>

      <section className="tiers-section">
        <h2>Loyalty Tiers</h2>
        <div className="tiers-info">
          <div className="tier bronze">
            <h3>Bronze</h3>
            <p>0 - 999 Points</p>
          </div>
          <div className="tier silver">
            <h3>Silver</h3>
            <p>1,000 - 4,999 Points</p>
          </div>
          <div className="tier gold">
            <h3>Gold</h3>
            <p>5,000 - 9,999 Points</p>
          </div>
          <div className="tier platinum">
            <h3>Platinum</h3>
            <p>10,000+ Points</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LoyaltyDashboard;
