import React from 'react';
import './LiloBean.css';

/* ============================================================
   ADD-ON STEPPER
   Collapsed: "Add Shots" + [+] button.
   Once value > 0, expands to show the category header ("Espresso
   & Shot Options" / "Customized") and a −  count  + stepper row.
   ============================================================ */
export function AddOnStepper({
  label = 'Shots',
  addLabel,                    // defaults to `Add ${label}` if not given
  categoryLabel,               // defaults to label if not given
  value = 0,
  min = 0,
  max = 5,
  onChange,
}) {
  const increment = () => onChange(Math.min(max, value + 1));
  const decrement = () => onChange(Math.max(min, value - 1));

  if (value <= 0) {
    return (
      <div className="lb-addon">
        <div className="lb-addon-collapsed">
          <span className="lb-addon-label">{addLabel ?? `Add ${label}`}</span>
          <button
            type="button"
            className="lb-stepper-btn"
            aria-label={`Add ${label}`}
            onClick={increment}
          >
            +
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lb-addon">
      <div className="lb-addon-header">
        <span className="lb-addon-category">{categoryLabel ?? label}</span>
        <span className="lb-addon-customized">Customized</span>
      </div>
      <div className="lb-addon-stepper-row">
        <span className="lb-addon-label">{label}</span>
        <div className="lb-stepper-controls">
          <button
            type="button"
            className="lb-stepper-btn"
            aria-label={`Remove ${label}`}
            onClick={decrement}
            disabled={value <= min}
          >
            −
          </button>
          <span className="lb-stepper-count">{value}</span>
          <button
            type="button"
            className="lb-stepper-btn"
            aria-label={`Add ${label}`}
            onClick={increment}
            disabled={value >= max}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   INLINE STEPPER
   Same footprint as a .lb-select box — a single pill with the
   label on the left ("Add Shot" / "2 Shots") and −/+ controls
   on the right, in place of a dropdown's chevron. Drop this into
   a category slot (e.g. "Espresso") instead of CategoryDropdown.
   ============================================================ */
export function InlineStepper({
  zeroLabel = 'Add Shot',
  singularLabel = 'Shot',
  pluralLabel,
  value = 0,
  min = 0,
  max = 5,
  onChange,
}) {
  const increment = () => onChange(Math.min(max, value + 1));
  const decrement = () => onChange(Math.max(min, value - 1));
  const label =
    value <= 0 ? zeroLabel : `${value} ${value === 1 ? singularLabel : (pluralLabel ?? `${singularLabel}s`)}`;

  return (
    <div className="lb-shot-box">
      <span className="lb-shot-label">{label}</span>
      <div className="lb-shot-controls">
        <button
          type="button"
          className="lb-shot-btn"
          aria-label={`Decrease ${singularLabel.toLowerCase()}`}
          onClick={decrement}
          disabled={value <= min}
        >
          −
        </button>
        <span className="lb-shot-count">{value}</span>
        <button
          type="button"
          className="lb-shot-btn"
          aria-label={`Increase ${singularLabel.toLowerCase()}`}
          onClick={increment}
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}
