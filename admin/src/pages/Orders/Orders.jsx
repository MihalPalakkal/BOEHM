import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Clock, MapPin, Search } from 'lucide-react';
import adminService from '../../api/adminService';

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Received', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Ready', value: 'ready' },
  { label: 'Out for Delivery', value: 'out_for_delivery' },
  { label: 'Delivered', value: 'delivered' },
];

const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];

const formatStatus = (status) =>
  statusOptions.find((option) => option.value === status)?.label || status.replaceAll('_', ' ');

const formatPayment = (method) => {
  const labels = {
    card: 'Card',
    upi: 'UPI',
    upi_cash_after_delivery: 'UPI/Cash after delivery',
    upi_cash_on_delivery: 'UPI/Cash on delivery',
  };

  return labels[method] || method || 'Not selected';
};

const getStatusBadge = (status) => {
  if (status === 'delivered') return 'badge badge-success';
  if (status === 'cancelled') return 'badge badge-danger';
  if (status === 'pending') return 'badge badge-warning';
  return 'badge badge-info';
};

const getNextStatus = (status) => {
  const currentIndex = statusFlow.indexOf(status);
  return currentIndex >= 0 ? statusFlow[currentIndex + 1] : null;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setError('');
      const response = await adminService.getOrders({
        status: statusFilter,
        search: query.trim(),
      });
      setOrders(response.data || []);
    } catch {
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  }, [query, statusFilter]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const response = await adminService.updateOrderStatus(orderId, newStatus);
      setOrders((currentOrders) =>
        currentOrders.map((order) => (order.id === orderId ? response.data : order)),
      );
    } catch {
      setError('Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const visibleOrders = useMemo(() => orders, [orders]);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
          {statusOptions.map((status) => (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`btn ${statusFilter === status.value ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '20px' }}
            >
              {status.label}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="search"
            className="form-input"
            placeholder="Search order, customer, address..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={{ paddingLeft: '2.5rem', borderRadius: '20px' }}
          />
        </div>
      </div>

      {loading && <div className="flex justify-center p-6"><div className="spinner"></div></div>}
      {error && <div className="badge badge-danger p-6 w-full justify-center mb-4">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence>
          {visibleOrders.map((order) => {
            const nextStatus = getNextStatus(order.status);
            const itemText = order.items?.length
              ? order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ')
              : 'No line items';

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel"
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>#{order.id}</span>
                  <span className={getStatusBadge(order.status)}>{formatStatus(order.status)}</span>
                </div>

                <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>{order.customerName}</h3>

                <div className="flex-col gap-2 mb-4" style={{ flex: 1 }}>
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <Clock size={16} />
                    {new Date(order.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    <MapPin size={16} />
                    {order.deliveryAddress || 'Pickup'}
                  </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 500 }}>{itemText}</p>
                  <p style={{ fontWeight: 600, color: 'var(--success)' }}>₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                    Payment: {formatPayment(order.paymentMethod)}
                  </p>
                </div>

                <div className="flex gap-2 mt-auto">
                  {nextStatus ? (
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                      disabled={updatingId === order.id}
                      onClick={() => handleStatusUpdate(order.id, nextStatus)}
                    >
                      {nextStatus === 'delivered' && <CheckCircle size={16} />}
                      Mark {formatStatus(nextStatus)}
                    </button>
                  ) : (
                    <button className="btn btn-outline" style={{ width: '100%' }} disabled>
                      Completed
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {visibleOrders.length === 0 && !loading && (
        <div className="flex justify-center items-center p-6 text-muted" style={{ height: '200px' }}>
          No orders found.
        </div>
      )}
    </div>
  );
};

export default Orders;
