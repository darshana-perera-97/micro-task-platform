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
    
    // Update user points (in a real app, this would be done via API)
    const updatedUser = { ...user, points: user.points - 100 };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    toast.success('Congratulations! You have successfully claimed 100 points!');
    
    // Reload to update points display
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Points & Rewards</h2>
        <p className="text-gray-600">Manage your points and claim rewards</p>
      </div>

      {/* Points Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Points</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{user.points}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Award className="size-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earned</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{user.totalEarned}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <TrendingUp className="size-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Claims</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{userClaims.length}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Gift className="size-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claim Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Reward Progress</CardTitle>
          <CardDescription>
            Collect 100 points to claim your reward
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold text-gray-900">{user.points} / 100 Points</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              {canClaim ? (
                <div>
                  <p className="font-semibold text-green-700">🎉 Ready to claim!</p>
                  <p className="text-sm text-gray-600">You have enough points for a reward</p>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-gray-900">Keep earning!</p>
                  <p className="text-sm text-gray-600">
                    {100 - user.points} more points needed
                  </p>
                </div>
              )}
            </div>
            <Button
              onClick={handleClaim}
              disabled={!canClaim}
              size="lg"
              className="gap-2"
            >
              <Gift className="size-4" />
              Claim 100 Points
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Claim History */}
      <Card>
        <CardHeader>
          <CardTitle>Claim History</CardTitle>
          <CardDescription>
            Your reward claim history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userClaims.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="size-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No claims yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Earn 100 points to make your first claim
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Points Claimed</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userClaims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-mono text-sm">{claim.id}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-purple-600">{claim.points} Points</span>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(claim.claimedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
