import React from 'react';
import logo from '../assets/lilo-bean-logo.svg';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="lb-header">
      <div className="lb-logo">
        <Link to="/">
          <img src={logo} alt="The Lilo Bean Logo" width={100} height={55} className="lb-logo-img" />
        </Link>
      </div>
      <nav>
        <Link to="/menu" className="lb-nav">
          Menu
        </Link>
      </nav>
    </header>
  );
}