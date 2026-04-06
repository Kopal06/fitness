import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const CARDS = [
  { label: 'Home', path: '/', icon: '🏠', desc: 'Your starting point' },
  { label: 'Dashboard', path: '/dashboard', icon: '📊', desc: 'See your daily summary' },
  { label: 'Calculator', path: '/calculator', icon: '🧮', desc: 'Calculate BMR, BMI & macros' },
  { label: 'Food Tracker', path: '/food', icon: '🥗', desc: 'Log meals & track nutrition' },
  { label: 'Workout', path: '/workout', icon: '🏋️', desc: 'Log exercises & calories burned' },
  { label: 'Progress', path: '/progress', icon: '📈', desc: 'Track weight, sleep & steps' },
  { label: 'Settings', path: '/settings', icon: '⚙️', desc: 'Update your profile' },
];

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  return (
    <div className="page">
      <h1 className="page-title">Welcome back, {currentUser?.name || 'there'} 👋</h1>
      <p style={{ color: '#8a7460', marginBottom: '2rem', fontSize: 16 }}>
        What would you like to track today?
      </p>
      <div className="grid-3">
        {CARDS.filter(c => c.path !== '/').map(c => (
          <div
            key={c.path}
            className="card"
            style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
            onClick={() => navigate(c.path)}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(122,92,48,0.10)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 13, color: '#8a7460' }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}