import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const AuthLayout: React.FC = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Navigate to="/workspace" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">BuddyBuilder</h2>
          <p className="mt-2 text-sm text-gray-400">
            AI-Powered Development Environment
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
