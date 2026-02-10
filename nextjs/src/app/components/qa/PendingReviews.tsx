import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useData } from '../../context/DataContext';
import { Submission } from '../../types';
import { CheckCircle2, XCircle, FileText, Image, Link, Eye } from 'lucide-react';
import { toast } from 'sonner';

export function PendingReviews() {
  const { submissions, updateSubmission } = useData();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewComment, setReviewComment] = useState('');

  const pendingSubmissions = submissions
    .filter(sub => sub.status === 'pending')
    .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());

  const handleReview = (approved: boolean) => {
    if (!selectedSubmission) return;

    updateSubmission(selectedSubmission.id, {
      status: approved ? 'approved' : 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewerComment: reviewComment || undefined,
    });

    toast.success(
      approved
        ? 'Submission approved successfully!'
        : 'Submission rejected with feedback.'
    );

    setSelectedSubmission(null);
    setReviewComment('');
  };

  const getEvidenceIcon = (type: string) => {
    const icons = {
      image: Image,
      url: Link,
      text: FileText,
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Pending Reviews</h2>
          <p className="text-gray-600">Review and approve or reject task submissions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submissions Awaiting Review</CardTitle>
            <CardDescription>
              {pendingSubmissions.length} submission{pendingSubmissions.length !== 1 ? 's' : ''} pending
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingSubmissions.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="size-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">All caught up!</p>
                <p className="text-sm text-gray-400 mt-1">No pending submissions to review</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Evidence</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingSubmissions.map((submission) => {
                    const EvidenceIcon = getEvidenceIcon(submission.evidence.type);

                    return (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{submission.userName}</p>
                            <p className="text-xs text-gray-500">{submission.userId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-gray-900">{submission.taskTitle}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <EvidenceIcon className="size-4 text-gray-400" />
                            <span className="text-sm text-gray-600 max-w-[200px] truncate">
                              {submission.evidence.value}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{submission.points} pts</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                          <br />
                          <span className="text-xs text-gray-400">
                            {new Date(submission.submittedAt).toLocaleTimeString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="size-4 mr-1" />
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review Dialog */}
      {selectedSubmission && (
        <Dialog open={true} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Submission</DialogTitle>
              <DialogDescription>
                Verify the evidence and approve or reject this submission
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Submission Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">User</p>
                  <p className="font-medium text-gray-900">{selectedSubmission.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Task</p>
                  <p className="font-medium text-gray-900">{selectedSubmission.taskTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Points</p>
                  <p className="font-medium text-blue-600">{selectedSubmission.points} points</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedSubmission.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Evidence */}
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Evidence Submitted</Label>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {selectedSubmission.evidence.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-900 break-all">
                    {selectedSubmission.evidence.value}
                  </p>
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <Label htmlFor="comment">Reviewer Comment (Optional)</Label>
                <Textarea
                  id="comment"
                  placeholder="Add feedback for the user..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 border-red-200 text-red-700 hover:bg-red-50"
                  onClick={() => handleReview(false)}
                >
                  <XCircle className="size-4" />
                  Reject
                </Button>
                <Button
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => handleReview(true)}
                >
                  <CheckCircle2 className="size-4" />
                  Approve
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
