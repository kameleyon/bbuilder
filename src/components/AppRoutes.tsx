import { Routes, Route } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import { SignUp } from '@clerk/clerk-react';
import { Dashboard } from './dashboard/Dashboard';
import { AuthLayout } from './auth/AuthLayout';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/sign-in/*" element={
        <AuthLayout>
          <SignIn routing="path" path="/sign-in" />
        </AuthLayout>
      } />
      <Route path="/sign-up/*" element={
        <AuthLayout>
          <SignUp routing="path" path="/sign-up" />
        </AuthLayout>
      } />
      <Route path="/*" element={<Dashboard />} />
    </Routes>
  );
}