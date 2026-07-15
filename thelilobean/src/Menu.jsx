import React from 'react';
import './LiloBean.css';
import { Header} from './components/Header';
import { Footer } from './components/Footer';

/* ============================================================
   1. MENU ITEM — single drink: circular photo + name
   ============================================================ */
export function MenuItem({ imageUrl, name, onClick }) {
  return (
    <button className="lb-menu-item" onClick={onClick}>
      <span className="lb-menu-item-circle">
        <img className="lb-menu-item-img" src={imageUrl} alt={name} />
      </span>
      <span className="lb-menu-item-name">{name}</span>
    </button>
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
          <MenuItem key={item.name} {...item} />
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   3. FULL MENU PAGE
   Swap image URLs / drink names as needed, or add more sections
   by adding another { title, items } object to `menuData`.
   ============================================================ */
const menuData = [
  {
    title: 'Espresso',
    items: [
      { name: 'Spanish Latte', imageUrl: '/assets/menu/spanish-latte.jpg', placeholder: "Spanish Latte" },
      { name: 'Biscoff Latte', imageUrl: '/assets/menu/biscoff-latte.jpg', placeholder: "Biscoff Latte" },
      { name: 'Churro Latte', imageUrl: '/assets/menu/churro-latte.jpg', placeholder: "Churro Latte" },
      { name: 'Cinnamon Toast Crunch Latte', imageUrl: '/assets/menu/cinnamon-toast-crunch-latte.jpg', placeholder: "Cinnamon Toast Crunch Latte" },
      { name: 'Caramel Macchiato', imageUrl: '/assets/menu/caramel-macchiato.jpg', placeholder: "Caramel Macchiato" },
      { name: 'Caramel Latte', imageUrl: '/assets/menu/caramel-latte.jpg', placeholder: "Caramel Latte" },
      { name: 'Brown Sugar Shaken Espresso', imageUrl: '/assets/menu/brown-sugar-shaken-espresso.jpg', placeholder: "Brown Sugar Shaken Espresso" },
      { name: 'Sea Salt Caramel Shaken Espresso', imageUrl: '/assets/menu/sea-salt-caramel-shaken-espresso.jpg', placeholder: "Sea Salt Caramel Shaken Espresso" },
    ],
  },
  {
    title: 'Matcha',
    items: [
      { name: 'Matcha Latte', imageUrl: '/assets/menu/matcha-latte.jpg', placeholder: "Matcha Latte" },
      { name: 'Strawberry Matcha Latte', imageUrl: '/assets/menu/strawberry-matcha-latte.png', placeholder: "Strawberry Matcha Latte" },
    ],
  },
];

export default function MenuPage() {
  return (
    <div className="lb-page">
      <Header />

      {menuData.map((section) => (
        <MenuSection key={section.title} title={section.title} items={section.items} />
      ))}

      <Footer instagramUrl="https://www.instagram.com/thelilobean?igsh=NTc4MTIwNjQ2YQ==" />
    </div>
  );
}
