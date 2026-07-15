export function Footer({ instagramUrl = '#' }) {
  return (
    <footer className="lb-footer">
      <span className="lb-footer-label">Follow us</span>
      <a className="lb-social" href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="4.2" stroke="white" strokeWidth="1.8" />
          <circle cx="17.4" cy="6.6" r="1.1" fill="white" />
        </svg>
      </a>
    </footer>
  );
}