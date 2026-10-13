import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LiloBean.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useCart } from './Cart';
import { useMenuData } from './MenuDataContext';
import { placeOrder } from './lib/orders';

const PAYMENT_METHODS = ['Zelle', 'Apple Cash', 'Cash'];

// Formats digits as (555) 123-4567 while the user types
function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function PaymentPage() {
  const { items, setPaymentMethod, clearCart } = useCart();
  const { drinks, customizeCategories } = useMenuData();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    paymentMethod: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'phone' ? formatPhone(value) : value,
    }));
  };

  // Items added straight from the drink detail page never went through
  // Customize, so they have no selections/shots. Record the actual
  // defaults so the saved order tells the whole story (e.g. 2 shots on
  // an espresso drink, not 0).
  const withDefaults = (item) => {
    if (item.selections) return item;
    const drink = drinks[item.slug];
    return {
      ...item,
      selections: Object.fromEntries(
        customizeCategories.map((c) => [c.label, c.options[0]])
      ),
      shots: drink?.category === 'Espresso' ? 2 : 0,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || items.length === 0) return;

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();

    if (!firstName || !lastName) {
      setError('Please enter your first and last name.');
      return;
    }
    if (form.phone.replace(/\D/g, '').length !== 10) {
      setError('Please enter a 10-digit phone number.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const orderId = await placeOrder({
        firstName,
        lastName,
        phone: form.phone,
        paymentMethod: form.paymentMethod,
        items: items.map(withDefaults),
      });
      setPaymentMethod(form.paymentMethod);
      clearCart();
      navigate('/order-confirmation', { state: { orderId, firstName } });
    } catch (err) {
      console.error('Failed to place order:', err);
      setError("We couldn't place your order. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="lb-page">
      <Header />

      <div className="lb-payment-wrap">
        <div className="lb-payment-card">
          <h1 className="lb-payment-title">Pickup<br />Details</h1>

          {items.length === 0 && !submitting && (
            <p className="lb-confirmation-text" style={{ marginBottom: 24 }}>
              Your cart is empty.
            </p>
          )}

          <form className="lb-form" onSubmit={handleSubmit} noValidate>
            <div className="lb-form-row">
              <div className="lb-field">
                <label className="lb-label" htmlFor="firstName">First Name</label>
                <input
                  className="lb-input"
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  maxLength={60}
                  required
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="lb-field">
                <label className="lb-label" htmlFor="lastName">Last Name</label>
                <input
                  className="lb-input"
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  maxLength={60}
                  required
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="lb-field">
              <label className="lb-label" htmlFor="phone">Phone Number</label>
              <input
                className="lb-input"
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="(555) 123-4567"
                required
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="lb-field">
              <label className="lb-label" htmlFor="paymentMethod">Form of Payment</label>
              <div className="lb-select-wrap">
                <select
                  className="lb-select"
                  id="paymentMethod"
                  name="paymentMethod"
                  required
                  value={form.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select one</option>
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p className="lb-form-error" role="alert">{error}</p>}

            <div className="lb-form-actions">
              <button
                className="lb-btn"
                type="submit"
                disabled={submitting || items.length === 0 || !form.paymentMethod}
              >
                {submitting ? 'Placing Order…' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer instagramUrl="https://www.instagram.com/thelilobean" />
    </div>
  );
}
