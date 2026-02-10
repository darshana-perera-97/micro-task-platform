import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Settings, Users, ListTodo, FileCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { mockUsers } from '../../data/mockData';

export function AdminDashboard() {
  const { tasks, submissions } = useData();

  const activeTasksCount = tasks.filter(t => t.active).length;
  const totalUsers = mockUsers.filter(u => u.role === 'user').length;
  const pendingReviews = submissions.filter(sub => sub.status === 'pending').length;
  const totalSubmissions = submissions.length;

  const stats = [
    {
      title: 'Active Tasks',
      value: activeTasksCount,
      total: tasks.length,
      icon: ListTodo,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pending Reviews',
      value: pendingReviews,
      icon: FileCheck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Total Submissions',
      value: totalSubmissions,
      icon: Settings,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const topUsers = mockUsers
    .filter(u => u.role === 'user')
    .sort((a, b) => b.totalEarned - a.totalEarned)
    .slice(0, 5);

  const recentSubmissions = submissions
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-orange-100 text-orange-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600">Manage tasks, users, and monitor platform activity</p>
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
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {stat.value}
                      {stat.total !== undefined && (
                        <span className="text-base text-gray-400 ml-1">/ {stat.total}</span>
                      )}
                    </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Users */}
        <Card>
          <CardHeader>
            <CardTitle>Top Users by Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topUsers.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{user.totalEarned} pts</p>
                    <p className="text-xs text-gray-500">{user.points} current</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{submission.taskTitle}</p>
                    <p className="text-xs text-gray-600">
                      {submission.userName} • {new Date(submission.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(submission.status)}`}>
                    {submission.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Task Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Active Tasks</span>
                <span className="font-semibold text-gray-900">
                  {activeTasksCount} / {tasks.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(activeTasksCount / tasks.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">YouTube</p>
                <p className="text-xl font-bold text-gray-900">
                  {tasks.filter(t => t.type === 'youtube').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Social Media</p>
                <p className="text-xl font-bold text-gray-900">
                  {tasks.filter(t => t.type === 'social_media').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Other</p>
                <p className="text-xl font-bold text-gray-900">
                  {tasks.filter(t => t.type !== 'youtube' && t.type !== 'social_media').length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
