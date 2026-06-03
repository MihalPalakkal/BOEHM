import React, { useState } from 'react';
import { Save, Plus, Edit2, Trash2 } from 'lucide-react';

const Loyalty = () => {
  const [settings, setSettings] = useState({
    earnRate: 10, // points per 100 spent
    redemptionRate: 1, // points per 1 rs
    expiryMonths: 12,
    welcomeBonus: 50,
    birthdayBonus: 100,
  });

  const [tiers, setTiers] = useState([
    { id: 1, name: 'Silver', threshold: 0, multiplier: 1.0 },
    { id: 2, name: 'Gold', threshold: 5000, multiplier: 1.5 },
    { id: 3, name: 'Platinum', threshold: 15000, multiplier: 2.0 },
  ]);

  const [offers, setOffers] = useState([
    { id: 1, name: 'Free Vanilla Shake', menuItem: 'Vanilla Shake', points: 150, active: true },
    { id: 2, name: 'Secret Menu Access', menuItem: 'Secret Menu Item', points: 500, active: true },
  ]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    // axiosInstance.patch('/admin/loyalty/settings', settings)
    alert('Loyalty settings saved successfully!');
  };

  return (
    <div className="animate-fade-in flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Loyalty & Rewards Program</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Global Settings */}
        <div className="glass-panel p-6">
          <h3 className="mb-4" style={{ fontSize: '1.125rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Global Settings</h3>
          <form onSubmit={handleSaveSettings}>
            <div className="form-group flex items-center justify-between">
              <label className="form-label mb-0">Points Earn Rate (per ₹100)</label>
              <input type="number" className="form-input" style={{ width: '120px' }} value={settings.earnRate} onChange={e => setSettings({...settings, earnRate: e.target.value})} />
            </div>
            <div className="form-group flex items-center justify-between">
              <label className="form-label mb-0">Redemption Rate (points = ₹1)</label>
              <input type="number" className="form-input" style={{ width: '120px' }} value={settings.redemptionRate} onChange={e => setSettings({...settings, redemptionRate: e.target.value})} />
            </div>
            <div className="form-group flex items-center justify-between">
              <label className="form-label mb-0">Points Expiry (Months)</label>
              <input type="number" className="form-input" style={{ width: '120px' }} value={settings.expiryMonths} onChange={e => setSettings({...settings, expiryMonths: e.target.value})} />
            </div>
            <div className="form-group flex items-center justify-between">
              <label className="form-label mb-0">Welcome Bonus Points</label>
              <input type="number" className="form-input" style={{ width: '120px' }} value={settings.welcomeBonus} onChange={e => setSettings({...settings, welcomeBonus: e.target.value})} />
            </div>
            <div className="form-group flex items-center justify-between mb-6">
              <label className="form-label mb-0">Birthday Bonus Points</label>
              <input type="number" className="form-input" style={{ width: '120px' }} value={settings.birthdayBonus} onChange={e => setSettings({...settings, birthdayBonus: e.target.value})} />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Save size={16} /> Save Settings
            </button>
          </form>
        </div>

        {/* Tier Configuration */}
        <div className="glass-panel p-6">
          <h3 className="mb-4" style={{ fontSize: '1.125rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Tier Configuration</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Spend Threshold (₹)</th>
                  <th>Earn Multiplier</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map(tier => (
                  <tr key={tier.id}>
                    <td style={{ fontWeight: 600, color: tier.name === 'Platinum' ? '#c084fc' : tier.name === 'Gold' ? 'var(--warning)' : '#d1d5db' }}>
                      {tier.name}
                    </td>
                    <td>
                      <input type="number" className="form-input" style={{ width: '100px', padding: '0.25rem 0.5rem' }} value={tier.threshold} onChange={() => {}} />
                    </td>
                    <td>
                      <input type="number" step="0.1" className="form-input" style={{ width: '80px', padding: '0.25rem 0.5rem' }} value={tier.multiplier} onChange={() => {}} /> x
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-primary mt-4" style={{ width: '100%' }}>Save Tiers</button>
        </div>
      </div>

      {/* Points-Only Offers */}
      <div className="glass-panel p-6 mt-6">
        <div className="flex justify-between items-center mb-4" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Points-Only Offers</h3>
          <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem' }}><Plus size={16} /> Add Offer</button>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Offer Name</th>
                <th>Linked Menu Item</th>
                <th>Required Points</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map(offer => (
                <tr key={offer.id}>
                  <td style={{ fontWeight: 500 }}>{offer.name}</td>
                  <td>{offer.menuItem}</td>
                  <td style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{offer.points} pts</td>
                  <td>
                    <span className={`badge ${offer.active ? 'badge-success' : 'badge-danger'}`}>
                      {offer.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }}><Edit2 size={14} /></button>
                      <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Loyalty;
