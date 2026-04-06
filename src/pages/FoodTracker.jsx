import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const FOOD_DB = [
  { name: 'Eggs', calories: 155, carbs: 1, protein: 13, fat: 11, serving: '1 large' },
  { name: 'Chicken Breast', calories: 165, carbs: 0, protein: 31, fat: 4, serving: '100g' },
  { name: 'Brown Rice', calories: 216, carbs: 45, protein: 5, fat: 2, serving: '1 cup cooked' },
  { name: 'Banana', calories: 105, carbs: 27, protein: 1, fat: 0, serving: '1 medium' },
  { name: 'Oats', calories: 150, carbs: 27, protein: 5, fat: 3, serving: '1/2 cup dry' },
  { name: 'Almonds', calories: 164, carbs: 6, protein: 6, fat: 14, serving: '1 oz' },
  { name: 'Salmon', calories: 208, carbs: 0, protein: 20, fat: 13, serving: '100g' },
  { name: 'Greek Yogurt', calories: 100, carbs: 6, protein: 17, fat: 1, serving: '170g' },
  { name: 'Apple', calories: 95, carbs: 25, protein: 0, fat: 0, serving: '1 medium' },
  { name: 'Sweet Potato', calories: 103, carbs: 24, protein: 2, fat: 0, serving: '1 medium' },
  { name: 'Broccoli', calories: 55, carbs: 11, protein: 4, fat: 1, serving: '1 cup' },
  { name: 'Milk (whole)', calories: 149, carbs: 12, protein: 8, fat: 8, serving: '1 cup' },
];

export default function FoodTracker() {
  const { getData, setData } = useApp();
  const today = new Date().toISOString().split('T')[0];
  const foodLog = getData('foodLog', []);
  const todayLog = foodLog.filter(f => f.date === today);

  const totals = todayLog.reduce((a, f) => ({
    calories: a.calories + f.calories,
    carbs: a.carbs + f.carbs,
    protein: a.protein + f.protein,
    fat: a.fat + f.fat,
  }), { calories: 0, carbs: 0, protein: 0, fat: 0 });

  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [custom, setCustom] = useState({ name: '', calories: '', carbs: '', protein: '', fat: '', amount: '' });
  const [showCustom, setShowCustom] = useState(false);

  const handleSearch = (q) => {
    setSearch(q);
    if (q.length < 2) { setResults([]); return; }
    setResults(FOOD_DB.filter(f => f.name.toLowerCase().includes(q.toLowerCase())));
  };

  const addFood = (food) => {
    const entry = { ...food, id: Date.now(), date: today, amount: food.serving };
    setData('foodLog', [...foodLog, entry]);
    setSearch(''); setResults([]);
  };

  const addCustom = () => {
    if (!custom.name || !custom.calories) return;
    const entry = {
      id: Date.now(), date: today,
      name: custom.name,
      calories: Number(custom.calories),
      carbs: Number(custom.carbs) || 0,
      protein: Number(custom.protein) || 0,
      fat: Number(custom.fat) || 0,
      amount: custom.amount || '1 serving',
    };
    setData('foodLog', [...foodLog, entry]);
    setCustom({ name: '', calories: '', carbs: '', protein: '', fat: '', amount: '' });
    setShowCustom(false);
  };

  const deleteFood = (id) => setData('foodLog', foodLog.filter(f => f.id !== id));

  return (
    <div className="page">
      <h1 className="page-title">Food tracker</h1>

      {/* Search */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input className="search-input" placeholder="Search for foods..." value={search} onChange={e => handleSearch(e.target.value)} />
            </div>
            {results.length > 0 && (
              <div className="search-results">
                {results.map(f => (
                  <div key={f.name} className="search-result-item" onClick={() => addFood(f)}>
                    <span style={{ fontWeight: 500 }}>{f.name}</span>
                    <span style={{ color: '#8a7460', fontSize: 12, marginLeft: 8 }}>{f.calories} cal • {f.serving}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-primary" style={{ width: 'auto', whiteSpace: 'nowrap' }} onClick={() => setShowCustom(s => !s)}>+ Add custom</button>
        </div>

        {showCustom && (
          <div style={{ marginTop: '1rem', borderTop: '1px solid #e8e0d4', paddingTop: '1rem' }}>
            <div className="form-row-2" style={{ marginBottom: 10 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Food name</label>
                <input className="form-input" value={custom.name} onChange={e => setCustom(c => ({ ...c, name: e.target.value }))} placeholder="e.g. Dosa" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Amount / serving</label>
                <input className="form-input" value={custom.amount} onChange={e => setCustom(c => ({ ...c, amount: e.target.value }))} placeholder="e.g. 2 pieces" />
              </div>
            </div>
            <div className="form-row" style={{ marginBottom: 10 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Calories</label>
                <input className="form-input" type="number" value={custom.calories} onChange={e => setCustom(c => ({ ...c, calories: e.target.value }))} placeholder="0" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Protein (g)</label>
                <input className="form-input" type="number" value={custom.protein} onChange={e => setCustom(c => ({ ...c, protein: e.target.value }))} placeholder="0" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Carbs (g)</label>
                <input className="form-input" type="number" value={custom.carbs} onChange={e => setCustom(c => ({ ...c, carbs: e.target.value }))} placeholder="0" />
              </div>
            </div>
            <div className="form-row-2" style={{ marginBottom: 10 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Fat (g)</label>
                <input className="form-input" type="number" value={custom.fat} onChange={e => setCustom(c => ({ ...c, fat: e.target.value }))} placeholder="0" />
              </div>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={addCustom}>Add food</button>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-title">Today's totals</div>
        <div className="grid-4">
          <div className="stat-box"><div className="stat-value">{totals.calories}</div><div className="stat-label">Calories</div></div>
          <div className="stat-box"><div className="stat-value">{totals.carbs}g</div><div className="stat-label">Carbs</div></div>
          <div className="stat-box"><div className="stat-value">{totals.protein}g</div><div className="stat-label">Protein</div></div>
          <div className="stat-box"><div className="stat-value">{totals.fat}g</div><div className="stat-label">Fat</div></div>
        </div>
      </div>

      {/* Log */}
      <div className="card">
        <div className="card-title">Today's food log</div>
        {todayLog.length === 0
          ? <div style={{ color: '#8a7460', fontSize: 14 }}>Nothing logged yet. Search above to add food.</div>
          : todayLog.map(f => (
            <div key={f.id} className="log-item">
              <div>
                <div className="log-item-name">{f.name}</div>
                <div className="log-item-detail">{f.calories} cal • C: {f.carbs}g • P: {f.protein}g • F: {f.fat}g • {f.amount}</div>
              </div>
              <button className="delete-btn" onClick={() => deleteFood(f.id)}>🗑</button>
            </div>
          ))}
      </div>
    </div>
  );
}