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
import { FileText, Image, Link } from 'lucide-react';

interface ReviewedSubmissionsProps {
  status: 'approved' | 'rejected';
}

export function ReviewedSubmissions({ status }: ReviewedSubmissionsProps) {
  const { submissions } = useData();

  const filteredSubmissions = submissions
    .filter(sub => sub.status === status)
    .sort((a, b) => {
      const dateA = new Date(a.reviewedAt || a.submittedAt).getTime();
      const dateB = new Date(b.reviewedAt || b.submittedAt).getTime();
      return dateB - dateA;
    });

  const getEvidenceIcon = (type: string) => {
    const icons = {
      image: Image,
      url: Link,
      text: FileText,
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const title = status === 'approved' ? 'Approved Submissions' : 'Rejected Submissions';
  const description = status === 'approved' 
    ? 'Successfully approved task submissions' 
    : 'Submissions that were rejected with feedback';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {filteredSubmissions.length} submission{filteredSubmissions.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No {status} submissions yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Evidence</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Reviewed</TableHead>
                  <TableHead>Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => {
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
                          <span className="text-sm text-gray-600 max-w-[150px] truncate">
                            {submission.evidence.value}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{submission.points} pts</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {submission.reviewedAt
                          ? new Date(submission.reviewedAt).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600 max-w-[200px] truncate">
                          {submission.reviewerComment || '-'}
                        </p>
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
