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

  const goals = getData('goals', { calories: 2000, protein: 150, carbs: 200, fat: 65 });
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

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>
      <div style={{ color: '#8a7460', marginBottom: '1.5rem', fontSize: 15 }}>{dateStr}</div>

      {/* Rings */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="rings-row">
          <RingChart value={netCals} max={goals.calories} size={90} color="#7a5c30" label="Calories" sublabel={`${Math.max(0, goals.calories - netCals)} left`} />
          <RingChart value={totalProtein} max={goals.protein || 150} size={90} color="#c0834d" label="Protein" sublabel={`${Math.max(0, (goals.protein || 150) - totalProtein)}g left`} />
          <RingChart value={totalCarbs} max={goals.carbs || 200} size={90} color="#b5a06e" label="Carbs" sublabel={`${Math.max(0, (goals.carbs || 200) - totalCarbs)}g left`} />
          <RingChart value={totalFat} max={goals.fat || 65} size={90} color="#8a6d3a" label="Fat" sublabel={`${Math.max(0, (goals.fat || 65) - totalFat)}g left`} />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
            <span style={{ color: '#8a7460' }}>Daily calorie goal</span>
            <span style={{ fontWeight: 600 }}>{Math.round((netCals / goals.calories) * 100)}%</span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${Math.min(100, Math.max(0, (netCals / goals.calories) * 100))}%` }} />
          </div>
        </div>
        <div className="grid-3" style={{ marginTop: '1rem' }}>
          <div><span style={{ fontSize: 12, color: '#8a7460' }}>Carbs</span><div style={{ fontWeight: 600, fontSize: 15 }}>{totalCarbs}g</div></div>
          <div><span style={{ fontSize: 12, color: '#8a7460' }}>Protein</span><div style={{ fontWeight: 600, fontSize: 15 }}>{totalProtein}g</div></div>
          <div><span style={{ fontSize: 12, color: '#8a7460' }}>Fat</span><div style={{ fontWeight: 600, fontSize: 15 }}>{totalFat}g</div></div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid-3" style={{ marginBottom: '1rem' }}>
        <div className="stat-box">
          <div className="stat-value">{totalCals}</div>
          <div className="stat-label">Calories consumed</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{totalCalsBurned}</div>
          <div className="stat-label">Active Calories Burned</div>
          <div style={{ fontSize: 11, color: '#8a7460', marginTop: 4 }}>
            {workoutCalsBurned} workout + {stepCalsBurned} steps
          </div>
        </div>
        <div
          className="stat-box"
          style={{ transition: 'background 0.3s', background: waterAnim ? '#d4eaf7' : '#f3ede4' }}
        >
          <div className="stat-value">{todayWater}</div>
          <div className="stat-label">Water (cups)</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '1rem' }}>
        <div className="stat-box">
          <div className="stat-value">{progressData.steps || 0}</div>
          <div className="stat-label">Steps today</div>
          {stepCalsBurned > 0 && (
            <div style={{ fontSize: 11, color: '#8a7460', marginTop: 4 }}>≈ {stepCalsBurned} cal burned</div>
          )}
        </div>
        <div className="stat-box">
          <div className="stat-value">{progressData.sleep || 0}h</div>
          <div className="stat-label">Sleep last night</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={() => navigate('/food')}>+ Log meal</button>
        <button
          className="btn"
          style={{ background: '#f3ede4', color: '#2c2416', border: 'none', borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          onClick={() => navigate('/workout')}
        >+ Log workout</button>
        <button
          className="btn"
          style={{ background: '#fff', border: '1.5px solid #e0d5c5', color: '#2c2416', borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          onClick={logWater}
        >+ Log water</button>
      </div>

      {/* Food log */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="section-header" onClick={() => setFoodOpen(o => !o)}>
          <span className="card-title" style={{ margin: 0 }}>Today's food log</span>
          <span className="collapse-toggle">{foodOpen ? '∧' : '∨'}</span>
        </div>
        {foodOpen && (
          todayFood.length === 0
            ? <div style={{ color: '#8a7460', fontSize: 14 }}>Nothing logged yet</div>
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
            ? <div style={{ color: '#8a7460', fontSize: 14 }}>No workouts logged yet</div>
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