import React from 'react';
import './LiloBean.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Link } from 'react-router-dom';
import { categoryOrder } from './drinks.js';
import { useMenuData } from './MenuDataContext';

/* ============================================================
   1. MENU ITEM — single drink: circular photo + name
   ============================================================ */
export function MenuItem({ imageUrl, name, slug }) {
  return (
    <Link className="lb-menu-item" to={`/menu/${slug}`}>
      <span className="lb-menu-item-circle">
        <img className="lb-menu-item-img" src={imageUrl} alt={name} />
      </span>
      <span className="lb-menu-item-name">{name}</span>
    </Link>
  );
}

/* ============================================================
   2. MENU SECTION — category band (e.g. "Espresso") + item grid
   ============================================================ */
export function MenuSection({ title, items = [] }) {
  return (
    <section className="lb-menu-section">
      <div className="lb-menu-band">
        <h2 className="lb-menu-title">{title}</h2>
        <div className="lb-menu-divider">
          <span className="lb-menu-divider-icon" aria-hidden="true">♡</span>
        </div>
      </div>
      <div className="lb-menu-grid">
        {items.map((item) => (
          <MenuItem key={item.slug} {...item} />
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   3. BUILD MENU DATA FROM drinksData.js
   Groups every drink by its `category` field, in the order
   defined by `categoryOrder`. Add a new drink in drinksData.js
   and it shows up here automatically — no need to touch this file.
   ============================================================ */
function buildMenuData(drinks) {
  return categoryOrder.map((category) => ({
    title: category,
    items: Object.entries(drinks)
      .filter(([, drink]) => drink.category === category)
      .map(([slug, drink]) => ({
        slug,
        name: drink.name,
        imageUrl: drink.imageUrl,
      })),
  }));
}

/* ============================================================
   4. FULL MENU PAGE
   ============================================================ */
export default function MenuPage() {
  const { drinks, loading, error } = useMenuData();
  const menuData = buildMenuData(drinks);

  return (
    <div className="lb-page">
      <Header />

      {loading && <p className="lb-cart-empty">Loading menu…</p>}
      {error && <p className="lb-cart-empty">Couldn't load the menu. Please refresh and try again.</p>}

      {!loading && !error && menuData.map((section) => (
        <MenuSection key={section.title} title={section.title} items={section.items} />
      ))}

      <Footer instagramUrl="https://www.instagram.com/thelilobean?igsh=NTc4MTIwNjQ2YQ==" />
    </div>
  );
}
