import React, { useState } from 'react';
import './LiloBean.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

/* ============================================================
   1. SIZE SELECTOR
   ============================================================ */
export function SizeSelector({ sizes, selected, onSelect }) {
  return (
    <div className="lb-size-options">
      {sizes.map((size) => (
        <button
          key={size.label}
          className={`lb-size-swatch${selected === size.label ? ' is-selected' : ''}`}
          onClick={() => onSelect(size.label)}
        >
          <span className="lb-size-circle">
            <img src={size.imageUrl} alt={`${size.label} cup`} />
          </span>
          <span className="lb-size-label">{size.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ============================================================
   2. WHAT'S INCLUDED LIST
   ============================================================ */
export function IncludedList({ items }) {
  return (
    <ul className="lb-included-list">
      {items.map((item) => (
        <li key={item} className="lb-included-item">
          <span className="lb-heart-icon" aria-hidden="true">♡</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ============================================================
   3. FULL DRINK DETAIL PAGE
   ============================================================ */
export default function DrinkDetailPage({
  name,
  imageUrl,
  sizes = [],
  included = [],
  onCustomizeClick,
  onAddToOrder,
}) {
  const [selectedSize, setSelectedSize] = useState(sizes[0]?.label);

  return (
    <div className="lb-page">
      <Header />

      <section className="lb-drink-hero">
        <img className="lb-drink-hero-img" src={imageUrl} alt={name} />
        <h1 className="lb-drink-hero-name">{name}</h1>
      </section>

      <div className="lb-drink-body">
        <div>
          <h2 className="lb-drink-col-heading">Size</h2>
          <div className="lb-detail-divider">
            <span className="lb-detail-divider-icon" aria-hidden="true">♡</span>
          </div>
          <SizeSelector sizes={sizes} selected={selectedSize} onSelect={setSelectedSize} />
        </div>

        <div>
          <h2 className="lb-drink-col-heading">What's Included</h2>
          <div className="lb-detail-divider">
            <span className="lb-detail-divider-icon" aria-hidden="true">♡</span>
          </div>
          <IncludedList items={included} />
        </div>
      </div>

      <div className="lb-drink-cta">
        <button className="lb-btn" style={{ marginRight: '8px' }} onClick={() => onAddToOrder?.(selectedSize)}>
          Add to Order
        </button>
        <button className="lb-btn" onClick={() => onCustomizeClick?.(selectedSize)}>
          Customize ✨
        </button>
      </div>

      <Footer instagramUrl="https://www.instagram.com/thelilobean?igsh=NTc4MTIwNjQ2YQ==" />
    </div>
  );
}
