import React from 'react';

import { Home, QrCode, ShoppingBag, Users, Settings, ForkKnife } from 'lucide-react';
import Header from "@/components/dashboard/Header";
import NavItem from '@/components/dashboard/NavItem';
import UserProfile from '@/components/dashboard/UserProfile';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, selectedOrganization } = useAuth() 

  console.log({selectedOrganization})

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
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="text-xs text-gray-400 mb-1">Managing</div>
          <div className="text-lg font-medium">Chef kiss</div>
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