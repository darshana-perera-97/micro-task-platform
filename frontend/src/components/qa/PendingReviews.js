import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { FileText, Image as ImageIcon, Link } from 'lucide-react';
import { toast } from 'sonner';

import API_URL from '../../config/api';

export function PendingReviews() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/qa/submissions?status=pending`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setSubmissions(data.data);
            console.log('Pending submissions loaded:', data.data.length);
          }
        }
      } catch (error) {
        console.error('Error fetching pending submissions:', error);
        toast.error('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

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

  const handleReview = async (submissionId, status) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Not authenticated');
        return;
      }

      const endpoint = status === 'approved' 
        ? `${API_URL}/qa/submissions/${submissionId}/approve`
        : `${API_URL}/qa/submissions/${submissionId}/reject`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: comment || undefined }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(`Submission ${status} successfully!${status === 'approved' ? ' Points have been awarded to the user.' : ''}`);
        
        // Remove the reviewed submission from the list
        setSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
        
        setReviewingId(null);
        setComment('');
      } else {
        toast.error(data.message || `Failed to ${status} submission`);
      }
    } catch (error) {
      console.error('Error reviewing submission:', error);
      toast.error(`Failed to ${status} submission`);
    }
  };

  const pendingSubmissions = submissions.filter(sub => sub.status === 'pending');

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">Pending Reviews</h2>
          <p className="text-sm sm:text-base text-black/50 font-light">Loading pending submissions...</p>
        </div>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
          pendingSubmissions.map((submission) => {
            const evidenceType = getEvidenceType(submission.evidence);
            const evidenceValue = getEvidenceValue(submission.evidence);
            const EvidenceIcon = getEvidenceIcon(evidenceType);

            return (
              <Card key={submission.id} className="border-0 shadow-sm bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-medium text-black/80">{submission.taskTitle || 'N/A'}</CardTitle>
                      <p className="text-sm text-black/50 font-light mt-1">By {submission.userName || 'Unknown'}</p>
                      <p className="text-xs text-black/40 font-light mt-1">
                        Points: {submission.points || 0} | Submitted: {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-0 font-normal">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-black/70">Evidence ({evidenceType})</Label>
                    <div className="flex items-start gap-2 mt-2 bg-black/5 p-3 rounded-lg">
                      <EvidenceIcon className="size-4 text-black/40 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-black/60 font-light flex-1 break-words">
                        {evidenceValue}
                      </p>
                    </div>
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
            );
          })
        )}
      </div>
    </div>
  );
}

