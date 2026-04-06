import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Calculator() {
  const { setData, getData } = useApp();
  const [unit, setUnit] = useState('metric');
  const [sex, setSex] = useState('male');
  const [activeTab, setActiveTab] = useState('macros');
  const [form, setForm] = useState({
    age: '', weight: '', height: '', heightFt: '', heightIn: '', activityLevel: '1.55',
  });
  const [results, setResults] = useState(null);
  const [saved, setSaved] = useState(false);

  const savedGoals = getData('goals', null);

  const set = (k, v) => {
    if (k !== 'activityLevel' && Number(v) < 0) return;
    setForm(f => ({ ...f, [k]: v }));
  };

  const getWeightKg = () => unit === 'imperial' ? form.weight * 0.453592 : Number(form.weight);
  const getHeightCm = () => {
    if (unit === 'imperial') {
      return ((Number(form.heightFt) * 12) + Number(form.heightIn || 0)) * 2.54;
    }
    return Number(form.height);
  };

  const calculate = () => {
    const w = getWeightKg();
    const h = getHeightCm();
    const a = Number(form.age);
    if (!w || !h || !a) return;

    const bmr = sex === 'male'
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = bmr * Number(form.activityLevel);

    const heightM = h / 100;
    const bmi = w / (heightM * heightM);
    let bmiCat = '';
    if (bmi < 18.5) bmiCat = 'Underweight';
    else if (bmi < 25) bmiCat = 'Normal weight';
    else if (bmi < 30) bmiCat = 'Overweight';
    else bmiCat = 'Obese';

    const protein = Math.round(w * 2.2);
    const fat = Math.round((tdee * 0.25) / 9);
    const carbs = Math.round((tdee - (protein * 4) - (fat * 9)) / 4);

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      bmi: bmi.toFixed(1),
      bmiCat,
      protein,
      fat,
      carbs,
      calories: Math.round(tdee),
    });
    setSaved(false);
  };

  const saveGoals = () => {
    if (!results) return;
    setData('goals', {
      calories: results.calories,
      protein: results.protein,
      carbs: results.carbs,
      fat: results.fat,
      bmr: results.bmr,
      tdee: results.tdee,
      bmi: results.bmi,
      bmiCat: results.bmiCat,
      fromCalc: true,
    });
    setSaved(true);
  };

  const ACTIVITY = [
    { val: '1.2', label: 'Sedentary (little/no exercise)' },
    { val: '1.375', label: 'Lightly active (1–3 days/week)' },
    { val: '1.55', label: 'Moderately active (3–5 days/week)' },
    { val: '1.725', label: 'Very active (6–7 days/week)' },
    { val: '1.9', label: 'Super active (physical job)' },
  ];

  const inputBlock = (
    <>
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div>
          <label className="form-label">Units</label>
          <div className="seg-control" style={{ width: 'fit-content' }}>
            <button className={`seg-btn${unit === 'metric' ? ' active' : ''}`} onClick={() => setUnit('metric')}>Metric (kg/cm)</button>
            <button className={`seg-btn${unit === 'imperial' ? ' active' : ''}`} onClick={() => setUnit('imperial')}>Imperial (lbs/in)</button>
          </div>
        </div>
        <div>
          <label className="form-label">Sex</label>
          <div className="seg-control" style={{ width: 'fit-content' }}>
            <button className={`seg-btn${sex === 'male' ? ' active' : ''}`} onClick={() => setSex('male')}>Male</button>
            <button className={`seg-btn${sex === 'female' ? ' active' : ''}`} onClick={() => setSex('female')}>Female</button>
          </div>
        </div>
      </div>

      <div className="form-row" style={{ marginBottom: 12 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Age (years)</label>
          <input className="form-input" type="number" min="0" value={form.age} onChange={e => set('age', e.target.value)} placeholder="25" />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Weight ({unit === 'imperial' ? 'lbs' : 'kg'})</label>
          <input className="form-input" type="number" min="0" value={form.weight} onChange={e => set('weight', e.target.value)} placeholder={unit === 'imperial' ? '150' : '68'} />
        </div>
        {unit === 'imperial' ? (
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Height (ft / in)</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input className="form-input" type="number" min="0" value={form.heightFt} onChange={e => set('heightFt', e.target.value)} placeholder="5" style={{ width: '50%' }} />
              <input className="form-input" type="number" min="0" value={form.heightIn} onChange={e => set('heightIn', e.target.value)} placeholder="8" style={{ width: '50%' }} />
            </div>
          </div>
        ) : (
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Height (cm)</label>
            <input className="form-input" type="number" min="0" value={form.height} onChange={e => set('height', e.target.value)} placeholder="170" />
          </div>
        )}
      </div>

      {(activeTab === 'bmr' || activeTab === 'macros') && (
        <div className="form-group">
          <label className="form-label">Activity level</label>
          <select className="form-select" value={form.activityLevel} onChange={e => set('activityLevel', e.target.value)}>
            {ACTIVITY.map(a => <option key={a.val} value={a.val}>{a.label}</option>)}
          </select>
        </div>
      )}

      <button className="btn btn-primary" onClick={calculate}>Calculate</button>
    </>
  );

  return (
    <div className="page">
      <h1 className="page-title">Calculator</h1>

      {/* Saved results summary */}
      {savedGoals && savedGoals.fromCalc && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-title" style={{ marginBottom: '0.75rem' }}>Saved results</div>
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: 12, color: '#b8849a', fontWeight: 600, marginBottom: 6 }}>MACROS (active on dashboard)</div>
            <div className="grid-4">
              <div className="stat-box"><div className="stat-value">{savedGoals.calories}</div><div className="stat-label">Calories</div></div>
              <div className="stat-box"><div className="stat-value">{savedGoals.protein}g</div><div className="stat-label">Protein</div></div>
              <div className="stat-box"><div className="stat-value">{savedGoals.carbs}g</div><div className="stat-label">Carbs</div></div>
              <div className="stat-box"><div className="stat-value">{savedGoals.fat}g</div><div className="stat-label">Fat</div></div>
            </div>
          </div>
          {savedGoals.bmr && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div className="stat-box" style={{ flex: 1 }}>
                <div className="stat-value">{savedGoals.bmr}</div>
                <div className="stat-label">BMR (cal/day)</div>
              </div>
              <div className="stat-box" style={{ flex: 1 }}>
                <div className="stat-value">{savedGoals.tdee}</div>
                <div className="stat-label">TDEE (cal/day)</div>
              </div>
              <div className="stat-box" style={{ flex: 1 }}>
                <div className="stat-value">{savedGoals.bmi}</div>
                <div className="stat-label">BMI — {savedGoals.bmiCat}</div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="seg-control" style={{ marginBottom: '1.5rem' }}>
        {['macros', 'bmr', 'bmi'].map(t => (
          <button
            key={t}
            className={`seg-btn${activeTab === t ? ' active' : ''}`}
            onClick={() => { setActiveTab(t); setResults(null); setSaved(false); }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="card">
        {inputBlock}

        {results && (
          <div style={{ marginTop: '1.5rem' }}>
            {activeTab === 'macros' && (
              <>
                <div className="grid-4" style={{ marginBottom: '1rem' }}>
                  <div className="result-box"><div className="result-value" style={{ fontSize: '1.5rem' }}>{results.calories}</div><div className="result-label">Calories</div></div>
                  <div className="result-box"><div className="result-value" style={{ fontSize: '1.5rem' }}>{results.protein}g</div><div className="result-label">Protein</div></div>
                  <div className="result-box"><div className="result-value" style={{ fontSize: '1.5rem' }}>{results.carbs}g</div><div className="result-label">Carbs</div></div>
                  <div className="result-box"><div className="result-value" style={{ fontSize: '1.5rem' }}>{results.fat}g</div><div className="result-label">Fat</div></div>
                </div>
                <button className="btn btn-primary" onClick={saveGoals}>
                  {saved ? '✓ Goals saved! Dashboard rings updated.' : 'Save as my daily goals'}
                </button>
                {saved && (
                  <div style={{ fontSize: 13, color: '#b8849a', marginTop: 8, textAlign: 'center' }}>
                    Your dashboard rings now reflect these macro targets.
                  </div>
                )}
              </>
            )}
            {activeTab === 'bmr' && (
              <>
                <div className="result-box">
                  <div style={{ fontSize: 13, color: '#b8849a', marginBottom: 4 }}>Basal Metabolic Rate</div>
                  <div className="result-value">{results.bmr}</div>
                  <div className="result-label">calories/day at complete rest</div>
                </div>
                <div className="result-box" style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 13, color: '#b8849a', marginBottom: 4 }}>TDEE</div>
                  <div className="result-value">{results.tdee}</div>
                  <div className="result-label">calories/day with your activity level</div>
                </div>
              </>
            )}
            {activeTab === 'bmi' && (
              <div className="result-box">
                <div style={{ fontSize: 13, color: '#b8849a', marginBottom: 4 }}>Body Mass Index</div>
                <div className="result-value">{results.bmi}</div>
                <div className="result-label">{results.bmiCat}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}