import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  return (
    <div className="page">
      <h1 className="page-title">Welcome back, {currentUser?.name || 'there'} 👋</h1>
      <p style={{ color: '#8a7460', marginBottom: '2rem', fontSize: 16 }}>What would you like to track today?</p>
      <div className="grid-3">
        {[
          { icon: '🥗', title: 'Food Tracker', desc: 'Log meals & track nutrition', path: '/food' },
          { icon: '🏋️', title: 'Workout', desc: 'Log exercises & calories burned', path: '/workout' },
          { icon: '📈', title: 'Progress', desc: 'Track weight, sleep & steps', path: '/progress' },
          { icon: '📊', title: 'Dashboard', desc: 'See your daily summary', path: '/dashboard' },
          { icon: '🧮', title: 'Calculator', desc: 'Calculate BMR, BMI & macros', path: '/calculator' },
          { icon: '⚙️', title: 'Settings', desc: 'Update profile & goals', path: '/settings' },
        ].map(c => (
          <div key={c.path} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(c.path)}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{c.title}</div>
            <div style={{ fontSize: 13, color: '#8a7460' }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}