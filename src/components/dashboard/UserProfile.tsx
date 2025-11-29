import { ChevronDown } from 'lucide-react';

interface UserProfileProps {
  display_name: string;
  role: string;
  initials: string;
}

export default function UserProfile({ display_name, role, initials }: UserProfileProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">{display_name}</div>
        <div className="text-xs text-gray-400">{role}</div>
      </div>
      <ChevronDown size={16} className="text-gray-400" />
    </div>
  );
}