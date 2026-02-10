import React from 'react';
import { Bell, User, LogOut, Award } from 'lucide-react';
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

export function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleBadge = () => {
    const badges = {
      admin: { label: 'Admin', variant: 'default' as const },
      qa: { label: 'QA Lead', variant: 'secondary' as const },
      user: { label: 'User', variant: 'outline' as const },
    };
    return badges[user.role];
  };

  const roleBadge = getRoleBadge();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award className="size-8 text-blue-600" />
          <div>
            <h1 className="font-semibold text-gray-900">Task & Reward Platform</h1>
            <Badge variant={roleBadge.variant} className="text-xs">
              {roleBadge.label}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'user' && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
              <Award className="size-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">{user.points} Points</span>
            </div>
          )}

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-5" />
            <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 gap-2">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-blue-100 text-blue-700">
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
