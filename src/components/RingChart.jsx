import React from 'react';
import PropTypes from 'prop-types';

export default function RingChart({ value, max, size = 80, color = '#e07090', label, sublabel }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const dash = pct * circ;
  const remaining = max - value;

  return (
    <div className="ring-wrap">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f5cfd8" strokeWidth={8} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={pct >= 1 ? '#e74c3c' : color}
          strokeWidth={8}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
      </svg>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#2d1f26', marginTop: -4 }}>
          {Math.max(0, Math.round(remaining))}
        </div>
        {sublabel && <div className="ring-label">{sublabel}</div>}
      </div>
      {label && <div className="ring-label">{label}</div>}
    </div>
  );
}

RingChart.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  label: PropTypes.string,
  sublabel: PropTypes.string,
};