import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Users,
  Gift
} from 'lucide-react';
import { cn } from '../ui/utils';

export function Sidebar({ role, isOpen = false, onClose }) {
  const location = useLocation();

  const userMenuItems = [
    { path: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/user/tasks', label: 'Tasks', icon: ListTodo },
    { path: '/user/submissions', label: 'My Submissions', icon: FileCheck },
    { path: '/user/points', label: 'Points & Rewards', icon: Award },
    { path: '/user/profile', label: 'Profile', icon: User },
  ];

  const qaMenuItems = [
    { path: '/qa/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/qa/pending', label: 'Pending Reviews', icon: ClipboardCheck },
    { path: '/qa/approved', label: 'Approved', icon: CheckSquare },
    { path: '/qa/rejected', label: 'Rejected', icon: XSquare },
  ];

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/tasks', label: 'Task Management', icon: Settings },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/submissions', label: 'All Submissions', icon: FileCheck },
    { path: '/admin/claims', label: 'Claims', icon: Gift },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : role === 'qa' ? qaMenuItems : userMenuItems;

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white/95 backdrop-blur-md border-r border-black/5 transform transition-transform duration-300 ease-in-out lg:hidden shadow-xl',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                  isActive
                    ? 'bg-black/5 text-black font-medium'
                    : 'text-black/60 hover:bg-black/5 hover:text-black/80'
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:block w-64 bg-white/50 backdrop-blur-sm border-r border-black/5 p-5 fixed top-[73px] left-0 h-[calc(100vh-73px)] z-20 overflow-y-auto"
      )}>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                  isActive
                    ? 'bg-black/5 text-black font-medium'
                    : 'text-black/60 hover:bg-black/5 hover:text-black/80'
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

