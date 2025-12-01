import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
      const { user, loading } = useAuth() 
     
      if (loading) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        );
      }
    
      if (!user) {
        return <Navigate to="/login" replace />;
      }
      

  return (
    <div className="min-h-screen flex items-center justify-center">
    {children}
    </div>

  );
};

export default AppLayout;