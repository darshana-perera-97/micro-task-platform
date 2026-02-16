import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useData } from '../../context/DataContext';
import { toast } from 'sonner';

export function TaskManagement() {
  const { tasks, addTask, updateTask, deleteTask } = useData();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    type: 'youtube',
    points: 0,
    active: true,
  });

  const handleCreate = () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    addTask(formData);
    toast.success('Task created successfully!');
    setFormData({
      title: '',
      description: '',
      instructions: '',
      type: 'youtube',
      points: 0,
      active: true,
    });
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">Task Management</h2>
          <p className="text-sm sm:text-base text-black/50 font-light">Create and manage tasks</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)} className="w-full sm:w-auto bg-black hover:bg-black/90 text-white">
          {isCreating ? 'Cancel' : 'Create New Task'}
        </Button>
      </div>

      {isCreating && (
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-light text-black/90">Create New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Task title"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Task description"
              />
            </div>
            <div>
              <Label>Instructions</Label>
              <Textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="Step-by-step instructions"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full h-9 rounded-md border px-3"
                >
                  <option value="youtube">YouTube</option>
                  <option value="social_media">Social Media</option>
                  <option value="website_visit">Website Visit</option>
                  <option value="survey">Survey</option>
                </select>
              </div>
              <div>
                <Label>Points</Label>
                <Input
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <Button onClick={handleCreate} className="w-full">Create Task</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{task.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={task.active ? 'default' : 'outline'}>
                    {task.active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant="outline">{task.points} pts</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateTask(task.id, { active: !task.active })}
                >
                  {task.active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    deleteTask(task.id);
                    toast.success('Task deleted');
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

