import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { mockUsers } from '../../data/mockData';
import { useData } from '../../context/DataContext';

export function UserManagement() {
  const { submissions } = useData();
  const users = mockUsers.filter(u => u.role === 'user');

  const getUserStats = (userId: string) => {
    const userSubmissions = submissions.filter(sub => sub.userId === userId);
    return {
      total: userSubmissions.length,
      approved: userSubmissions.filter(sub => sub.status === 'approved').length,
      pending: userSubmissions.filter(sub => sub.status === 'pending').length,
      rejected: userSubmissions.filter(sub => sub.status === 'rejected').length,
    };
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>
        <p className="text-gray-600">View and manage platform users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{users.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {users.filter(u => u.points > 0 || u.totalEarned > 0).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Points Distributed</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">
                {users.reduce((sum, u) => sum + u.totalEarned, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Average Points</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">
                {Math.round(users.reduce((sum, u) => sum + u.totalEarned, 0) / users.length) || 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            {users.length} registered user{users.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Current Points</TableHead>
                <TableHead>Total Earned</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const stats = getUserStats(user.id);
                
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-blue-600">{user.points}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-600">{user.totalEarned}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {stats.total} total
                        </Badge>
                        {stats.approved > 0 && (
                          <Badge variant="outline" className="text-xs text-green-700">
                            {stats.approved} ✓
                          </Badge>
                        )}
                        {stats.pending > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {stats.pending} pending
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.totalEarned > 0 ? 'default' : 'outline'}>
                        {user.totalEarned > 0 ? 'Active' : 'New'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
