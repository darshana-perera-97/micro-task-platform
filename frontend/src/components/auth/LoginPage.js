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

  const handleLogin = async (e) => {
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
      console.error('Login error:', error);
      toast.error(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left Side - Illustration/Info */}
        <div className="hidden md:flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black/5 rounded-xl">
                <Award className="size-8 text-black/70" />
              </div>
              <h1 className="text-4xl font-light text-black/90 tracking-tight">Task & Reward</h1>
            </div>
            <p className="text-lg text-black/60 font-light">
              Complete tasks, earn points, claim rewards
            </p>
          </div>

          <div className="space-y-5 mt-10">
            <div className="flex items-start gap-4">
              <div className="p-1.5 bg-black/5 rounded-lg mt-0.5">
                <CheckCircle2 className="size-4 text-black/50" />
              </div>
              <div>
                <h3 className="font-medium text-black/80 text-sm mb-1">Simple Tasks</h3>
                <p className="text-sm text-black/50 font-light">Complete easy tasks like subscribing, following, and sharing</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-1.5 bg-black/5 rounded-lg mt-0.5">
                <CheckCircle2 className="size-4 text-black/50" />
              </div>
              <div>
                <h3 className="font-medium text-black/80 text-sm mb-1">Earn Points</h3>
                <p className="text-sm text-black/50 font-light">Get rewarded with points for every completed task</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-1.5 bg-black/5 rounded-lg mt-0.5">
                <CheckCircle2 className="size-4 text-black/50" />
              </div>
              <div>
                <h3 className="font-medium text-black/80 text-sm mb-1">Claim Rewards</h3>
                <p className="text-sm text-black/50 font-light">Exchange your points for real rewards when you reach 100 points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full border-0 shadow-sm bg-white">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-light text-black/90">Welcome Back</CardTitle>
            <CardDescription className="text-black/50 font-light">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-black/70">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-black/10 focus:border-black/30 h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-black/70">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-black/10 focus:border-black/30 h-11"
                  required
                />
              </div>

              <Button type="submit" className="w-full h-11 bg-black hover:bg-black/90 text-white font-medium rounded-lg" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


