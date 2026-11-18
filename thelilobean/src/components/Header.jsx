import React from 'react';
import logo from '../assets/lilo-bean-logo.svg';
import { Link } from 'react-router-dom';
import { useCart } from '../Cart';

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.8L19.5 8H6.2"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="9" cy="19.5" r="1.4" fill="currentColor" />
      <circle cx="17" cy="19.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function Header() {
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="lb-header">
      <div className="lb-logo">
        <Link to="/">
          <img src={logo} alt="The Lilo Bean Logo" width={100} height={55} className="lb-logo-img" />
        </Link>
      </div>
      <nav className="lb-nav-links">
        <Link to="/menu" className="lb-nav">
          Menu
        </Link>
        <Link
          to="/checkout"
          className="lb-cart-link"
          aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
        >
          <CartIcon />
          {count > 0 && <span className="lb-cart-badge">{count > 99 ? '99+' : count}</span>}
        </Link>
      </nav>
    </header>
  );
}