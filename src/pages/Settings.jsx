import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const { currentUser, getData, setData, logout } = useApp();
  const profile = getData('profile', { age: '', weight: '', height: '' });

  const [pForm, setPForm] = useState({
    name: currentUser?.name || '',
    age: profile.age,
    weight: profile.weight,
    height: profile.height,
  });
  const [pSaved, setPSaved] = useState(false);

  const setP = (k, v) => {
    // Block negative values for numeric fields
    if (['age', 'weight', 'height'].includes(k) && Number(v) < 0) return;
    setPForm(f => ({ ...f, [k]: v }));
  };

  const saveProfile = () => {
    setData('profile', { age: pForm.age, weight: pForm.weight, height: pForm.height });
    setPSaved(true);
    setTimeout(() => setPSaved(false), 2000);
  };

  return (
    <div className="page">
      <h1 className="page-title">Settings</h1>

      {/* User Profile */}
      <div className="card settings-section">
        <div className="settings-section-header">
          <div className="settings-icon-wrap">👤</div>
          <div className="settings-section-title">User profile</div>
        </div>

        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            className="form-input"
            value={pForm.name}
            onChange={e => setP('name', e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" value={currentUser?.email || ''} disabled />
          <div className="form-hint">Email cannot be changed</div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Age</label>
            <input
              className="form-input"
              type="number"
              min="0"
              value={pForm.age}
              onChange={e => setP('age', e.target.value)}
              placeholder="25"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Weight (kg)</label>
            <input
              className="form-input"
              type="number"
              min="0"
              value={pForm.weight}
              onChange={e => setP('weight', e.target.value)}
              placeholder="68"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Height (cm)</label>
            <input
              className="form-input"
              type="number"
              min="0"
              value={pForm.height}
              onChange={e => setP('height', e.target.value)}
              placeholder="170"
            />
          </div>
        </div>

        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={saveProfile}>
          {pSaved ? '✓ Profile saved!' : 'Save profile'}
        </button>
      </div>

      {/* Preferences */}
      <div className="card settings-section">
        <div className="settings-section-header">
          <div className="settings-icon-wrap">⚙️</div>
          <div className="settings-section-title">Preferences</div>
        </div>
        <div className="pref-row">
          <span className="pref-row-label">Units</span>
          <span className="pref-row-value">Metric (kg, cm)</span>
        </div>
        <div className="pref-row">
          <span className="pref-row-label">Theme</span>
          <span className="pref-row-value">Light mode</span>
        </div>
      </div>

      {/* Account */}
      <div className="card settings-section">
        <div className="settings-section-header">
          <div className="settings-icon-wrap">↩</div>
          <div className="settings-section-title">Account</div>
        </div>
        <button className="btn btn-danger" onClick={logout}>↩ Logout</button>
      </div>
    </div>
  );
}