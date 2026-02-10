import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { useData } from '../../context/DataContext';
import { toast } from 'sonner';

export function PendingReviews() {
  const { submissions, updateSubmission } = useData();
  const [reviewingId, setReviewingId] = useState(null);
  const [comment, setComment] = useState('');

  const pendingSubmissions = submissions.filter(sub => sub.status === 'pending');

  const handleReview = (submissionId, status) => {
    updateSubmission(submissionId, {
      status,
      reviewedAt: new Date().toISOString(),
      reviewerComment: comment || undefined,
    });
    toast.success(`Submission ${status} successfully!`);
    setReviewingId(null);
    setComment('');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Pending Reviews</h2>
        <p className="text-sm sm:text-base text-gray-600">Review and approve or reject submissions</p>
      </div>

      <div className="grid gap-4">
        {pendingSubmissions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No pending reviews</p>
            </CardContent>
          </Card>
        ) : (
          pendingSubmissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{submission.taskTitle}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">By {submission.userName}</p>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Evidence ({submission.evidence.type})</Label>
                  <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">
                    {submission.evidence.value}
                  </p>
                </div>
                {reviewingId === submission.id && (
                  <div>
                    <Label>Comment (Optional)</Label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment for the user..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (reviewingId === submission.id) {
                        handleReview(submission.id, 'approved');
                      } else {
                        setReviewingId(submission.id);
                      }
                    }}
                    variant="default"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => {
                      if (reviewingId === submission.id) {
                        handleReview(submission.id, 'rejected');
                      } else {
                        setReviewingId(submission.id);
                      }
                    }}
                    variant="destructive"
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

