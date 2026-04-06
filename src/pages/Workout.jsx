import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const EXERCISES = [
  'Squat', 'Deadlift', 'Bench Press', 'Pull-up', 'Push-up',
  'Shoulder Press', 'Bicep Curl', 'Tricep Dip', 'Lunge', 'Plank',
  'Running', 'Cycling', 'Jump Rope', 'Burpees', 'Row',
];

export default function Workout() {
  const { getData, setData } = useApp();
  const today = new Date().toISOString().split('T')[0];
  const workoutLog = getData('workoutLog', []);

  const [form, setForm] = useState({ exercise: '', sets: '', reps: '', weight: '', duration: '', calories: '', notes: '' });
  const [selectedDate, setSelectedDate] = useState(today);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const streak = (() => {
    const dates = [...new Set(workoutLog.map(w => w.date))].sort().reverse();
    let s = 0;
    let d = new Date(today);
    for (const date of dates) {
      if (date === d.toISOString().split('T')[0]) { s++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return s;
  })();

  const addExercise = () => {
    if (!form.exercise) return;
    const entry = {
      id: Date.now(), date: today,
      exercise: form.exercise,
      sets: Number(form.sets) || 0,
      reps: Number(form.reps) || 0,
      weight: Number(form.weight) || 0,
      duration: Number(form.duration) || 0,
      calories: Number(form.calories) || 0,
      notes: form.notes,
    };
    setData('workoutLog', [...workoutLog, entry]);
    setForm({ exercise: '', sets: '', reps: '', weight: '', duration: '', calories: '', notes: '' });
  };

  const deleteExercise = (id) => setData('workoutLog', workoutLog.filter(w => w.id !== id));

  const dayLog = workoutLog.filter(w => w.date === selectedDate);
  const dayCalories = dayLog.reduce((a, b) => a + b.calories, 0);

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Workout log</h1>
        <div className="streak-badge">🏅 {streak} day streak</div>
      </div>

      {/* Log form */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-title">Log exercise</div>
        <div className="form-group">
          <label className="form-label">Exercise</label>
          <select className="form-select" value={form.exercise} onChange={e => set('exercise', e.target.value)}>
            <option value="">Select exercise</option>
            {EXERCISES.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div className="form-row" style={{ marginBottom: 12 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Sets</label>
            <input className="form-input" type="number" value={form.sets} onChange={e => set('sets', e.target.value)} placeholder="0" min="0" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Reps</label>
            <input className="form-input" type="number" value={form.reps} onChange={e => set('reps', e.target.value)} placeholder="0" min="0" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Weight (kg)</label>
            <input className="form-input" type="number" value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="0" min="0" />
          </div>
        </div>
        <div className="form-row-2" style={{ marginBottom: 12 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Duration (min)</label>
            <input className="form-input" type="number" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="0" min="0" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Active Calories Burned (estimate)</label>
            <input className="form-input" type="number" value={form.calories} onChange={e => set('calories', e.target.value)} placeholder="0" min="0" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Add any notes about this workout..." />
        </div>
        <button className="btn btn-primary" onClick={addExercise}>+ Add exercise</button>
      </div>

      {/* History */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="card-title" style={{ margin: 0 }}>Workout history</div>
          <div className="date-picker-wrap">
            <span>📅</span>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
          </div>
        </div>
        {dayLog.length > 0 && (
          <div className="stat-box" style={{ marginBottom: '1rem' }}>
            <div className="stat-value">{dayCalories} cal</div>
            <div className="stat-label">Total Active Calories Burned</div>
          </div>
        )}
        {dayLog.length === 0
          ? <div style={{ color: '#8a7460', fontSize: 14 }}>No workouts logged for this date.</div>
          : dayLog.map(w => (
            <div key={w.id} className="log-item">
              <div>
                <div className="log-item-name">{w.exercise}</div>
                <div className="log-item-detail">
                  {w.sets > 0 && `${w.sets} sets × ${w.reps} reps @ ${w.weight} kg`}
                  {w.duration > 0 && ` • ${w.duration} min`}
                  {w.calories > 0 && ` • ${w.calories} cal burned`}
                </div>
              </div>
              <button className="delete-btn" onClick={() => deleteExercise(w.id)}>🗑</button>
            </div>
          ))}
      </div>
    </div>
  );
}