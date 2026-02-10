import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ClipboardCheck, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function QADashboard() {
  const { submissions } = useData();

  const pendingCount = submissions.filter(sub => sub.status === 'pending').length;
  const approvedCount = submissions.filter(sub => sub.status === 'approved').length;
  const rejectedCount = submissions.filter(sub => sub.status === 'rejected').length;
  const totalSubmissions = submissions.length;

  const stats = [
    {
      title: 'Pending Reviews',
      value: pendingCount,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Approved',
      value: approvedCount,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Rejected',
      value: rejectedCount,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Total Submissions',
      value: totalSubmissions,
      icon: ClipboardCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">QA Dashboard</h2>
        <p className="text-sm sm:text-base text-gray-600">Review and manage task submissions</p>
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

