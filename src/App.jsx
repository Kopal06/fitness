import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import FoodTracker from './pages/FoodTracker';
import Workout from './pages/Workout';
import Progress from './pages/Progress';
import Calculator from './pages/Calculator';
import Settings from './pages/Settings';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<ProtectedRoute><><Navbar /><Home /></></ProtectedRoute>} />
      <Route path="/calculator" element={<ProtectedRoute><><Navbar /><Calculator /></></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><><Navbar /><Dashboard /></></ProtectedRoute>} />
      <Route path="/food" element={<ProtectedRoute><><Navbar /><FoodTracker /></></ProtectedRoute>} />
      <Route path="/workout" element={<ProtectedRoute><><Navbar /><Workout /></></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><><Navbar /><Progress /></></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><><Navbar /><Settings /></></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}