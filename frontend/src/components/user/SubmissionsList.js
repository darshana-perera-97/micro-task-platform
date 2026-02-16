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
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">My Submissions</h2>
        <p className="text-sm sm:text-base text-black/50 font-light">Track the status of your task submissions</p>
      </div>

      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-light text-black/90">All Submissions</CardTitle>
          <CardDescription className="text-xs sm:text-sm text-black/50 font-light">
            Total submissions: {userSubmissions.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userSubmissions.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm sm:text-base text-black/50 font-light">No submissions yet</p>
              <p className="text-xs sm:text-sm text-black/40 font-light mt-2">Start completing tasks to see your submissions here</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <Table>
              <TableHeader>
                <TableRow className="border-b border-black/5">
                  <TableHead className="text-black/50 font-medium">Task</TableHead>
                  <TableHead className="text-black/50 font-medium">Evidence</TableHead>
                  <TableHead className="text-black/50 font-medium">Points</TableHead>
                  <TableHead className="text-black/50 font-medium">Submitted</TableHead>
                  <TableHead className="text-black/50 font-medium">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userSubmissions.map((submission) => {
                  const statusBadge = getStatusBadge(submission.status);
                  const EvidenceIcon = getEvidenceIcon(submission.evidence.type);

                  return (
                    <TableRow key={submission.id} className="border-b border-black/5 hover:bg-black/5">
                      <TableCell>
                        <div>
                          <p className="font-medium text-black/80 text-sm">{submission.taskTitle}</p>
                          {submission.reviewerComment && (
                            <p className="text-xs text-black/40 mt-1 max-w-xs truncate font-light">
                              {submission.reviewerComment}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <EvidenceIcon className="size-4 text-black/40 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-black/60 max-w-[100px] sm:max-w-[150px] truncate font-light">
                            {submission.evidence.value}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs sm:text-sm font-medium text-black/70">+{submission.points}</span>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-black/50 whitespace-nowrap font-light">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadge.variant} className="bg-black/5 text-black/60 border-0 font-normal">
                          {statusBadge.label}
                        </Badge>
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

