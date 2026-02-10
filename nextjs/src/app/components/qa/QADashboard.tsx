import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ClipboardCheck, CheckSquare, XSquare, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function QADashboard() {
  const { submissions } = useData();

  const pendingCount = submissions.filter(sub => sub.status === 'pending').length;
  const approvedCount = submissions.filter(sub => sub.status === 'approved').length;
  const rejectedCount = submissions.filter(sub => sub.status === 'rejected').length;
  const totalReviews = approvedCount + rejectedCount;

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
      icon: CheckSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Rejected',
      value: rejectedCount,
      icon: XSquare,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Total Reviewed',
      value: totalReviews,
      icon: ClipboardCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  const recentReviews = submissions
    .filter(sub => sub.status !== 'pending')
    .sort((a, b) => {
      const dateA = new Date(a.reviewedAt || a.submittedAt).getTime();
      const dateB = new Date(b.reviewedAt || b.submittedAt).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    return status === 'approved' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">QA Dashboard</h2>
        <p className="text-gray-600">Review and manage task submissions</p>
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

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {recentReviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews yet</p>
          ) : (
            <div className="space-y-3">
              {recentReviews.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{submission.taskTitle}</p>
                    <p className="text-sm text-gray-600">
                      By {submission.userName} • {new Date(submission.reviewedAt || submission.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-blue-600">{submission.points} pts</span>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(submission.status)}`}>
                      {submission.status === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Approval Rate</span>
                <span className="font-semibold text-gray-900">
                  {totalReviews > 0 ? Math.round((approvedCount / totalReviews) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalReviews > 0 ? (approvedCount / totalReviews) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
