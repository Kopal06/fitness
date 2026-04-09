import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Calculator', path: '/calculator' },
  { label: 'Food Tracker', path: '/food' },
  { label: 'Workout', path: '/workout' },
  { label: 'Settings', path: '/settings' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, currentUser } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    if (!currentUser) return;
    const keysToReset = [
      'foodLog', 'workoutLog', 'waterLog',
      'progressData', 'weightHistory', 'goals', 'profile',
    ];
    keysToReset.forEach(key => {
      localStorage.removeItem(`ft_${currentUser.email}_${key}`);
    });
    setShowConfirm(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <nav className="navbar">
        <a className="navbar-brand" href="/">
          <div className="navbar-logo">FP</div>
          <span className="navbar-title">FitPro</span>
        </a>
        <div className="navbar-links">
          {LINKS.map(l => (
            <button
              key={l.path}
              className={`nav-link${location.pathname === l.path ? ' active' : ''}`}
              onClick={() => navigate(l.path)}
            >{l.label}</button>
          ))}
        </div>
        <div className="navbar-actions">
          <button
            className="icon-btn"
            title="Reset all data"
            onClick={() => setShowConfirm(true)}
            style={{ fontSize: 14, color: '#c0627a' }}
          >↺ Reset</button>
          <button className="icon-btn" title="Logout" onClick={logout}>↩</button>
        </div>
      </nav>

      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
        }}>
          <div style={{
            background: '#fff', borderRadius: 20, padding: '2rem',
            maxWidth: 400, width: '90%', border: '1.5px solid #f5cfd8',
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: '#2d1f26' }}>Reset all data?</div>
            <div style={{ fontSize: 14, color: '#9e7080', marginBottom: '1.5rem' }}>
              This will clear all your logged food, workouts, water, progress, and goals. This cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-danger" onClick={handleReset}>Yes, reset everything</button>
              <button
                style={{ background: '#fce4ea', color: '#c0627a', border: 'none', borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', flex: 1, justifyContent: 'center', display: 'flex', fontFamily: 'inherit' }}
                onClick={() => setShowConfirm(false)}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}