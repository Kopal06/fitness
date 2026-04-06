import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PropTypes from 'prop-types';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useApp();
  return isLoggedIn ? children : <Navigate to="/auth" replace />;
}

ProtectedRoute.propTypes = { children: PropTypes.node.isRequired };