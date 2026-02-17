import React, { useState, useRef } from 'react';
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
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Upload, Link, FileText, Award, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../ui/utils';

export function TaskDetailsModal({ task, onClose, currentStatus }) {
  const { addSubmission, submissions } = useData();
  const { user } = useAuth();
  // Use task's evidenceType (set by admin) - users cannot change this
  const evidenceType = task.evidenceType || 'text';
  const [evidenceValue, setEvidenceValue] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  if (!user) return null;

  const submission = submissions.find(
    sub => sub.taskId === task.id && sub.userId === user.id
  );

  // Only allow submission if task has never been submitted (one attempt only)
  const canSubmit = currentStatus === 'new';

  // Handle image file selection
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validate URL format
  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // CRITICAL: Double-check if task has already been submitted (prevent multiple submissions)
    const existingSubmission = submissions.find(
      sub => sub.taskId === task.id && sub.userId === user.id
    );
    
    if (existingSubmission) {
      toast.error('You have already submitted this task. Each task can only be completed once.');
      return;
    }
    
    // Additional check: if canSubmit is false, prevent submission
    if (!canSubmit) {
      toast.error('This task has already been submitted. Each task can only be completed once.');
      return;
    }
    
    // Validate based on evidence type
    if (evidenceType === 'image') {
      if (!imageFile) {
        toast.error('Please select an image file');
        return;
      }
    } else if (evidenceType === 'url') {
      if (!evidenceValue.trim()) {
        toast.error('Please provide a URL');
        return;
      }
      if (!isValidUrl(evidenceValue.trim())) {
        toast.error('Please provide a valid URL (must start with http:// or https://)');
        return;
      }
    } else if (evidenceType === 'text') {
      if (!evidenceValue.trim()) {
        toast.error('Please provide text evidence');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Prepare evidence object based on type
      let evidenceData = {
        image: '',
        text: '',
        link: '',
      };

      if (evidenceType === 'image') {
        // For image, we'll store the file name and optionally convert to base64
        // In a real app, you'd upload to a server and store the URL
        evidenceData.image = imageFile.name;
        // Optionally convert to base64 for storage (not recommended for large files)
        // const reader = new FileReader();
        // reader.readAsDataURL(imageFile);
        // reader.onloadend = () => {
        //   evidenceData.image = reader.result;
        // };
      } else if (evidenceType === 'url') {
        evidenceData.link = evidenceValue.trim();
      } else if (evidenceType === 'text') {
        evidenceData.text = evidenceValue.trim();
      }

      await addSubmission({
        taskId: task.id,
        userId: user.id,
        userName: user.name,
        taskTitle: task.title,
        evidence: evidenceData,
        points: task.points,
      });

      toast.success('Task submitted successfully! Your submission is pending review.');
      setEvidenceValue('');
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    } catch (error) {
      // Error is already handled in addSubmission, but we can show a more specific message
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to submit task. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-white">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0">
            <div className="flex-1">
              <DialogTitle className="text-lg sm:text-xl">{task.title}</DialogTitle>
              <DialogDescription className="mt-1 text-sm">{task.description}</DialogDescription>
            </div>
            <div className="flex items-center gap-2 sm:ml-4">
              <Award className="size-4 sm:size-5 text-blue-600" />
              <span className="text-lg sm:text-xl font-bold text-blue-600">{task.points} pts</span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 mt-4">
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
              {/* Evidence Type Display (set by admin, read-only for users) */}
              <div>
                <Label className="mb-2 block text-sm font-medium text-gray-700">Required Evidence Type</Label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {evidenceType === 'image' && <Upload className="size-5 text-gray-600" />}
                  {evidenceType === 'url' && <Link className="size-5 text-gray-600" />}
                  {evidenceType === 'text' && <FileText className="size-5 text-gray-600" />}
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {evidenceType === 'image' ? 'Image Upload' : evidenceType === 'url' ? 'URL Link' : 'Text Evidence'}
                  </span>
                  <Badge variant="outline" className="ml-auto text-xs bg-white">
                    Set by Admin
                  </Badge>
                </div>
              </div>

              <div>
                <Label htmlFor="evidence">
                  {evidenceType === 'image'
                    ? 'Upload Image'
                    : evidenceType === 'url'
                    ? 'URL Link'
                    : 'Text Evidence'}
                </Label>
                
                {evidenceType === 'image' ? (
                  <div className="mt-2 space-y-3">
                    {!imagePreview ? (
                      <div className={cn(
                        "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                        canSubmit 
                          ? "border-gray-300 hover:border-gray-400 cursor-pointer" 
                          : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                      )}>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          disabled={!canSubmit}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className={cn(
                            "flex flex-col items-center gap-2",
                            canSubmit ? "cursor-pointer" : "cursor-not-allowed"
                          )}
                        >
                          <ImageIcon className="size-8 text-gray-400" />
                          <span className="text-sm text-gray-600 font-medium">
                            Click to upload or drag and drop
                          </span>
                          <span className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="relative border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg object-contain"
                        />
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm text-gray-600 truncate flex-1 mr-2">
                            {imageFile.name}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveImage}
                            disabled={!canSubmit}
                            className="flex-shrink-0"
                          >
                            <X className="size-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : evidenceType === 'url' ? (
                  <Input
                    id="evidence"
                    type="url"
                    placeholder="e.g., https://twitter.com/your-post"
                    value={evidenceValue}
                    onChange={(e) => setEvidenceValue(e.target.value)}
                    disabled={!canSubmit}
                    className="mt-2"
                  />
                ) : (
                  <Textarea
                    id="evidence"
                    placeholder="Enter your evidence here (e.g., confirmation code, description)"
                    value={evidenceValue}
                    onChange={(e) => setEvidenceValue(e.target.value)}
                    disabled={!canSubmit}
                    rows={4}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !canSubmit} 
                  className="flex-1"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Task'}
                </Button>
              </div>
            </form>
          )}

          {!canSubmit && submission && (
            <div className={cn(
              "border rounded-lg p-4 text-center",
              submission.status === 'approved' 
                ? "bg-green-50 border-green-200"
                : submission.status === 'pending'
                ? "bg-orange-50 border-orange-200"
                : "bg-red-50 border-red-200"
            )}>
              <p className={cn(
                "font-medium",
                submission.status === 'approved' 
                  ? "text-green-800"
                  : submission.status === 'pending'
                  ? "text-orange-800"
                  : "text-red-800"
              )}>
                {submission.status === 'approved' 
                  ? "✓ Task Already Completed"
                  : submission.status === 'pending'
                  ? "⏳ Under Review"
                  : "✗ Task Submission Rejected"}
              </p>
              <p className={cn(
                "text-sm mt-1",
                submission.status === 'approved' 
                  ? "text-green-700"
                  : submission.status === 'pending'
                  ? "text-orange-700"
                  : "text-red-700"
              )}>
                {submission.status === 'approved' 
                  ? "You've already completed this task. Each task can only be completed once."
                  : submission.status === 'pending'
                  ? "Your submission is being reviewed. Each task can only be completed once."
                  : "This task submission was rejected. Each task can only be completed once."}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

