import React from 'react';
import './OrderTracker.css';

function OrderTracker({ order }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed':
        return 'completed';
      case 'In Progress':
        return 'in-progress';
      case 'Pending':
        return 'pending';
      case 'Cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  return (
    <div className="order-tracker">
      <div className="tracker-header">
        <div className="order-id">
          <h3>{order.id}</h3>
          <p>{order.date}</p>
        </div>
        <span className={`status-badge ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>
      
      <div className="tracker-body">
        <p className="order-total">Total: <strong>{order.total}</strong></p>
        <button className="btn-view-details">View Details</button>
      </div>
    </div>
  );
}

export default OrderTracker;
