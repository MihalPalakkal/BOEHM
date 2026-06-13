import React, { useEffect, useMemo, useState } from 'react';
import { Search, ChevronRight, Star, History, Plus, Minus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import adminService from '../../api/adminService';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'No orders yet';

const formatPayment = (method) => {
  const labels = {
    card: 'Card',
    upi: 'UPI',
    upi_cash_after_delivery: 'UPI/Cash after delivery',
    upi_cash_on_delivery: 'UPI/Cash on delivery',
  };

  return labels[method] || method || 'Not selected';
};

const getTierStyle = (tier) => {
  if (tier === 'Platinum') {
    return {
      background: 'rgba(168, 85, 247, 0.2)',
      color: '#c084fc',
      border: '1px solid rgba(168, 85, 247, 0.3)',
    };
  }

  if (tier === 'Silver') {
    return {
      background: 'rgba(156, 163, 175, 0.2)',
      color: '#d1d5db',
    };
  }

  if (tier === 'Gold') return {};

  return {
    background: 'rgba(16, 185, 129, 0.15)',
    color: 'var(--success)',
  };
};

const getTierClass = (tier) => (tier === 'Gold' ? 'badge badge-warning' : 'badge');

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [pointsAdjust, setPointsAdjust] = useState({ amount: '', reason: '', type: 'add' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await adminService.getCustomers();
        setCustomers(response.data || []);
      } catch {
        setError('Could not load customers.');
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return customers;

    return customers.filter((customer) => {
      const text = `${customer.name} ${customer.email} ${customer.phone}`;
      return text.toLowerCase().includes(query);
    });
  }, [customers, searchTerm]);

  useEffect(() => {
    if (!selectedCustomer) return;
    const updatedCustomer = customers.find((customer) => customer.id === selectedCustomer.id);
    if (updatedCustomer) setSelectedCustomer(updatedCustomer);
  }, [customers, selectedCustomer]);

  const showMessage = (nextMessage) => {
    setMessage(nextMessage);
    window.setTimeout(() => setMessage(''), 2200);
  };

  const handlePointsAdjust = async (event) => {
    event.preventDefault();
    if (!selectedCustomer) return;

    try {
      setAdjusting(true);
      setError('');
      const response = await adminService.adjustCustomerPoints(selectedCustomer.id, {
        ...pointsAdjust,
        amount: Number(pointsAdjust.amount),
      });
      const updatedCustomer = response.data;

      setCustomers((currentCustomers) =>
        currentCustomers.map((customer) =>
          customer.id === updatedCustomer.id ? updatedCustomer : customer,
        ),
      );
      setSelectedCustomer(updatedCustomer);
      setPointsAdjust({ amount: '', reason: '', type: 'add' });
      showMessage('Customer points updated.');
    } catch {
      setError('Could not adjust customer points.');
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <div className="animate-fade-in flex gap-6" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="glass-panel" style={{ flex: 1, transition: 'all 0.3s', display: 'flex', flexDirection: 'column' }}>
        <div className="p-6 border-b" style={{ borderBottomColor: 'var(--border-color)' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Customers</h2>
            {message && <span className="badge badge-success">{message}</span>}
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="search"
              className="form-input"
              placeholder="Search by name, phone or email..."
              style={{ paddingLeft: '2.5rem', borderRadius: '20px' }}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        {error && <div className="badge badge-danger p-6 justify-center">{error}</div>}
        {loading && <div className="flex justify-center p-6"><div className="spinner"></div></div>}

        <div className="table-container" style={{ flex: 1, overflowY: 'auto' }}>
          <table>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-panel)', zIndex: 1 }}>
              <tr>
                <th>Name</th>
                {!selectedCustomer && <th>Contact</th>}
                <th>Orders</th>
                <th>Tier</th>
                <th>Points</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  style={{ cursor: 'pointer', backgroundColor: selectedCustomer?.id === customer.id ? 'rgba(109, 40, 217, 0.1)' : 'transparent' }}
                >
                  <td style={{ fontWeight: 500 }}>
                    {customer.name}
                    {selectedCustomer && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        {customer.phone || 'No phone'}
                      </div>
                    )}
                  </td>
                  {!selectedCustomer && (
                    <td>
                      <div>{customer.phone || 'No phone'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{customer.email}</div>
                    </td>
                  )}
                  <td>
                    <div>{customer.orderCount}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{formatCurrency(customer.totalSpend)}</div>
                  </td>
                  <td>
                    <span className={getTierClass(customer.tier)} style={getTierStyle(customer.tier)}>
                      {customer.tier}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{customer.points}</td>
                  <td><ChevronRight size={18} color="var(--text-muted)" /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filteredCustomers.length === 0 && (
            <div className="text-muted p-6">No customers found.</div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedCustomer && (
          <motion.div
            initial={{ opacity: 0, x: 50, width: 0 }}
            animate={{ opacity: 1, x: 0, width: '420px' }}
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
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{selectedCustomer.name}</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Member since {formatDate(selectedCustomer.memberSince)}</p>
                <p style={{ color: 'var(--text-secondary)' }}>{selectedCustomer.email}</p>
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
                  <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }}></div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Orders</div>
                    <div style={{ fontWeight: 600 }}>{selectedCustomer.orderCount}</div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h4 className="flex items-center gap-2 mb-4" style={{ color: 'var(--text-secondary)' }}><Star size={16} /> Adjust Points</h4>
                <form onSubmit={handlePointsAdjust} style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <div className="flex gap-2 mb-4">
                    <button type="button" className={`btn ${pointsAdjust.type === 'add' ? 'btn-success' : 'btn-outline'}`} style={{ flex: 1 }} onClick={() => setPointsAdjust({ ...pointsAdjust, type: 'add' })}>
                      <Plus size={16} /> Add
                    </button>
                    <button type="button" className={`btn ${pointsAdjust.type === 'subtract' ? 'btn-danger' : 'btn-outline'}`} style={{ flex: 1 }} onClick={() => setPointsAdjust({ ...pointsAdjust, type: 'subtract' })}>
                      <Minus size={16} /> Deduct
                    </button>
                  </div>
                  <input type="number" className="form-input mb-4" placeholder="Amount" value={pointsAdjust.amount} onChange={(event) => setPointsAdjust({ ...pointsAdjust, amount: event.target.value })} required min="1" />
                  <input type="text" className="form-input mb-4" placeholder="Reason (e.g. Compensation)" value={pointsAdjust.reason} onChange={(event) => setPointsAdjust({ ...pointsAdjust, reason: event.target.value })} required />
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={adjusting}>
                    {adjusting ? 'Saving...' : 'Confirm Adjustment'}
                  </button>
                </form>
              </div>

              <div>
                <h4 className="flex items-center gap-2 mb-4" style={{ color: 'var(--text-secondary)' }}><History size={16} /> Recent Activity</h4>
                <div className="flex-col gap-4">
                  {(selectedCustomer.recentOrders || []).length === 0 && (
                    <div className="text-muted">No orders yet.</div>
                  )}
                  {(selectedCustomer.recentOrders || []).map((order) => (
                    <div key={order.id} style={{ padding: '1rem', borderLeft: '2px solid var(--accent-primary)', backgroundColor: 'rgba(255,255,255,0.02)', marginBottom: '0.5rem' }}>
                      <div className="flex justify-between mb-1">
                        <span style={{ fontWeight: 500 }}>Order #{order.id}</span>
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>{formatCurrency(order.totalAmount)}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {formatDate(order.createdAt)} - {order.status.replaceAll('_', ' ')} - {formatPayment(order.paymentMethod)}
                      </div>
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
