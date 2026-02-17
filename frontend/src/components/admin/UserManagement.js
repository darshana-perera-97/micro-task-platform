import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from 'sonner';
import { ChevronDown, Search, Users, UserCheck, UserX, Clock, Filter } from 'lucide-react';

import API_URL from '../../config/api';

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch users
        const usersResponse = await fetch(`${API_URL}/admin/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          if (usersData.success && usersData.data) {
            setUsers(usersData.data);
          }
        }

        // Fetch tasks
        const tasksResponse = await fetch(`${API_URL}/admin/tasks`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          if (tasksData.success && tasksData.data) {
            setTasks(tasksData.data);
          }
        }

        // Fetch submissions for accurate activity counts
        const submissionsResponse = await fetch(`${API_URL}/qa/submissions`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (submissionsResponse.ok) {
          const submissionsData = await submissionsResponse.json();
          if (submissionsData.success && submissionsData.data) {
            setSubmissions(submissionsData.data);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUserStats = (user) => {
    if (user.role === 'admin') {
      // For admins: show arranged/created tasks
      const arrangedTasks = tasks.length;
      return {
        label: 'Arranged Tasks',
        value: arrangedTasks,
      };
    } else if (user.role === 'qa') {
      // For QAs: show reviewed tasks (approved + rejected submissions)
      const reviewedSubmissions = submissions.filter(
        sub => sub.status === 'approved' || sub.status === 'rejected'
      );
      return {
        label: 'Reviewed Tasks',
        value: reviewedSubmissions.length,
      };
    } else {
      // For regular users: show submitted tasks
      const userSubmissions = submissions.filter(sub => sub.userId === user.id);
      return {
        label: 'Submitted Tasks',
        value: userSubmissions.length,
      };
    }
  };

  // Filter users based on search query, role, and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    hibernate: users.filter(u => u.status === 'hibernate').length,
    admins: users.filter(u => u.role === 'admin').length,
    qas: users.filter(u => u.role === 'qa').length,
    regularUsers: users.filter(u => u.role === 'user').length,
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Not authenticated');
        return;
      }

      const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update local state
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, status: newStatus } : user
          )
        );
        toast.success(`User status updated to ${newStatus}`);
      } else {
        toast.error(data.message || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'suspended':
        return 'destructive';
      case 'hibernate':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'suspended':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'hibernate':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">User Management</h2>
          <p className="text-sm sm:text-base text-black/50 font-light">Loading users...</p>
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
        <h2 className="text-2xl sm:text-3xl font-light text-black/90 mb-2">User Management</h2>
        <p className="text-sm sm:text-base text-black/50 font-light">View and manage all platform users</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-black/50 font-light mb-1">Total Users</p>
                <p className="text-2xl sm:text-3xl font-light text-black/90">{stats.total}</p>
              </div>
              <div className="bg-black/5 p-2.5 rounded-lg">
                <Users className="size-5 text-black/60" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-black/50 font-light mb-1">Active Users</p>
                <p className="text-2xl sm:text-3xl font-light text-green-600">{stats.active}</p>
              </div>
              <div className="bg-green-50 p-2.5 rounded-lg">
                <UserCheck className="size-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-black/50 font-light mb-1">Pending Users</p>
                <p className="text-2xl sm:text-3xl font-light text-orange-600">{stats.pending}</p>
              </div>
              <div className="bg-orange-50 p-2.5 rounded-lg">
                <Clock className="size-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-black/50 font-light mb-1">Suspended</p>
                <p className="text-2xl sm:text-3xl font-light text-red-600">{stats.suspended}</p>
              </div>
              <div className="bg-red-50 p-2.5 rounded-lg">
                <UserX className="size-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-light text-black/90">All Users</CardTitle>
              <CardDescription className="text-black/50 font-light">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-black/40" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-[250px] bg-white border-black/10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 text-sm bg-white border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black/70"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="qa">QA</option>
                  <option value="user">User</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-sm bg-white border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black/70"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="hibernate">Hibernate</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-black/5">
                  <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Name</TableHead>
                  <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Email</TableHead>
                  <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Role</TableHead>
                  <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Points</TableHead>
                  <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Total Earned</TableHead>
                  <TableHead className="text-xs sm:text-sm text-black/50 font-medium">Activity</TableHead>
                  <TableHead className="text-xs sm:text-sm text-black/50 font-medium w-32">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <p className="text-black/40 font-light">No users found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const userStats = getUserStats(user);
                    return (
                      <TableRow key={user.id} className="border-b border-black/5 hover:bg-black/5">
                        <TableCell className="font-medium text-black/80 text-xs sm:text-sm">
                          {user.name}
                        </TableCell>
                        <TableCell className="text-black/70 text-xs sm:text-sm">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.role === 'admin' ? 'default' : user.role === 'qa' ? 'secondary' : 'outline'}
                            className="text-xs bg-black/5 text-black/60 border-0 font-normal"
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-black/70 text-xs sm:text-sm font-medium">
                          {user.points || 0}
                        </TableCell>
                        <TableCell className="text-black/70 text-xs sm:text-sm font-medium">
                          {user.totalEarned || 0}
                        </TableCell>
                        <TableCell className="text-black/60 text-xs sm:text-sm">
                          <span className="text-black/50">{userStats.label}: </span>
                          <span className="font-medium text-black/70">{userStats.value}</span>
                        </TableCell>
                        <TableCell className="w-32">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-auto p-0 border-0 hover:bg-transparent"
                              >
                                <Badge
                                  variant={getStatusBadgeVariant(user.status || 'pending')}
                                  className={`cursor-pointer text-xs border-0 ${getStatusColor(user.status || 'pending')}`}
                                >
                                  {user.status || 'pending'}
                                  <ChevronDown className="ml-1 h-3 w-3" />
                                </Badge>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border-gray-200 shadow-lg">
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(user.id, 'active')}
                                disabled={user.status === 'active'}
                                className="hover:bg-gray-50"
                              >
                                Active
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(user.id, 'hibernate')}
                                disabled={user.status === 'hibernate'}
                                className="hover:bg-gray-50"
                              >
                                Hibernate
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(user.id, 'suspended')}
                                disabled={user.status === 'suspended' || user.role === 'admin'}
                                className="hover:bg-gray-50"
                              >
                                Deactivate
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(user.id, 'pending')}
                                disabled={user.status === 'pending'}
                                className="hover:bg-gray-50"
                              >
                                Pending
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

