import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Award, CheckCircle2, TrendingUp, Users, Zap, Shield, ArrowRight } from 'lucide-react';
import { cn } from '../ui/utils';

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: 'Quick Tasks',
      description: 'Complete simple tasks in minutes and earn points instantly',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Award,
      title: 'Earn Rewards',
      description: 'Accumulate points and exchange them for real rewards',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your earnings and track your submission status',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data is safe with our secure authentication system',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '10K+', icon: Users },
    { label: 'Tasks Completed', value: '50K+', icon: CheckCircle2 },
    { label: 'Rewards Claimed', value: '5K+', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-black rounded-lg">
                <Award className="size-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-black/90">TaskReward</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-black/70 hover:text-black hover:bg-black/5"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate('/login')}
                className="bg-black hover:bg-black/90 text-white rounded-lg"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full text-sm text-black/70 font-medium mb-4">
              <Zap className="size-4" />
              <span>Earn rewards by completing simple tasks</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-black/90 tracking-tight leading-tight">
              Complete Tasks.
              <br />
              <span className="font-medium bg-gradient-to-r from-black to-black/70 bg-clip-text text-transparent">
                Earn Rewards.
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-black/60 font-light max-w-2xl mx-auto leading-relaxed">
              Join thousands of users earning points by completing simple tasks. 
              Exchange your points for real rewards when you reach 100 points.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                onClick={() => navigate('/login')}
                size="lg"
                className="bg-black hover:bg-black/90 text-white rounded-lg px-8 py-6 text-base font-medium h-auto group"
              >
                Get Started
                <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/login')}
                className="border-black/20 hover:bg-black/5 text-black/70 rounded-lg px-8 py-6 text-base font-medium h-auto"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-2 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-black/5"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-black/5 rounded-xl mb-4">
                  <stat.icon className="size-6 text-black/70" />
                </div>
                <div className="text-4xl font-semibold text-black/90">{stat.value}</div>
                <div className="text-sm text-black/60 font-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-light text-black/90 tracking-tight">
              Why Choose TaskReward?
            </h2>
            <p className="text-lg text-black/60 font-light max-w-2xl mx-auto">
              A simple, secure platform designed to help you earn rewards through easy tasks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "p-6 rounded-2xl border border-black/5 bg-white/80 backdrop-blur-sm",
                  "hover:shadow-lg hover:border-black/10 transition-all duration-300",
                  "group cursor-pointer"
                )}
              >
                <div className={cn("inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4", feature.bgColor)}>
                  <feature.icon className={cn("size-6", feature.color)} />
                </div>
                <h3 className="text-lg font-semibold text-black/90 mb-2 group-hover:text-black transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-black/60 font-light leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-light text-black/90 tracking-tight">
              How It Works
            </h2>
            <p className="text-lg text-black/60 font-light max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Sign Up & Login',
                description: 'Create your account and log in to access available tasks',
              },
              {
                step: '02',
                title: 'Complete Tasks',
                description: 'Browse and complete simple tasks like subscribing, following, or sharing',
              },
              {
                step: '03',
                title: 'Earn & Claim',
                description: 'Earn points for approved tasks and claim rewards when you reach 100 points',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative p-8 rounded-2xl bg-white border border-black/5 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-6xl font-light text-black/5 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-black/90 mb-3">{item.title}</h3>
                <p className="text-sm text-black/60 font-light leading-relaxed">{item.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2">
                    <ArrowRight className="size-6 text-black/20" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center p-12 rounded-3xl bg-gradient-to-br from-black to-black/90 text-white space-y-6">
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight">
              Ready to Start Earning?
            </h2>
            <p className="text-lg text-white/80 font-light max-w-2xl mx-auto">
              Join thousands of users already earning rewards. Get started today and complete your first task.
            </p>
            <div className="pt-4">
              <Button
                onClick={() => navigate('/login')}
                size="lg"
                className="bg-white hover:bg-white/90 text-black rounded-lg px-8 py-6 text-base font-medium h-auto group"
              >
                Get Started Now
                <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-black/5 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-black rounded-lg">
                <Award className="size-4 text-white" />
              </div>
              <span className="text-sm font-medium text-black/70">TaskReward</span>
            </div>
            <div className="text-sm text-black/50 font-light">
              © {new Date().getFullYear()} TaskReward. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

