import React from 'react';
import { Link } from 'react-router-dom';
import OrderTracker from '../../components/OrderTracker/OrderTracker';
import { findMenuItem } from '../../services/menuService';
import { useCart } from '../../context/CartContext';
import './OrderHistory.css';

function OrderHistory() {
  const { addItem } = useCart();
  const [orders] = React.useState([
    {
      id: 'BOE-492118',
      date: 'Today, 7:14 PM',
      total: '₹587',
      status: 'Preparing',
      fulfillment: 'Delivery',
      items: ['Smash Burger Royale', 'Truffle Parm Fries'],
      menuItemIds: [1, 7],
    },
    {
      id: 'BOE-488903',
      date: 'May 31, 2026',
      total: '₹1,124',
      status: 'Completed',
      fulfillment: 'Pickup',
      items: ['Wood Fired Margherita', 'Roasted Beet Salad', 'Blood Orange Spritz'],
      menuItemIds: [3, 6, 9],
    },
    {
      id: 'BOE-473611',
      date: 'May 24, 2026',
      total: '₹704',
      status: 'Completed',
      fulfillment: 'Delivery',
      items: ['Charred Chicken Bowl', 'Chocolate Olive Oil Cake'],
      menuItemIds: [2, 8],
    },
  ]);

  const reorder = (order) => {
    order.menuItemIds
      .map(findMenuItem)
      .filter(Boolean)
      .forEach(addItem);
  };

  return (
    <div className="order-history-page">
      <section className="section-shell page-heading split">
        <div>
          <p className="eyebrow">Orders</p>
          <h1>Order history</h1>
        </div>
        <Link className="btn secondary" to="/menu">New order</Link>
      </section>
      
      <div className="orders-container section-shell">
        {orders.length === 0 ? (
          <div className="no-orders">
            <h2>No orders yet</h2>
            <p>Your BOEHM orders will appear here after checkout.</p>
            <Link className="btn primary" to="/menu">Browse menu</Link>
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
