import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import RingChart from '../components/RingChart';

const CALS_PER_STEP = 0.04;

export default function Dashboard() {
  const { getData, setData } = useApp();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [foodOpen, setFoodOpen] = useState(true);
  const [workoutOpen, setWorkoutOpen] = useState(true);
  const [waterAnim, setWaterAnim] = useState(false);

  // Steps inline editing
  const [editingSteps, setEditingSteps] = useState(false);
  const [stepsInput, setStepsInput] = useState('');

  // Sleep inline editing
  const [editingSleep, setEditingSleep] = useState(false);
  const [sleepInput, setSleepInput] = useState('');

  const goals = getData('goals', null);
  const hasGoals = goals && goals.fromCalc;

  const foodLog = getData('foodLog', []);
  const workoutLog = getData('workoutLog', []);
  const waterLog = getData('waterLog', []);
  const progressData = getData('progressData', { steps: 0, sleep: 0 });

  const todayFood = foodLog.filter(f => f.date === today);
  const todayWorkout = workoutLog.filter(w => w.date === today);
  const todayWater = waterLog.filter(w => w.date === today).reduce((a, b) => a + b.cups, 0);

  const totalCals = todayFood.reduce((a, b) => a + b.calories, 0);
  const totalProtein = todayFood.reduce((a, b) => a + b.protein, 0);
  const totalCarbs = todayFood.reduce((a, b) => a + b.carbs, 0);
  const totalFat = todayFood.reduce((a, b) => a + b.fat, 0);

  const workoutCalsBurned = todayWorkout.reduce((a, b) => a + (b.calories || 0), 0);
  const stepCalsBurned = Math.round((Number(progressData.steps) || 0) * CALS_PER_STEP);
  const totalCalsBurned = workoutCalsBurned + stepCalsBurned;
  const netCals = Math.max(0, totalCals - totalCalsBurned);

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const logWater = () => {
    const entry = { date: today, cups: 1, id: Date.now() };
    setData('waterLog', [...waterLog, entry]);
    setWaterAnim(true);
    setTimeout(() => setWaterAnim(false), 600);
  };

  const saveSteps = () => {
    const val = Math.max(0, Number(stepsInput) || 0);
    setData('progressData', { ...progressData, steps: val });
    setEditingSteps(false);
  };

  const saveSleep = () => {
    const val = Math.max(0, Number(sleepInput) || 0);
    setData('progressData', { ...progressData, sleep: val });
    setEditingSleep(false);
  };

  // Styles
  const statBox = {
    background: '#fce4ea',
    borderRadius: 12,
    padding: '1rem',
    textAlign: 'center',
  };
  const statValue = { fontSize: 22, fontWeight: 700, color: '#2d1f26' };
  const statLabel = { fontSize: 12, color: '#9e7080', marginTop: 4, fontWeight: 500 };
  const statSub = { fontSize: 11, color: '#b8849a', marginTop: 4 };

  const secondaryBtn = {
    background: '#fce4ea',
    color: '#c0627a',
    border: 'none',
    borderRadius: 10,
    padding: '12px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'opacity 0.15s',
  };

  const outlineBtn = {
    background: '#fff',
    border: '2px solid #f4a0b5',
    color: '#c0627a',
    borderRadius: 10,
    padding: '12px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'opacity 0.15s',
  };

  const logBtn = {
    marginTop: 8,
    background: '#fce4ea',
    color: '#c0627a',
    border: 'none',
    borderRadius: 8,
    padding: '6px 14px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  };

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>
      <div style={{ color: '#b8849a', marginBottom: '1.5rem', fontSize: 15 }}>{dateStr}</div>

      {/* No goals banner */}
      {!hasGoals && (
        <div style={{
          background: '#fce4ea', border: '1.5px solid #f5cfd8', borderRadius: 14,
          padding: '1rem 1.25rem', marginBottom: '1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#c0627a', marginBottom: 2 }}>
              Dashboard rings are inactive
            </div>
            <div style={{ fontSize: 13, color: '#9e7080' }}>
              Calculate your macros in the Calculator to activate your daily rings.
            </div>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: 'auto', whiteSpace: 'nowrap' }}
            onClick={() => navigate('/calculator')}
          >
            Go to Calculator →
          </button>
        </div>
      )}

      {/* Rings card */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        {!hasGoals ? (
          <div style={{ opacity: 0.4, pointerEvents: 'none' }}>
            <div className="rings-row">
              {['Calories', 'Protein', 'Carbs', 'Fat'].map(label => (
                <div key={label} className="ring-wrap">
                  <svg width={90} height={90} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={45} cy={45} r={35} fill="none" stroke="#fce4ea" strokeWidth={8} />
                  </svg>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#2d1f26', marginTop: -4 }}>0</div>
                    <div className="ring-label">left</div>
                  </div>
                  <div className="ring-label">{label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: '#b8849a' }}>Daily calorie goal</span>
                <span style={{ fontWeight: 600 }}>0%</span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: '0%' }} />
              </div>
            </div>
            <div className="grid-3" style={{ marginTop: '1rem' }}>
              <div><span style={{ fontSize: 12, color: '#b8849a' }}>Carbs</span><div style={{ fontWeight: 600, fontSize: 15 }}>0g</div></div>
              <div><span style={{ fontSize: 12, color: '#b8849a' }}>Protein</span><div style={{ fontWeight: 600, fontSize: 15 }}>0g</div></div>
              <div><span style={{ fontSize: 12, color: '#b8849a' }}>Fat</span><div style={{ fontWeight: 600, fontSize: 15 }}>0g</div></div>
            </div>
          </div>
        ) : (
          <>
            <div className="rings-row">
              <RingChart value={netCals} max={goals.calories} size={90} color="#e07090" label="Calories" sublabel={`${Math.max(0, goals.calories - netCals)} left`} />
              <RingChart value={totalProtein} max={goals.protein} size={90} color="#f4a0b5" label="Protein" sublabel={`${Math.max(0, goals.protein - totalProtein)}g left`} />
              <RingChart value={totalCarbs} max={goals.carbs} size={90} color="#c96b85" label="Carbs" sublabel={`${Math.max(0, goals.carbs - totalCarbs)}g left`} />
              <RingChart value={totalFat} max={goals.fat} size={90} color="#e8b4c2" label="Fat" sublabel={`${Math.max(0, goals.fat - totalFat)}g left`} />
            </div>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: '#b8849a' }}>Daily calorie goal</span>
                <span style={{ fontWeight: 600 }}>{Math.round((netCals / goals.calories) * 100)}%</span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${Math.min(100, Math.max(0, (netCals / goals.calories) * 100))}%` }} />
              </div>
            </div>
            <div className="grid-3" style={{ marginTop: '1rem' }}>
              <div><span style={{ fontSize: 12, color: '#b8849a' }}>Carbs</span><div style={{ fontWeight: 600, fontSize: 15 }}>{totalCarbs}g</div></div>
              <div><span style={{ fontSize: 12, color: '#b8849a' }}>Protein</span><div style={{ fontWeight: 600, fontSize: 15 }}>{totalProtein}g</div></div>
              <div><span style={{ fontSize: 12, color: '#b8849a' }}>Fat</span><div style={{ fontWeight: 600, fontSize: 15 }}>{totalFat}g</div></div>
            </div>
          </>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid-3" style={{ marginBottom: '1rem' }}>
        <div style={statBox}>
          <div style={statValue}>{totalCals}</div>
          <div style={statLabel}>Calories consumed</div>
        </div>
        <div style={statBox}>
          <div style={statValue}>{totalCalsBurned}</div>
          <div style={statLabel}>Active Calories Burned</div>
          <div style={statSub}>{workoutCalsBurned} workout + {stepCalsBurned} steps</div>
        </div>
        <div style={{
          ...statBox,
          background: waterAnim ? '#f5c6d3' : '#fce4ea',
          transition: 'background 0.3s',
        }}>
          <div style={statValue}>{todayWater}</div>
          <div style={statLabel}>Water (cups)</div>
        </div>
      </div>

      {/* Steps + Sleep inline log row */}
      <div className="grid-2" style={{ marginBottom: '1rem' }}>

        {/* Steps */}
        <div style={statBox}>
          <div style={statValue}>{progressData.steps || 0}</div>
          <div style={statLabel}>Steps today</div>
          {stepCalsBurned > 0 && <div style={statSub}>≈ {stepCalsBurned} cal burned</div>}
          {editingSteps ? (
            <div style={{ marginTop: 8, display: 'flex', gap: 6, justifyContent: 'center' }}>
              <input
                type="number"
                min="0"
                value={stepsInput}
                onChange={e => setStepsInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveSteps()}
                placeholder="e.g. 8000"
                autoFocus
                style={{
                  width: 110, padding: '5px 10px', borderRadius: 8,
                  border: '1.5px solid #f4a0b5', fontSize: 13,
                  fontFamily: 'inherit', outline: 'none', color: '#2d1f26',
                }}
              />
              <button style={{ ...logBtn, padding: '6px 10px' }} onClick={saveSteps}>✓</button>
              <button style={{ ...logBtn, padding: '6px 10px', background: '#fff', border: '1px solid #f5cfd8', color: '#b8849a' }} onClick={() => setEditingSteps(false)}>✕</button>
            </div>
          ) : (
            <button style={logBtn} onClick={() => { setStepsInput(progressData.steps || ''); setEditingSteps(true); }}>
              + Log steps
            </button>
          )}
        </div>

        {/* Sleep */}
        <div style={statBox}>
          <div style={statValue}>{progressData.sleep || 0}h</div>
          <div style={statLabel}>Sleep last night</div>
          {editingSleep ? (
            <div style={{ marginTop: 8, display: 'flex', gap: 6, justifyContent: 'center' }}>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={sleepInput}
                onChange={e => setSleepInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveSleep()}
                placeholder="e.g. 7.5"
                autoFocus
                style={{
                  width: 110, padding: '5px 10px', borderRadius: 8,
                  border: '1.5px solid #f4a0b5', fontSize: 13,
                  fontFamily: 'inherit', outline: 'none', color: '#2d1f26',
                }}
              />
              <button style={{ ...logBtn, padding: '6px 10px' }} onClick={saveSleep}>✓</button>
              <button style={{ ...logBtn, padding: '6px 10px', background: '#fff', border: '1px solid #f5cfd8', color: '#b8849a' }} onClick={() => setEditingSleep(false)}>✕</button>
            </div>
          ) : (
            <button style={logBtn} onClick={() => { setSleepInput(progressData.sleep || ''); setEditingSleep(true); }}>
              + Log sleep
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={() => navigate('/food')}>
          + Log meal
        </button>
        <button style={secondaryBtn} onClick={() => navigate('/workout')}>
          + Log workout
        </button>
        <button style={outlineBtn} onClick={logWater}>
          + Log water
        </button>
      </div>

      {/* Food log */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="section-header" onClick={() => setFoodOpen(o => !o)}>
          <span className="card-title" style={{ margin: 0 }}>Today's food log</span>
          <span className="collapse-toggle">{foodOpen ? '∧' : '∨'}</span>
        </div>
        {foodOpen && (
          todayFood.length === 0
            ? <div style={{ color: '#b8849a', fontSize: 14 }}>Nothing logged yet</div>
            : todayFood.map(f => (
              <div key={f.id} className="log-item">
                <div>
                  <div className="log-item-name">{f.name}</div>
                  <div className="log-item-detail">{f.calories} cal • {f.amount}</div>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Workout log */}
      <div className="card">
        <div className="section-header" onClick={() => setWorkoutOpen(o => !o)}>
          <span className="card-title" style={{ margin: 0 }}>Today's workouts</span>
          <span className="collapse-toggle">{workoutOpen ? '∧' : '∨'}</span>
        </div>
        {workoutOpen && (
          todayWorkout.length === 0
            ? <div style={{ color: '#b8849a', fontSize: 14 }}>No workouts logged yet</div>
            : todayWorkout.map(w => (
              <div key={w.id} className="log-item">
                <div>
                  <div className="log-item-name">{w.exercise}</div>
                  <div className="log-item-detail">{w.sets} sets × {w.reps} reps @ {w.weight} kg</div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}