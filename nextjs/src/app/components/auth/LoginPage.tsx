import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../context/AuthContext';
import { Award, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Login successful!');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (role: 'admin' | 'user' | 'qa') => {
    const credentials = {
      admin: 'admin@platform.com',
      user: 'john@example.com',
      qa: 'qa@platform.com',
    };
    setEmail(credentials[role]);
    setPassword('password');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Illustration/Info */}
        <div className="hidden md:flex flex-col justify-center space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Award className="size-12 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Task & Reward Platform</h1>
            </div>
            <p className="text-xl text-gray-600">
              Complete tasks, earn points, claim rewards
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="size-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Simple Tasks</h3>
                <p className="text-gray-600">Complete easy tasks like subscribing, following, and sharing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="size-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Earn Points</h3>
                <p className="text-gray-600">Get rewarded with points for every completed task</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="size-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Claim Rewards</h3>
                <p className="text-gray-600">Exchange your points for real rewards when you reach 100 points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Quick Login (Demo)</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('user')}
                >
                  User
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('qa')}
                >
                  QA Lead
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('admin')}
                >
                  Admin
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Click any role to auto-fill credentials (password not required for demo)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}