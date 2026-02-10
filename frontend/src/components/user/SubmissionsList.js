import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { FileText, Image, Link } from 'lucide-react';

export function SubmissionsList() {
  const { submissions } = useData();
  const { user } = useAuth();

  if (!user) return null;

  const userSubmissions = submissions
    .filter(sub => sub.userId === user.id)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Pending', variant: 'secondary' },
      approved: { label: 'Approved', variant: 'outline' },
      rejected: { label: 'Rejected', variant: 'destructive' },
    };
    return badges[status] || badges.pending;
  };

  const getEvidenceIcon = (type) => {
    const icons = {
      image: Image,
      url: Link,
      text: FileText,
    };
    return icons[type] || FileText;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">My Submissions</h2>
        <p className="text-sm sm:text-base text-gray-600">Track the status of your task submissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">All Submissions</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Total submissions: {userSubmissions.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userSubmissions.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-sm sm:text-base text-gray-500">No submissions yet</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Start completing tasks to see your submissions here</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Evidence</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userSubmissions.map((submission) => {
                  const statusBadge = getStatusBadge(submission.status);
                  const EvidenceIcon = getEvidenceIcon(submission.evidence.type);

                  return (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{submission.taskTitle}</p>
                          {submission.reviewerComment && (
                            <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                              {submission.reviewerComment}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <EvidenceIcon className="size-4 text-gray-400 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-600 max-w-[100px] sm:max-w-[150px] truncate">
                            {submission.evidence.value}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs sm:text-sm font-semibold text-blue-600">+{submission.points}</span>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

