import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Award, CheckCircle2, Clock, Trophy, Youtube, Share2, Globe, FileText, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TaskDetailsModal } from './TaskDetailsModal';

import API_URL from '../../config/api';

export function UserDashboard() {
  const { user, fetchProfile } = useAuth();
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token || !user) {
          setLoading(false);
          return;
        }

        // Fetch active tasks
        const tasksResponse = await fetch(`${API_URL}/tasks`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          if (tasksData.success && tasksData.data) {
            setTasks(tasksData.data);
          }
        }

        // Fetch user submissions
        const submissionsResponse = await fetch(`${API_URL}/submissions/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (submissionsResponse.ok) {
          const submissionsData = await submissionsResponse.json();
          if (submissionsData.success && submissionsData.data) {
            setSubmissions(submissionsData.data);
          }
        }

        // Fetch user points
        const pointsResponse = await fetch(`${API_URL}/points/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (pointsResponse.ok) {
          const pointsData = await pointsResponse.json();
          if (pointsData.success && pointsData.data) {
            setUserPoints(pointsData.data.points || 0);
          }
        }

        // Refresh user profile to get latest points
        if (fetchProfile) {
          await fetchProfile(token);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, fetchProfile]);

  if (!user) return null;

  const userSubmissions = submissions.filter(sub => sub.userId === user.id);
  const completedTasks = userSubmissions.filter(sub => sub.status === 'approved').length;
  const pendingReviews = userSubmissions.filter(sub => sub.status === 'pending').length;
  const canClaim = (userPoints || user.points || 0) >= 100;
  
  // Filter out tasks that have already been submitted (one attempt only)
  const activeTasksList = tasks.filter(t => {
    if (!t.active) return false;
    
    // Check if user has already submitted this task (any status - one attempt only)
    const submission = userSubmissions.find(sub => sub.taskId === t.id);
    
    // Only include tasks that have never been submitted (one attempt only)
    return !submission;
  });
  
  const activeTasks = activeTasksList.length;
  
  // Show first 6 available tasks
  const availableTasksPreview = activeTasksList.slice(0, 6);

  const getTaskStatus = (taskId) => {
    const submission = userSubmissions.find(sub => sub.taskId === taskId);
    if (!submission) return 'new';
    return submission.status === 'pending' ? 'submitted' : submission.status;
  };

  const getTaskIcon = (type) => {
    const icons = {
      youtube: Youtube,
      social_media: Share2,
      website_visit: Globe,
      survey: FileText,
    };
    return icons[type] || FileText;
  };

  const stats = [
    {
      title: 'Total Points',
      value: userPoints || user.points || 0,
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
              <span className="font-medium text-black/80">{userPoints || user.points || 0} / 100</span>
            </div>
            <div className="w-full bg-black/5 rounded-full h-2 overflow-hidden">
              <div
                className="bg-black h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(((userPoints || user.points || 0) / 100) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-black/60 font-light">
                {canClaim ? (
                  <span className="text-black/80 font-medium">You can claim your reward!</span>
                ) : (
                  `${100 - (userPoints || user.points || 0)} more points to claim`
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

      {/* Available Tasks */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-light text-black/90">Available Tasks</CardTitle>
            {activeTasks > 6 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Navigate to tasks view - you can implement navigation here
                  window.location.hash = '#tasks';
                }}
                className="text-xs text-black/60 hover:text-black/90"
              >
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {activeTasksList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-black/40 font-light mb-2">No active tasks available at the moment.</p>
              <p className="text-black/30 text-xs font-light">Check back soon for new opportunities!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {availableTasksPreview.map((task) => {
                const Icon = getTaskIcon(task.type);
                const status = getTaskStatus(task.id);
                const canSubmit = status === 'new' || status === 'rejected';
                
                return (
                  <Card
                    key={task.id}
                    className="flex flex-col border-0 shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="bg-black/5 p-2 rounded-lg">
                          <Icon className="size-4 text-black/60" />
                        </div>
                        <Badge variant="outline" className="text-xs bg-black/5 text-black/50 border-0 font-normal">
                          {task.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <CardTitle className="text-base font-medium text-black/80 line-clamp-2">{task.title}</CardTitle>
                      <p className="text-xs text-black/50 font-light line-clamp-2 mt-1">{task.description}</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-light text-black/90">{task.points}</span>
                          <span className="text-xs text-black/50 font-light">pts</span>
                        </div>
                        <Button
                          size="sm"
                          variant={canSubmit ? 'default' : 'outline'}
                          className={canSubmit 
                            ? "bg-black hover:bg-black/90 text-white text-xs h-8" 
                            : "bg-white border border-black/10 hover:bg-black/5 text-black/70 text-xs h-8"
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task);
                          }}
                        >
                          {status === 'approved' ? 'View' : canSubmit ? 'Start' : 'View'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
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

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          currentStatus={getTaskStatus(selectedTask.id)}
        />
      )}
    </div>
  );
}

