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
import { cn } from '../ui/utils';

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
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">Points & Rewards</h2>
        <p className="text-sm sm:text-base text-black/50 font-light">Manage your points and claim rewards</p>
      </div>

      {/* Points Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-black/50 font-light mb-1">Current Points</p>
                <p className="text-2xl sm:text-3xl font-light text-black/90">{user.points}</p>
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
                <p className="text-2xl sm:text-3xl font-light text-black/90">{user.totalEarned}</p>
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
                <p className="text-xs sm:text-sm text-black/50 font-light mb-1">Total Claims</p>
                <p className="text-2xl sm:text-3xl font-light text-black/90">{userClaims.length}</p>
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
            Exchange 100 points for a reward
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-black/50 font-light">Progress to next reward</span>
              <span className="font-medium text-black/80">{user.points} / 100 points</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          <Button
            onClick={handleClaim}
            disabled={!canClaim}
            className={cn(
              "w-full h-12 font-medium rounded-lg",
              canClaim 
                ? "bg-black hover:bg-black/90 text-white" 
                : "bg-black/5 text-black/40 cursor-not-allowed"
            )}
          >
            {canClaim ? 'Claim 100 Points Reward' : `Need ${100 - user.points} more points`}
          </Button>
        </CardContent>
      </Card>

      {/* Claim History */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-light text-black/90">Claim History</CardTitle>
          <CardDescription className="text-black/50 font-light">Your reward claim history</CardDescription>
        </CardHeader>
        <CardContent>
          {userClaims.length === 0 ? (
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
                  {userClaims.map((claim) => (
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

