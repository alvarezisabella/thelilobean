import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

const ITEM_H = 40; // keep in sync with --wheel-item-h in pickers.css
const HOURS = [9, 10, 11, 12, 1, 2, 3]; // 8:00 AM - 3:00 PM
const MINUTES = ['00', '15', '30', '45'];
const PERIODS = ['AM', 'PM'];
const LAST_HOUR_IDX = HOURS.length - 1; // 3 PM: only :00 allowed

const pad = (n) => String(n).padStart(2, '0');
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

const parse = (value) => {
  if (!value) return { h: 0, m: 0 };
  const [h24, minute] = value.split(':').map(Number);
  return {
    h: clamp(h24 - 8, 0, LAST_HOUR_IDX),
    m: Math.max(0, MINUTES.indexOf(pad(minute))),
  };
};

const formatValue = (value) => {
  const [h24, minute] = value.split(':').map(Number);
  return `${h24 % 12 || 12}:${pad(minute)} ${h24 < 12 ? 'AM' : 'PM'}`;
};

// One scrolling column that snaps to the item under the center band.
function Wheel({ items, selectedIndex, onSelect, disabled = [], label }) {
  const ref = useRef(null);
  const timer = useRef(null);
  const drag = useRef(null);
  const latest = useRef({});
  latest.current = { selectedIndex, onSelect, disabled };
  const [live, setLive] = useState(selectedIndex);

  const scrollToIndex = (i, smooth) => {
    if (ref.current) {
      ref.current.scrollTo({ top: i * ITEM_H, behavior: smooth ? 'smooth' : 'auto' });
    }
  };
  const indexAtScroll = () =>
    clamp(Math.round(ref.current.scrollTop / ITEM_H), 0, items.length - 1);

  // Called once scrolling stops. Disabled rows bounce back to the last valid one.
  const settle = (idx) => {
    const { selectedIndex: sel, onSelect: select, disabled: off } = latest.current;
    if (off.includes(idx)) {
      scrollToIndex(sel, true);
      setLive(sel);
      return;
    }
    if (idx !== sel) select(idx);
  };

  useLayoutEffect(() => {
    scrollToIndex(selectedIndex, false);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Follow the selection when something else changes it (AM/PM linking, 3 PM clamp, clicks, keys)
  useEffect(() => {
    if (ref.current && indexAtScroll() !== selectedIndex) scrollToIndex(selectedIndex, true);
    setLive(selectedIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  const onScroll = () => {
    if (!ref.current) return;
    setLive(indexAtScroll());
    if (drag.current) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => ref.current && settle(indexAtScroll()), 120);
  };

  const onKeyDown = (e) => {
    const dir = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    let i = selectedIndex + dir;
    while (i >= 0 && i < items.length && disabled.includes(i)) i += dir;
    if (i >= 0 && i < items.length) onSelect(i);
  };

  // Mouse drag (touch and trackpads already scroll natively)
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') return;
    drag.current = { y: e.clientY, top: ref.current.scrollTop, moved: false, id: e.pointerId };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.abs(dy) > 3) {
      d.moved = true;
      ref.current.style.scrollSnapType = 'none';
      ref.current.setPointerCapture(d.id);
    }
    if (d.moved) ref.current.scrollTop = d.top - dy;
  };
  const endDrag = () => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.moved) return;
    ref.current.style.scrollSnapType = '';
    const idx = indexAtScroll();
    scrollToIndex(idx, true);
    settle(idx);
  };

  return (
    <div
      className="lb-wheel"
      ref={ref}
      role="listbox"
      tabIndex={0}
      aria-label={label}
      onScroll={onScroll}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="lb-wheel-spacer" aria-hidden="true" />
      {items.map((item, i) => {
        const off = disabled.includes(i);
        return (
          <div
            key={item}
            role="option"
            aria-selected={i === selectedIndex}
            aria-disabled={off}
            className={`lb-wheel-item${i === live ? ' is-active' : ''}${off ? ' is-disabled' : ''}`}
            onClick={() => !off && onSelect(i)}
          >
            {item}
          </div>
        );
      })}
      <div className="lb-wheel-spacer" aria-hidden="true" />
    </div>
  );
}

// Alarm-style wheel time picker limited to 8:00 AM - 3:00 PM in 15-minute steps.
// Calls onChange({ target: { name, value } }) with value as "HH:MM" (24h),
// updating live as the wheels move.
export function TimeWheel({ id, name, value, onChange }) {
  const initial = parse(value);
  const [open, setOpen] = useState(false);
  const [hourIdx, setHourIdx] = useState(initial.h);
  const [minuteIdx, setMinuteIdx] = useState(initial.m);
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

  const emit = (h, m) =>
    onChange({ target: { name, value: `${pad(h + 8)}:${MINUTES[m]}` } });

  const selectHour = (h) => {
    const m = h === LAST_HOUR_IDX ? 0 : minuteIdx; // 3:00 PM is the last slot
    setHourIdx(h);
    setMinuteIdx(m);
    emit(h, m);
  };

  const selectMinute = (m) => {
    setMinuteIdx(m);
    emit(hourIdx, m);
  };

  // AM/PM is linked to the hour wheel: 8-11 are AM, 12-3 are PM
  const periodIdx = hourIdx >= 4 ? 1 : 0;
  const selectPeriod = (p) => {
    if (p === 0 && hourIdx >= 4) selectHour(0);
    if (p === 1 && hourIdx < 4) selectHour(4);
  };

  const minuteDisabled = hourIdx === LAST_HOUR_IDX ? [1, 2, 3] : [];

  return (
    <div className="lb-picker" ref={wrapRef}>
      <button
        type="button"
        id={id}
        // className={`lb-input lb-picker-trigger${value ? '' : ' is-placeholder'}`}
        className="lb-input lb-picker-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {value ? formatValue(value) : 'SELECT A TIME'}
      </button>

      {open && (
        <div className="lb-picker-pop lb-wheel-pop" role="dialog" aria-label="Choose a pickup time">
          <div className="lb-wheel-wrap">
            <span className="lb-wheel-band" aria-hidden="true" />
            <Wheel label="Hour" items={HOURS} selectedIndex={hourIdx} onSelect={selectHour} />
            <span className="lb-wheel-colon" aria-hidden="true">:</span>
            <Wheel
              label="Minute"
              items={MINUTES}
              selectedIndex={minuteIdx}
              onSelect={selectMinute}
              disabled={minuteDisabled}
            />
            <Wheel label="AM or PM" items={PERIODS} selectedIndex={periodIdx} onSelect={selectPeriod} />
          </div>

          <p className="lb-picker-note">Pickup is 8:00 AM to 3:00 PM.</p>

          <button type="button" className="lb-btn lb-picker-done" onClick={() => setOpen(false)}>
            Done
          </button>
        </div>
      )}
    </div>
  );
}
