import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BarChart3, Shield, Wallet, PieChart, Bell, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Task Force Pro Edition Wallet',
  description: 'Professional financial management for modern professionals',
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="relative container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Professional Financial Management
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Comprehensive transaction tracking across multiple accounts, smart budgeting, and professional financial reporting for modern professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg">
                <Link href="/register">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Wallet className="h-10 w-10 text-primary" />}
              title="Multi-Account Management"
              description="Track transactions across bank accounts, mobile money, and cash all in one place."
            />
            <FeatureCard
              icon={<PieChart className="h-10 w-10 text-primary" />}
              title="Visual Analytics"
              description="Comprehensive visual reports and insights for better financial decision-making."
            />
            <FeatureCard
              icon={<Bell className="h-10 w-10 text-primary" />}
              title="Budget Alerts"
              description="Set budget limits and receive notifications when approaching or exceeding thresholds."
            />
            <FeatureCard
              icon={<Tag className="h-10 w-10 text-primary" />}
              title="Category Management"
              description="Create and manage custom categories and subcategories for detailed expense tracking."
            />
            <FeatureCard
              icon={<Calendar className="h-10 w-10 text-primary" />}
              title="Custom Reports"
              description="Generate detailed financial reports for any time period you choose."
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="Transaction Analytics"
              description="Advanced analytics and insights across all your accounts and categories."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Connect Your Accounts"
              description="Link your bank accounts, mobile money, and track cash - all in one secure place."
            />
            <StepCard
              number="2"
              title="Set Your Budgets"
              description="Create custom budgets with categories and get notified when you're close to limits."
            />
            <StepCard
              number="3"
              title="Track & Analyze"
              description="Monitor your spending patterns and get insights through beautiful visualizations."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
            Join professionals who are already managing their finances smarter with Task Force Pro Edition Wallet.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg">
            <Link href="/register">
              Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg bg-card border shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg bg-card border relative">
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2 mt-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
} 