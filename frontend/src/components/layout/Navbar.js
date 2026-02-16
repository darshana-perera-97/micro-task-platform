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
    <nav className="bg-white/80 backdrop-blur-md border-b border-black/5 px-4 sm:px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-black/5"
            onClick={onMenuClick}
          >
            <Menu className="size-5 text-black/60" />
          </Button>
          <div className="p-1.5 bg-black/5 rounded-lg">
            <Award className="size-5 sm:size-6 text-black/70" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-light text-black/80">Task & Reward</h1>
            <Badge variant={roleBadge.variant} className="text-xs hidden sm:inline-block bg-black/5 text-black/60 border-0 font-normal">
              {roleBadge.label}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user.role === 'user' && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-black/5 rounded-lg">
              <Award className="size-4 text-black/50" />
              <span className="text-xs sm:text-sm font-medium text-black/70">{user.points} Points</span>
            </div>
          )}

          <Button variant="ghost" size="icon" className="relative hover:bg-black/5">
            <Bell className="size-4 sm:size-5 text-black/60" />
            <span className="absolute top-1.5 right-1.5 size-2 bg-red-400 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 sm:h-10 gap-2 hover:bg-black/5">
                <Avatar className="size-7 sm:size-8">
                  <AvatarFallback className="bg-black/5 text-black/60 text-xs sm:text-sm font-medium">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-light text-black/70">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border-black/10 shadow-lg">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-black/80">{user.name}</p>
                  <p className="text-xs text-black/50">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-black/5" />
              <DropdownMenuItem className="hover:bg-black/5">
                <User className="size-4 mr-2 text-black/60" />
                <span className="text-black/70">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-black/5" />
              <DropdownMenuItem onClick={logout} className="text-red-500 hover:bg-red-50">
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

