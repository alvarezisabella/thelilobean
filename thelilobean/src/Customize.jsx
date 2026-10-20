import React, { useState } from 'react';
import './LiloBean.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InlineStepper } from './addShots';
import { useSearchParams } from 'react-router-dom';

/* ============================================================
   1. CATEGORY DROPDOWN — heading + divider + <select>
   ============================================================ */
export function CategoryDropdown({ label, options, value, onChange }) {
  return (
    <div className="lb-customize-category">
      <h3 className="lb-category-heading">{label}</h3>
      <div className="lb-detail-divider lb-detail-divider--tight">
        <span className="lb-detail-divider-icon" aria-hidden="true">♡</span>
      </div>
      <div className="lb-select-wrap">
        <select
          className="lb-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* ============================================================
   2. FULL CUSTOMIZE PAGE
   `categories` is an array of { label, options } — add or remove
   entries to change what shows up (Milk, Sweetness, Ice, Toppings, etc.)
   Shots are handled separately via AddOnStepper since they're a
   quantity, not a single choice from a list.
   ============================================================ */
export default function CustomizePage({
  name,
  imageUrl,
  slug,
  size,
  category,
  categories,
  maxShots = 4,
  initialSelections,
  initialShots,
  onConfirm,
}) {
  // "Espresso" is handled separately as a +/- stepper, not a dropdown
  const dropdownCategories = categories.filter((c) => c.label !== 'Espresso');
  const [params, setParams] = useSearchParams();

  const selections = Object.fromEntries(
    dropdownCategories.map((c) => {
      const fromUrl = params.get(`o.${c.label}`);
      const fallback = initialSelections?.[c.label] ?? c.options[0];
      return [c.label, fromUrl && c.options.includes(fromUrl) ? fromUrl : fallback];
    })
  );

  const shotsParam = params.get('shots');
  const parsedShots = Number(shotsParam);
  const shots =
    shotsParam !== null && Number.isInteger(parsedShots) && parsedShots >= 0 && parsedShots <= maxShots
      ? parsedShots
      : initialShots ?? (category === 'Espresso' ? 2 : 0);

  const updateParam = (key, value) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set(key, value);
        return next;
      },
      { replace: true }
    );

  const updateSelection = (label, value) => updateParam(`o.${label}`, value);
  const setShots = (n) => updateParam('shots', n);

  const handleAddToOrder = () => {
    onConfirm?.({ slug, name, imageUrl, size, selections, shots });
  };

  return (
    <div className="lb-page">
      <Header />

      <section className="lb-drink-hero">
        <img className="lb-drink-hero-img" src={imageUrl} alt={name} />
        <h1 className="lb-drink-hero-name">{name}</h1>
      </section>

      <div className="lb-customize-grid">
        {dropdownCategories.map((cat) => (
          <CategoryDropdown
            key={cat.label}
            label={cat.label}
            options={cat.options}
            value={selections[cat.label]}
            onChange={(value) => updateSelection(cat.label, value)}
          />
        ))}

        <div className="lb-customize-category">
          <h3 className="lb-category-heading">Espresso</h3>
          <div className="lb-detail-divider lb-detail-divider--tight">
            <span className="lb-detail-divider-icon" aria-hidden="true">♡</span>
          </div>
          <InlineStepper
            zeroLabel="Add Shot"
            singularLabel="Shot"
            value={shots}
            max={maxShots}
            onChange={setShots}
          />
        </div>
      </div>

      <div className="lb-drink-cta">
        <button className="lb-btn" onClick={handleAddToOrder}>
          Add to Order
        </button>
      </div>

      <Footer instagramUrl="https://www.instagram.com/thelilobean?igsh=NTc4MTIwNjQ2YQ==" />
    </div>
  );
}
