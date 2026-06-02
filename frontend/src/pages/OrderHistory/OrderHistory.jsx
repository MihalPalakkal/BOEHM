import React from 'react';
import OrderTracker from '../../components/OrderTracker/OrderTracker';
import './OrderHistory.css';

function OrderHistory() {
  const [orders] = React.useState([
    { id: 'ORD001', date: '2024-06-01', total: '$35.97', status: 'Completed' },
    { id: 'ORD002', date: '2024-05-28', total: '$42.50', status: 'Completed' },
    { id: 'ORD003', date: '2024-05-25', total: '$28.75', status: 'Completed' }
  ]);

  return (
    <div className="order-history-page">
      <h1>Order History</h1>
      
      <div className="orders-container">
        {orders.length === 0 ? (
          <p className="no-orders">No orders yet</p>
        ) : (
          orders.map(order => (
            <OrderTracker key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
