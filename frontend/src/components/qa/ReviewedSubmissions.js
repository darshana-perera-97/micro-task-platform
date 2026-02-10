import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useData } from '../../context/DataContext';

export function ReviewedSubmissions({ status }) {
  const { submissions } = useData();

  const reviewedSubmissions = submissions.filter(sub => sub.status === status);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          {status === 'approved' ? 'Approved' : 'Rejected'} Submissions
        </h2>
        <p className="text-sm sm:text-base text-gray-600">View {status} submissions</p>
      </div>

      <div className="grid gap-4">
        {reviewedSubmissions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No {status} submissions</p>
            </CardContent>
          </Card>
        ) : (
          reviewedSubmissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{submission.taskTitle}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">By {submission.userName}</p>
                  </div>
                  <Badge variant={status === 'approved' ? 'outline' : 'destructive'}>
                    {status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Evidence:</span> {submission.evidence.value}
                  </p>
                  {submission.reviewerComment && (
                    <p className="text-sm">
                      <span className="font-medium">Comment:</span> {submission.reviewerComment}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Reviewed: {new Date(submission.reviewedAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

