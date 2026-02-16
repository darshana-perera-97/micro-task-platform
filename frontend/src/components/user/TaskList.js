import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Youtube, Share2, Globe, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { TaskDetailsModal } from './TaskDetailsModal';
import { cn } from '../ui/utils';

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
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">Available Tasks</h2>
          <p className="text-sm sm:text-base text-black/50 font-light">Complete tasks to earn points and rewards</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTasks.map((task) => {
            const Icon = getTaskIcon(task.type);
            const status = getTaskStatus(task.id);
            const statusBadge = getStatusBadge(status);
            const canSubmit = status === 'new' || status === 'rejected';

            return (
              <Card key={task.id} className="flex flex-col border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="bg-black/5 p-2.5 rounded-lg">
                      <Icon className="size-5 text-black/60" />
                    </div>
                    <Badge variant={statusBadge.variant} className="bg-black/5 text-black/60 border-0 text-xs font-normal">
                      {statusBadge.label}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-4 font-medium text-black/80">{task.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-black/50 text-sm font-light">{task.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-light text-black/90">{task.points}</span>
                      <span className="text-sm text-black/50 font-light">points</span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-black/5 text-black/50 border-0 font-normal">
                      {task.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => setSelectedTask(task)}
                    variant={canSubmit ? 'default' : 'outline'}
                    className={cn(
                      "w-full h-10 font-medium rounded-lg",
                      canSubmit 
                        ? "bg-black hover:bg-black/90 text-white" 
                        : "bg-white border border-black/10 hover:bg-black/5 text-black/70"
                    )}
                  >
                    {status === 'approved' ? 'View Details' : canSubmit ? 'View Task' : 'View Status'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {activeTasks.length === 0 && (
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="py-16 text-center">
              <p className="text-black/50 font-light">No active tasks available at the moment.</p>
              <p className="text-sm text-black/40 font-light mt-2">Check back soon for new opportunities!</p>
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

