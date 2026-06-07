import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrderTracker from '../../components/OrderTracker/OrderTracker';
import { findMenuItem } from '../../services/menuService';
import { useCart } from '../../context/CartContext';
import orderService from '../../services/orderService';
import authService from '../../services/authService';
import './OrderHistory.css';

function OrderHistory() {
  const { addItem } = useCart();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      const user = authService.getCurrentUser();
      if (!user?.id) {
        setOrders([]);
        return;
      }

      try {
        const response = await orderService.getOrders(user.id);
        setOrders(response.data || []);
      } catch {
        setStatus({ type: 'error', message: 'Could not load order history.' });
      }
    };

    loadOrders();
  }, []);

  const reorder = (order) => {
    const ids = order.items?.map((item) => item.menuItemId ?? item.id) || order.menuItemIds || [];
    ids.map(findMenuItem).filter(Boolean).forEach(addItem);
  };

  return (
    <div className="order-history-page">
      <section className="section-shell page-heading split">
        <div>
          <p className="eyebrow">Orders</p>
          <h1>Order history</h1>
        </div>
        <Link className="btn secondary" to="/menu">
          New order
        </Link>
      </section>

      <div className="orders-container section-shell">
        {status && <p className={`form-status ${status.type}`}>{status.message}</p>}

        {orders.length === 0 ? (
          <div className="no-orders">
            <h2>No orders yet</h2>
            <p>Your BOEHM orders will appear here after checkout.</p>
            <Link className="btn primary" to="/menu">
              Browse menu
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div className="order-history-card" key={order.id}>
              <OrderTracker order={order} />
              <button type="button" className="btn-reorder" onClick={() => reorder(order)}>
                Reorder
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OrderHistory;