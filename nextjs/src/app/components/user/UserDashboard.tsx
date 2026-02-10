import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Award, CheckCircle2, Clock, Trophy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export function UserDashboard() {
  const { user } = useAuth();
  const { submissions, tasks } = useData();

  if (!user) return null;

  const userSubmissions = submissions.filter(sub => sub.userId === user.id);
  const completedTasks = userSubmissions.filter(sub => sub.status === 'approved').length;
  const pendingReviews = userSubmissions.filter(sub => sub.status === 'pending').length;
  const canClaim = user.points >= 100;
  const activeTasks = tasks.filter(t => t.active).length;

  const stats = [
    {
      title: 'Total Points',
      value: user.points,
      icon: Award,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Completed Tasks',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Reviews',
      value: pendingReviews,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Available Tasks',
      value: activeTasks,
      icon: Trophy,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const recentSubmissions = userSubmissions
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: 'Pending', className: 'bg-orange-100 text-orange-800' },
      approved: { label: 'Approved', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Welcome back, {user.name}!</h2>
        <p className="text-gray-600">Here's your task completion overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`size-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Points Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Points Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Current Points</span>
              <span className="font-semibold text-gray-900">{user.points} / 100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((user.points / 100) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {canClaim ? (
                  <span className="text-green-600 font-medium">🎉 You can claim your reward!</span>
                ) : (
                  `${100 - user.points} more points to claim`
                )}
              </p>
              {canClaim && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Ready to claim
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSubmissions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No submissions yet. Start completing tasks!</p>
          ) : (
            <div className="space-y-3">
              {recentSubmissions.map((submission) => {
                const statusBadge = getStatusBadge(submission.status);
                return (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{submission.taskTitle}</p>
                      <p className="text-sm text-gray-600">
                        Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-blue-600">+{submission.points} pts</span>
                      <span className={`text-xs px-2 py-1 rounded ${statusBadge.className}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
