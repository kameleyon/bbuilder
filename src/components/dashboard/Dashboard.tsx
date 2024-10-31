import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';

export function Dashboard() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <DashboardLayout />;
}