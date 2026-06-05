import React, { useState } from 'react';
import { Search, ChevronRight, Star, History, Plus, Minus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Customers = () => {
  const [customers] = useState([
    { id: 'CUST-001', name: 'Alice Johnson', phone: '+91 9876543210', email: 'alice@example.com', date: '2023-11-15', tier: 'Gold', points: 1250 },
    { id: 'CUST-002', name: 'Bob Smith', phone: '+91 9876543211', email: 'bob@example.com', date: '2024-01-22', tier: 'Silver', points: 450 },
    { id: 'CUST-003', name: 'Charlie Davis', phone: '+91 9876543212', email: 'charlie@example.com', date: '2023-08-05', tier: 'Platinum', points: 3400 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [pointsAdjust, setPointsAdjust] = useState({ amount: 0, reason: '', type: 'add' });

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'Platinum': return 'badge" style="background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3)"';
      case 'Gold': return 'badge badge-warning';
      case 'Silver': return 'badge" style="background: rgba(156, 163, 175, 0.2); color: #d1d5db"';
      default: return 'badge';
    }
  };

  const handlePointsAdjust = (e) => {
    e.preventDefault();
    alert(`Successfully ${pointsAdjust.type === 'add' ? 'added' : 'deducted'} ${pointsAdjust.amount} points ${pointsAdjust.type === 'add' ? 'to' : 'from'} ${selectedCustomer.name}`);
    setPointsAdjust({ amount: 0, reason: '', type: 'add' });
  };

  return (
    <div className="animate-fade-in flex gap-6" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Customers List */}
      <div className="glass-panel" style={{ flex: selectedCustomer ? '1' : '1', transition: 'all 0.3s', display: 'flex', flexDirection: 'column' }}>
        <div className="p-6 border-b" style={{ borderBottomColor: 'var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Customers</h2>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by name, phone or email..." 
              style={{ paddingLeft: '2.5rem', borderRadius: '20px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="table-container" style={{ flex: 1, overflowY: 'auto' }}>
          <table>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-panel)', zIndex: 1 }}>
              <tr>
                <th>Name</th>
                {!selectedCustomer && <th>Contact</th>}
                <th>Tier</th>
                <th>Points</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(customer => (
                <tr 
                  key={customer.id} 
                  onClick={() => setSelectedCustomer(customer)}
                  style={{ cursor: 'pointer', backgroundColor: selectedCustomer?.id === customer.id ? 'rgba(109, 40, 217, 0.1)' : 'transparent' }}
                >
                  <td style={{ fontWeight: 500 }}>
                    {customer.name}
                    {selectedCustomer && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{customer.phone}</div>}
                  </td>
                  {!selectedCustomer && (
                    <td>
                      <div>{customer.phone}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{customer.email}</div>
                    </td>
                  )}
                  <td>
                    <span className={getTierBadge(customer.tier).replace('"', '').replace('"', '')} dangerouslySetInnerHTML={{__html: customer.tier}} style={customer.tier === 'Platinum' ? {background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)'} : customer.tier === 'Silver' ? {background: 'rgba(156, 163, 175, 0.2)', color: '#d1d5db'} : {}}></span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{customer.points}</td>
                  <td><ChevronRight size={18} color="var(--text-muted)" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail View */}
      <AnimatePresence>
        {selectedCustomer && (
          <motion.div 
            initial={{ opacity: 0, x: 50, width: 0 }}
            animate={{ opacity: 1, x: 0, width: '400px' }}
            exit={{ opacity: 0, x: 50, width: 0 }}
            className="glass-panel" 
            style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
          >
            <div className="p-6 border-b flex justify-between items-center" style={{ borderBottomColor: 'var(--border-color)', position: 'sticky', top: 0, backgroundColor: 'var(--bg-panel)', zIndex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Customer Details</h3>
              <button onClick={() => setSelectedCustomer(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                  {selectedCustomer.name.charAt(0)}
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{selectedCustomer.name}</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Member since {selectedCustomer.date}</p>
                <div className="mt-4 flex justify-center gap-4">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tier</div>
                    <div style={{ fontWeight: 600, color: 'var(--warning)' }}>{selectedCustomer.tier}</div>
                  </div>
                  <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }}></div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Points</div>
                    <div style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{selectedCustomer.points}</div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h4 className="flex items-center gap-2 mb-4" style={{ color: 'var(--text-secondary)' }}><Star size={16} /> Adjust Points</h4>
                <form onSubmit={handlePointsAdjust} style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <div className="flex gap-2 mb-4">
                    <button type="button" className={`btn ${pointsAdjust.type === 'add' ? 'btn-success' : 'btn-outline'}`} style={{ flex: 1 }} onClick={() => setPointsAdjust({...pointsAdjust, type: 'add'})}>
                      <Plus size={16} /> Add
                    </button>
                    <button type="button" className={`btn ${pointsAdjust.type === 'subtract' ? 'btn-danger' : 'btn-outline'}`} style={{ flex: 1 }} onClick={() => setPointsAdjust({...pointsAdjust, type: 'subtract'})}>
                      <Minus size={16} /> Deduct
                    </button>
                  </div>
                  <input type="number" className="form-input mb-4" placeholder="Amount" value={pointsAdjust.amount || ''} onChange={(e) => setPointsAdjust({...pointsAdjust, amount: e.target.value})} required min="1" />
                  <input type="text" className="form-input mb-4" placeholder="Reason (e.g. Compensation)" value={pointsAdjust.reason} onChange={(e) => setPointsAdjust({...pointsAdjust, reason: e.target.value})} required />
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Confirm Adjustment</button>
                </form>
              </div>

              <div>
                <h4 className="flex items-center gap-2 mb-4" style={{ color: 'var(--text-secondary)' }}><History size={16} /> Recent Activity</h4>
                <div className="flex-col gap-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} style={{ padding: '1rem', borderLeft: '2px solid var(--accent-primary)', backgroundColor: 'rgba(255,255,255,0.02)', marginBottom: '0.5rem' }}>
                      <div className="flex justify-between mb-1">
                        <span style={{ fontWeight: 500 }}>Order ORD-102{9-i}</span>
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>+45 pts</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 days ago</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Customers;
