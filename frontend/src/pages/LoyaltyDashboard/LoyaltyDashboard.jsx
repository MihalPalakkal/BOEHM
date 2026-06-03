import React, { useState } from 'react';
import LoyaltyCard from '../../components/LoyaltyCard/LoyaltyCard';
import './LoyaltyDashboard.css';

function LoyaltyDashboard() {
  const [message, setMessage] = useState('');
  const [loyalty] = React.useState({
    points: 2450,
    tier: 'Gold',
    nextTier: 'Platinum',
    pointsNeeded: 3000,
    rewards: [
      { id: 1, name: 'Free Drink', pointsRequired: 150, description: 'Any zero-proof spritz or iced tea.' },
      { id: 2, name: '₹150 Off', pointsRequired: 500, description: 'Apply to pickup or delivery orders.' },
      { id: 3, name: 'Free Dessert', pointsRequired: 750, description: 'Chocolate cake or rotating dessert.' },
      { id: 4, name: 'Priority Handoff', pointsRequired: 1200, description: 'Move one pickup order to priority prep.' },
      { id: 5, name: 'Dinner Credit', pointsRequired: 3000, description: '₹1,000 credit for your next table-size order.' },
    ]
  });
  const progress = Math.min((loyalty.points / loyalty.pointsNeeded) * 100, 100);

  const handleRedeem = (reward) => {
    setMessage(`${reward.name} is ready to apply at checkout.`);
  };

  return (
    <div className="loyalty-dashboard">
      <section className="loyalty-hero section-shell">
        <div>
          <p className="eyebrow">BOEHM rewards</p>
          <h1>Loyalty dashboard</h1>
          <p>Earn one point per ₹10 and unlock direct-ordering perks.</p>
        </div>

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
            <h2>{Math.max(loyalty.pointsNeeded - loyalty.points, 0)}</h2>
            <p>Points to {loyalty.nextTier}</p>
          </div>
        </div>
      </section>

      <section className="section-shell loyalty-progress">
        <div className="progress-label">
          <span>{loyalty.tier}</span>
          <span>{loyalty.nextTier}</span>
        </div>
        <div className="progress-bar" aria-label={`${Math.round(progress)} percent to ${loyalty.nextTier}`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="rewards-section section-shell">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Redeem</p>
            <h2>Available rewards</h2>
          </div>
          {message && <span className="reward-message">{message}</span>}
        </div>
        <div className="rewards-grid">
          {loyalty.rewards.map((reward) => (
            <LoyaltyCard
              key={reward.id}
              reward={reward}
              userPoints={loyalty.points}
              onRedeem={handleRedeem}
            />
          ))}
        </div>
      </section>

      <section className="tiers-section section-shell">
        <div className="section-heading">
          <p className="eyebrow">Milestones</p>
          <h2>Loyalty tiers</h2>
        </div>
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
