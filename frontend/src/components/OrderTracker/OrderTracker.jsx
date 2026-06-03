import React from 'react';
import './OrderTracker.css';

const statusSteps = ['Received', 'Preparing', 'Ready', 'Completed'];

function OrderTracker({ order }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed':
        return 'completed';
      case 'In Progress':
      case 'Preparing':
      case 'Ready':
      case 'Received':
        return 'in-progress';
      case 'Pending':
        return 'pending';
      case 'Cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  const activeStep = Math.max(statusSteps.indexOf(order.status), 0);

  return (
    <article className="order-tracker">
      <div className="tracker-header">
        <div className="order-id">
          <h3>{order.id}</h3>
          <p>{order.date} - {order.fulfillment}</p>
        </div>
        <span className={`status-badge ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>
      
      <div className="tracker-body">
        <div className="tracker-items">
          {order.items.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="progress-track" aria-label={`Order status ${order.status}`}>
          {statusSteps.map((step, index) => (
            <span
              key={step}
              className={index <= activeStep || order.status === 'Completed' ? 'complete' : ''}
            >
              {step}
            </span>
          ))}
        </div>

        <div className="tracker-footer">
          <p className="order-total">Total: <strong>{order.total}</strong></p>
          <button className="btn-view-details" type="button">View details</button>
        </div>
      </div>
    </article>
  );
}

export default OrderTracker;
