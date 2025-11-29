import React, { use } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface OrganizationProtectedRouteProps {
  children: React.ReactNode;
}

const OrganizationProtectedRoute = ({ children }: OrganizationProtectedRouteProps) => {
  const { user, loading } = useAuth();
  console.log({organizationProtected: user})


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (user && !user.org_id) {
    return <Navigate to="/businesses" replace />;
  }

  return <>{children}</>;
};

export default OrganizationProtectedRoute;