import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useData } from '../../context/DataContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { CreateTaskModal } from './CreateTaskModal';
import { toast } from 'sonner';

export function TaskManagement() {
  const { tasks, updateTask, deleteTask } = useData();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleToggleActive = (taskId: string, currentActive: boolean) => {
    updateTask(taskId, { active: !currentActive });
    toast.success(
      currentActive ? 'Task deactivated successfully' : 'Task activated successfully'
    );
  };

  const handleDelete = (taskId: string, taskTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${taskTitle}"?`)) {
      deleteTask(taskId);
      toast.success('Task deleted successfully');
    }
  };

  const getTaskTypeLabel = (type: string) => {
    const labels = {
      youtube: 'YouTube',
      social_media: 'Social Media',
      website_visit: 'Website Visit',
      survey: 'Survey',
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Task Management</h2>
            <p className="text-gray-600">Create, edit, and manage tasks</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="size-4" />
            Create New Task
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
            <CardDescription>
              {tasks.length} total task{tasks.length !== 1 ? 's' : ''} •{' '}
              {tasks.filter(t => t.active).length} active
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No tasks created yet</p>
                <Button onClick={() => setIsCreateModalOpen(true)} variant="outline" className="mt-4 gap-2">
                  <Plus className="size-4" />
                  Create Your First Task
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{task.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{task.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getTaskTypeLabel(task.type)}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-blue-600">{task.points} pts</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={task.active}
                            onCheckedChange={() => handleToggleActive(task.id, task.active)}
                          />
                          <span className="text-sm text-gray-600">
                            {task.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.info('Edit functionality coming soon')}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(task.id, task.title)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <CreateTaskModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
