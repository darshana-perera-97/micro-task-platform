import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, ListTodo, FileCheck, Award } from 'lucide-react';
import { useData } from '../../context/DataContext';

import API_URL from '../../config/api';

export function AdminDashboard() {
  const { tasks, submissions } = useData();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/admin/analytics`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setAnalytics(data.data);
            setError(null);
          } else {
            setError('Failed to load analytics');
          }
        } else {
          setError('Failed to load analytics');
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Error loading analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Use real analytics data if available, otherwise fallback to calculated values
  const stats = analytics ? [
    {
      title: 'Total Users',
      value: analytics.overview?.totalUsers || 0,
      icon: Users,
      color: 'text-black/60',
      bgColor: 'bg-black/5',
    },
    {
      title: 'Active Tasks',
      value: analytics.tasks?.active || 0,
      icon: ListTodo,
      color: 'text-black/60',
      bgColor: 'bg-black/5',
    },
    {
      title: 'Total Submissions',
      value: analytics.submissions?.total || 0,
      icon: FileCheck,
      color: 'text-black/60',
      bgColor: 'bg-black/5',
    },
    {
      title: 'Pending Reviews',
      value: analytics.submissions?.pending || 0,
      icon: Award,
      color: 'text-black/60',
      bgColor: 'bg-black/5',
    },
  ] : [
    {
      title: 'Total Users',
      value: 0,
      icon: Users,
      color: 'text-black/60',
      bgColor: 'bg-black/5',
    },
    {
      title: 'Active Tasks',
      value: tasks.filter(t => t.active).length,
      icon: ListTodo,
      color: 'text-black/60',
      bgColor: 'bg-black/5',
    },
    {
      title: 'Total Submissions',
      value: submissions.length,
      icon: FileCheck,
      color: 'text-black/60',
      bgColor: 'bg-black/5',
    },
    {
      title: 'Pending Reviews',
      value: submissions.filter(s => s.status === 'pending').length,
      icon: Award,
      color: 'text-black/60',
      bgColor: 'bg-black/5',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">Admin Dashboard</h2>
          <p className="text-sm sm:text-base text-black/50 font-light">Platform overview and statistics</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-0 shadow-sm bg-white">
              <CardContent className="p-5 sm:p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">Admin Dashboard</h2>
          <p className="text-sm sm:text-base text-black/50 font-light">Platform overview and statistics</p>
        </div>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">Admin Dashboard</h2>
        <p className="text-sm sm:text-base text-black/50 font-light">Platform overview and statistics</p>
        {analytics && (
          <p className="text-xs text-black/40 mt-1">
            Last updated: {new Date(analytics.generatedAt).toLocaleString()}
          </p>
        )}
      </div>

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

      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-light">User Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-black/60">Active Users:</span>
                <span className="text-sm font-medium">{analytics.overview?.activeUsers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-black/60">Pending Users:</span>
                <span className="text-sm font-medium">{analytics.overview?.pendingUsers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-black/60">Regular Users:</span>
                <span className="text-sm font-medium">{analytics.overview?.regularUsers || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-light">Submission Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-black/60">Approved:</span>
                <span className="text-sm font-medium text-green-600">{analytics.submissions?.approved || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-black/60">Rejected:</span>
                <span className="text-sm font-medium text-red-600">{analytics.submissions?.rejected || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-black/60">Approval Rate:</span>
                <span className="text-sm font-medium">{analytics.submissions?.approvalRate || '0%'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

