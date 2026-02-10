import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Award, TrendingUp, Gift } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { toast } from 'sonner';

export function PointsRewards() {
  const { user } = useAuth();
  const { claimHistory, addClaim } = useData();

  if (!user) return null;

  const canClaim = user.points >= 100;
  const progressPercentage = Math.min((user.points / 100) * 100, 100);
  const userClaims = claimHistory
    .filter(claim => claim.userId === user.id)
    .sort((a, b) => new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime());

  const handleClaim = () => {
    if (!canClaim) {
      toast.error('You need at least 100 points to claim a reward');
      return;
    }

    addClaim(user.id, 100);
    
    // Update user points
    const updatedUser = { ...user, points: user.points - 100 };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    toast.success('Congratulations! You have successfully claimed 100 points!');
    
    // Reload to update points display
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Points & Rewards</h2>
        <p className="text-sm sm:text-base text-gray-600">Manage your points and claim rewards</p>
      </div>

      {/* Points Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Current Points</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">{user.points}</p>
              </div>
              <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
                <Award className="size-5 sm:size-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Earned</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{user.totalEarned}</p>
              </div>
              <div className="bg-green-50 p-2 sm:p-3 rounded-lg">
                <TrendingUp className="size-5 sm:size-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Claims</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">{userClaims.length}</p>
              </div>
              <div className="bg-purple-50 p-2 sm:p-3 rounded-lg">
                <Gift className="size-5 sm:size-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claim Reward */}
      <Card>
        <CardHeader>
          <CardTitle>Claim Reward</CardTitle>
          <CardDescription>
            Exchange 100 points for a reward
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress to next reward</span>
              <span className="font-semibold">{user.points} / 100 points</span>
            </div>
            <Progress value={progressPercentage} />
          </div>
          <Button
            onClick={handleClaim}
            disabled={!canClaim}
            className="w-full"
            size="lg"
          >
            {canClaim ? '🎉 Claim 100 Points Reward' : `Need ${100 - user.points} more points`}
          </Button>
        </CardContent>
      </Card>

      {/* Claim History */}
      <Card>
        <CardHeader>
          <CardTitle>Claim History</CardTitle>
          <CardDescription>Your reward claim history</CardDescription>
        </CardHeader>
        <CardContent>
          {userClaims.length === 0 ? (
            <p className="text-sm sm:text-base text-gray-500 text-center py-6 sm:py-8">No claims yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Points Claimed</TableHead>
                    <TableHead className="text-xs sm:text-sm">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userClaims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="text-xs sm:text-sm font-semibold text-purple-600">
                        {claim.points} points
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm whitespace-nowrap">
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

