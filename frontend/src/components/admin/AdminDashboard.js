import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, ListTodo, FileCheck, Award } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { mockUsers } from '../../data/mockData';

export function AdminDashboard() {
  const { tasks, submissions } = useData();

  const stats = [
    {
      title: 'Total Users',
      value: mockUsers.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Tasks',
      value: tasks.filter(t => t.active).length,
      icon: ListTodo,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Submissions',
      value: submissions.length,
      icon: FileCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pending Reviews',
      value: submissions.filter(s => s.status === 'pending').length,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Admin Dashboard</h2>
        <p className="text-sm sm:text-base text-gray-600">Platform overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-2 sm:p-3 rounded-lg`}>
                    <Icon className={`size-5 sm:size-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

