import React from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  FileCheck, 
  Award, 
  User,
  ClipboardCheck,
  CheckSquare,
  XSquare,
  Settings,
  Users
} from 'lucide-react';
import { cn } from '../ui/utils';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  role: 'admin' | 'user' | 'qa';
}

export function Sidebar({ currentView, onViewChange, role }: SidebarProps) {
  const userMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: ListTodo },
    { id: 'submissions', label: 'My Submissions', icon: FileCheck },
    { id: 'points', label: 'Points & Rewards', icon: Award },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const qaMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pending', label: 'Pending Reviews', icon: ClipboardCheck },
    { id: 'approved', label: 'Approved', icon: CheckSquare },
    { id: 'rejected', label: 'Rejected', icon: XSquare },
  ];

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Task Management', icon: Settings },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'submissions', label: 'All Submissions', icon: FileCheck },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : role === 'qa' ? qaMenuItems : userMenuItems;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
