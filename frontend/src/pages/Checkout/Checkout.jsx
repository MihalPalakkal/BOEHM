import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency, getRewardPoints } from '../../services/currencyService';
import orderService from '../../services/orderService';
import authService from '../../services/authService';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import './Checkout.css';

const onlyDigits = (value, maxLength) => value.replace(/\D/g, '').slice(0, maxLength);
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function Checkout() {
  const { user } = useAuth();
  const {
    items,
    subtotal,
    tax,
    serviceFee,
    deliveryFee,
    total,
    rewardPoints,
    clearCart,
    removeItem,
    updateQuantity,
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
    paymentMethod: 'upi_cash_on_delivery',
    notes: '',
  });
  const [placedOrder, setPlacedOrder] = useState(null);
  const [orderSnapshot, setOrderSnapshot] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorRef = useRef(null);

  useEffect(() => {
    const autofillContact = async () => {
      const currentUser = user || authService.getCurrentUser();

      if (!currentUser?.id) return;

      setFormData((currentData) => ({
        ...currentData,
        fullName: currentData.fullName || currentUser.name || '',
        email: currentData.email || currentUser.email || '',
      }));

      try {
        const response = await userService.getUserProfile(currentUser.id);
        const profile = response.data || {};

        setFormData((currentData) => ({
          ...currentData,
          fullName: currentData.fullName || profile.name || currentUser.name || '',
          email: currentData.email || profile.email || currentUser.email || '',
          phone: currentData.phone || onlyDigits(profile.phone || '', 10),
        }));
      } catch {
        // Checkout should still work when profile autofill is unavailable.
      }
    };

    autofillContact();
  }, [user]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue =
      name === 'phone'
        ? onlyDigits(value, 10)
        : name === 'zipCode'
          ? onlyDigits(value, 6)
          : value;

    setFormData({
      ...formData,
      [name]: nextValue,
    });
  };

  const showCheckoutError = (message, fieldId) => {
    setError(message);
    window.requestAnimationFrame(() => {
      const field = fieldId ? document.getElementById(fieldId) : null;
      if (field) {
        field.focus();
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const validateCheckout = () => {
    if (!formData.fullName.trim()) {
      return { message: 'Enter your full name.', fieldId: 'fullName' };
    }

    if (!isValidEmail(formData.email.trim())) {
      return { message: 'Enter a valid email address.', fieldId: 'email' };
    }

    if (formData.phone.length !== 10) {
      return { message: 'Enter a valid 10-digit phone number.', fieldId: 'phone' };
    }

    if (formData.fulfillment === 'delivery') {
      if (!formData.address.trim()) {
        return { message: 'Enter your delivery address.', fieldId: 'address' };
      }

      if (!formData.city.trim()) {
        return { message: 'Enter your city.', fieldId: 'city' };
      }

      if (formData.zipCode.length !== 6) {
        return { message: 'Enter a valid 6-digit PIN code.', fieldId: 'zipCode' };
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setError('');

    const validationError = validateCheckout();
    if (validationError) {
      showCheckoutError(validationError.message, validationError.fieldId);
      return;
    }

    const currentUser = authService.getCurrentUser();
    const token = authService.getToken();
    if (!currentUser?.id || !token) {
      showCheckoutError('Please sign in before placing an order.');
      return;
    }

    try {
      setIsSubmitting(true);
      const snapshot = {
        itemCount,
        total,
        rewardPoints,
        items: items.map((item) => ({ ...item })),
      };
      const orderPayload = {
        userId: currentUser.id,
        totalAmount: total,
        deliveryAddress:
          formData.fulfillment === 'delivery'
            ? `${formData.address.trim()}, ${formData.city.trim()}, ${formData.zipCode}`
            : null,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes.trim(),
        estimatedDeliveryAt: null,
        items: items.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
          notes: '',
        })),
      };

      const response = await orderService.createOrder(orderPayload);
      const newOrder = response.data;

      setOrderSnapshot(snapshot);
      setPlacedOrder(newOrder);
      clearCart();
    } catch (orderError) {
      const status = orderError?.response?.status;
      const nextMessage =
        status === 401
          ? 'Your session expired. Please sign in again before placing the order.'
          : orderError?.response?.data?.error || 'Could not place order. Please try again.';
      showCheckoutError(nextMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="checkout-page">
        <section className="section-shell confirmation">
          <p className="eyebrow">Order received</p>
          <h1>#{placedOrder.id}</h1>
          <p>Your order is queued and being prepared.</p>
          <div className="confirmation-panel">
            <div>
              <span>Items</span>
              <strong>{orderSnapshot?.itemCount || 0}</strong>
            </div>
            <div>
              <span>Total</span>
              <strong>{formatCurrency(orderSnapshot?.total || 0)}</strong>
            </div>
            <div>
              <span>Rewards</span>
              <strong>{orderSnapshot?.rewardPoints || 0} pts</strong>
            </div>
          </div>
          <div className="confirmation-actions">
            <Link to="/orders" className="btn primary">
              Track order
            </Link>
            <Link to="/menu" className="btn secondary">
              Order more
            </Link>
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
          <Link to="/menu" className="btn primary">
            Browse menu
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <section className="section-shell page-heading">
        <div>
          <p className="eyebrow">Secure handoff</p>
          <h1>Checkout</h1>
        </div>
        <Link to="/cart" className="text-link">
          Back to cart
        </Link>
      </section>

      <div className="checkout-container section-shell">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          {error && <p className="form-status error">{error}</p>}

          <section className="form-section">
            <h2>Contact</h2>
            <div className="form-group">
              <label htmlFor="fullName">Full name</label>
              <input id="fullName" type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength="10"
                placeholder="10-digit mobile number"
                required
              />
            </div>
          </section>

          <section className="form-section">
            <h2>Handoff</h2>
            <div className="form-group">
              <label htmlFor="fulfillment">Fulfillment</label>
              <select id="fulfillment" name="fulfillment" value={formData.fulfillment} onChange={handleChange}>
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
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength="6"
                  placeholder="6-digit PIN code"
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
                <option value="upi_cash_on_delivery">UPI/Cash on delivery</option>
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

          {error && (
            <p ref={errorRef} className="form-status error checkout-submit-status">
              {error}
            </p>
          )}
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Placing order...' : 'Place order'}
          </button>
        </form>

        <div className="order-summary">
          <h2>Order summary</h2>
          <div className="checkout-items">
            {items.map((item) => (
              <article key={item.id} className="checkout-item">
                <div>
                  <span>{item.name}</span>
                  <small>
                    {formatCurrency(item.price)} each - {getRewardPoints(item.price * item.quantity)} pts
                  </small>
                </div>
                <div className="checkout-item-actions">
                  <button
                    type="button"
                    aria-label={`Decrease ${item.name}`}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <strong>{item.quantity}</strong>
                  <button
                    type="button"
                    aria-label={`Increase ${item.name}`}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <strong>{formatCurrency(item.price * item.quantity)}</strong>
                <button
                  className="checkout-remove"
                  type="button"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
          <Link to="/cart" className="text-link">
            Edit full cart
          </Link>
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
