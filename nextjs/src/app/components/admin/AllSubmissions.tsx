import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useData } from '../../context/DataContext';
import { FileText, Image, Link, Filter } from 'lucide-react';

export function AllSubmissions() {
  const { submissions } = useData();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredSubmissions = submissions
    .filter(sub => statusFilter === 'all' || sub.status === statusFilter)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const getEvidenceIcon = (type: string) => {
    const icons = {
      image: Image,
      url: Link,
      text: FileText,
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: 'Pending', variant: 'secondary' as const },
      approved: { label: 'Approved', variant: 'outline' as const },
      rejected: { label: 'Rejected', variant: 'destructive' as const },
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const statusCounts = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">All Submissions</h2>
          <p className="text-gray-600">View and monitor all task submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-gray-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({statusCounts.all})</SelectItem>
              <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
              <SelectItem value="approved">Approved ({statusCounts.approved})</SelectItem>
              <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{statusCounts.all}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{statusCounts.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{statusCounts.approved}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{statusCounts.rejected}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>
            Showing {filteredSubmissions.length} submission{filteredSubmissions.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No submissions found</p>
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
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => {
                  const EvidenceIcon = getEvidenceIcon(submission.evidence.type);
                  const statusBadge = getStatusBadge(submission.status);

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
                          <span className="text-sm text-gray-600 max-w-[150px] truncate">
                            {submission.evidence.value}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-blue-600">{submission.points} pts</span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                        <br />
                        <span className="text-xs text-gray-400">
                          {new Date(submission.submittedAt).toLocaleTimeString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
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
  );
}
