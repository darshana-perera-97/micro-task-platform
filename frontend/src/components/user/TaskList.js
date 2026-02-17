import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Youtube, Share2, Globe, FileText, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { TaskDetailsModal } from './TaskDetailsModal';
import { cn } from '../ui/utils';

import API_URL from '../../config/api';

export function TaskList() {
  const { tasks } = useData();
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState(null);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's submissions directly from API
  const fetchUserSubmissions = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token || !user) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/submissions/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setUserSubmissions(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching user submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSubmissions();
  }, [user]);

  // Refresh submissions when modal closes (after submission)
  const handleModalClose = () => {
    setSelectedTask(null);
    // Refresh submissions to update the list
    fetchUserSubmissions();
  };

  if (!user) return null;

  const activeTasks = tasks.filter(t => t.active);

  const getTaskStatus = (taskId) => {
    const submission = userSubmissions.find(sub => sub.taskId === taskId);
    if (!submission) return 'new';
    // Once submitted, user cannot resubmit regardless of status
    return submission.status === 'pending' ? 'submitted' : submission.status;
  };

  // Only show tasks that haven't been submitted yet (user can still do them)
  // Filter out any task that has ANY submission (pending, approved, or rejected)
  // This ensures submitted tasks never appear in the Available Tasks page
  const availableTasks = activeTasks.filter(task => {
    // Check if user has submitted this task (any status)
    const hasSubmission = userSubmissions.some(sub => sub.taskId === task.id);
    // Only show tasks with NO submission at all
    return !hasSubmission;
  });

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

        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-light text-black/90">Tasks</CardTitle>
            <CardDescription className="text-black/50 font-light">
              {availableTasks.length} task{availableTasks.length !== 1 ? 's' : ''} available to complete
            </CardDescription>
          </CardHeader>
          <CardContent>
            {availableTasks.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-black/50 font-light">No available tasks at the moment.</p>
                <p className="text-sm text-black/40 font-light mt-2">
                  {activeTasks.length > 0 
                    ? 'You have already submitted all available tasks. Check back soon for new opportunities!'
                    : 'Check back soon for new opportunities!'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-black/5">
                      <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Task</TableHead>
                      <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Type</TableHead>
                      <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Description</TableHead>
                      <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Points</TableHead>
                      <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Status</TableHead>
                      <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availableTasks.map((task) => {
                      const Icon = getTaskIcon(task.type);
                      
                      return (
                        <TableRow key={task.id} className="border-b border-black/5 hover:bg-black/5">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="bg-black/5 p-2 rounded-lg">
                                <Icon className="size-4 text-black/60" />
                              </div>
                              <div>
                                <p className="font-medium text-black/80 text-xs sm:text-sm">{task.title}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs bg-black/5 text-black/50 border-0 font-normal">
                              {task.type.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-xs sm:text-sm text-black/60 font-light line-clamp-2">
                              {task.description}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="text-sm sm:text-base font-medium text-black/80">{task.points}</span>
                              <span className="text-xs text-black/50 font-light">pts</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="default" 
                              className="text-xs border-0 font-normal bg-green-100 text-green-800"
                            >
                              Available
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => setSelectedTask(task)}
                              variant="default"
                              size="sm"
                              className="h-8 text-xs bg-black hover:bg-black/90 text-white"
                            >
                              <Eye className="size-3 mr-1" />
                              Start
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={handleModalClose}
          currentStatus={getTaskStatus(selectedTask.id)}
        />
      )}
    </>
  );
}

