import React from 'react';
import './LiloBean.css';
import heroImage from './assets/hero-image.jpg';
import welcomeImage from './assets/lilo-bean-coffee.jpg';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

export function Hero({ imageUrl, heading, ctaLabel = 'Order Now', onCtaClick }) {
  return (
    <section className="lb-hero" style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className="lb-hero-content">
        <h1 className="lb-hero-heading">{heading}</h1>
        <button className="lb-btn" onClick={onCtaClick}>{ctaLabel}</button>
      </div>
    </section>
  );
}

export function WelcomeCard({ imageUrl, imageAlt = '', heading, paragraphs = [] }) {
  return (
    <section className="lb-card">
      <img className="lb-card-img" src={imageUrl} alt={imageAlt} />
      <div className="lb-card-body">
        <h2 className="lb-card-heading">{heading}</h2>
        {paragraphs.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    </section>
  );
}


export default function LiloBeanLanding() {
  return (
    <div className="lb-page">
      <Header />

      <Hero
        imageUrl={heroImage}
        heading={<>Coffee that<br />feels like home</>}
        ctaLabel="Order Now"
        onCtaClick={() => console.log('Order Now clicked')}
      />

      <WelcomeCard
        imageUrl={welcomeImage}
        imageAlt="Iced coffee from The Lilo Bean"
        heading="Welcome to The Lilo Bean!"
        paragraphs={[
          "We're a home-based coffee shop located in Fontana, CA and hoping to reach fellow coffee lovers to share our authentic, creative twist.",
          "We often hold sales and specials to expand beyond espresso drinks and we welcome you to join our community.",
          "The support we can is beyond meaningful and we hope you give us a try.",
          "Thank you for supporting local!",
        ]}
      />

      <Footer instagramUrl="https://www.instagram.com/thelilobean?igsh=NTc4MTIwNjQ2YQ==" />
    </div>
  );
}
