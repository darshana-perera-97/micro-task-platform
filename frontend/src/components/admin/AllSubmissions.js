import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
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

export function AllSubmissions() {
  const { submissions } = useData();

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Pending', variant: 'secondary' },
      approved: { label: 'Approved', variant: 'outline' },
      rejected: { label: 'Rejected', variant: 'destructive' },
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">All Submissions</h2>
        <p className="text-sm sm:text-base text-gray-600">View all task submissions across the platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => {
                const statusBadge = getStatusBadge(submission.status);
                return (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.taskTitle}</TableCell>
                    <TableCell>{submission.userName}</TableCell>
                    <TableCell>{submission.points}</TableCell>
                    <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}

