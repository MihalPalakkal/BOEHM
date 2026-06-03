import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, CheckCircle, Search, Filter } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Dummy fetch (replace with real polling or websocket)
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      // const res = await axiosInstance.get('/admin/orders');
      // setOrders(res.data);
      
      // Mock data for UI development
      const mockOrders = [
        { id: 'ORD-1029', customerName: 'Alice Johnson', items: '2x Burger, 1x Fries', total: 450, address: '123 Main St, Apt 4B', timestamp: new Date().toISOString(), status: 'Received' },
        { id: 'ORD-1028', customerName: 'Bob Smith', items: '1x Pizza, 2x Coke', total: 600, address: '456 Elm St', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), status: 'Preparing' },
        { id: 'ORD-1027', customerName: 'Charlie Davis', items: '3x Pasta', total: 750, address: '789 Oak Ave', timestamp: new Date(Date.now() - 35 * 60000).toISOString(), status: 'Out for Delivery' },
      ];
      setOrders(mockOrders);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      // await axiosInstance.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredOrders = statusFilter === 'All' ? orders : orders.filter(o => o.status === statusFilter);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Received': return 'badge badge-warning';
      case 'Preparing': return 'badge badge-info';
      case 'Out for Delivery': return 'badge badge-info'; // Use custom styling inline later if needed
      case 'Delivered': return 'badge badge-success';
      default: return 'badge';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          {['All', 'Received', 'Preparing', 'Out for Delivery', 'Delivered'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`btn ${statusFilter === status ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '20px' }}
            >
              {status}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" className="form-input" placeholder="Search orders..." style={{ paddingLeft: '2.5rem', borderRadius: '20px' }} />
        </div>
      </div>

      {loading && <div className="flex justify-center p-6"><div className="spinner"></div></div>}
      {error && <div className="badge badge-danger p-6 w-full justify-center mb-4">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence>
          {filteredOrders.map(order => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel"
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}
            >
              <div className="flex justify-between items-center mb-4">
                <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{order.id}</span>
                <span className={getStatusBadge(order.status)}>{order.status}</span>
              </div>
              
              <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>{order.customerName}</h3>
              
              <div className="flex-col gap-2 mb-4" style={{ flex: 1 }}>
                <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <Clock size={16} />
                  {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  <MapPin size={16} />
                  {order.address}
                </div>
              </div>
              
              <div style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 500 }}>{order.items}</p>
                <p style={{ fontWeight: 600, color: 'var(--success)' }}>₹{order.total}</p>
              </div>
              
              <div className="flex gap-2 mt-auto">
                {order.status === 'Received' && (
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleStatusUpdate(order.id, 'Preparing')}>
                    Mark as Preparing
                  </button>
                )}
                {order.status === 'Preparing' && (
                  <button className="btn btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #a855f7, #6366f1)' }} onClick={() => handleStatusUpdate(order.id, 'Out for Delivery')}>
                    Out for Delivery
                  </button>
                )}
                {order.status === 'Out for Delivery' && (
                  <button className="btn btn-success" style={{ width: '100%' }} onClick={() => handleStatusUpdate(order.id, 'Delivered')}>
                    <CheckCircle size={16} /> Delivered
                  </button>
                )}
                {order.status === 'Delivered' && (
                  <button className="btn btn-outline" style={{ width: '100%' }} disabled>
                    Completed
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {filteredOrders.length === 0 && !loading && (
        <div className="flex justify-center items-center p-6 text-muted" style={{ height: '200px' }}>
          No orders found.
        </div>
      )}
    </div>
  );
};

export default Orders;
