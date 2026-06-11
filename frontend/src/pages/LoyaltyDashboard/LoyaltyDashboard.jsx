import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoyaltyCard from '../../components/LoyaltyCard/LoyaltyCard';
import loyaltyService from '../../services/loyaltyService';
import authService from '../../services/authService';
import './LoyaltyDashboard.css';

function LoyaltyDashboard() {
  const [message, setMessage] = useState('');
  const [loyalty, setLoyalty] = useState(null);
  const [catalogue, setCatalogue] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const loadLoyalty = async () => {
      const user = authService.getCurrentUser();
      if (!user?.id) {
        setIsLoggedIn(false);
        // Still load public data (tiers, catalogue)
        try {
          const [tiersRes, catalogueRes] = await Promise.all([
            loyaltyService.getLoyaltyTiers(),
            loyaltyService.getRewardsCatalogue(),
          ]);
          setTiers(tiersRes.data || []);
          setCatalogue(catalogueRes.data || []);
        } catch {
          // silent
        }
        return;
      }

      try {
        const [loyaltyRes, tiersRes, catalogueRes] = await Promise.all([
          loyaltyService.getUserLoyalty(user.id),
          loyaltyService.getLoyaltyTiers(),
          loyaltyService.getRewardsCatalogue(),
        ]);

        setLoyalty(loyaltyRes.data);
        setTiers(tiersRes.data || []);
        setCatalogue(catalogueRes.data || []);
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

      await loyaltyService.redeemReward(user.id, reward.id);
      setMessage(`${reward.name} redeemed successfully.`);

      // Refresh loyalty data
      const loyaltyRes = await loyaltyService.getUserLoyalty(user.id);
      setLoyalty(loyaltyRes.data);
    } catch {
      setMessage('Could not redeem this reward.');
    }
  };

  const currentTier = loyalty?.tier || 'Bronze';
  const currentPoints = loyalty?.points || 0;

  const nextTier =
    tiers.find((tier) => tier.minPoints > currentPoints) ||
    tiers[tiers.length - 1] ||
    null;
  const pointsNeeded = nextTier
    ? Math.max(nextTier.minPoints - currentPoints, 0)
    : 0;
  const progress = nextTier
    ? Math.min((currentPoints / nextTier.minPoints) * 100, 100)
    : 100;

  return (
    <div className="loyalty-dashboard">
      <section className="loyalty-hero section-shell">
        <div>
          <p className="eyebrow">BOEHM rewards</p>
          <h1>Loyalty dashboard</h1>
          <p>Earn one point per ₹10 and unlock direct-ordering perks.</p>
        </div>

        {isLoggedIn ? (
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
        ) : (
          <div className="loyalty-stats">
            <p>
              <Link to="/login">Sign in</Link> to see your points and redeem
              rewards.
            </p>
          </div>
        )}
      </section>

      {isLoggedIn && (
        <section className="section-shell loyalty-progress">
          <div className="progress-label">
            <span>{currentTier}</span>
            <span>{nextTier?.name || currentTier}</span>
          </div>
          <div
            className="progress-bar"
            aria-label={`${Math.round(progress)} percent to next tier`}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
        </section>
      )}

      <section className="rewards-section section-shell">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Redeem</p>
            <h2>Available rewards</h2>
          </div>
          {message && <span className="reward-message">{message}</span>}
        </div>

        <div className="rewards-grid">
          {catalogue.map((reward) => (
            <LoyaltyCard
              key={reward.id}
              reward={reward}
              userPoints={currentPoints}
              onRedeem={isLoggedIn ? handleRedeem : undefined}
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
                  : `${tier.minPoints} – ${tier.maxPoints} Points`}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LoyaltyDashboard;