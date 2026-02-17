import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ClipboardCheck, CheckCircle2, XCircle, Clock } from 'lucide-react';

import API_URL from '../../config/api';

export function QADashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch all submissions (QA can see all)
        const response = await fetch(`${API_URL}/qa/submissions`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setSubmissions(data.data);
            console.log('QA Dashboard - Submissions loaded:', data.data.length);
          }
        } else {
          console.error('Failed to fetch submissions for QA dashboard');
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const pendingCount = submissions.filter(sub => sub.status === 'pending').length;
  const approvedCount = submissions.filter(sub => sub.status === 'approved').length;
  const rejectedCount = submissions.filter(sub => sub.status === 'rejected').length;
  const totalSubmissions = submissions.length;

  const stats = [
    {
      title: 'Pending Reviews',
      value: pendingCount,
      icon: Clock,
      color: 'text-black/60',
      bgColor: 'bg-black/5',
    },
    {
      title: 'Approved',
      value: approvedCount,
      icon: CheckCircle2,
      color: 'text-black/60',
      bgColor: 'bg-black/5',
    },
    {
      title: 'Rejected',
      value: rejectedCount,
      icon: XCircle,
      color: 'text-black/60',
      bgColor: 'bg-black/5',
    },
    {
      title: 'Total Submissions',
      value: totalSubmissions,
      icon: ClipboardCheck,
      color: 'text-black/60',
      bgColor: 'bg-black/5',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">QA Dashboard</h2>
          <p className="text-sm sm:text-base text-black/50 font-light">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-sm bg-white animate-pulse">
              <CardContent className="p-5 sm:p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">QA Dashboard</h2>
        <p className="text-sm sm:text-base text-black/50 font-light">Review and manage task submissions</p>
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

