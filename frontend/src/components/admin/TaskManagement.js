import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Upload, Link, FileText, Youtube, Share2, Globe, Power, Eye, CheckCircle2, Clock, XCircle, BarChart3, Edit2, Save, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { toast } from 'sonner';

import API_URL from '../../config/api';

export function TaskManagement() {
  const { addTask, updateTask, deleteTask, submissions } = useData();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [viewTask, setViewTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    type: 'youtube',
    points: 0,
    active: true,
    evidenceType: 'text',
    completedAmount: 0,
  });

  // Fetch tasks from admin endpoint
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/admin/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setTasks(data.data);
          console.log('Tasks loaded from admin endpoint:', data.data.length);
        }
      } else {
        console.error('Failed to fetch tasks');
        toast.error('Failed to load tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Error loading tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      const result = await addTask(formData);
      if (result) {
        toast.success('Task created successfully!');
        setFormData({
          title: '',
          description: '',
          instructions: '',
          type: 'youtube',
          points: 0,
          active: true,
          evidenceType: 'text',
          completedAmount: 0,
        });
        setOpen(false);
        
        // Refresh tasks list
        await fetchTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
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

  const getTaskTypeLabel = (type) => {
    const labels = {
      youtube: 'YouTube',
      social_media: 'Social Media',
      website_visit: 'Website Visit',
      survey: 'Survey',
    };
    return labels[type] || type;
  };

  const getEvidenceTypeLabel = (type) => {
    const labels = {
      image: 'Image',
      url: 'Link',
      text: 'Text',
    };
    return labels[type] || type;
  };

  const getTaskAnalytics = (taskId) => {
    const taskSubmissions = submissions.filter(sub => sub.taskId === taskId);
    const total = taskSubmissions.length;
    const pending = taskSubmissions.filter(sub => sub.status === 'pending').length;
    const approved = taskSubmissions.filter(sub => sub.status === 'approved').length;
    const rejected = taskSubmissions.filter(sub => sub.status === 'rejected').length;
    const totalPointsAwarded = taskSubmissions
      .filter(sub => sub.status === 'approved')
      .reduce((sum, sub) => sum + (sub.points || 0), 0);
    const completionRate = total > 0 ? ((approved / total) * 100).toFixed(1) : 0;

    return {
      total,
      pending,
      approved,
      rejected,
      totalPointsAwarded,
      completionRate,
    };
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">Task Management</h2>
          <p className="text-sm sm:text-base text-black/50 font-light">Create and manage tasks</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-black hover:bg-black/90 text-white">
              Create New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px] bg-white p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-light">Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what users need to do"
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Instructions</Label>
                <Textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Provide step-by-step instructions for completing the task"
                  rows={4}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Evidence Type *</Label>
                <RadioGroup 
                  value={formData.evidenceType} 
                  onValueChange={(value) => setFormData({ ...formData, evidenceType: value })}
                >
                  <div className="grid grid-cols-3 gap-3">
                    <label
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        formData.evidenceType === 'image'
                          ? 'border-black bg-black/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <RadioGroupItem value="image" id="evidence-image" className="sr-only" />
                      <Upload className="size-6" />
                      <span className="text-sm font-medium">Upload Image</span>
                    </label>
                    <label
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        formData.evidenceType === 'url'
                          ? 'border-black bg-black/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <RadioGroupItem value="url" id="evidence-url" className="sr-only" />
                      <Link className="size-6" />
                      <span className="text-sm font-medium">Enter Link</span>
                    </label>
                    <label
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        formData.evidenceType === 'text'
                          ? 'border-black bg-black/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <RadioGroupItem value="text" id="evidence-text" className="sr-only" />
                      <FileText className="size-6" />
                      <span className="text-sm font-medium">Enter Text</span>
                    </label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Task Type</Label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full h-11 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="social_media">Social Media</option>
                    <option value="website_visit">Website Visit</option>
                    <option value="survey">Survey</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Points</Label>
                  <Input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Completed Amount</Label>
                <Input
                  type="number"
                  value={formData.completedAmount}
                  onChange={(e) => setFormData({ ...formData, completedAmount: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                  className="h-11"
                />
                <p className="text-xs text-gray-500">Maximum number of times this task can be completed</p>
              </div>
              <div className="pt-4">
                <Button onClick={handleCreate} className="w-full h-11 bg-black hover:bg-black/90 text-white">
                  Create Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="flex flex-col items-center justify-center py-12 px-6">
            <div className="animate-pulse space-y-4 w-full">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      ) : tasks.length === 0 ? (
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="flex flex-col items-center justify-center py-12 px-6">
            <FileText className="size-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-black/90 mb-2">No tasks yet</h3>
            <p className="text-sm text-black/50 text-center mb-6">
              Get started by creating your first task. Click the "Create New Task" button above.
            </p>
            <Button
              onClick={() => setOpen(true)}
              className="bg-black hover:bg-black/90 text-white"
            >
              Create Your First Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tasks.map((task) => {
            const Icon = getTaskIcon(task.type);
            const EvidenceIcon = task.evidenceType === 'image' ? Upload : task.evidenceType === 'url' ? Link : FileText;
            
            return (
              <Card key={task.id} className="flex flex-col border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-black/5 p-2.5 rounded-lg">
                      <Icon className="size-5 text-black/60" />
                    </div>
                    <Badge variant={task.active ? 'default' : 'outline'} className={task.active ? 'bg-green-100 text-green-700 border-green-200' : ''}>
                      {task.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-medium text-black/90 mb-2">{task.title}</CardTitle>
                  <CardDescription className="text-sm text-black/50 font-light line-clamp-2">
                    {task.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-black/50">
                    <Badge variant="outline" className="text-xs font-normal bg-black/5 border-0">
                      {getTaskTypeLabel(task.type)}
                    </Badge>
                    <Badge variant="outline" className="text-xs font-normal bg-black/5 border-0">
                      <EvidenceIcon className="size-3 mr-1" />
                      {getEvidenceTypeLabel(task.evidenceType)}
                    </Badge>
                    <Badge variant="outline" className="text-xs font-normal bg-black/5 border-0">
                      {task.points} pts
                    </Badge>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        const newActiveState = !task.active;
                        await updateTask(task.id, { active: newActiveState });
                        toast.success(newActiveState ? 'Task activated successfully!' : 'Task deactivated successfully!');
                        await fetchTasks(); // Refresh tasks list
                      }}
                      className="flex-1 text-xs"
                    >
                      <Power className="size-3 mr-1" />
                      {task.active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setViewTask(task);
                        setIsEditing(false);
                        setEditFormData(null);
                      }}
                      className="flex-1 text-xs"
                    >
                      <Eye className="size-3 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* View Task Dialog */}
      {viewTask && (
        <Dialog open={!!viewTask} onOpenChange={() => {
          setViewTask(null);
          setIsEditing(false);
          setEditFormData(null);
        }}>
          <DialogContent className="sm:max-w-[700px] bg-white p-0 max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="px-8 pt-8 pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-light">
                  {isEditing ? 'Edit Task' : viewTask.title}
                </DialogTitle>
                {!isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(true);
                      setEditFormData({
                        title: viewTask.title,
                        description: viewTask.description,
                        instructions: viewTask.instructions || '',
                        type: viewTask.type,
                        points: viewTask.points,
                        evidenceType: viewTask.evidenceType || 'text',
                        active: viewTask.active,
                        completedAmount: viewTask.completedAmount || 0,
                      });
                    }}
                    className="text-xs"
                  >
                    <Edit2 className="size-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </DialogHeader>
            <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden px-8 pb-8">
              <TabsList className="mb-6 bg-gray-100">
                <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:text-black">
                  Task Details
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-black">
                  Analytics
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="flex-1 overflow-y-auto space-y-6">
                {isEditing && editFormData ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Title *</Label>
                      <Input
                        value={editFormData.title}
                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                        placeholder="Task title"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Description *</Label>
                      <Textarea
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                        placeholder="Task description"
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Instructions</Label>
                      <Textarea
                        value={editFormData.instructions}
                        onChange={(e) => setEditFormData({ ...editFormData, instructions: e.target.value })}
                        placeholder="Step-by-step instructions"
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Evidence Type *</Label>
                      <RadioGroup 
                        value={editFormData.evidenceType} 
                        onValueChange={(value) => setEditFormData({ ...editFormData, evidenceType: value })}
                      >
                        <div className="grid grid-cols-3 gap-3">
                          <label
                            className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                              editFormData.evidenceType === 'image'
                                ? 'border-black bg-black/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <RadioGroupItem value="image" id="edit-evidence-image" className="sr-only" />
                            <Upload className="size-6" />
                            <span className="text-sm font-medium">Upload Image</span>
                          </label>
                          <label
                            className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                              editFormData.evidenceType === 'url'
                                ? 'border-black bg-black/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <RadioGroupItem value="url" id="edit-evidence-url" className="sr-only" />
                            <Link className="size-6" />
                            <span className="text-sm font-medium">Enter Link</span>
                          </label>
                          <label
                            className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                              editFormData.evidenceType === 'text'
                                ? 'border-black bg-black/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <RadioGroupItem value="text" id="edit-evidence-text" className="sr-only" />
                            <FileText className="size-6" />
                            <span className="text-sm font-medium">Enter Text</span>
                          </label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Task Type</Label>
                        <select
                          value={editFormData.type}
                          onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                          className="w-full h-11 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                        >
                          <option value="youtube">YouTube</option>
                          <option value="social_media">Social Media</option>
                          <option value="website_visit">Website Visit</option>
                          <option value="survey">Survey</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Points</Label>
                        <Input
                          type="number"
                          value={editFormData.points}
                          onChange={(e) => setEditFormData({ ...editFormData, points: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                          min="0"
                          className="h-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Completed Amount</Label>
                      <Input
                        type="number"
                        value={editFormData.completedAmount}
                        onChange={(e) => setEditFormData({ ...editFormData, completedAmount: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        min="0"
                        className="h-11"
                      />
                      <p className="text-xs text-gray-500">Maximum number of times this task can be completed</p>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={async () => {
                          if (!editFormData.title || !editFormData.description) {
                            toast.error('Please fill in all required fields');
                            return;
                          }
                          await updateTask(viewTask.id, editFormData);
                          toast.success('Task updated successfully!');
                          setViewTask({ ...viewTask, ...editFormData });
                          setIsEditing(false);
                          setEditFormData(null);
                          await fetchTasks(); // Refresh tasks list
                        }}
                        className="flex-1 h-11 bg-black hover:bg-black/90 text-white"
                      >
                        <Save className="size-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setEditFormData(null);
                        }}
                        className="h-11"
                      >
                        <X className="size-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Description</Label>
                      <p className="text-sm text-black/80 mt-1">{viewTask.description}</p>
                    </div>
                    
                    {viewTask.instructions && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Instructions</Label>
                        <div className="text-sm text-black/80 mt-1 whitespace-pre-line bg-gray-50 p-4 rounded-md">
                          {viewTask.instructions}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Task Type</Label>
                        <div className="mt-1">
                          <Badge variant="outline" className="bg-black/5 border-0">
                            {getTaskTypeLabel(viewTask.type)}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Evidence Type</Label>
                        <div className="mt-1">
                          <Badge variant="outline" className="bg-black/5 border-0">
                            {getEvidenceTypeLabel(viewTask.evidenceType || 'text')}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Points</Label>
                        <p className="text-sm text-black/80 mt-1">{viewTask.points} pts</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Completed Amount</Label>
                        <p className="text-sm text-black/80 mt-1">{viewTask.completedAmount || 0}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Status</Label>
                        <div className="mt-1">
                          <Badge variant={viewTask.active ? 'default' : 'outline'} className={viewTask.active ? 'bg-green-100 text-green-700 border-green-200' : ''}>
                            {viewTask.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Created At</Label>
                        <p className="text-sm text-black/80 mt-1">
                          {new Date(viewTask.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analytics" className="flex-1 overflow-y-auto space-y-6">
                {(() => {
                  const analytics = getTaskAnalytics(viewTask.id);
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="border-0 shadow-sm">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Total Submissions</p>
                                <p className="text-2xl font-light text-black/90">{analytics.total}</p>
                              </div>
                              <BarChart3 className="size-8 text-black/30" />
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-0 shadow-sm">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Completion Rate</p>
                                <p className="text-2xl font-light text-black/90">{analytics.completionRate}%</p>
                              </div>
                              <CheckCircle2 className="size-8 text-green-500" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <Card className="border-0 shadow-sm">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <div className="bg-orange-100 p-2 rounded-lg">
                                <Clock className="size-5 text-orange-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Pending</p>
                                <p className="text-xl font-medium text-black/90">{analytics.pending}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-0 shadow-sm">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <div className="bg-green-100 p-2 rounded-lg">
                                <CheckCircle2 className="size-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Approved</p>
                                <p className="text-xl font-medium text-black/90">{analytics.approved}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-0 shadow-sm">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <div className="bg-red-100 p-2 rounded-lg">
                                <XCircle className="size-5 text-red-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Rejected</p>
                                <p className="text-xl font-medium text-black/90">{analytics.rejected}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card className="border-0 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg font-light">Points Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Total Points Awarded</p>
                            <p className="text-2xl font-light text-black/90">{analytics.totalPointsAwarded} pts</p>
                          </div>
                        </CardContent>
                      </Card>

                      {analytics.total === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <BarChart3 className="size-12 mx-auto mb-3 text-gray-300" />
                          <p>No submissions yet for this task</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

