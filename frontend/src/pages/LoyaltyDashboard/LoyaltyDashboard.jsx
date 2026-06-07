import React, { useEffect, useState } from 'react';
import LoyaltyCard from '../../components/LoyaltyCard/LoyaltyCard';
import loyaltyService from '../../services/loyaltyService';
import authService from '../../services/authService';
import './LoyaltyDashboard.css';

function LoyaltyDashboard() {
  const [message, setMessage] = useState('');
  const [loyalty, setLoyalty] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [tiers, setTiers] = useState([]);

  useEffect(() => {
    const loadLoyalty = async () => {
      const user = authService.getCurrentUser();
      if (!user?.id) return;

      try {
        const [loyaltyRes, rewardsRes, tiersRes] = await Promise.all([
          loyaltyService.getUserLoyalty(user.id),
          loyaltyService.getRewards(user.id),
          loyaltyService.getLoyaltyTiers(),
        ]);

        setLoyalty(loyaltyRes.data);
        setRewards(rewardsRes.data || []);
        setTiers(tiersRes.data || []);
      } catch {
        setMessage('Could not load loyalty data.');
      }
    };

    loadLoyalty();
  }, []);

  const handleRedeem = async (reward) => {
    try {
      const user = authService.getCurrentUser();
      if (!user?.id) return;

      await loyaltyService.redeemReward(user.id, reward.rewardId || reward.id);
      setMessage(`${reward.name} redeemed successfully.`);
    } catch {
      setMessage('Could not redeem this reward.');
    }
  };

  const currentTier = loyalty?.tier || 'Bronze';
  const currentPoints = loyalty?.points || 0;

  const nextTier = tiers.find((tier) => tier.minPoints > currentPoints) || tiers[tiers.length - 1] || null;
  const pointsNeeded = nextTier ? Math.max(nextTier.minPoints - currentPoints, 0) : 0;
  const progress = nextTier ? Math.min((currentPoints / nextTier.minPoints) * 100, 100) : 100;

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
            <h2>{currentPoints}</h2>
            <p>Current Points</p>
          </div>
          <div className="stat">
            <h2>{currentTier}</h2>
            <p>Member Tier</p>
          </div>
          <div className="stat">
            <h2>{pointsNeeded}</h2>
            <p>Points to {nextTier?.name || 'next tier'}</p>
          </div>
        </div>
      </section>

      <section className="section-shell loyalty-progress">
        <div className="progress-label">
          <span>{currentTier}</span>
          <span>{nextTier?.name || currentTier}</span>
        </div>
        <div className="progress-bar" aria-label={`${Math.round(progress)} percent to next tier`}>
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
          {rewards.map((reward) => (
            <LoyaltyCard
              key={reward.id}
              reward={reward}
              userPoints={currentPoints}
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
          {tiers.map((tier) => (
            <div key={tier.id} className={`tier ${tier.name.toLowerCase()}`}>
              <h3>{tier.name}</h3>
              <p>
                {tier.maxPoints === null
                  ? `${tier.minPoints}+ Points`
                  : `${tier.minPoints} - ${tier.maxPoints} Points`}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LoyaltyDashboard;