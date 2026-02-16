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
      color: 'text-black/60',
      bgColor: 'bg-black/5',
    },
    {
      title: 'Completed Tasks',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'text-black/60',
      bgColor: 'bg-black/5',
    },
    {
      title: 'Pending Reviews',
      value: pendingReviews,
      icon: Clock,
      color: 'text-black/60',
      bgColor: 'bg-black/5',
    },
    {
      title: 'Available Tasks',
      value: activeTasks,
      icon: Trophy,
      color: 'text-black/60',
      bgColor: 'bg-black/5',
    },
  ];

  const recentSubmissions = userSubmissions
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Pending', className: 'bg-black/10 text-black/70' },
      approved: { label: 'Approved', className: 'bg-black/5 text-black/60' },
      rejected: { label: 'Rejected', className: 'bg-red-50 text-red-600' },
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">Welcome back, {user.name}</h2>
        <p className="text-sm sm:text-base text-black/50 font-light">Here's your task completion overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-0 shadow-sm bg-white">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-black/50 font-light mb-1">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-light text-black/90">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-2.5 rounded-lg`}>
                    <Icon className={`size-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Points Progress */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-light text-black/90">Points Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-black/50 font-light">Current Points</span>
              <span className="font-medium text-black/80">{user.points} / 100</span>
            </div>
            <div className="w-full bg-black/5 rounded-full h-2 overflow-hidden">
              <div
                className="bg-black h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((user.points / 100) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-black/60 font-light">
                {canClaim ? (
                  <span className="text-black/80 font-medium">You can claim your reward!</span>
                ) : (
                  `${100 - user.points} more points to claim`
                )}
              </p>
              {canClaim && (
                <span className="text-xs bg-black/5 text-black/70 px-2.5 py-1 rounded-md font-medium">
                  Ready to claim
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Submissions */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-light text-black/90">Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSubmissions.length === 0 ? (
            <p className="text-black/40 text-center py-12 font-light">No submissions yet. Start completing tasks!</p>
          ) : (
            <div className="space-y-2">
              {recentSubmissions.map((submission) => {
                const statusBadge = getStatusBadge(submission.status);
                return (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 bg-black/5 rounded-lg hover:bg-black/10 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-black/80 text-sm">{submission.taskTitle}</p>
                      <p className="text-xs text-black/40 font-light mt-1">
                        Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-black/70">+{submission.points} pts</span>
                      <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${statusBadge.className}`}>
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

