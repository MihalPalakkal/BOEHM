import React, { useEffect, useState } from 'react';
import { Edit2, Plus, Save, Trash2, X } from 'lucide-react';
import adminService from '../../api/adminService';

const emptyReward = {
  name: '',
  description: '',
  pointsRequired: 100,
  active: true,
};

const Loyalty = () => {
  const [settings, setSettings] = useState({
    earnRate: 10,
    redemptionRate: 1,
    expiryMonths: 12,
    welcomeBonus: 50,
    birthdayBonus: 100,
  });
  const [tiers, setTiers] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [rewardForm, setRewardForm] = useState(emptyReward);
  const [editingReward, setEditingReward] = useState(null);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadLoyalty = async () => {
    try {
      const [tiersRes, rewardsRes] = await Promise.all([
        adminService.getTiers(),
        adminService.getRewards(),
      ]);
      setTiers(tiersRes.data || []);
      setRewards(rewardsRes.data || []);
      setError('');
    } catch {
      setError('Could not load loyalty configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoyalty();
  }, []);

  const showMessage = (nextMessage) => {
    setMessage(nextMessage);
    window.setTimeout(() => setMessage(''), 2200);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showMessage('Local loyalty settings saved for this admin session.');
  };

  const updateTierField = (tierId, field, value) => {
    setTiers((currentTiers) =>
      currentTiers.map((tier) =>
        tier.id === tierId
          ? {
              ...tier,
              [field]: value,
            }
          : tier,
      ),
    );
  };

  const saveTiers = async () => {
    try {
      const responses = await Promise.all(
        tiers.map((tier, index) =>
          adminService.updateTier(tier.id, {
            ...tier,
            minPoints: Number(tier.minPoints || 0),
            maxPoints: tier.maxPoints === '' || tier.maxPoints === null ? null : Number(tier.maxPoints),
            sortOrder: tier.sortOrder || index + 1,
          }),
        ),
      );
      setTiers(responses.map((response) => response.data));
      showMessage('Tier configuration saved.');
    } catch {
      setError('Could not save tier configuration.');
    }
  };

  const openRewardModal = (reward = null) => {
    setEditingReward(reward);
    setRewardForm(
      reward
        ? {
            name: reward.name || '',
            description: reward.description || '',
            pointsRequired: reward.pointsRequired || 0,
            active: Boolean(reward.active),
          }
        : emptyReward,
    );
    setIsRewardModalOpen(true);
  };

  const handleRewardChange = (event) => {
    const { name, value, type, checked } = event.target;
    setRewardForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const saveReward = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        ...rewardForm,
        pointsRequired: Number(rewardForm.pointsRequired),
      };
      const response = editingReward
        ? await adminService.updateReward(editingReward.id, payload)
        : await adminService.createReward(payload);

      setRewards((currentRewards) =>
        editingReward
          ? currentRewards.map((reward) => (reward.id === editingReward.id ? response.data : reward))
          : [...currentRewards, response.data],
      );
      setIsRewardModalOpen(false);
      showMessage(editingReward ? 'Offer updated.' : 'Offer added.');
    } catch {
      setError('Could not save offer.');
    }
  };

  const toggleReward = async (reward) => {
    try {
      const response = await adminService.updateRewardStatus(reward.id, !reward.active);
      setRewards((currentRewards) =>
        currentRewards.map((currentReward) => (currentReward.id === reward.id ? response.data : currentReward)),
      );
    } catch {
      setError('Could not update offer status.');
    }
  };

  return (
    <div className="animate-fade-in flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Loyalty & Rewards Program</h2>
          <p>Edit reward offers and tier thresholds backed by the database.</p>
        </div>
        {message && <span className="badge badge-success">{message}</span>}
      </div>

      {error && <div className="badge badge-danger p-6 justify-center mb-4">{error}</div>}
      {loading && <div className="flex justify-center p-6"><div className="spinner"></div></div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div className="glass-panel p-6">
          <h3 className="mb-4" style={{ fontSize: '1.125rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Global Settings</h3>
          <form onSubmit={handleSaveSettings}>
            <div className="form-group flex items-center justify-between">
              <label className="form-label mb-0">Points Earn Rate (per ₹100)</label>
              <input type="number" className="form-input" style={{ width: '120px' }} value={settings.earnRate} onChange={(e) => setSettings({ ...settings, earnRate: e.target.value })} />
            </div>
            <div className="form-group flex items-center justify-between">
              <label className="form-label mb-0">Redemption Rate (points = ₹1)</label>
              <input type="number" className="form-input" style={{ width: '120px' }} value={settings.redemptionRate} onChange={(e) => setSettings({ ...settings, redemptionRate: e.target.value })} />
            </div>
            <div className="form-group flex items-center justify-between">
              <label className="form-label mb-0">Points Expiry (Months)</label>
              <input type="number" className="form-input" style={{ width: '120px' }} value={settings.expiryMonths} onChange={(e) => setSettings({ ...settings, expiryMonths: e.target.value })} />
            </div>
            <div className="form-group flex items-center justify-between">
              <label className="form-label mb-0">Welcome Bonus Points</label>
              <input type="number" className="form-input" style={{ width: '120px' }} value={settings.welcomeBonus} onChange={(e) => setSettings({ ...settings, welcomeBonus: e.target.value })} />
            </div>
            <div className="form-group flex items-center justify-between mb-6">
              <label className="form-label mb-0">Birthday Bonus Points</label>
              <input type="number" className="form-input" style={{ width: '120px' }} value={settings.birthdayBonus} onChange={(e) => setSettings({ ...settings, birthdayBonus: e.target.value })} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Save size={16} /> Save Settings
            </button>
          </form>
        </div>

        <div className="glass-panel p-6">
          <h3 className="mb-4" style={{ fontSize: '1.125rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Tier Configuration</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Min Points</th>
                  <th>Max Points</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier) => (
                  <tr key={tier.id}>
                    <td>
                      <input className="form-input" value={tier.name} onChange={(event) => updateTierField(tier.id, 'name', event.target.value)} />
                    </td>
                    <td>
                      <input type="number" className="form-input" value={tier.minPoints} onChange={(event) => updateTierField(tier.id, 'minPoints', event.target.value)} />
                    </td>
                    <td>
                      <input type="number" className="form-input" value={tier.maxPoints ?? ''} placeholder="No limit" onChange={(event) => updateTierField(tier.id, 'maxPoints', event.target.value)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-primary mt-4" style={{ width: '100%' }} onClick={saveTiers}>Save Tiers</button>
        </div>
      </div>

      <div className="glass-panel p-6 mt-6">
        <div className="flex justify-between items-center mb-4" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Points-Only Offers</h3>
          <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem' }} onClick={() => openRewardModal()}>
            <Plus size={16} /> Add Offer
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Offer Name</th>
                <th>Description</th>
                <th>Required Points</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((reward) => (
                <tr key={reward.id}>
                  <td style={{ fontWeight: 500 }}>{reward.name}</td>
                  <td>{reward.description}</td>
                  <td style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{reward.pointsRequired} pts</td>
                  <td>
                    <button
                      className={`badge ${reward.active ? 'badge-success' : 'badge-danger'}`}
                      style={{ border: 0, cursor: 'pointer' }}
                      onClick={() => toggleReward(reward)}
                    >
                      {reward.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} onClick={() => openRewardModal(reward)}><Edit2 size={14} /></button>
                      <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => toggleReward({ ...reward, active: true })}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isRewardModalOpen && (
        <div className="modal-backdrop">
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '2rem' }}>
            <div className="flex justify-between items-center mb-4">
              <h3>{editingReward ? 'Edit Offer' : 'Add Offer'}</h3>
              <button onClick={() => setIsRewardModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={saveReward}>
              <div className="form-group">
                <label className="form-label">Offer name</label>
                <input className="form-input" name="name" value={rewardForm.name} onChange={handleRewardChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" name="description" value={rewardForm.description} onChange={handleRewardChange} rows="3" />
              </div>
              <div className="form-group">
                <label className="form-label">Required points</label>
                <input className="form-input" type="number" min="1" name="pointsRequired" value={rewardForm.pointsRequired} onChange={handleRewardChange} />
              </div>
              <label className="form-group flex items-center gap-2">
                <input type="checkbox" name="active" checked={rewardForm.active} onChange={handleRewardChange} />
                <span>Active offer</span>
              </label>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" className="btn btn-outline" onClick={() => setIsRewardModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Offer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loyalty;
