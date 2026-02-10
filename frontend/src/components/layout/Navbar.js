import React from 'react';
import { Bell, User, LogOut, Award, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/badge';

export function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleBadge = () => {
    const badges = {
      admin: { label: 'Admin', variant: 'default' },
      qa: { label: 'QA Lead', variant: 'secondary' },
      user: { label: 'User', variant: 'outline' },
    };
    return badges[user.role] || badges.user;
  };

  const roleBadge = getRoleBadge();

  return (
    <nav className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="size-5" />
          </Button>
          <Award className="size-6 sm:size-8 text-blue-600" />
          <div>
            <h1 className="text-sm sm:text-base font-semibold text-gray-900">Task & Reward Platform</h1>
            <Badge variant={roleBadge.variant} className="text-xs hidden sm:inline-block">
              {roleBadge.label}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user.role === 'user' && (
            <div className="hidden sm:flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-blue-50 rounded-lg">
              <Award className="size-4 text-blue-600" />
              <span className="text-xs sm:text-sm font-semibold text-blue-900">{user.points} Points</span>
            </div>
          )}

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-4 sm:size-5" />
            <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 sm:h-10 gap-1 sm:gap-2">
                <Avatar className="size-6 sm:size-8">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs sm:text-sm">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="size-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="size-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

