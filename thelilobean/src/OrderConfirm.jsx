import React from 'react';
import './LiloBean.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useCart } from './Cart';

export default function OrderConfirmationPage() {
  const { paymentMethod } = useCart();

  return (
    <div className="lb-page">
      <Header />

      <div className="lb-payment-wrap">
        <div className="lb-payment-card">
          <h1 className="lb-payment-title">Order Received!</h1>
          <p className="lb-confirmation-text">
            Please pay with {paymentMethod ?? 'your selected method'} when
            you pick up your order.
          </p>
          <p className="lb-confirmation-text">
            Contact us <a href="https://www.instagram.com/thelilobean" target="_blank" rel="noopener noreferrer" style={{ color: '#7a4a2d', fontWeight: 'bold' }}>@thelilobean</a> on Instagram for pickup details and for any questions about your order. We look forward to seeing you soon!
          </p>
        </div>
      </div>

      <Footer instagramUrl="https://www.instagram.com/thelilobean" />
    </div>
  );
}
