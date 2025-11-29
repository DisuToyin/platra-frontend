import type { LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

export default function NavItem({ 
  to, 
  icon: Icon, 
  label, 
  onClick 
}: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  const baseClasses = "w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors text-sm font-normal tracking-tight";
  const activeClasses = "bg-blue-600 text-white";
  const inactiveClasses = "text-gray-300 hover:bg-gray-800";
  
  const className = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;

  return (
    <Link
      to={to}
      className={className}
      onClick={onClick}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
}