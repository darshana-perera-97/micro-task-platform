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

export function Sidebar({ currentView, onViewChange, role, isOpen = false }) {
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
    <>
      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="p-4 space-y-1">
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

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen p-4">
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
    </>
  );
}

