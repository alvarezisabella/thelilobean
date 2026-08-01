import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LiloBean.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useCart } from './Cart';

const PAYMENT_METHODS = ['Zelle', 'Apple Cash', 'Cash'];

export default function PaymentPage() {
  const { setPaymentMethod } = useCart();
  const navigate = useNavigate();

  const choose = (method) => {
    setPaymentMethod(method);
    navigate('/order-confirmation');
  };

  return (
    <div className="lb-page">
      <Header />

      <div className="lb-payment-wrap">
        <div className="lb-payment-card">
          <h1 className="lb-payment-title">Choose<br />Payment Method</h1>
          <div className="lb-payment-options">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method}
                className="lb-payment-btn"
                onClick={() => choose(method)}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Footer instagramUrl="https://www.instagram.com/thelilobean" />
    </div>
  );
}
