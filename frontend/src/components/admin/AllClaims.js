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
import { Gift, Eye, Calendar, User, Mail, Award } from 'lucide-react';
import { toast } from 'sonner';

import API_URL from '../../config/api';

export function AllClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast.error('Not authenticated');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/admin/claims`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setClaims(data.data);
          } else {
            toast.error(data.message || 'Failed to load claims');
          }
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || 'Failed to fetch claims');
        }
      } catch (error) {
        console.error('Error fetching claims:', error);
        toast.error('An unexpected error occurred while fetching claims');
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const totalClaims = claims.length;
  const totalPointsClaimed = claims.reduce((sum, claim) => sum + (claim.points || 0), 0);
  const todayClaims = claims.filter(claim => {
    const claimDate = new Date(claim.claimedAt).toDateString();
    const today = new Date().toDateString();
    return claimDate === today;
  }).length;

  const stats = [
    { title: 'Total Claims', value: totalClaims, icon: Gift, color: 'text-black/60', bgColor: 'bg-black/5' },
    { title: 'Total Points Claimed', value: totalPointsClaimed, icon: Award, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Today\'s Claims', value: todayClaims, icon: Calendar, color: 'text-green-600', bgColor: 'bg-green-50' },
  ];

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">All Claims</h2>
          <p className="text-sm sm:text-base text-black/50 font-light">Loading claims data...</p>
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
        <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">All Claims</h2>
        <p className="text-sm sm:text-base text-black/50 font-light">View and manage all reward claims across the platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-0 shadow-sm bg-white">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-black/50 font-light mb-1">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-light text-black/90">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-2.5 rounded-lg`}>
                    <Icon className={`size-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-light text-black/90">Claims History</CardTitle>
          <CardDescription className="text-xs sm:text-sm text-black/50 font-light">
            All reward claims made by users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {claims.length === 0 ? (
            <div className="text-center py-16">
              <Gift className="size-12 text-black/20 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-black/50 font-light">No claims yet</p>
              <p className="text-xs sm:text-sm text-black/40 font-light mt-2">Users haven't claimed any rewards yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-black/5">
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">User</TableHead>
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Email</TableHead>
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Points Claimed</TableHead>
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Claimed Date</TableHead>
                    <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claims.map((claim) => (
                    <TableRow key={claim.id} className="border-b border-black/5 hover:bg-black/5">
                      <TableCell className="font-medium text-black/80 text-sm">{claim.userName}</TableCell>
                      <TableCell className="text-black/70 text-sm">{claim.userEmail}</TableCell>
                      <TableCell className="text-black/70 text-sm">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-0 font-normal">
                          {claim.points} points
                        </Badge>
                      </TableCell>
                      <TableCell className="text-black/50 text-sm whitespace-nowrap">
                        {new Date(claim.claimedAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedClaim(claim)} 
                          className="text-black/60 hover:bg-black/5"
                        >
                          <Eye className="size-4 mr-1" /> View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Claim Details Modal */}
      {selectedClaim && (
        <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
          <DialogContent className="max-w-2xl bg-white p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-light text-black/90">Claim Details</DialogTitle>
              <DialogDescription className="text-black/50 text-sm">View detailed information about this reward claim</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-black/50">
                    <User className="size-4" />
                    <span className="font-medium">User Name:</span>
                  </div>
                  <p className="text-black/80 pl-6">{selectedClaim.userName}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-black/50">
                    <Mail className="size-4" />
                    <span className="font-medium">Email:</span>
                  </div>
                  <p className="text-black/80 pl-6">{selectedClaim.userEmail}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-black/50">
                    <Award className="size-4" />
                    <span className="font-medium">Points Claimed:</span>
                  </div>
                  <p className="text-black/80 pl-6">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-0 font-normal">
                      {selectedClaim.points} points
                    </Badge>
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-black/50">
                    <Calendar className="size-4" />
                    <span className="font-medium">Claimed At:</span>
                  </div>
                  <p className="text-black/80 pl-6">{new Date(selectedClaim.claimedAt).toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-black/50">
                    <Gift className="size-4" />
                    <span className="font-medium">Claim ID:</span>
                  </div>
                  <p className="text-black/80 pl-6 font-mono text-xs">{selectedClaim.id}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-black/50">
                    <User className="size-4" />
                    <span className="font-medium">User ID:</span>
                  </div>
                  <p className="text-black/80 pl-6 font-mono text-xs">{selectedClaim.userId}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

