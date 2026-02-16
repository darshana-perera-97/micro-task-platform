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
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">Pending Reviews</h2>
        <p className="text-sm sm:text-base text-black/50 font-light">Review and approve or reject submissions</p>
      </div>

      <div className="grid gap-4">
        {pendingSubmissions.length === 0 ? (
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="py-16 text-center">
              <p className="text-black/50 font-light">No pending reviews</p>
            </CardContent>
          </Card>
        ) : (
          pendingSubmissions.map((submission) => (
            <Card key={submission.id} className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-medium text-black/80">{submission.taskTitle}</CardTitle>
                    <p className="text-sm text-black/50 font-light mt-1">By {submission.userName}</p>
                  </div>
                  <Badge variant="secondary" className="bg-black/5 text-black/60 border-0 font-normal">Pending</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-black/70">Evidence ({submission.evidence.type})</Label>
                  <p className="text-sm text-black/60 mt-2 bg-black/5 p-3 rounded-lg font-light">
                    {submission.evidence.value}
                  </p>
                </div>
                {reviewingId === submission.id && (
                  <div>
                    <Label className="text-sm font-medium text-black/70">Comment (Optional)</Label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment for the user..."
                      rows={3}
                      className="mt-2 bg-white border-black/10 focus:border-black/30"
                    />
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => {
                      if (reviewingId === submission.id) {
                        handleReview(submission.id, 'approved');
                      } else {
                        setReviewingId(submission.id);
                      }
                    }}
                    className="flex-1 bg-black hover:bg-black/90 text-white"
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
                    className="flex-1"
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

