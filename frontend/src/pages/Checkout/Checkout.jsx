import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../services/currencyService';
import './Checkout.css';

function Checkout() {
  const {
    items,
    subtotal,
    tax,
    serviceFee,
    deliveryFee,
    total,
    rewardPoints,
    clearCart,
  } = useCart();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    fulfillment: 'delivery',
    time: 'asap',
    paymentMethod: 'card',
    notes: '',
  });
  const [placedOrder, setPlacedOrder] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    setPlacedOrder({
      id: `BOE-${Date.now().toString().slice(-6)}`,
      items,
      total,
      fulfillment: formData.fulfillment,
      time: formData.time,
    });
    clearCart();
  };

  if (placedOrder) {
    return (
      <div className="checkout-page">
        <section className="section-shell confirmation">
          <p className="eyebrow">Order received</p>
          <h1>{placedOrder.id}</h1>
          <p>
            Your {placedOrder.fulfillment} order is queued for {placedOrder.time === 'asap' ? 'the next available handoff' : placedOrder.time}.
          </p>
          <div className="confirmation-panel">
            <div>
              <span>Items</span>
              <strong>{placedOrder.items.reduce((sum, item) => sum + item.quantity, 0)}</strong>
            </div>
            <div>
              <span>Total</span>
              <strong>{formatCurrency(placedOrder.total)}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>Received</strong>
            </div>
          </div>
          <div className="confirmation-actions">
            <Link to="/orders" className="btn primary">Track order</Link>
            <Link to="/menu" className="btn secondary">Order more</Link>
          </div>
        </section>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <section className="section-shell empty-checkout">
          <p className="eyebrow">Checkout</p>
          <h1>Your cart is empty.</h1>
          <p>Add dishes before starting checkout.</p>
          <Link to="/menu" className="btn primary">Browse menu</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <section className="section-shell page-heading">
        <p className="eyebrow">Secure handoff</p>
        <h1>Checkout</h1>
      </section>
      
      <div className="checkout-container section-shell">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <h2>Contact</h2>
            
            <div className="form-group">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </section>

          <section className="form-section">
            <h2>Handoff</h2>
            <div className="form-group">
              <label htmlFor="fulfillment">Fulfillment</label>
              <select
                id="fulfillment"
                name="fulfillment"
                value={formData.fulfillment}
                onChange={handleChange}
              >
                <option value="delivery">Delivery</option>
                <option value="pickup">Pickup</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                type="text"
                name="address"
                placeholder={formData.fulfillment === 'pickup' ? 'Optional for pickup' : 'Street address'}
                value={formData.address}
                onChange={handleChange}
                required={formData.fulfillment === 'delivery'}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required={formData.fulfillment === 'delivery'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="zipCode">Zip code</label>
                <input
                  id="zipCode"
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required={formData.fulfillment === 'delivery'}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="time">Pickup or delivery time</label>
              <select id="time" name="time" value={formData.time} onChange={handleChange}>
                <option value="asap">As soon as possible</option>
                <option value="6:30 PM">6:30 PM</option>
                <option value="7:00 PM">7:00 PM</option>
                <option value="7:30 PM">7:30 PM</option>
                <option value="8:00 PM">8:00 PM</option>
              </select>
            </div>
          </section>

          <section className="form-section">
            <h2>Payment</h2>
            
            <div className="form-group">
              <label htmlFor="paymentMethod">Payment method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="card">Card at handoff</option>
                <option value="cash">Cash at handoff</option>
                <option value="wallet">Digital wallet</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Kitchen notes</label>
              <textarea
                id="notes"
                name="notes"
                rows="4"
                placeholder="Allergies, gate code, sauce preferences..."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </section>

          <button type="submit" className="btn-submit">Place order</button>
        </form>

        <div className="order-summary">
          <h2>Order summary</h2>
          <div className="checkout-items">
            {items.map((item) => (
              <div key={item.id}>
                <span>{item.quantity}x {item.name}</span>
                <strong>{formatCurrency(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Service fee</span>
            <span>{formatCurrency(serviceFee)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>{deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}</span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <p className="checkout-rewards">Earn {rewardPoints} points on this order.</p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
