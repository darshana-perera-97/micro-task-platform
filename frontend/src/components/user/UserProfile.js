import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Award, Mail, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config/api';

export function UserProfile() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [pointsData, setPointsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchedUserIdRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    // Reset state if user changed
    if (fetchedUserIdRef.current && fetchedUserIdRef.current !== user.id) {
      fetchedUserIdRef.current = null;
      setSubmissions([]);
      setPointsData(null);
    }
    
    // Skip fetch if already fetched for this user (prevent duplicate fetches)
    if (fetchedUserIdRef.current === user.id) {
      setLoading(false);
      return;
    }
    
    let isMounted = true;
    
    const fetchData = async () => {
      // Mark that we're starting to fetch for this user (prevents concurrent fetches)
      fetchedUserIdRef.current = user.id;
      
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          if (isMounted) {
            setLoading(false);
            fetchedUserIdRef.current = null; // Reset on error
          }
          return;
        }

        // Fetch user submissions
        const submissionsResponse = await fetch(`${API_URL}/submissions/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (submissionsResponse.ok && isMounted) {
          const submissionsData = await submissionsResponse.json();
          if (submissionsData.success) {
            // Set submissions even if empty array (user has no submissions yet)
            setSubmissions(submissionsData.data || []);
          } else {
            // If API returns success: false, still set empty array
            setSubmissions([]);
          }
        } else if (isMounted) {
          // If response is not ok, set empty array as fallback
          setSubmissions([]);
        }

        // Fetch user points
        const pointsResponse = await fetch(`${API_URL}/points/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (pointsResponse.ok && isMounted) {
          const pointsDataResponse = await pointsResponse.json();
          if (pointsDataResponse.success) {
            // Set points data, with defaults if data is missing
            setPointsData(pointsDataResponse.data || { points: 0, totalEarned: 0 });
          } else {
            // If API returns success: false, set default values
            setPointsData({ points: 0, totalEarned: 0 });
          }
        } else if (isMounted) {
          // If response is not ok, set default values as fallback
          setPointsData({ points: 0, totalEarned: 0 });
        }

        // Note: We don't call fetchProfile here to avoid causing re-renders
        // The user data from context should be sufficient
        // If we need fresh data, we can call it separately without causing loops
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Reset ref on error so we can retry
        if (isMounted) {
          fetchedUserIdRef.current = null;
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [user?.id]); // Only depend on user.id to prevent re-renders when user object reference changes but data is the same

  if (!user) return null;

  const userSubmissions = submissions.filter(sub => sub.userId === user.id);
  const approvedSubmissions = userSubmissions.filter(sub => sub.status === 'approved');
  const pendingSubmissions = userSubmissions.filter(sub => sub.status === 'pending');
  
  const currentPoints = pointsData?.points ?? user.points ?? 0;
  const totalEarned = pointsData?.totalEarned ?? user.totalEarned ?? 0;

  // Format join date
  const getJoinDate = () => {
    if (user.createdAt) {
      const date = new Date(user.createdAt);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return 'Recently';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Profile</h2>
          <p className="text-sm sm:text-base text-gray-600">Loading profile data...</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="lg:col-span-1 animate-pulse">
            <CardContent className="pt-6">
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2 animate-pulse">
            <CardContent className="pt-6">
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Profile</h2>
        <p className="text-sm sm:text-base text-gray-600">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 border-0 shadow-sm bg-white">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="size-24 mb-4">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold text-gray-900">{user.name || 'User'}</h3>
              <Badge variant="outline" className="mt-2">
                {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
              </Badge>
              
              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="size-4 text-gray-400" />
                  <span className="text-gray-600">{user.email || 'No email'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="size-4 text-gray-400" />
                  <span className="text-gray-600">Joined {getJoinDate()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="lg:col-span-2 border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-light text-black/90">Activity Statistics</CardTitle>
            <CardDescription className="text-black/50 font-light">Your performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-black/60 font-light">
                  <Award className="size-4" />
                  <span>Current Points</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">{currentPoints}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-black/60 font-light">
                  <TrendingUp className="size-4" />
                  <span>Total Earned</span>
                </div>
                <p className="text-3xl font-bold text-green-600">{totalEarned}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-black/60 font-light">
                  <Award className="size-4" />
                  <span>Approved Tasks</span>
                </div>
                <p className="text-3xl font-bold text-purple-600">{approvedSubmissions.length}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-black/60 font-light">
                  <Award className="size-4" />
                  <span>Pending Reviews</span>
                </div>
                <p className="text-3xl font-bold text-orange-600">{pendingSubmissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

