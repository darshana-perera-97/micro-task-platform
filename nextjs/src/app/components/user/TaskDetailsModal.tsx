import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Task } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Upload, Link, FileText, Award } from 'lucide-react';
import { toast } from 'sonner';

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
  currentStatus: string;
}

export function TaskDetailsModal({ task, onClose, currentStatus }: TaskDetailsModalProps) {
  const { addSubmission, submissions } = useData();
  const { user } = useAuth();
  const [evidenceType, setEvidenceType] = useState<'image' | 'text' | 'url'>('text');
  const [evidenceValue, setEvidenceValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const submission = submissions.find(
    sub => sub.taskId === task.id && sub.userId === user.id
  );

  const canSubmit = currentStatus === 'new' || currentStatus === 'rejected';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!evidenceValue.trim()) {
      toast.error('Please provide evidence for your submission');
      return;
    }

    setIsSubmitting(true);

    try {
      addSubmission({
        taskId: task.id,
        userId: user.id,
        userName: user.name,
        taskTitle: task.title,
        evidence: {
          type: evidenceType,
          value: evidenceValue,
        },
        points: task.points,
      });

      toast.success('Task submitted successfully! Your submission is pending review.');
      setEvidenceValue('');
      onClose();
    } catch (error) {
      toast.error('Failed to submit task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl">{task.title}</DialogTitle>
              <DialogDescription className="mt-1">{task.description}</DialogDescription>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Award className="size-5 text-blue-600" />
              <span className="text-xl font-bold text-blue-600">{task.points} pts</span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Task Instructions */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {task.instructions}
              </pre>
            </div>
          </div>

          {/* Current Status */}
          {submission && (
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Submission Status</h3>
                <Badge
                  variant={
                    submission.status === 'approved'
                      ? 'outline'
                      : submission.status === 'rejected'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {submission.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-700 mb-1">
                Submitted: {new Date(submission.submittedAt).toLocaleString()}
              </p>
              {submission.reviewerComment && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-sm font-medium text-gray-900">Reviewer Comment:</p>
                  <p className="text-sm text-gray-700 mt-1">{submission.reviewerComment}</p>
                </div>
              )}
            </div>
          )}

          {/* Submission Form */}
          {canSubmit && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="mb-3 block">Evidence Type</Label>
                <RadioGroup value={evidenceType} onValueChange={(v) => setEvidenceType(v as any)}>
                  <div className="grid grid-cols-3 gap-3">
                    <label
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        evidenceType === 'image'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <RadioGroupItem value="image" id="image" className="sr-only" />
                      <Upload className="size-6" />
                      <span className="text-sm font-medium">Image</span>
                    </label>
                    <label
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        evidenceType === 'url'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <RadioGroupItem value="url" id="url" className="sr-only" />
                      <Link className="size-6" />
                      <span className="text-sm font-medium">URL</span>
                    </label>
                    <label
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        evidenceType === 'text'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <RadioGroupItem value="text" id="text" className="sr-only" />
                      <FileText className="size-6" />
                      <span className="text-sm font-medium">Text</span>
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="evidence">
                  {evidenceType === 'image'
                    ? 'Image File Name or Description'
                    : evidenceType === 'url'
                    ? 'URL Link'
                    : 'Text Evidence'}
                </Label>
                {evidenceType === 'text' ? (
                  <Textarea
                    id="evidence"
                    placeholder="Enter your evidence here (e.g., confirmation code, description)"
                    value={evidenceValue}
                    onChange={(e) => setEvidenceValue(e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                ) : (
                  <Input
                    id="evidence"
                    placeholder={
                      evidenceType === 'image'
                        ? 'e.g., screenshot_proof.png'
                        : 'e.g., https://twitter.com/...'
                    }
                    value={evidenceValue}
                    onChange={(e) => setEvidenceValue(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? 'Submitting...' : 'Submit Task'}
                </Button>
              </div>
            </form>
          )}

          {!canSubmit && currentStatus === 'approved' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-800 font-medium">✓ Task Completed</p>
              <p className="text-sm text-green-700 mt-1">You've already completed this task</p>
            </div>
          )}

          {!canSubmit && currentStatus === 'submitted' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <p className="text-orange-800 font-medium">⏳ Under Review</p>
              <p className="text-sm text-orange-700 mt-1">Your submission is being reviewed</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
