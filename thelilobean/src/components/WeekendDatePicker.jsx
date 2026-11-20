import React, { useEffect, useMemo, useRef, useState } from 'react';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const fromISO = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// Calendar popup where only Saturdays and Sundays can be picked.
// Calls onChange({ target: { name, value } }) with value as "YYYY-MM-DD",
// so it plugs straight into the existing handleChange.
export function WeekendDatePicker({ id, name, value, onChange, maxDaysAhead = 60 }) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const maxDate = useMemo(() => {
    const m = new Date(today);
    m.setDate(m.getDate() + maxDaysAhead);
    return m;
  }, [today, maxDaysAhead]);

  const selected = value ? fromISO(value) : null;
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const base = selected || today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const year = view.getFullYear();
  const month = view.getMonth();
  const blanks = view.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const canPrev = view > new Date(today.getFullYear(), today.getMonth(), 1);
  const canNext = new Date(year, month + 1, 1) <= maxDate;

  const shiftMonth = (delta) => setView(new Date(year, month + delta, 1));

  const pick = (date) => {
    onChange({ target: { name, value: toISO(date) } });
    setOpen(false);
  };

  const label = selected
    ? selected.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : 'SELECT A DAY';

  return (
    <div className="lb-picker" ref={wrapRef}>
      <button
        type="button"
        id={id}
        // className={`lb-input lb-picker-trigger${selected ? '' : ' is-placeholder'}`}
        className="lb-input lb-picker-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
      </button>

      {open && (
        <div className="lb-picker-pop lb-cal" role="dialog" aria-label="Choose a pickup date">
          <div className="lb-cal-head">
            <button
              type="button"
              className="lb-cal-nav"
              onClick={() => shiftMonth(-1)}
              disabled={!canPrev}
              aria-label="Previous month"
            >
              ‹
            </button>
            <span className="lb-cal-month">
              {view.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="button"
              className="lb-cal-nav"
              onClick={() => shiftMonth(1)}
              disabled={!canNext}
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          <div className="lb-cal-grid">
            {WEEKDAYS.map((d) => (
              <span key={d} className="lb-cal-dow">{d}</span>
            ))}
            {Array.from({ length: blanks }).map((_, i) => (
              <span key={`b${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = new Date(year, month, i + 1);
              const dow = date.getDay();
              const weekend = dow === 0 || dow === 6;
              const disabled = !weekend || date < today || date > maxDate;
              const isSelected = selected && toISO(selected) === toISO(date);
              return (
                <button
                  key={i}
                  type="button"
                  className={`lb-cal-day${weekend ? ' is-weekend' : ''}${isSelected ? ' is-selected' : ''}`}
                  disabled={disabled}
                  aria-pressed={!!isSelected}
                  aria-label={date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  onClick={() => pick(date)}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <p className="lb-picker-note">Pickup is available Saturdays and Sundays.</p>
        </div>
      )}
    </div>
  );
}
