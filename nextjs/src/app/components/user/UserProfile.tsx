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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Profile</h2>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            <div className="grid grid-cols-2 gap-6">
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

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold text-gray-900 mb-3">Completion Rate</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-semibold text-gray-900">
                    {userSubmissions.length > 0
                      ? Math.round((approvedSubmissions.length / userSubmissions.length) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        userSubmissions.length > 0
                          ? (approvedSubmissions.length / userSubmissions.length) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Completed Tasks</CardTitle>
          <CardDescription>Your latest approved submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {approvedSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No completed tasks yet</p>
              <p className="text-sm text-gray-400 mt-1">Start completing tasks to build your history</p>
            </div>
          ) : (
            <div className="space-y-3">
              {approvedSubmissions.slice(0, 5).map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{submission.taskTitle}</p>
                    <p className="text-sm text-gray-600">
                      Completed {new Date(submission.reviewedAt || submission.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">+{submission.points} points</p>
                    <Badge variant="outline" className="text-xs mt-1">Approved</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
