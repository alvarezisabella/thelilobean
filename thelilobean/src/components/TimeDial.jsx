import React, { useEffect, useRef, useState } from 'react';

const MINUTES = [0, 15, 30, 45];
const OPEN_HOUR = 8;   // 8:00 AM
const CLOSE_HOUR = 15; // 3:00 PM (last pickup slot)

const SIZE = 224;
const CENTER = SIZE / 2;
const RADIUS = 84;
const BTN = 38;

// clock-face number (1-12) -> 24h hour inside the 8am-3pm window, or null
const toHour24 = (n) => {
  const h = n >= 8 && n <= 11 ? n : n === 12 ? 12 : n + 12;
  return h >= OPEN_HOUR && h <= CLOSE_HOUR ? h : null;
};

const pad = (n) => String(n).padStart(2, '0');

const parse = (value) => {
  if (!value) return null;
  const [h, m] = value.split(':').map(Number);
  return { h24: h, minute: m, clockNum: h % 12 || 12 };
};

const format = ({ h24, minute }) =>
  `${h24 % 12 || 12}:${pad(minute)} ${h24 < 12 ? 'AM' : 'PM'}`;

// Clock-face time picker limited to 8:00 AM - 3:00 PM in 15-minute steps.
// Calls onChange({ target: { name, value } }) with value as "HH:MM" (24h).
export function TimeDial({ id, name, value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const current = parse(value);

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

  const emit = (h24, minute) =>
    onChange({ target: { name, value: `${pad(h24)}:${pad(minute)}` } });

  const pickHour = (n) => {
    const h24 = toHour24(n);
    if (h24 == null) return;
    // 3:00 PM is the last slot, so no minutes past :00 at that hour
    const minute = h24 === CLOSE_HOUR ? 0 : current?.minute ?? 0;
    emit(h24, minute);
  };

  const pickMinute = (m) => {
    if (!current) return;
    emit(current.h24, m);
  };

  const handAngle = current ? (current.clockNum % 12) * 30 : null;
  const handLength = RADIUS - BTN / 2 + 2;

  return (
    <div className="lb-picker" ref={wrapRef}>
      <button
        type="button"
        id={id}
        // className={`lb-input lb-picker-trigger${current ? '' : ' is-placeholder'}`}
        className="lb-input lb-picker-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {current ? format(current) : 'SELECT A TIME'}
      </button>

      {open && (
        <div className="lb-picker-pop lb-dial" role="dialog" aria-label="Choose a pickup time">
          <div className="lb-dial-face" style={{ width: SIZE, height: SIZE }}>
            {current && (
              <span
                className="lb-dial-hand"
                style={{
                  left: CENTER - 1,
                  top: CENTER - handLength,
                  height: handLength,
                  transform: `rotate(${handAngle}deg)`,
                }}
              />
            )}
            <span className="lb-dial-pin" style={{ left: CENTER - 4, top: CENTER - 4 }} />

            {Array.from({ length: 12 }).map((_, i) => {
              const n = i + 1;
              const angle = (n % 12) * 30 * (Math.PI / 180);
              const x = CENTER + RADIUS * Math.sin(angle) - BTN / 2;
              const y = CENTER - RADIUS * Math.cos(angle) - BTN / 2;
              const h24 = toHour24(n);
              const isSelected = current && current.clockNum === n;
              return (
                <button
                  key={n}
                  type="button"
                  className={`lb-dial-hour${isSelected ? ' is-selected' : ''}`}
                  style={{ left: x, top: y, width: BTN, height: BTN }}
                  disabled={h24 == null}
                  aria-pressed={!!isSelected}
                  aria-label={h24 == null ? `${n} (closed)` : format({ h24, minute: 0 })}
                  onClick={() => pickHour(n)}
                >
                  {n}
                </button>
              );
            })}

            <span className="lb-dial-ampm">
              {current ? (current.h24 < 12 ? 'AM' : 'PM') : ''}
            </span>
          </div>

          <div className="lb-dial-minutes" role="group" aria-label="Minutes">
            {MINUTES.map((m) => {
              const disabled = !current || (current.h24 === CLOSE_HOUR && m > 0);
              const isSelected = current && current.minute === m;
              return (
                <button
                  key={m}
                  type="button"
                  className={`lb-dial-min${isSelected ? ' is-selected' : ''}`}
                  disabled={disabled}
                  aria-pressed={!!isSelected}
                  onClick={() => pickMinute(m)}
                >
                  :{pad(m)}
                </button>
              );
            })}
          </div>

          <p className="lb-picker-note">Pickup is 8:00 AM to 3:00 PM.</p>

          <button
            type="button"
            className="lb-btn lb-picker-done"
            disabled={!current}
            onClick={() => setOpen(false)}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
