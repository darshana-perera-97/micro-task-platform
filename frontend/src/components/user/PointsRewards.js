import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Award, TrendingUp, Gift, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { cn } from '../ui/utils';

import API_URL from '../../config/api';

export function PointsRewards() {
  const { user, fetchProfile } = useAuth();
  const [pointsData, setPointsData] = useState(null);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [claimResult, setClaimResult] = useState(null);

  useEffect(() => {
    const fetchPointsData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/points/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setPointsData(data.data);
            console.log('Points data loaded from backend:', data.data);
          }
        } else {
          console.error('Failed to fetch points data');
        }

        // Fetch pending submissions to calculate pending points
        const submissionsResponse = await fetch(`${API_URL}/submissions/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (submissionsResponse.ok) {
          const submissionsData = await submissionsResponse.json();
          if (submissionsData.success && submissionsData.data) {
            // Filter only pending submissions for current user
            const pending = submissionsData.data.filter(sub => 
              sub.status === 'pending' && sub.userId === user?.id
            );
            setPendingSubmissions(pending);
            console.log('Pending submissions:', pending);
            console.log('Pending points calculated:', pending.reduce((sum, sub) => sum + (sub.points || 0), 0));
          }
        }
      } catch (error) {
        console.error('Error fetching points data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPointsData();
  }, []);

  if (!user) return null;

  // Current points = only APPROVED points (from QA-approved tasks)
  // Pending points are separate and cannot be claimed until approved
  const currentPoints = pointsData?.points ?? user.points ?? 0; // Only approved points
  const totalEarned = pointsData?.totalEarned ?? user.totalEarned ?? 0;
  const userClaims = pointsData?.claims ?? [];
  const sortedClaims = [...userClaims].sort((a, b) => new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime());

  // Calculate pending points from pending submissions (not claimable yet)
  const pendingPoints = pendingSubmissions.reduce((sum, sub) => sum + (sub.points || 0), 0);

  // Can only claim if user has at least 100 APPROVED points
  // Pending points do NOT count towards claim eligibility
  const canClaim = currentPoints >= 100;
  const progressPercentage = Math.min((currentPoints / 100) * 100, 100);

  const handleClaimClick = () => {
    if (!canClaim) {
      toast.error('You need at least 100 points to claim a reward');
      return;
    }
    setShowClaimDialog(true);
  };

  const handleClaimConfirm = async () => {
    setShowClaimDialog(false);
    setClaiming(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Authentication required');
        setClaiming(false);
        return;
      }

      const response = await fetch(`${API_URL}/points/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setClaimResult({
          success: true,
          remainingPoints: data.data?.remainingPoints || currentPoints - 100,
          claim: data.data?.claim,
        });
        setShowSuccessDialog(true);
        
        // Refresh points data
        const refreshResponse = await fetch(`${API_URL}/points/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success && refreshData.data) {
            setPointsData(refreshData.data);
          }
        }

        // Refresh user profile
        if (fetchProfile) {
          await fetchProfile(token);
        }
      } else {
        toast.error(data.message || 'Failed to claim reward. Please try again.');
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error('An error occurred while claiming reward. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">Points & Rewards</h2>
          <p className="text-sm sm:text-base text-black/50 font-light">Loading your points data...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-sm bg-white animate-pulse">
              <CardContent className="p-5 sm:p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">Points & Rewards</h2>
        <p className="text-sm sm:text-base text-black/50 font-light">Manage your points and claim rewards</p>
      </div>

      {/* Points Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-black/50 font-light mb-1">Current Points</p>
                <p className="text-2xl sm:text-3xl font-light text-black/90">{currentPoints}</p>
                <p className="text-xs text-black/40 font-light mt-1">
                  Approved & claimable
                </p>
              </div>
              <div className="bg-black/5 p-2.5 rounded-lg">
                <Award className="size-5 text-black/60" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-black/50 font-light mb-1">Total Earned</p>
                <p className="text-2xl sm:text-3xl font-light text-black/90">{totalEarned}</p>
              </div>
              <div className="bg-black/5 p-2.5 rounded-lg">
                <TrendingUp className="size-5 text-black/60" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-black/50 font-light mb-1">Pending Points</p>
                <p className="text-2xl sm:text-3xl font-light text-black/90">{pendingPoints}</p>
              </div>
              <div className="bg-orange-50 p-2.5 rounded-lg">
                <Clock className="size-5 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-black/40 font-light mt-2">
              Awaiting QA approval (not claimable)
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-black/50 font-light mb-1">Total Claims</p>
                <p className="text-2xl sm:text-3xl font-light text-black/90">{sortedClaims.length}</p>
              </div>
              <div className="bg-black/5 p-2.5 rounded-lg">
                <Gift className="size-5 text-black/60" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claim Reward */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-light text-black/90">Claim Reward</CardTitle>
          <CardDescription className="text-black/50 font-light">
            Exchange 100 approved points for a reward. Only points from QA-approved tasks can be claimed. Pending points are not eligible for claiming.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-black/50 font-light">Progress to next reward</span>
              <span className="font-medium text-black/80">{currentPoints} / 100 points</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          <Button
            onClick={handleClaimClick}
            disabled={!canClaim || claiming}
            className={cn(
              "w-full h-12 font-medium rounded-lg",
              canClaim && !claiming
                ? "bg-black hover:bg-black/90 text-white" 
                : "bg-black/5 text-black/40 cursor-not-allowed"
            )}
          >
            {claiming 
              ? 'Claiming...' 
              : canClaim 
                ? 'Claim 100 Points Reward' 
                : `Need ${100 - currentPoints} more points`}
          </Button>
        </CardContent>
      </Card>

      {/* Claim Confirmation Dialog */}
      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent className="bg-white p-6 max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Gift className="size-6 text-blue-600" />
              </div>
              <DialogTitle className="text-xl font-light text-black/90">Claim Reward</DialogTitle>
            </div>
            <DialogDescription className="text-black/50 text-sm">
              Confirm your reward claim
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-black/60">Current Points:</span>
                <span className="text-lg font-medium text-black/90">{currentPoints} pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-black/60">Points to Claim:</span>
                <span className="text-lg font-medium text-red-600">-100 pts</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="text-sm font-medium text-black/80">Remaining Points:</span>
                <span className="text-xl font-bold text-black/90">{currentPoints - 100} pts</span>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                You can only claim once per day. After claiming, you'll need to wait until tomorrow to claim again.
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowClaimDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleClaimConfirm}
              disabled={claiming}
              className="flex-1 bg-black hover:bg-black/90 text-white"
            >
              {claiming ? 'Claiming...' : 'Confirm Claim'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-white p-6 max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle2 className="size-6 text-green-600" />
              </div>
              <DialogTitle className="text-xl font-light text-black/90">Reward Claimed!</DialogTitle>
            </div>
            <DialogDescription className="text-black/50 text-sm">
              Your reward has been successfully claimed
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Gift className="size-12 text-green-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-green-700 mb-1">100 Points Claimed!</p>
              <p className="text-sm text-green-600">Congratulations on your reward!</p>
            </div>
            {claimResult && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-black/60">Remaining Points:</span>
                  <span className="text-lg font-medium text-black/90">{claimResult.remainingPoints} pts</span>
                </div>
                {claimResult.claim && (
                  <div className="flex justify-between items-center text-xs text-black/50">
                    <span>Claimed at:</span>
                    <span>{new Date(claimResult.claim.claimedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-4">
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                setClaimResult(null);
              }}
              className="w-full bg-black hover:bg-black/90 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Claim History */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-light text-black/90">Claim History</CardTitle>
          <CardDescription className="text-black/50 font-light">Your reward claim history</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedClaims.length === 0 ? (
            <p className="text-sm sm:text-base text-black/40 text-center py-12 font-light">No claims yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-black/5">
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Points Claimed</TableHead>
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedClaims.map((claim) => (
                    <TableRow key={claim.id} className="border-b border-black/5 hover:bg-black/5">
                      <TableCell className="text-xs sm:text-sm font-medium text-black/70">
                        {claim.points} points
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm whitespace-nowrap text-black/50 font-light">
                        {new Date(claim.claimedAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

