import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LiloBean.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useCart } from './Cart';
import { useMenuData } from './MenuDataContext';

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

function getCustomizationLines(item, drinks, customizeCategories) {
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

function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

// Price of one of this item, looked up from the menu by slug + size label
function getUnitPrice(item, drinks) {
  const sizes = drinks[item.slug]?.sizes ?? [];
  const match = sizes.find((s) => s.label === item.size);
  return match?.price ?? null;
}

/* ============================================================
   CART ITEM CARD
   Click the photo/name area to go back and edit this item's
   customization. The stepper and trash icon are separate
   buttons so they don't trigger the edit navigation.
   ============================================================ */
export function CartItemCard({ item, onEdit, onQuantityChange, onRemove }) {
  const { drinks, customizeCategories } = useMenuData();
  const customizations = getCustomizationLines(item, drinks, customizeCategories);
  const unitPrice = getUnitPrice(item, drinks);

  return (
    <div className="lb-cart-card">
      <button className="lb-cart-card-main" onClick={onEdit}>
        <span className="lb-cart-card-circle">
          <img className="lb-cart-card-img" src={item.imageUrl} alt={item.name} />
        </span>
        <span className="lb-cart-card-info">
          <span className="lb-cart-card-name">{item.name}</span>
          {item.size && <span className="lb-cart-card-size">{item.size}</span>}
          {customizations.length > 0 && (
            <span className="lb-cart-card-customizations">{customizations.join(', ')}</span>
          )}
          {unitPrice != null && (
            <span className="lb-cart-card-price">
              {formatPrice(unitPrice * item.quantity)}
              {item.quantity > 1 && (
                <span className="lb-cart-card-price-each"> · {formatPrice(unitPrice)} each</span>
              )}
            </span>
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
  const { items, updateQuantity, removeItem, loaded } = useCart();
  const { drinks } = useMenuData();
  const navigate = useNavigate();

  // Only show a total when every item has a known price, so it's never wrong
  const unitPrices = items.map((item) => getUnitPrice(item, drinks));
  const total =
    items.length > 0 && unitPrices.every((p) => p != null)
      ? items.reduce((sum, item, i) => sum + unitPrices[i] * item.quantity, 0)
      : null;

  return (
    <div className="lb-page">
      <Header />

      <section className="lb-checkout-band">
        <h1 className="lb-checkout-title">Everything Look Correct?</h1>
      </section>

      <div className="lb-cart-list">
        {!loaded && <p className="lb-cart-empty">Loading your cart…</p>}
        {loaded && items.length === 0 && <p className="lb-cart-empty">Your cart is empty.</p>}

        {items.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            onEdit={() => navigate(`/menu/${item.slug}`, { state: { cartItemId: item.id } })}
            onQuantityChange={(qty) => updateQuantity(item.id, qty)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
      </div>

      {total != null && (
        <div className="lb-cart-total">
          <span className="lb-cart-total-label">Total</span>
          <span className="lb-cart-total-leader" aria-hidden="true" />
          <span className="lb-cart-total-amount">{formatPrice(total)}</span>
        </div>
      )}

      <div className="lb-drink-cta lb-drink-cta--stack">
        <Link to="/menu" className="lb-nav lb-continue-shopping">
          Continue Shopping
        </Link>
        {items.length > 0 && (
          <button className="lb-btn" onClick={() => navigate('/payment')}>
            Continue to Payment
          </button>
        )}
      </div>

      <Footer instagramUrl="https://www.instagram.com/thelilobean" />
    </div>
  );
}
