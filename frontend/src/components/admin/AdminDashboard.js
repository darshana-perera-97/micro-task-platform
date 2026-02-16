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

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">Admin Dashboard</h2>
        <p className="text-sm sm:text-base text-black/50 font-light">Platform overview and statistics</p>
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
    </div>
  );
}

