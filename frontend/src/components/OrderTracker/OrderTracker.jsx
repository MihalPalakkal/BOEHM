import React from 'react';
import { formatCurrency } from '../../services/currencyService';
import './OrderTracker.css';

const DB_STATUS_MAP = {
  pending: 'Received',
  confirmed: 'Received',
  preparing: 'Preparing',
  ready: 'Ready',
  out_for_delivery: 'Ready',
  delivered: 'Completed',
  cancelled: 'Cancelled',
};

const statusSteps = ['Received', 'Preparing', 'Ready', 'Completed'];

function OrderTracker({ order }) {
  const displayStatus = DB_STATUS_MAP[order.status] || order.status || 'Received';

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'completed';
      case 'Preparing':
      case 'Ready':
      case 'Received':
        return 'in-progress';
      case 'Cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  const activeStep = Math.max(statusSteps.indexOf(displayStatus), 0);

  // Format date from createdAt or date
  const orderDate = order.createdAt || order.date || '';
  const formattedDate = orderDate
    ? new Date(orderDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  // Fulfillment type
  const fulfillment = order.fulfillment || (order.deliveryAddress ? 'Delivery' : 'Pickup');

  // Format total
  const total = order.total || (order.totalAmount != null ? formatCurrency(order.totalAmount) : '');

  // Normalise items: can be objects (from API) or plain strings (legacy)
  const itemNames = Array.isArray(order.items)
    ? order.items.map((item) => (typeof item === 'string' ? item : item.name || `Item #${item.menuItemId}`))
    : [];

  return (
    <article className="order-tracker">
      <div className="tracker-header">
        <div className="order-id">
          <h3>#{order.id}</h3>
          <p>
            {formattedDate}
            {fulfillment ? ` — ${fulfillment}` : ''}
          </p>
        </div>
        <span className={`status-badge ${getStatusColor(displayStatus)}`}>
          {displayStatus}
        </span>
      </div>

      <div className="tracker-body">
        <div className="tracker-items">
          {itemNames.map((name, i) => (
            <span key={i}>{name}</span>
          ))}
        </div>

        {displayStatus !== 'Cancelled' && (
          <div className="progress-track" aria-label={`Order status ${displayStatus}`}>
            {statusSteps.map((step, index) => (
              <span
                key={step}
                className={index <= activeStep || displayStatus === 'Completed' ? 'complete' : ''}
              >
                {step}
              </span>
            ))}
          </div>
        )}

        <div className="tracker-footer">
          <p className="order-total">
            Total: <strong>{total}</strong>
          </p>
        </div>
      </div>
    </article>
  );
}

export default OrderTracker;
