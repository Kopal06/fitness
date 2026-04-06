import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(pw) {
  return pw.length >= 6;
}

export default function Auth() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const { login, register } = useApp();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleLogin = () => {
    const e = {};
    if (!validateEmail(form.email)) e.email = 'Enter a valid email address';
    if (!validatePassword(form.password)) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    if (Object.keys(e).length) return;
    const res = login(form.email, form.password);
    if (!res.success) { setServerError(res.error); return; }
    navigate('/');
  };

  const handleRegister = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!validateEmail(form.email)) e.email = 'Enter a valid email address';
    if (!validatePassword(form.password)) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    if (Object.keys(e).length) return;
    const res = register(form.name, form.email, form.password);
    if (!res.success) { setServerError(res.error); return; }
    setServerError('');
    setTab('login');
    setForm(f => ({ ...f, name: '', password: '', confirm: '' }));
  };

  return (
    <div className="auth-page">
      <div className="auth-logo-wrap">
        <div className="auth-logo">FT</div>
        <div className="auth-app-name">FitPro</div>
        <div className="auth-tagline">Track your nutrition and workouts</div>
      </div>
      <div className="auth-card">
        <div className="auth-tabs">
          <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => { setTab('login'); setErrors({}); setServerError(''); }}>Login</button>
          <button className={`auth-tab${tab === 'register' ? ' active' : ''}`} onClick={() => { setTab('register'); setErrors({}); setServerError(''); }}>Register</button>
        </div>
        {serverError && <div style={{ background: '#fef0ee', color: '#c0392b', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 13 }}>{serverError}</div>}
        {tab === 'login' ? (
          <>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" />
              {errors.email && <div className="form-hint" style={{ color: '#c0392b' }}>{errors.email}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" />
              {errors.password && <div className="form-hint" style={{ color: '#c0392b' }}>{errors.password}</div>}
            </div>
            <button className="btn btn-primary" onClick={handleLogin}>Login</button>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" />
              {errors.name && <div className="form-hint" style={{ color: '#c0392b' }}>{errors.name}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" />
              {errors.email && <div className="form-hint" style={{ color: '#c0392b' }}>{errors.email}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 characters" />
              {errors.password && <div className="form-hint" style={{ color: '#c0392b' }}>{errors.password}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm password</label>
              <input className="form-input" type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="Repeat password" />
              {errors.confirm && <div className="form-hint" style={{ color: '#c0392b' }}>{errors.confirm}</div>}
            </div>
            <button className="btn btn-primary" onClick={handleRegister}>Create account</button>
          </>
        )}
      </div>
    </div>
  );
}