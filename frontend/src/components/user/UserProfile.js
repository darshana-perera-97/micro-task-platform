import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Award, Mail, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export function UserProfile() {
  const { user } = useAuth();
  const { submissions } = useData();

  if (!user) return null;

  const userSubmissions = submissions.filter(sub => sub.userId === user.id);
  const approvedSubmissions = userSubmissions.filter(sub => sub.status === 'approved');
  const pendingSubmissions = userSubmissions.filter(sub => sub.status === 'pending');

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Profile</h2>
        <p className="text-sm sm:text-base text-gray-600">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="size-24 mb-4">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
              <Badge variant="outline" className="mt-2">User</Badge>
              
              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="size-4 text-gray-400" />
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="size-4 text-gray-400" />
                  <span className="text-gray-600">Joined February 2026</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity Statistics</CardTitle>
            <CardDescription>Your performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="size-4" />
                  <span>Current Points</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">{user.points}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="size-4" />
                  <span>Total Earned</span>
                </div>
                <p className="text-3xl font-bold text-green-600">{user.totalEarned}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="size-4" />
                  <span>Approved Tasks</span>
                </div>
                <p className="text-3xl font-bold text-purple-600">{approvedSubmissions.length}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="size-4" />
                  <span>Pending Reviews</span>
                </div>
                <p className="text-3xl font-bold text-orange-600">{pendingSubmissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

