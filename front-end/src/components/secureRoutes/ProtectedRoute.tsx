import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  isAllowed: boolean;
  children: React.ReactElement;
}

export default function ProtectedRoute({ isAllowed, children }: Props) {
  if (!isAllowed) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
