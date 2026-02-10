import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Youtube, Share2, Globe, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { TaskDetailsModal } from './TaskDetailsModal';

export function TaskList() {
  const { tasks, submissions } = useData();
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState(null);

  if (!user) return null;

  const activeTasks = tasks.filter(t => t.active);
  const userSubmissions = submissions.filter(sub => sub.userId === user.id);

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

  const getStatusBadge = (status) => {
    const badges = {
      new: { label: 'New', variant: 'default' },
      submitted: { label: 'Submitted', variant: 'secondary' },
      approved: { label: 'Approved', variant: 'outline' },
      rejected: { label: 'Rejected', variant: 'destructive' },
    };
    return badges[status] || badges.new;
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Available Tasks</h2>
          <p className="text-sm sm:text-base text-gray-600">Complete tasks to earn points and rewards</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {activeTasks.map((task) => {
            const Icon = getTaskIcon(task.type);
            const status = getTaskStatus(task.id);
            const statusBadge = getStatusBadge(status);
            const canSubmit = status === 'new' || status === 'rejected';

            return (
              <Card key={task.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Icon className="size-6 text-blue-600" />
                    </div>
                    <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                  </div>
                  <CardTitle className="text-lg mt-3">{task.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{task.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-600">{task.points}</span>
                      <span className="text-sm text-gray-600">points</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {task.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => setSelectedTask(task)}
                    variant={canSubmit ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {status === 'approved' ? 'View Details' : canSubmit ? 'View Task' : 'View Status'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {activeTasks.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No active tasks available at the moment.</p>
              <p className="text-sm text-gray-400 mt-1">Check back soon for new opportunities!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          currentStatus={getTaskStatus(selectedTask.id)}
        />
      )}
    </>
  );
}

