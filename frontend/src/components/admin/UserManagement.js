import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
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

  const getUserStats = (userId) => {
    const userSubmissions = submissions.filter(sub => sub.userId === userId);
    return {
      total: userSubmissions.length,
      approved: userSubmissions.filter(s => s.status === 'approved').length,
      pending: userSubmissions.filter(s => s.status === 'pending').length,
    };
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">User Management</h2>
        <p className="text-sm sm:text-base text-gray-600">View and manage all users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => {
                const stats = getUserStats(user.id);
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : user.role === 'qa' ? 'secondary' : 'outline'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.points}</TableCell>
                    <TableCell>
                      {stats.approved} approved, {stats.pending} pending
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Active</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              </TableBody>
            </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

