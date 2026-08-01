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
            Please pay with <strong>{paymentMethod ?? 'your selected method'}</strong> when
            you pick up your order.
          </p>
        </div>
      </div>

      <Footer instagramUrl="https://www.instagram.com/thelilobean" />
    </div>
  );
}
