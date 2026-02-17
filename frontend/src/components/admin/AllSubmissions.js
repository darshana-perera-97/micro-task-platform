import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { FileText, Image as ImageIcon, Link, Eye, Filter } from 'lucide-react';
import { toast } from 'sonner';

import API_URL from '../../config/api';

export function AllSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const url = statusFilter === 'all' 
          ? `${API_URL}/qa/submissions`
          : `${API_URL}/qa/submissions?status=${statusFilter}`;

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setSubmissions(data.data);
            console.log('Submissions loaded from backend:', data.data.length);
          }
        } else {
          console.error('Failed to fetch submissions');
          toast.error('Failed to load submissions');
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
        toast.error('Error loading submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [statusFilter]);

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Pending', variant: 'secondary', className: 'bg-orange-100 text-orange-800' },
      approved: { label: 'Approved', variant: 'outline', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejected', variant: 'destructive', className: 'bg-red-100 text-red-800' },
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
      image: ImageIcon,
      url: Link,
      text: FileText,
    };
    return icons[type] || FileText;
  };

  const statusCounts = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">All Submissions</h2>
          <p className="text-sm sm:text-base text-black/50 font-light">Loading submissions...</p>
        </div>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
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
        <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">All Submissions</h2>
        <p className="text-sm sm:text-base text-black/50 font-light">View and manage all task submissions across the platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-black/50 font-light mb-1">Total</p>
                <p className="text-2xl sm:text-3xl font-light text-black/90">{statusCounts.all}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-black/50 font-light mb-1">Pending</p>
                <p className="text-2xl sm:text-3xl font-light text-orange-600">{statusCounts.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-black/50 font-light mb-1">Approved</p>
                <p className="text-2xl sm:text-3xl font-light text-green-600">{statusCounts.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-black/50 font-light mb-1">Rejected</p>
                <p className="text-2xl sm:text-3xl font-light text-red-600">{statusCounts.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Table */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-light text-black/90">Submissions</CardTitle>
              <CardDescription className="text-black/50 font-light">All task submissions from users</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-black/50" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-[180px] px-3 py-2 text-sm bg-white border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black/70"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-black/40 font-light">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-black/5">
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Task</TableHead>
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">User</TableHead>
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Evidence</TableHead>
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Points</TableHead>
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Submitted</TableHead>
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Status</TableHead>
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Reviewed By</TableHead>
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => {
                    const statusBadge = getStatusBadge(submission.status);
                    const evidenceType = getEvidenceType(submission.evidence);
                    const EvidenceIcon = getEvidenceIcon(evidenceType);
                    
                    return (
                      <TableRow key={submission.id} className="border-b border-black/5 hover:bg-black/5">
                        <TableCell className="font-medium text-black/80 text-xs sm:text-sm">
                          {submission.taskTitle || 'N/A'}
                        </TableCell>
                        <TableCell className="text-black/70 text-xs sm:text-sm">
                          {submission.userName || 'Unknown'}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <EvidenceIcon className="size-4 text-black/50" />
                            <span className="text-black/60 capitalize">{evidenceType}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-black/70 text-xs sm:text-sm font-medium">
                          {submission.points || 0} pts
                        </TableCell>
                        <TableCell className="text-black/50 text-xs sm:text-sm whitespace-nowrap">
                          {new Date(submission.submittedAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${statusBadge.className} border-0`}>
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-black/70 text-xs sm:text-sm">
                          {submission.reviewerName || '-'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                            className="text-xs h-8 hover:bg-black/5"
                          >
                            <Eye className="size-3 mr-1" />
                            View
                          </Button>
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

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">{selectedSubmission.taskTitle}</DialogTitle>
              <DialogDescription className="text-sm">
                Submission details and evidence
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-black/50 font-light mb-1">User</p>
                  <p className="text-sm font-medium text-black/80">{selectedSubmission.userName}</p>
                </div>
                <div>
                  <p className="text-xs text-black/50 font-light mb-1">Points</p>
                  <p className="text-sm font-medium text-black/80">{selectedSubmission.points} pts</p>
                </div>
                <div>
                  <p className="text-xs text-black/50 font-light mb-1">Status</p>
                  <Badge className={`text-xs ${getStatusBadge(selectedSubmission.status).className} border-0`}>
                    {getStatusBadge(selectedSubmission.status).label}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-black/50 font-light mb-1">Submitted</p>
                  <p className="text-sm text-black/70">
                    {new Date(selectedSubmission.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-black/50 font-light mb-2">Evidence Type</p>
                <div className="flex items-center gap-2 p-3 bg-black/5 rounded-lg">
                  {(() => {
                    const type = getEvidenceType(selectedSubmission.evidence);
                    const Icon = getEvidenceIcon(type);
                    return (
                      <>
                        <Icon className="size-4 text-black/60" />
                        <span className="text-sm font-medium text-black/80 capitalize">{type}</span>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div>
                <p className="text-xs text-black/50 font-light mb-2">Evidence</p>
                <div className="p-4 bg-gray-50 rounded-lg border border-black/10">
                  <p className="text-sm text-black/70 whitespace-pre-wrap break-words">
                    {getEvidenceValue(selectedSubmission.evidence)}
                  </p>
                </div>
              </div>

              {selectedSubmission.reviewerComment && (
                <div>
                  <p className="text-xs text-black/50 font-light mb-2">Reviewer Comment</p>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-black/70">{selectedSubmission.reviewerComment}</p>
                  </div>
                </div>
              )}

              {selectedSubmission.reviewerName && (
                <div>
                  <p className="text-xs text-black/50 font-light mb-1">Reviewed By</p>
                  <p className="text-sm font-medium text-black/80">{selectedSubmission.reviewerName}</p>
                </div>
              )}
              {selectedSubmission.reviewedAt && (
                <div>
                  <p className="text-xs text-black/50 font-light mb-1">Reviewed At</p>
                  <p className="text-sm text-black/70">
                    {new Date(selectedSubmission.reviewedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

