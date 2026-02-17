import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../../context/AuthContext';
import { FileText, Image, Link } from 'lucide-react';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

import API_URL from '../../config/api';

export function SubmissionsList() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token || !user) {
          setLoading(false);
          return;
        }

        // Fetch user's submissions from backend
        const response = await fetch(`${API_URL}/submissions/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setSubmissions(data.data);
            console.log('User submissions loaded from backend:', data.data.length);
          }
        } else {
          console.error('Failed to fetch user submissions');
        }
      } catch (error) {
        console.error('Error fetching user submissions:', error);
        toast.error('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  if (!user) return null;

  const userSubmissions = submissions
    .sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Pending', variant: 'secondary' },
      approved: { label: 'Approved', variant: 'outline' },
      rejected: { label: 'Rejected', variant: 'destructive' },
    };
    return badges[status] || badges.pending;
  };

  const getEvidenceType = (evidence) => {
    if (evidence?.image) return 'image';
    if (evidence?.link) return 'url';
    if (evidence?.text) return 'text';
    return 'text';
  };

  const getEvidenceValue = (evidence) => {
    if (evidence?.image) return evidence.image;
    if (evidence?.link) return evidence.link;
    if (evidence?.text) return evidence.text;
    return 'No evidence provided';
  };

  const getEvidenceIcon = (type) => {
    const icons = {
      image: Image,
      url: Link,
      text: FileText,
    };
    return icons[type] || FileText;
  };

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">My Submissions</h2>
          <p className="text-sm sm:text-base text-black/50 font-light">Loading your submissions...</p>
        </div>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-black/5">
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Task</TableHead>
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Evidence</TableHead>
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Points</TableHead>
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Submitted</TableHead>
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userSubmissions.map((submission) => {
                    const statusBadge = getStatusBadge(submission.status);
                    const evidenceType = getEvidenceType(submission.evidence);
                    const evidenceValue = getEvidenceValue(submission.evidence);
                    const EvidenceIcon = getEvidenceIcon(evidenceType);

                    return (
                      <TableRow key={submission.id} className="border-b border-black/5 hover:bg-black/5">
                        <TableCell>
                          <div>
                            <p className="font-medium text-black/80 text-xs sm:text-sm">{submission.taskTitle || 'N/A'}</p>
                            {submission.qaComment && (
                              <p className="text-xs text-black/40 mt-1 max-w-xs truncate font-light">
                                {submission.qaComment}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <EvidenceIcon className="size-4 text-black/40 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-black/60 max-w-[100px] sm:max-w-[150px] truncate font-light">
                              {evidenceValue}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs sm:text-sm font-medium text-black/70">+{submission.points || 0}</span>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-black/50 whitespace-nowrap font-light">
                          {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={statusBadge.variant} 
                            className={cn(
                              "text-xs border-0 font-normal",
                              submission.status === 'pending' ? "bg-orange-100 text-orange-800" :
                              submission.status === 'approved' ? "bg-green-100 text-green-800" :
                              "bg-red-100 text-red-800"
                            )}
                          >
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

