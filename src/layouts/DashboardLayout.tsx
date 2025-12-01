import React from 'react';

import { Home, QrCode, ShoppingBag, Users, Settings, ForkKnife, Loader2 } from 'lucide-react';
import Header from "@/components/dashboard/Header";
import NavItem from '@/components/dashboard/NavItem';
import UserProfile from '@/components/dashboard/UserProfile';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/lib/utils';
import { Navigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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
  
  if (user && !user.org_id || user?.org_id=="") {
    return <Navigate to="/businesses" replace />;
  }

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/menu', icon: ForkKnife, label: 'Menu' },
    { to: '/qrcodes', icon: QrCode, label: 'QR Codes' },
    { to: '/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/staff', icon: Users, label: 'Staff' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">

        <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              {user?.logo_url ? (
                <img
                  src={user?.logo_url}
                  alt={user?.organization_name}
                  className="w-11 h-11 rounded-xl object-cover border-2 border-gray-700"
                />
              ) : (
                <div className="w-11 h-11 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center border-2 border-gray-700">
                  <span className="text-white font-bold text-sm">
                    {user?.organization_name?.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-600 rounded-full border-2 border-gray-900"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-blue-400 mb-0.5">Managing</div>
              <div className="text-sm font-semibold text-white truncate">
                {user?.organization_name}
              </div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2 pt-2">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          {user && <UserProfile
            display_name={user.display_name}
            role="Restaurant Owner"
            initials={getInitials(user.display_name)}
          /> }

        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {user && <Header
          title="Dashboard"
          subtitle={`Welcome back, ${user.display_name}`}
          userName={user.display_name}
          userEmail={user.email}
          userInitials={getInitials(user.display_name)}
        />}

        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}