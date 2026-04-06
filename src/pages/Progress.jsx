import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function Progress() {
  const { getData, setData } = useApp();

  const [form, setForm] = useState({
    currentWeight: '', goalWeight: '', fatPercent: '', steps: '', sleep: '',
  });
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    const saved = getData('progressData', {
      currentWeight: '', goalWeight: '', fatPercent: '', steps: '', sleep: '',
    });
    setForm(saved);
  }, []);

  const set = (k, v) => {
    if (v !== '' && Number(v) < 0) return;
    setForm(f => ({ ...f, [k]: v }));
  };

  const saveAll = () => {
    setData('progressData', form);
    setSaveMsg('Saved!');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  const weightHistory = getData('weightHistory', []);

  const logWeight = () => {
    if (!form.currentWeight) return;
    setData('progressData', form);
    const entry = {
      date: new Date().toISOString().split('T')[0],
      currentWeight: form.currentWeight,
      goalWeight: form.goalWeight,
    };
    const updated = [
      ...weightHistory.filter(w => w.date !== entry.date),
      entry,
    ].sort((a, b) => a.date.localeCompare(b.date));
    setData('weightHistory', updated);
    setSaveMsg('Saved!');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  const secondaryBtn = {
    flex: 1,
    background: '#fce4ea',
    color: '#c0627a',
    border: 'none',
    borderRadius: 10,
    padding: '12px 16px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.15s',
  };

  return (
    <div className="page">
      <h1 className="page-title">Progress tracking</h1>

      <div className="grid-2" style={{ marginBottom: '1rem' }}>

        {/* Body Metrics */}
        <div className="card">
          <div className="card-title">Body metrics</div>

          <div className="form-group">
            <label className="form-label">Current weight (kg)</label>
            <input
              className="form-input"
              type="number"
              min="0"
              value={form.currentWeight}
              onChange={e => set('currentWeight', e.target.value)}
              placeholder="e.g. 68"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Goal weight (kg)</label>
            <input
              className="form-input"
              type="number"
              min="0"
              value={form.goalWeight}
              onChange={e => set('goalWeight', e.target.value)}
              placeholder="e.g. 60"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Body fat %</label>
            <input
              className="form-input"
              type="number"
              min="0"
              value={form.fatPercent}
              onChange={e => set('fatPercent', e.target.value)}
              placeholder="e.g. 20"
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveAll}>
              {saveMsg === 'Saved!' ? '✓ Saved!' : 'Save all'}
            </button>
            <button style={secondaryBtn} onClick={logWeight}>
              Log today's weight
            </button>
          </div>
        </div>

        {/* Daily Tracking */}
        <div className="card">
          <div className="card-title">Daily tracking</div>

          <div className="form-group">
            <label className="form-label">Steps today</label>
            <input
              className="form-input"
              type="number"
              min="0"
              value={form.steps}
              onChange={e => set('steps', e.target.value)}
              placeholder="e.g. 8000"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hours of sleep last night</label>
            <input
              className="form-input"
              type="number"
              min="0"
              value={form.sleep}
              onChange={e => set('sleep', e.target.value)}
              placeholder="e.g. 7.5"
            />
          </div>

          <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={saveAll}>
            {saveMsg === 'Saved!' ? '✓ Saved!' : 'Save all'}
          </button>
        </div>
      </div>

      {/* Weight History */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-title">Weight history</div>
        {weightHistory.length === 0 ? (
          <div style={{ color: '#b8849a', fontSize: 14 }}>
            No weight logs yet. Enter your current weight above and click "Log today's weight".
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              padding: '6px 16px',
              fontSize: 12,
              color: '#b8849a',
              fontWeight: 600,
              marginBottom: 4,
            }}>
              <span>Date</span>
              <span>Current (kg)</span>
              <span>Goal (kg)</span>
            </div>
            {[...weightHistory].reverse().slice(0, 10).map(w => (
              <div
                key={w.date}
                className="log-item"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}
              >
                <div className="log-item-name">{w.date}</div>
                <div style={{ fontWeight: 600, color: '#2d1f26' }}>{w.currentWeight} kg</div>
                <div style={{ color: '#b8849a' }}>{w.goalWeight ? `${w.goalWeight} kg` : '—'}</div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Macros from Calculator */}
      <div className="card">
        <div className="card-title">Macro goals (from Calculator)</div>
        {(() => {
          const goals = getData('goals', null);
          if (!goals || !goals.fromCalc) return (
            <div style={{ color: '#b8849a', fontSize: 14 }}>
              No macros calculated yet. Use the Calculator page to set your macro goals.
            </div>
          );
          return (
            <div className="grid-4">
              <div className="stat-box">
                <div className="stat-value">{goals.calories}</div>
                <div className="stat-label">Calories</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">{goals.protein}g</div>
                <div className="stat-label">Protein</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">{goals.carbs}g</div>
                <div className="stat-label">Carbs</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">{goals.fat}g</div>
                <div className="stat-label">Fat</div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}