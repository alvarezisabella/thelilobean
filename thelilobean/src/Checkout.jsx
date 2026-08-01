import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LiloBean.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useCart } from './Cart';
import { drinks } from './drinksMenu.js';
import { customizeCategories } from './customizeCategories.js';

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ============================================================
   DEFAULTS + DIFFING
   Figures out what "default" looks like for a drink (same logic
   CustomizePage uses to initialize state), then compares the
   cart item's actual selections/shots against it. Only things
   that differ from default are shown as "customizations".
   ============================================================ */
function getDefaultSelections(categories) {
  return Object.fromEntries(
    categories.filter((c) => c.label !== 'Espresso').map((c) => [c.label, c.options[0]])
  );
}

function getDefaultShots(drinkCategory) {
  return drinkCategory === 'Espresso' ? 2 : 0;
}

function getCustomizationLines(item) {
  // Item was added straight from the drink detail page (no customize
  // step at all) — nothing to diff, so no customizations to show.
  if (!item.selections) return [];

  const drink = drinks[item.slug];
  if (!drink) return [];

  const categories = drink.categories ?? customizeCategories;
  const defaultSelections = getDefaultSelections(categories);
  const defaultShots = getDefaultShots(drink.category);

  const lines = [];

  Object.entries(item.selections).forEach(([label, value]) => {
    if (value !== defaultSelections[label]) {
      lines.push(value);
    }
  });

  const shots = item.shots ?? 0;
  if (shots !== defaultShots) {
    lines.push(`${shots} Shot${shots === 1 ? '' : 's'}`);
  }

  return lines;
}

/* ============================================================
   CART ITEM CARD
   Click the photo/name area to go back and edit this item's
   customization. The stepper and trash icon are separate
   buttons so they don't trigger the edit navigation.
   ============================================================ */
export function CartItemCard({ item, onEdit, onQuantityChange, onRemove }) {
  const customizations = getCustomizationLines(item);

  return (
    <div className="lb-cart-card">
      <button className="lb-cart-card-main" onClick={onEdit}>
        <span className="lb-cart-card-circle">
          <img className="lb-cart-card-img" src={item.imageUrl} alt={item.name} />
        </span>
        <span className="lb-cart-card-info">
          <span className="lb-cart-card-name">{item.name}</span>
          {item.size && <span className="lb-cart-card-desc">{item.size}</span>}
          {customizations.length > 0 && (
            <span className="lb-cart-card-desc">{customizations.join(', ')}</span>
          )}
        </span>
      </button>

      <div className="lb-cart-card-controls">
        <button
          className="lb-qty-btn"
          aria-label={`Decrease quantity of ${item.name}`}
          onClick={() => onQuantityChange(item.quantity - 1)}
        >
          −
        </button>
        <span className="lb-qty-value">{item.quantity}</span>
        <button
          className="lb-qty-btn"
          aria-label={`Increase quantity of ${item.name}`}
          onClick={() => onQuantityChange(item.quantity + 1)}
        >
          +
        </button>
        <button
          className="lb-trash-btn"
          aria-label={`Remove ${item.name} from cart`}
          onClick={onRemove}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   FULL CHECKOUT PAGE
   ============================================================ */
export default function CheckoutPage() {
  const { items, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  return (
    <div className="lb-page">
      <Header />

      <section className="lb-checkout-band">
        <h1 className="lb-checkout-title">Everything Look Correct?</h1>
      </section>

      <div className="lb-cart-list">
        {items.length === 0 && <p className="lb-cart-empty">Your cart is empty.</p>}

        {items.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            onEdit={() => navigate(`/menu/${item.slug}/customize`, { state: { cartItemId: item.id } })}
            onQuantityChange={(qty) => updateQuantity(item.id, qty)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
      </div>

      {items.length > 0 && (
        <div className="lb-drink-cta">
          <button className="lb-btn" onClick={() => navigate('/payment')}>
            Continue
          </button>
        </div>
      )}

      <Footer instagramUrl="https://www.instagram.com/thelilobean" />
    </div>
  );
}
