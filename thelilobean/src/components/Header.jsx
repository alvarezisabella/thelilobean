import React from 'react';
import './LiloBean.css';
import logo from './assets/lilo-bean-logo.svg';

export default function Header({ onMenuClick }) {
  return (
    <header className="lb-header">
      <div className="lb-logo">
        <img src={logo} alt="The Lilo Bean Logo" width={100} height={55} className="lb-logo-img" />
      </div>
      <button className="lb-nav" onClick={onMenuClick}>Menu</button>
    </header>
  );
}